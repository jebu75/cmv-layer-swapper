define([
	'esri/units',
	'esri/geometry/Extent',
	'esri/config',
	'esri/tasks/GeometryService',
	'esri/layers/ImageParameters',
    'esri/InfoTemplate',
    'fis/infoTemplates/UtilityLayerInfoTemplates'
], function( units, Extent, esriConfig, GeometryService, ImageParameters, InfoTemplate, UtilityLayerInfoTemplates ) {

	// url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
	esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
	esriConfig.defaults.io.alwaysUseProxy = false;
	// url to your geometry server.
	esriConfig.defaults.geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');

	//image parameters for dynamic services, set to png32 for higher quality exports.
	var imageParameters = new ImageParameters();
	imageParameters.format = 'png32';

    var panoInfoTemplate = new InfoTemplate();
    panoInfoTemplate.setTitle( 'Panoramic Photo Location' );
    panoInfoTemplate.setContent( '<a href="http://prod.gis.msu.edu/campusmap/pano.html?viewer=sphere&locationid=${LOCATIONID}" target="_blank">Open in new window</a>' );

    var panoInfoTemplates = {
        0: {infoTemplate: panoInfoTemplate}
    };


	return {
		//default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
		defaultMapClickMode: 'click',
		// map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            basemap    : 'gray',
            center     : [-84.482278, 42.723222],
            zoom       : 15,
            sliderStyle: 'small',
            lods       : [
                {
                    'level'     : 0,
                    'resolution': 156543.03392800014,
                    'scale'     : 591657527.591555
                },
                {
                    'level'     : 1,
                    'resolution': 78271.51696399994,
                    'scale'     : 295828763.795777
                },
                {
                    'level'     : 2,
                    'resolution': 39135.75848200009,
                    'scale'     : 147914381.897889
                },
                {
                    'level'     : 3,
                    'resolution': 19567.87924099992,
                    'scale'     : 73957190.948944
                },
                {
                    'level'     : 4,
                    'resolution': 9783.93962049996,
                    'scale'     : 36978595.474472
                },
                {
                    'level'     : 5,
                    'resolution': 4891.96981024998,
                    'scale'     : 18489297.737236
                },
                {
                    'level'     : 6,
                    'resolution': 2445.98490512499,
                    'scale'     : 9244648.868618
                },
                {
                    'level'     : 7,
                    'resolution': 1222.992452562495,
                    'scale'     : 4622324.434309
                },
                {
                    'level'     : 8,
                    'resolution': 611.4962262813797,
                    'scale'     : 2311162.217155
                },
                {
                    'level'     : 9,
                    'resolution': 305.74811314055756,
                    'scale'     : 1155581.108577
                },
                {
                    'level'     : 10,
                    'resolution': 152.87405657041106,
                    'scale'     : 577790.554289
                },
                {
                    'level'     : 11,
                    'resolution': 76.43702828507324,
                    'scale'     : 288895.277144
                },
                {
                    'level'     : 12,
                    'resolution': 38.21851414253662,
                    'scale'     : 144447.638572
                },
                {
                    'level'     : 13,
                    'resolution': 19.10925707126831,
                    'scale'     : 72223.819286
                },
                {
                    'level'     : 14,
                    'resolution': 9.554628535634155,
                    'scale'     : 36111.909643
                },
                {
                    'level'     : 15,
                    'resolution': 4.77731426794937,
                    'scale'     : 18055.954822
                },
                {
                    'level'     : 16,
                    'resolution': 2.388657133974685,
                    'scale'     : 9027.977411
                },
                {
                    'level'     : 17,
                    'resolution': 1.1943285668550503,
                    'scale'     : 4513.988705
                },
                {
                    'level'     : 18,
                    'resolution': 0.5971642835598172,
                    'scale'     : 2256.994353
                },
                {
                    'level'     : 19,
                    'resolution': 0.29858214164761665,
                    'scale'     : 1128.497176
                },
                {
                    'level'     : 20,
                    'resolution': 0.14929107082380833,
                    'scale'     : 564.248588
                },
                {
                    'level'     : 21,
                    'resolution': 0.07464553541190416,
                    'scale'     : 282.124294
                },
                {
                    'level'     : 22,
                    'resolution': 0.03732276770595208,
                    'scale'     : 141.062147
                }
            ]
        },
		// panes: {
		// 	left: {
		// 		splitter: true
		// 	},
		// 	right: {
		// 		id: 'sidebarRight',
		// 		placeAt: 'outer',
		// 		region: 'right',
		// 		splitter: true,
		// 		collapsible: true
		// 	},
		// 	bottom: {
		// 		id: 'sidebarBottom',
		// 		placeAt: 'outer',
		// 		splitter: true,
		// 		collapsible: true,
		// 		region: 'bottom'
		// 	},
		// 	top: {
		// 		id: 'sidebarTop',
		// 		placeAt: 'outer',
		// 		collapsible: true,
		// 		splitter: true,
		// 		region: 'top'
		// 	}
		// },
		// collapseButtonsPane: 'center', //center or outer

        panes: {
            left: {
                splitter: true
            },
            right: {
                 		id: 'sidebarRight',
                 		placeAt: 'outer',
                 		region: 'right',
                 		splitter: true,
                 		collapsible: true
            }
        },

		// operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
		// The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
		// 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [
            {
                type   : 'dynamic',
                url    : 'http://prod.gis.msu.edu/arcgis/rest/services/features/gigapan_loc/MapServer',
                title  : 'Panoramic Photos',
                slider: false,
                noLegend: false,
                collapsed: false,
                options: {
                    id     : 'panoFeatureLayer',
                    opacity: 0.8,
                    visible: true,
                    minScale: 2500,
                    infoTemplates: panoInfoTemplates,
                    outFields: ['LOCATIONID']
                }
            }],
		// set include:true to load. For titlePane type set position the the desired order in the sidebar
		widgets: {
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: 'Layers',
                open: true,
                position: 0,
                placeAt: 'right',
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    vectorReorder: true
                }
            },
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
                            'label': '1950',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1950/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1953 (Oct 15)',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1953_oct15/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1953 (Oct 17)',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1953_oct17/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1955',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1955/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1956',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1956/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1958 (Oct 4)',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1958_oct4/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1958 (Nov 12)',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1958_nov12/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1963',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1963/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1965',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1965/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1967',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1967/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1969',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1969/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1974',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1974/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1980',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1980/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1984',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1984/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1987',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu1987/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '1995',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus1995/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2001',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2001_tif/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2005',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2005_mar01/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2006 (Spring)',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus2006spring/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2006 (Summer)',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/campus2006summer/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2007',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2007_apr1/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2011',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2011_nov15/MapServer',
                            'type': 'tiled'
                        },
                        {
                            'label': '2012',
                            'url': 'http://prod.gis.msu.edu/arcgis/rest/services/historical/msu2012_jun19/MapServer',
                            'type': 'tiled'
                        }
                    ]
                }
            }
		}
	};
});