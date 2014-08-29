define ( [
            'dojo/_base/declare',
            'dijit/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dijit/_WidgetsInTemplateMixin',
            'dijit/form/Form',
            'dijit/form/FilteringSelect',
            'dijit/form/HorizontalSlider',
            'dijit/form/HorizontalRule',
            'dijit/form/HorizontalRuleLabels',
            'dojo/_base/array',
            'dojo/_base/lang',
            'dojo/store/Memory',
            'dojo/dom-style',
            'esri/layers/ArcGISDynamicMapServiceLayer',
            'esri/layers/ArcGISTiledMapServiceLayer',
            'dojo/text!./LayerSwapper/templates/LayerSwapper.html',
            'xstyle/css!./LayerSwapper/css/LayerSwapper.css'

         ], function ( declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Form, FilteringSelect, HorizontalSlider, HorizontalRule, HorizontalRuleLabels, array, lang, Memory, domStyle, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, LayerSwapperTemplate, css ) {

             return declare ( [ _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin ], {

                 widgetsInTemplate: true,
                 templateString: LayerSwapperTemplate,
                 baseClass: 'gisLayerSwapperDijit',

                 layerInfos: [],
                 _layers: [],

                 _layerTypes: {
                     dynamic: 'esri/layers/ArcGISDynamicMapServiceLayer',
                     tiled: 'esri/layers/ArcGISTiledMapServiceLayer'
                 },

                 postCreate: function () {
                     this.inherited ( arguments );

                     var modules = [];
                     array.forEach( this.layerInfos, function( layer ) {

                         var mod = this._layerTypes[ layer.type ];
                         if ( mod ) {
                             modules.push( mod );
                         }

                     }, this );

                     require( modules, lang.hitch( this, function () {

                         this.layerInfos.unshift( {
                                                      label: '- Select layer -',
                                                      url: ''
                                                  } );

                         var k=0, queryLen = this.layerInfos.length;
                         for ( k=0; k < queryLen; k++ ) {
                             this.layerInfos[ k ].id = k;
                         }

                         if ( queryLen > 0 ) {
                             var layerStore = new Memory( { data: this.layerInfos } );
                             console.log( layerStore );
                             this.layerSelectDijit.set( 'store', layerStore );
                             this.layerSelectDijit.set( 'value', 0 );
                             this.layerSelectDijit.set( 'disabled', false );
                         }

                     }) );


                 },

                 _onLayerChange: function ( newIndex ) {

                     var lyr, k= 0, queryLen=this.layerInfos.length;

                     if ( newIndex > 0 ) {
                         lyr = this.layerInfos[ newIndex ];
                         if ( !lyr.layer ) {
                             this._addLayer( lyr );
                         }
                         lyr.layer.show();
                     }

                     for (k=1; k < queryLen; k++ ) {
                         lyr = this.layerInfos[ k ];
                         if ( lyr.layer && k !== newIndex ) {
                             lyr.layer.hide();
                         }
                     }

                 },

                 _addLayer: function ( layerInfo ) {

                     var lyr;

                     if ( layerInfo.type === 'dynamic' ) {
                         lyr = new ArcGISDynamicMapServiceLayer( layerInfo.url, { visible:false } );
                         this.map.addLayer( lyr );
                         layerInfo.layer = lyr;

                     } else {
                         lyr = new ArcGISTiledMapServiceLayer( layerInfo.url, { visible:false } );
                         this.map.addLayer( lyr );
                         layerInfo.layer = lyr;
                     }

                     lyr.on( 'update-start', lang.hitch( this, function () {
                         domStyle.set( this.layerUpdateNode, 'display', 'inline-block' );
                     } ) );

                     lyr.on( 'update-end', lang.hitch( this, function () {
                         domStyle.set( this.layerUpdateNode, 'display', 'none' );
                     } ) );

                     var opacity = this.layerFadeSlider.get( 'value' );
                     lyr.setOpacity( opacity );

                 },

                 _onLayerFaderChange: function ( newValue ) {

                     var lyr, k= 0, queryLen=this.layerInfos.length;
                     for (k=1; k < queryLen; k++ ) {
                         lyr = this.layerInfos[ k ];
                         if ( lyr.layer )
                         {
                             lyr.layer.setOpacity( newValue );
                         }
                     }

                 }


             } );
         }


);
