/* Author: Marcel Timmerman
   License: ...
   Copyright: ...
*/
var SultansTrailMobileApp = {

  // ==========================================================================
  mapLayers:      [],
  mapVector:      '',
  mapFeatures:    [],
  mapView:        '',
  map:            '',
  geolocation:    '',
  count:          0,
  trackFiles:     {
    track01: '1.1 vienna-bratislava.gpx',
    track02: 'Track 002 ajbat.gpx',
    track03: 'Track 001 Naar zeleni Raj.gpx',
    track04:  'zandvoort 2016-05-17_12-58_Tue.gpx'
  },

  // ==========================================================================
  makeItHappen: function() {

    // ------------------------------------------------------------------------
    // Activate exit button
    $('#exit-bttn').on(
      'click',
      function ( e ) {

        if ( typeof cordova !== 'undefined' ) {
          // Deprecated
          if ( navigator.app ) {
            alert('exit navigator');
            navigator.app.exitApp();
          }

          // Deprecated
          else if (  navigator.device ) {
            alert('exit device');
            navigator.device.exitApp();
          }

          else if ( typeof app !== 'undefined' ) {
            alert('exit app');
            app.exitApp();
          }

          else {
            $('#message').text('No mobile device');
          }
        }
      }
    );

    // ------------------------------------------------------------------------
    // initialize layers, features and view
    this.addLayers();
    this.addMapFeatures();
    this.setView();

/*
    // ------------------------------------------------------------------------
    // Make a button panel on OpenLayer map
    var barsbttn = $('#bars-bttn');
    var panel = new ol.Control.Panel({defaultControl: barsbttn});
    panel.addControls([barsbttn]);
*/

    // ------------------------------------------------------------------------
    // Make series of tracks clickable
    Object.keys(this.trackFiles).forEach(
      function ( trackKey ) {
        $("#" + trackKey).on(
          'click',
          { app: SultansTrailMobileApp },
          function ( e ) {
            var app = e.data['app'];
            $('#message').text('load ' + trackKey + ': ' + app.trackFiles[trackKey]);
            var trackData = app.readTrack( app.trackFiles[trackKey]);
            alert(trackData);
          }
        );
      }
    );

    // ------------------------------------------------------------------------
    // show map
    this.map = new ol.Map( {
        target:       'mymap',
        layers:       this.mapLayers,
        view:         this.mapView,
        controls:     [
          new ol.control.Zoom(),

          new ol.control.Rotate(),

          new ol.control.Attribution( {
              collapsible: true,
              collapsed: true,
              label: 'i',
              collapselabel: '»'
            }
          )
/*
                  } ).extend( [
            new app.RotateNorthControl()
          ]),
*/
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
            $("#message").text(feature.get('dataLocation'));
//            t.mapView.setCenter(eLoc);
          }
        );
      },
      this
    );

    // ------------------------------------------------------------------------
    // get the geo locater
    this.geolocation = new ol.Geolocation( {
      // Get the current map projection
      projection: this.mapView.getProjection(),
      // Track the user position
      tracking: true
    } );

    // and listen to the change events
    this.geolocation.on( "change", this.locationListener, this);

    console.log("started");
  },

  // ==========================================================================
  locationListener: function (event) {

console.log(event);

    this.mapView.setCenter(this.geolocation.getPosition());
    this.mapView.setZoom(18);

    $("#message").text('Map changed: ' + this.geolocation.getPosition());
    this.count++;

    // being a test turn it off after a few times
    if( this.count > 1 ) {
      this.geolocation.un( "change", this.locationListener, this);
    }
  },

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
  readTrack: function ( file ) {
    var reader = new FileReader();
    reader.readAsText( 'tracks/' + file, 'UTF-8');
    return reader.result();
  },

  // ==========================================================================
  transform: function ( coordinate ) {

    return ol.proj.transform( coordinate, 'EPSG:4326', 'EPSG:3857');
  }

};

// jQuery way of run when DOM is loaded and ready
$( function(){ SultansTrailMobileApp.makeItHappen(); } );
