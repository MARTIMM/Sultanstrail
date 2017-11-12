/* Author: Marcel Timmerman
   License: ...
   Copyright: © Sufitrail 2017
*/
//use strict;

goog.provide('SultanstrailMobileApp');


// Application object
var SultansTrailMobileApp = {

  // ==========================================================================
  mapLayers:      [],
  mapVector:      '',
  mapFeatures:    [],
  mapView:        '',
  map:            '',
  geolocation:    '',
  count:          0,
  viewportSize:   { width: 0, height: 0},
  openMenuBttn:   '',


  sufiTrailTrackGpx: 'zandvoort 2016-05-17_12-58_Tue.gpx',
  trackGpxDom:    null,
  // The valid range of latitude in degrees is -90 and +90 for the southern and northern hemisphere respectively.
  // Longitude is in the range -180 and +180 specifying coordinates west and east of the Prime Meridian, respectively.
  trackLat:       { min: 200, max: -200},   // use semi infinites
  trackLon:       { min: 100, max: -100},
  trackMiddle:    { lat: 0, lon: 0},

  // Sultanstrail track bundle with parallel routes
  trackFiles:     {
    track01: 'Track 001 Naar zeleni Raj.gpx',
    track02: 'Track 002 ajbat.gpx',
    track03: 'Track 003.gpx',
    track04: 'Track 004 naar Gradiste.gpx',
    track05: 'Track 005.gpx',
    track06: 'Track 006.gpx',
    track07: 'Track 007.gpx',
    track08: 'Track 008 to Dragoman.gpx',
    track09: 'Track 009 to Slivnitsa.gpx',

    track10: '1.1 vienna-bratislava.gpx',
    track11:  'zandvoor 2016-05-17_12-58_Tue.gpx'
  },

  // ==========================================================================
  vector: null,
  /*
  new ol.layer.Vector( {
      source: new ol.source.Vector( {
          url: './tracks/zandvoort 2016-05-17_12-58_Tue.gpx',
          format: new ol.format.GPX()
        }
      )
    }
  ),
  */

  // ==========================================================================
  style: {
    'Point': new ol.style.Style( {
        image: new ol.style.Circle( {
            fill:     new ol.style.Fill( { color: 'rgba(255,255,0,0.4)'}),
            radius:   5,
            stroke:   new ol.style.Stroke( {
                color: '#ff0',
                width: 1
              }
            )
          }
        )
      }
    ),
    'LineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#f00',
            width: 3
          }
        )
      }
    ),
    'MultiLineString': new ol.style.Style( {
        stroke: new ol.style.Stroke( {
            color: '#0f0',
            width: 3
          }
        )
      }
    )
  },

  // ==========================================================================
  exitButton: function ( e ) {

    if ( typeof cordova !== 'undefined' ) {
      // Deprecated
      if ( navigator.app ) {
        alert('exit navigator');
        navigator.app.exitApp();
      }

      // Deprecated
      else if ( navigator.device ) {
        alert('exit device');
        navigator.device.exitApp();
      }

      else if ( typeof app !== 'undefined' ) {
        alert('exit app');
        app.exitApp();
      }

      else {
        goog.dom.setTextContent(
          goog.dom.getElement('message'),
          'No mobile device'
        );
      }
    }
  },

