const AppID = new require('./lib/steam/appid');
const Achievements = require('./lib/steam/achievements');
function SteamAppInfo() {}

SteamAppInfo.prototype.AppID = AppID;
SteamAppInfo.prototype.Achievements = Achievements;

SteamAppInfo.prototype.Achievements.getByName = function(name,lang) {
  return new Promise(function(resolve, reject) {
    new AppID().first(name).then(id => new Achievements().get(id, lang).then( data => resolve(data)).catch(err => reject(err))).catch( err => reject(err));
  });
};

module.exports = new SteamAppInfo();
