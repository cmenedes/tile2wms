# tile2wms
Receives Web Mercator map tile requests in the follwing formats:
  * [Tile Map Service (TMS)](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification)
  * [Slippy Tiles (XYZ)](https://en.wikipedia.org/wiki/Tiled_web_map) 
  * [Web Map Tile Service (WMTS)](https://www.opengeospatial.org/standards/wmts) 
  
  based requests and converts them to [Web Map Service (WMS)](https://www.opengeospatial.org/standards/wms) requests issued to a configured server.  The WMS response is written to response of the original request.

### Install
* `yarn install`

### Configuration
* Default configuration is loaded from `conf.json`
* Override configuration by specifying a different conf file in `.env` as `CONF=/path/to/file`

### Run 
* `yarn start`
https://en.wikipedia.org/wiki/Tiled_web_map
https://www.opengeospatial.org/standards/wmts
