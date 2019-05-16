# tile2wms
### Receives [Web Mercator (EPSG:3857)](https://epsg.io/3857) map tile requests in the follwing formats:
  * [Tile Map Service (TMS)](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification)
  * [Slippy Tiles (XYZ)](https://en.wikipedia.org/wiki/Tiled_web_map) 
  * [Web Map Tile Service (WMTS)](https://www.opengeospatial.org/standards/wmts) 

### Responds to tile reqests as follows:
  * Converts tile request to [Web Map Service (WMS)](https://www.opengeospatial.org/standards/wms) request.
  * Issues WMS request to a pre-configured server.  
  * Writes headers to the response of the original tile request based on configuration.
  * Copies headers from the WMS resonse to the response of the original tile request based on configuration.
  * Writes the WMS response to the response of the original tile request.

### Configuration
  * A default configuration `conf.json` is loaded from the project root.
  * Override configuration by specifying a different conf file in `.env` as `CONF=/path/to/file`.

### Install
* `yarn install`

### Run 
* `yarn start`
