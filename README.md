cmv-layer-swapper
=================

v1.1
Layer swapper widget for [David Spriggs Configurable Map Viewer](https://github.com/DavidSpriggs/ConfigurableViewerJSAPI) 

Widget designed to allow swapping of a configurable list of layers.  Most obvious use case is flipping thru historical imagery.  Works best for layers
which should be mutually exclusive of each other.  Also allows fading of the selected layer via a slider control.

Configuration details below.


![Alt text](Screenshot-1.png?raw=true "Layer Swapper Screenshot")

![Alt text](Screenshot-2.png?raw=true "Layer Swapper Screenshot 2")


To configure the in your project

1. Copy the LayerSwapper directory and LayerSwapper.js file into your viewer/js/gis/dijit directory
2. Add the following to your CMV viewer config file

```
layerSwapper: {
    include: true,
    id: 'layerSwapper',
    type: 'titlePane',
    title: 'Historical Imagery',
    path: 'gis/dijit/LayerSwapper',
    open: true,
    options: {
        map: true,
        layerInfos: [
            {
                'label': '1950', //name of layer in selector
                'url': 'http://your-server.com/arcgis/rest/services/your-service/MapServer', //url to dynamic or tiled service
                'type': 'tiled' //type of layer, either 'tile' or 'dynamic'
            }
        ]
    }
}
```

If you have many layers, it is suggested to use a config file.  Simply change the 'options' parameter to point to your config file:
```
options: 'config/layerSwapper'
```