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

  ```json
  {
    "logLevel": "warn",
    "port": 8080,
    "defaultWmsTemplate": "http://localhost:8080/geoserver/wms?REQUEST=GetMap&WIDTH=256&HEIGHT=256&CRS=EPSG:900913&TRANSPARENT=true",
    "layerWmsTemplates": {
      "a-layer": "https://a-different-server/wms?REQUEST=GetMap&WIDTH=256&HEIGHT=256&CRS=EPSG:900913&TRANSPARENT=true",
      "another-layer": "https://another-server/wms?REQUEST=GetMap&WIDTH=256&HEIGHT=256&CRS=EPSG:900913&TRANSPARENT=true"
    },
    "headers": {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "Origin, X-Requested-With, Content-Type, Accept"
    },
    "copyFromWmsHeaders": ["b-header", "c-header"],
    "formats": {
      "png": "image/png",
      "png8": "image/png8",
      "pbf": "application/x-protobuf;type=mapbox-vector",
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg"
    }
  }
  ```
  
 #### Configuration properties:
   * `loglevel` The log level
   * `port` Port on which to run express server
   * `defaultWmsTemplate` The default template for making WMS requests.  Must include the following querystring parameters:
     * `REQUEST=GetMap`
     * `WIDTH=256`
     * `HEIGHT=256`
     * `CRS=EPSG:900913` or `CRS=EPSG:3857`
   * `headers` A map of headers to set on responses. If no headers are desired use `{}`.
   * `copyFromWmsHeaders` An array of header names to copy from the WMS response. If no headers are to be copied use  `[]`.
   * `formats` A map of file extensions to mime types.

### Install
* `yarn install`

### Run 
* `yarn start`