/*
  // ==========================================================================
  loadTrack: function ( gpx-file ) {
    var app = e.data['app'];
    goog.dom.setTextContent(
      goog.dom.getElement('message'),
      'load ' + trackKey + ': ' + app.trackFiles[trackKey]
    );
    app.readTrack();
  },
*/

  // ==========================================================================
  openMenu: function ( e ) {
    console.log('open menu: ' + e );
    var menu = document.querySelector('div#tabpane ul.goog-tabpane-tabs');
    console.log(menu);

    var w = menu.offsetWidth;
    var h = menu.offsetHeight;
    var anim = new goog.fx.dom.Resize(
      menu, [ w, h], [ 200, h], 400, goog.fx.easing.easeOut
    );

    anim.play();
  },

  // ==========================================================================
  closeMenu: function ( e ) {
    console.log('open menu: ' + e );
    var menu = document.querySelector('div#tabpane ul.goog-tabpane-tabs');
    console.log(menu);

    var w = menu.offsetWidth;
    var h = menu.offsetHeight;
    var anim = new goog.fx.dom.Resize(
      menu, [ w, h], [ 0, h], 400, goog.fx.easing.easeOut
    );

    anim.play();
  },

  // ==========================================================================
  openMenuControl: function ( opts ) {

    // 'this' is the Control object! -> use SultansTrailMobileApp

    // build a control to show on map
    var options = opts || {};
    var openMenuBttn = goog.dom.createElement('button');
    openMenuBttn.innerHTML = '<img src="images/responsive.png" />';
    goog.events.listen(
      openMenuBttn, goog.events.EventType.CLICK,
      SultansTrailMobileApp.openMenu, false, SultansTrailMobileApp
    );

    var buttonContainer = goog.dom.createElement('div');
    buttonContainer.className = 'open-menu ol-unselectable ol-control';
    buttonContainer.appendChild(openMenuBttn);

    ol.control.Control.call(
      this, {
        element: buttonContainer,
        target: options.target
      }
    );
  },

  // ==========================================================================
  makeItHappen: function() {

    // ------------------------------------------------------------------------
    // make a tabpane
    var tabPane = new goog.ui.TabPane(
      goog.dom.getElement('tabpane'),
      goog.ui.TabPane.TabLocation.RIGHT
    );

    // ------------------------------------------------------------------------
    // get size of viewport and modify the tabpane to fit
    this.viewportSize = goog.dom.getViewportSize();
    console.log(this.viewportSize);
    goog.style.setSize(
      goog.dom.getElement('tabpane'),
      this.viewportSize.width,
      this.viewportSize.height
    );

    // ------------------------------------------------------------------------
    // Activate exit button
//    goog.events.listen(
//      goog.dom.getElement('exit-bttn'), goog.events.EventType.CLICK,
//      this.exitButton, false, this
//    );

    //-------------------------------------------------------------------------
    // inherit menu control
    ol.inherits( this.openMenuControl, ol.control.Control);

    //-------------------------------------------------------------------------
    // listen to click on map tab
    var maptab = document.querySelector('div#tabpane ul li');
    console.log(maptab);
    goog.events.listen(
      maptab, goog.events.EventType.CLICK,
      SultansTrailMobileApp.closeMenu, false, SultansTrailMobileApp
    );

    // ------------------------------------------------------------------------
    // initialize layers, features and view
    this.addLayers();
    this.addMapFeatures();
    this.setView();

/*
    // ------------------------------------------------------------------------
    // Make a button panel on OpenLayer map
    var barsbttn = goog.dom.getElement('bars-bttn');
    var panel = new ol.Control.Panel({defaultControl: barsbttn});
    panel.addControls([barsbttn]);
*/

/*
    // ------------------------------------------------------------------------
    // Make series of tracks clickable
    Object.keys(this.trackFiles).forEach(
      function ( trackKey ) {
//console.log("TK: " + trackKey);
//console.log("GE: " + goog.dom.getElement(trackKey));
return;
        goog.events.listen(
          goog.dom.getElement(trackKey), goog.events.EventType.CLICK,
          this.loadTrack, false, this
        );
      }
    );
*/

    // ------------------------------------------------------------------------
    // show map
    this.map = new ol.Map( {
        target:       'mymap',
        layers:       this.mapLayers,
        view:         this.mapView,
        controls:     [
          new ol.control.Zoom(),

          new ol.control.Rotate( {
              autoHide: false
            }
          ),

          new ol.control.Attribution( {
              collapsible: true,
              collapsed: false,
              label: 'O',
              collapselabel: '»'
            }
          ),

          new this.openMenuControl(),
        ]
      }
    );

    // ------------------------------------------------------------------------
    // click on features
    var t = this;
    this.map.on(
      'click',
      function ( e ) {
//        console.log('event: ' + e + ', target: ', + e.target + ', map: ' + e.map);
//        var eLoc = t.map.getEventCoordinate(e);
//        console.log("e loc: " + eLoc);
        this.map.forEachFeatureAtPixel(
          e.pixel,
          function( feature, layer) {
            console.log("Feature: " + feature.get('name') + ', id: ' + feature.getId());
            goog.dom.setTextContent(
              goog.dom.getElement("message"),
              feature.get('dataLocation')
            );
//            t.mapView.setCenter(eLoc);
          }
        );
      },
      this
    );

    this.loadTrack(this.sufiTrailTrackGpx);

/*
    // ------------------------------------------------------------------------
    // get the geo locater
    this.geolocation = new ol.Geolocation( {
      // Get the current map projection
      projection: this.mapView.getProjection(),
      // Track the user position
      tracking: true
    } );

    // and listen to the change events
//    this.geolocation.on( "change", this.locationListener, this);

    goog.events.listen(
      this.geolocation, goog.events.EventType.CHANGE,   // is same as 'change'
      this.locationListener, false, this
    );

    console.log("application started");
*/
  },

