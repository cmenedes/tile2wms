# tile2wms
Receives Web Mercator map tile requests as Tile Map Service (TMS), Slippy Tiles (XYZ) and Web Map Tile Service (WMTS) based requests and converts them to WMS requests issued to a configured server.  The WMS response is written to response of the original request.

### Install
* `yarn install`

### Configuration
* Default configuration is loaded from `conf.json`
* Override configuration by specifying a different conf file in `.env` as `CONF=/path/to/file`

### Run 
* `yarn start`
