var AppID = require('./lib/steam/appid');

function SteamAppInfo() {}

SteamAppInfo.prototype.AppID = new AppID();

module.exports = new SteamAppInfo();