/*
  // ==========================================================================
  locationListener: function (event) {

console.log(event);

    this.mapView.setCenter(this.geolocation.getPosition());
    this.mapView.setZoom(18);

    goog.dom.setTextContent(
      goog.dom.getElement("message"),
      'Map changed: ' + this.geolocation.getPosition()
    );
    this.count++;

    // being a test turn it off after a few times
    if( this.count > 0 ) {
//      this.geolocation.un( "change", this.locationListener, this);
      goog.events.unlisten( this.geolocation, goog.events.EventType.CHANGE,
        this.locationListener, false, this
      );
    }
  },
*/

  // ==========================================================================
  setView: function( ) {

    // This transformation is what I'm looking for. Longitude/Latitude of
    // Google map of our home.
    this.mapView = new ol.View( {
      center: this.transform( [ 4.632367, 52.390413]),
      zoom: 10
    } );
  },

  // ==========================================================================
  addLayers: function ( ) {

    // Take a standard openstreetmap and a tileset  which shows raster and data
    var s1 = new ol.source.OSM();
    this.mapLayers.push(new ol.layer.Tile( { source: s1 } ));
    //this.mapLayers[0].on( 'change:visible', this.layerEvent, this);

    var s2 = new ol.source.TileDebug( {
        projection: 'EPSG:3857',
        tileGrid: s1.getTileGrid()
      }
    );
    this.mapLayers.push(new ol.layer.Tile( { source: s2 } ));
  },

