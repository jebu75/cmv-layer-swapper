define([
    'dojo/_base/declare',
    'dijit/_WidgetBase',
    'dijit/_TemplatedMixin',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Form',
    'dijit/form/FilteringSelect',
    'dijit/form/HorizontalSlider',
    'dijit/form/HorizontalRule',
    'dijit/form/HorizontalRuleLabels',
    'dijit/form/Select',
    'dojo/_base/array',
    'dojo/_base/lang', 'dojo/topic',
    'dojo/store/Memory',
    'dojo/dom-style',
    'esri/dijit/LayerSwipe',
    'esri/layers/ArcGISDynamicMapServiceLayer',
    'esri/layers/ArcGISTiledMapServiceLayer',
    'esri/layers/ArcGISImageServiceLayer',
    'dojo/text!./LayerSwapper/templates/LayerSwapper.html',
    'xstyle/css!./LayerSwapper/css/LayerSwapper.css'
], function(
    declare,
    _WidgetBase,
    _TemplatedMixin,
    _WidgetsInTemplateMixin,
    Form,
    FilteringSelect,
    HorizontalSlider,
    HorizontalRule,
    HorizontalRuleLabels,
    Select,
    array,
    lang,
    topic,
    Memory,
    domStyle,
    LayerSwipe,
    ArcGISDynamicMapServiceLayer,
    ArcGISTiledMapServiceLayer,
    ArcGISImageServiceLayer,
    LayerSwapperTemplate
) {

    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: LayerSwapperTemplate,
        baseClass: 'gisLayerSwapperDijit',
        layerInfos: [],
        _layers: [],
        _layerTypes: {
            dynamic: 'esri/layers/ArcGISDynamicMapServiceLayer',
            tiled: 'esri/layers/ArcGISTiledMapServiceLayer',
            image:'esri/layers/ArcGISImageServiceLayer'
        },
        layerSwipe: null,
        postCreate: function() {
            this.inherited(arguments);

            this.layerInfos.unshift({
                label: '- Select layer -',
                url: ''
            });

            var k = 0,
                queryLen = this.layerInfos.length;
            for (k = 0; k < queryLen; k++) {
                this.layerInfos[k].id = k;
            }
            if (queryLen > 0) {
                var layerStore = new Memory({
                    data: this.layerInfos
                });
                this.layerSelectDijit.set('store', layerStore);
                this.layerSelectDijit.set('value', 0);
                this.layerSelectDijit.set('disabled', false);
            }

            this.layerSwipeDomNode = dojo.create('div', null, this.map.container, 'first');
        },
        onLayerChange: function(newIndex) {
            var lyr, k = 0,
                queryLen = this.layerInfos.length;
            if (newIndex > 0) {
                lyr = this.layerInfos[newIndex];
                if (!lyr.layer) {
                    this._addLayer(lyr);
                }
                lyr.layer.show();
            }
            for (k = 1; k < queryLen; k++) {
                lyr = this.layerInfos[k];
                if (lyr.layer && k !== newIndex) {
                    lyr.layer.hide();
                }
            }
            this._resetLayerSwipe();
        },
        _addLayer: function(layerInfo) {
            var lyr;
            if (layerInfo.type === 'dynamic') {
                lyr = new ArcGISDynamicMapServiceLayer(layerInfo.url, {
                    visible: false
                });
            } else if (layerInfo.type === 'image') {
                lyr = new ArcGISImageServiceLayer(layerInfo.url, {
                    visible: false
                });
            } else {
                lyr = new ArcGISTiledMapServiceLayer(layerInfo.url, {
                    visible: false
                });
            }

            if (lyr) {
                this.map.addLayer(lyr);
                layerInfo.layer = lyr;

                lyr.on('update-start', lang.hitch(this, function() {
                    domStyle.set(this.layerUpdateNode, 'display', 'inline-block');
                }));
                lyr.on('update-end', lang.hitch(this, function() {
                    domStyle.set(this.layerUpdateNode, 'display', 'none');
                }));
                var opacity = this.layerFadeSlider.get('value');
                lyr.setOpacity(opacity);
            }

        },
        onLayerFaderChange: function(newValue) {
            var lyr, k = 0,
                queryLen = this.layerInfos.length;
            for (k = 1; k < queryLen; k++) {
                lyr = this.layerInfos[k];
                if (lyr.layer) {
                    lyr.layer.setOpacity(newValue);
                }
            }
        },
        createLayerSwipeWidget: function(newValue) {
            if (newValue === 'none') {
                if (this.layerSwipe) {
                    this.layerSwipe.disable();
                }
                return;
            } else {
                if (this.layerSwipe) {
                    this.layerSwipe.set('type', newValue);
                    this.layerSwipe.set('layers', this._getLayerSwipeLayers());
                    this.layerSwipe.enable();
                } else {
                    this.layerSwipe = this._createLayerSwipe();
                }
                return;
            }
        },
        _createLayerSwipe: function() {
            var swipeType = this.layerSwipeTypeSelect.get('value');
            var layers = this._getLayerSwipeLayers();
            if (layers.length === 0) {
                return;
            }
            var layerSwipe = new LayerSwipe({
                type: swipeType,
                map: this.map,
                layers: layers
            }, this.layerSwipeDomNode);
            layerSwipe.startup();
            return layerSwipe;
        },
        _getLayerSwipeLayers: function() {
            var layers = [];
            array.forEach(this.layerInfos, function(layerInfo) {
                if (layerInfo.layer) {
                    layers.push(layerInfo.layer);
                }
            }, this);
            return layers;
        },
        _resetLayerSwipe: function() {
            this.layerSwipeTypeSelect.set('value', 'none');
        },
        reset: function() {
            this.layerSelectDijit.set('value', 0);
        }
    });
});