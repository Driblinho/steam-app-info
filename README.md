# steam-app-info

 Small lib to grabs some info from steam store web page

 ##  Features
 * AppID form game/app name

 ## Get Steam App ID by name

 ```javascript
const SteamAppInfo = require('steam-app-info');
SteamAppInfo.AppID.first('GTA V').then((id)=>console.log(id)).catch((err)=>console.log(err));
SteamAppInfo.AppID.all('GTA IV').then((id)=>console.log(id)).catch((err)=>console.log(err));
```

## TODO
* Tests
* Doc
* publish npm

## License
MIT
