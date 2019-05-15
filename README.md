# tile2wms
### Receives [Web Mercator (EPSG:3857)](https://epsg.io/3857) map tile requests in the follwing formats:
  * [Tile Map Service (TMS)](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification)
  * [Slippy Tiles (XYZ)](https://en.wikipedia.org/wiki/Tiled_web_map) 
  * [Web Map Tile Service (WMTS)](https://www.opengeospatial.org/standards/wmts) 

### Responds to tile reqests as follows:
  * Converts tile requests to [Web Map Service (WMS)](https://www.opengeospatial.org/standards/wms) 
  * Issues WMS request to a pre-configured server.  
  * Writes CORS headers to the response of the original tile request.
  * Copies headers from the WMS resonse to the response of the original tile request based on configuration.
  * Writes the WMS response to the response of the original tile request.

### Configuration
  * A default configuration `conf.json` is loaded from the project root
  * A custom configuration is specified as the environment variable `CONF=path/to/myconf.json`

### Install
* `yarn install`

### Configuration
* Default configuration is loaded from `conf.json`
* Override configuration by specifying a different conf file in `.env` as `CONF=/path/to/file`

### Run 
* `yarn start`
