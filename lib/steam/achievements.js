//http://steamcommunity.com/stats/208650/achievements
const htmlparser = require('htmlparser2');
const request = require('request');
const errors = require('../error.js');

function Achievements() {}

Achievements.prototype.query = "http://steamcommunity.com/stats/{appID}/achievements";

Achievements.prototype.parser = function () {
  'use strict';
  let tmp = [];
  let result = [];
  let acImg = false,acText = false,acPrct = false;
  const parser =  new htmlparser.Parser({
      onopentag: function(name, attribs) {
          const atrClass = (attribs.class!==undefined)? attribs.class.trim():'';
          if (name === 'div') {
            if(atrClass === 'achievePercent') acPrct = true;
            if(atrClass === 'achieveImgHolder') acImg = true;
            if(atrClass === 'achieveTxt') acText = true;
          }



      },
      onclosetag: function(name) {
          if (name === 'div') {
            acImg = acImg ? false : acImg;
            acText = acText ? false : acText;
            acPrct = acPrct ? false : acPrct;
          }
      },
      ontext: function(text) {
        if((acText || acPrct) && text.trim().length>0) {
            tmp.push(text);
          //console.log(tmp);
        }


      },
      onattribute: function(name, value) {
        if(acImg && name==='src')
          tmp.push(value);

        if(name==='style' && value==='clear: both;') {
            let signalAchievement = { name: tmp[2], img: tmp[0], percent: parseFloat(tmp[1]) };
            if(tmp.length>3) signalAchievement.desc = tmp[3];
            result.push(signalAchievement);
            tmp=[];
        }
      },
      onend: function() {
        if (result.length > 0)
            parser.emit('onAchievements', result);
        else
            parser.emit('notFound');
      }
  }, {
      decodeEntities: true
  });
  return parser;
}

Achievements.prototype.get = function(appID,lang) {
    'use strict';
    let _this = this;
    let q = this.query.replace("{appID}", appID);
    lang = (lang === undefined)?'':'?l='+lang;
    q+=lang;
    const parser = this.parser();
    return new Promise(function(resolve, reject) {
        request(q, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                parser.write(body);
                parser.end();
            } else
                reject(errors.requestError(err, response));
        });
        parser.on('onerror', (err) => reject(err));
        parser.on('onAchievements', (data) => resolve(data));
        parser.on('notFound', () => reject(new errors.NotFound(appID)));
    });
};

module.exports = Achievements;
