
* 0.4.2
  * bug fixed, all routes from track list are selectable with proper result
* 0.4.1
  * Removed `goog.events.*` and `goog.math` because event handling is done differently and math is not needed anymore (yet).
  * Removed `goog.style.*` and replaced by standard `style` on an `Element`
  * Removed `goog.dom.ViewportSizeMonitor` and replaced by standard use of `window.innerWidth` and `window.innerHeight`.
  * Remove `goog.dom` for `document.querySelector` and `document.createElement`
* 0.4.0
  * Menu of tracks from Rob
  * Show route, scale and fit on map
  * gpx files are extended with metadata and extensions data
* 0.3.0
  * Map and other pages fills whole page
  * Menu is hidden
  * buttonControl on map to open menu
  * Menu Map tab active to close the map again
* 0.2.0
  * Dropped JQuery * to simplify javascript footprint
  * Map visible
  * Features on map
  * Fixed menu
* 0.1.0
  * index.html generated from sxml
  * index.js; javascript using JQuery, JQuery Mobile, OpenLayers and Google Closure
  * index.css; together with css from JQuery Mobile and OpenLayers
* 0.0.1 Setup of application