//  layerEvent: function(e) {
//    console.log(e.type);
//  },

  // ==========================================================================
  // See also https://openlayers.org/en/latest/examples/icon-color.html
  addMapFeatures: function ( ) {

    // dataLocation is my own added field. inherited from ol.Object. Retrieve
    // with feature.get('dataLocation')
    var iconFeature = new ol.Feature( {
      geometry: new ol.geom.Point( this.transform( [ 4.632367, 52.390413])),
      name: 'location 1',
      dataLocation: "Ons huis - Jan de Bray straat"
    } );
    this.mapFeatures.push(iconFeature);
    iconFeature.setId('currloc');

    iconFeature = new ol.Feature( {
      geometry: new ol.geom.Point( this.transform( [ 4.632374, 52.390107])),
      name: 'location 2',
      dataLocation: "Jan de Bray straat - Schotersingel"
    } );
    this.mapFeatures.push(iconFeature);

    this.mapVector = new ol.source.Vector( {
      features: this.mapFeatures
    } );

    var iconStyle = new ol.style.Style( {
      image: new ol.style.Circle( {
        radius: 8,
        fill: new ol.style.Fill( { color: '#ff8800' } )
      } )
    } );

    this.mapLayers.push( new ol.layer.Vector( {
      source: this.mapVector,
      style: iconStyle
    } ) );


    // One other feature in a new layer with other symbol
    iconFeature = new ol.Feature( {
      geometry: new ol.geom.Point( this.transform( [ 4.632572, 52.390888])),
      name: 'location 3',
      dataLocation: "Jan de Bray straat - Tetterode straat"
    } );
    this.mapFeatures.push(iconFeature);

    this.mapVector = new ol.source.Vector( {
      features: [ this.mapFeatures[2] ]
    } );

    var iconStyle = new ol.style.Style( {
      image: new ol.style.Icon( ( {
        //anchor: [ 0.5, 46],
        //anchorXUnits: 'fraction',
        //anchorYUnits: 'pixels',
        opacity: 0.9,
        src: 'images/book.png'
      } ) )
    } );

    this.mapLayers.push( new ol.layer.Vector( {
      source: this.mapVector,
      style: iconStyle
    } ) );
  },

  // ==========================================================================
  loadTrack: function ( file ) {

    var app = this;
    this.map.removeLayer(this.vector);
    this.vector = new ol.layer.Vector( {
        source: new ol.source.Vector( {
            url: './tracks/' + file,
            format: new ol.format.GPX()
          }
        ),
        style: function ( feature ) {
          return app.style['LineString'];        // [feature.getGeometry().getType()];
        }
      }
    );

    this.map.addLayer(this.vector);
    this.loadGpxFile(file);
  },

  // ==========================================================================
  loadGpxFile: function ( file ) {

var timeStart = Date.now();
    var app = this;
    // https://xhr.spec.whatwg.org/
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
    var gpxTextReq = new XMLHttpRequest();
    gpxTextReq.onload = function ( ) {

//TODO check errors https://developer.mozilla.org/en-US/docs/Web/Events/loadend

      // https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML
//      var parser = new DOMParser();
//      app.trackGpxDom = parser.parseFromString( this.responseXML, "text/xml");
      app.trackGpxDom = this.responseXML;
console.log("Loaded after " + (Date.now() - timeStart) + " msec");
console.log("Result: " + app.trackGpxDom);
console.log(app.trackGpxDom.documentElement.nodeName);
      // https://stackoverflow.com/questions/16664205/what-is-the-difference-between-getelementsbytagname-and-getelementsbyname-in-jav
      // http://www.topografix.com/GPX/1/1/

      var trkElements = app.trackGpxDom.documentElement.getElementsByTagName('trkpt');
      var nTrk = trkElements.length;
      for( var i = 0; i < nTrk; i++) {
        var lat = parseFloat(trkElements[i].getAttribute("lat"));
        var lon = parseFloat(trkElements[i].getAttribute("lon"));
        if( lat < app.trackLat.min ) { app.trackLat.min = lat; };
        if( lat > app.trackLat.max ) { app.trackLat.max = lat; };
        if( lon < app.trackLon.min ) { app.trackLon.min = lon; };
        if( lon > app.trackLon.max ) { app.trackLon.max = lon; };
      }

console.log("Calculated lon/lat after " + (Date.now() - timeStart) + " msec");
console.log("trk area lat/lon: " + app.trackLat.min + ', ' + app.trackLat.max +
                             '/' + app.trackLon.min + ', ' + app.trackLon.max);

      app.trackMiddle.lat = (app.trackLat.min + app.trackLat.max) / 2.0;
      app.trackMiddle.lon = (app.trackLon.min + app.trackLon.max)/2.0;
console.log("Calculated center after " + (Date.now() - timeStart) + " msec");
console.log("trk middel: " + app.trackMiddle.lat + ', ' + app.trackMiddle.lon);
    }

    gpxTextReq.onerror = function ( ) {
      dump("Error while getting XML");
    }

    // 3rd arg must be true to have it explicitly asynchronous.
    gpxTextReq.open( "GET", './tracks/' + file, true);
    gpxTextReq.send();

/*
    var reader = new FileReader();
    goog.events.listen(
      reader, goog.events.EventType.LOAD,
      app.cnvText2Gpx, false, app
    );

    // start reading, function above is triggered when ready
    var file = new File();
    file.name('./tracks/' + file);

    reader.readAsText(
      new File(
        ['./tracks/' + file],
        {type: "text/plain;charset=utf-8"}
      )
    );
*/
  },

  // ==========================================================================
  transform: function ( coordinate ) {

    return ol.proj.transform( coordinate, 'EPSG:4326', 'EPSG:3857');
  },

  // ==========================================================================
  // From http://osgeo-org.1560.x6.nabble.com/Downloading-tiles-to-local-file-system-td4991005.html
  getTile: function ( x, y, zoom ) {
    // make tile object. It will hold x, y and path fields
    var tile = {};

    x = (1 + (x * Math.PI / 180)/ Math.PI)/2;

    tile.x = Math.floor(x*Math.pow(2,zoom));
    tile.y = Math.floor((1-Math.log(Math.tan(y*Math.PI/180) + 1/Math.cos(y*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));
    tile.path = zoom + '/'+ tile.x + '/'+ tile.y +'.png';

    // return the object
    return tile;
  },

  // ==========================================================================
  // From http://osgeo-org.1560.x6.nabble.com/Downloading-tiles-to-local-file-system-td4991005.html
  // Get all tiles for given region and zoom level
  getTiles: function ( bounds, zoom) {
    var tile_first = this.getTile( bounds.left, bounds.top,zoom);
    var tile_last = this.getTile( bounds.right, bounds.bottom,zoom);

    var tiles = [];
    for( x = tile_first.x; x <= tile_last.x; x++) {
      for( y = tile_first.y; y <= tile_last.y; y++) {
        tiles.push({'x':x,'y':y,'path': zoom + '/'+ x + '/'+ y +'.png'});
      }
    }
  }
};

// http://thanpol.as/javascript/you-dont-need-dom-ready
// Don't wait for event ready, just place script at the end of <body>
SultansTrailMobileApp.makeItHappen();
