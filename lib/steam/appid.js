const htmlparser = require('htmlparser2');
const request = require('request');
const errors = require('../error.js');

function AppID() {}

AppID.prototype.query = 'http://store.steampowered.com/search/?term=';

AppID.prototype.parser = function () {
  'use strict';
  let idsArray = [];
  let game = false;
  const appIdParser =  new htmlparser.Parser({
      onopentag: function(name, attribs) {
          if (name === 'div' && attribs.class === 'col search_capsule') game = true;
      },
      onclosetag: function(name) {
          if (name === 'div') game = false;
      },
      onattribute: function(name, value) {
          if (game) idsArray.push(value.split('/')[5]);
      },
      onend: function() {
          if (idsArray.length > 0)
              appIdParser.emit('onIDs', idsArray);
          else
              appIdParser.emit('idNotFound');
      }
  }, {
      decodeEntities: true
  });
  return appIdParser;
}

function requestError(err, response) {
    if (err) return err;
    return new Error("Status code:" + statusCode);
}



AppID.prototype.all = function(queryString) {
    'use strict';
    let _this = this;
    const parser = this.parser();
    return new Promise(function(resolve, reject) {
        request(_this.query+queryString, function(err, response, body) {
            if (!err && response.statusCode === 200) {
                parser.write(body);
                parser.end();
            } else
                reject(requestError(err, response));
        });
        parser.on('onerror', (err) => reject(err));
        parser.on('onIDs', (data) => resolve(data));
        parser.on('idNotFound', () => reject(new errors.IDNotFound(queryString)));
    });
};


AppID.prototype.first = function(queryString) {
  'use strict';
  let _this = this;
  return new Promise(function(resolve, reject) {
    _this.all(queryString).then((data)=>resolve(data.shift())).catch((err)=>reject(err));
  });
}



module.exports = AppID;
