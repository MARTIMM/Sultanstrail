# Sultans trail Project

**Table of contents**
[TOC]

# Purpose of this project

The question is; 'Why making another application which shows maps, like so many other apps do'. So the application must show something that is different than others. I'll try to point this out in the list below;

* The app is targeted to an audience of walkers and bikers.
* The app will therefore try to provide information only for this audience. E.g. no POI is provided to find a gas station but will show restaurants, places to  sleep and tourist information wherever possible.
* The app should be able to show maps when not in a WiFi zone. This means that the maps must be downloaded first.
* Mobile network might be available and must be usable if user is willing.
* Through POI links it should be possible to make reservations at hotels, B & B, restaurants etc. Clicking on such a link brings them to a website, e.g. booking.com.
* Furthermore, this app is also a tool for those who want to register new data for new or existing tracks.

Because this application is primarily made for a group who are mapping a trail which the [sultans](http://www.sultanstrail.com/) of past times had walked and another wandered by [sufi's](http://sufitrail.com/), the application is mainly build around these tracks. Hopefully, other tracks can be added later on. What can be provided for each of these tracks are the following;

* Track information. Where and how to walk or bike the track.
  * Complete track display.
  * Current location using GPS.
  * Icon-like pictures to show the environment on certain locations.
  * Warning signals when wandering off route.
  * Directions on the route. E.g. turn left/right or cross a field etc.

* Information of access points. These are places on the map where one can go nearby the start or end points of the route selected to walk. Long routes should also have access points along the route to be able to walk the trail in parts. The access points are points like airports, bus- and train stations. Also, when arriving by car, places to leave the car safely is useful.
* Information of connection/crossing points with other trails.
* Track historic information. Specific information gathered for the trail to provide insight to the historic background of the trail.
* If a user might want to walk/bike a trail, the application will try to store all possible information on the device. When device space is an issue then it must be possible to skip less relevant data to save space.
* Make notes and pictures and mark them on the map using small icons. This can come in handy when a route still needs to be described.

It should be obvious that these trails cost a bit of money because it is a lot of work to mark the trail along the route and to travel more than once to the trail to get this work done. Furthermore there is also work to provide an historic background of the route.

Perhaps, later, it would be possible to add other routes to the set by other enthusiastic people willing to put some time in their favorite trails. And there are lots of them like the [Camino de Santiago](http://santiago-compostela.net/) trails, [Grand Randonnees](http://www.gr-infos.com/gr-nl.htm)


## Software needed
Many packages and libraries are needed to implement and build the application.

### A list of what is needed;
* **Android SDK** to develop android mobile applications

* **Cordova** to pack javascript, html and css into an application

* **Nodejs** to load cordova and other javascript libraries locally

* **Cordova-jquery** jQuery javascript library build with cordova

* **OpenLayers** to show and manipulate layers of maps and other map oriented thingies

* **Javascript** Version 6 or 7.

* **Html5**

### Maybe needed
* **Backbone** javascript lib to have a MVC framework and to communicate with a server
* **Tilemill**
* **Google Closure** Javascript library, its more like an ecosystem! (Instead of jQuery), Compiling!

### Cordova plugins
* **cordova-plugin-device-motion**  [info](http://cordova.apache.org/docs/en/7.x/reference/cordova-plugin-device-motion/), This plugin provides access to the device's accelerometer.

## Planning
```mermaid
gantt
  dateFormat  YYYY-MM-DD
  title Mapping Trails Project

  section setup
  create environment using cordova :done, s0, 2017-09-19, 1d
  create manual, and other docs :active, s1, 2017-09-19, 1d

  section design
  write requirements doc        :active, d0, , 2d
  write design doc              :active, d1, , 10d
  write manual                  :active, d2, after d0, 10d

  section Implementation
  user interface    :active, ui, , 5d
  data structure    :active, ds, , 5d
  html              :html, after ds, 1d
  javascript        :js, after html, 20d

  section Testing
  test on emulator  :em, after html, 20d
  test on tablet    :tbl, after html, 20d

```

# Design and Implementation
As stated above, the application is mainly designed for a specific group of users, namely the group marking the sufitrail and the sultanstrail. To make sure that other trails can be added in the future, the design must be done in such a way that this would be possible. This will also make it possible that trails can be bought separately in an otherwise free or cheap application. There must also be a server to deliver the tracks. This can be done in the form of an app where the program part can start the mapping app and inject the data into that applications environment. The easiest way must be found still.

## Design
The project should designed in such a way that the application can help gathering the data which can make the trail interesting. This data

### Applications and services
In several diagrams is displayed what the application will do with the data and how data is packed into a trail app.

```plantuml
usecase (GPS data) as gps
usecase (pictures) as pic
usecase (Mapping\napplication) as m
usecase (user\nnotes) as n
usecase (uploader for\npacking) as u
usecase (server store\nfor data) as st

actor :Google\nplaystore: as ps
actor :Mobile user: as client
actor :Application\ndeveloper: as d

note "Download and install\napplication and track\ndata" as N1
note "App bundles data and uploads to server" as N2

N1 . client
client -> m
ps --> m : download\nand\ninstall app

m --> pic
m --> n
m --> gps

pic --> u
n --> u
gps --> u

u .. N2
st --> m : tracks and\nnew data
st <--> d
u -> st : user generated\ndata
ps <-- d : application

```

### User interface
The following items must be available
* An area where the map can be shown
* A button to display an expandable area where buttons or textual links are displayed for other actions.
  * load a trail and display a track centered on the map.
  * make a note in a notebook. Mark it on the map with a small icon.
  * make photograps to be placed on the map. Mark it with a small icon.
* Display a track when already loaded.
* Buttons to zoom the map.
* Layers to show specific details on the map.
  * Note and photo marks layer
  * Route layer
  * Access points layer
  * POI layer

### Data structure

### Useful external links
* [Global wheater forecast ](https://earth.nullschool.net/#current/wind/surface/level/orthographic=-354.15,49.32,581)
* [Reservations](Booking.com)

# Usage
* Install from app store

# Privacy issues

# Implementation
# Procedures to define the app using Cordova etc

## Install and setup

* Assume the following is ready
  * Githup repository of Sultanstrail
  * Android SDK is in place
  * node js is in place and several modules installed under which Cordova
* Create application environment
  ```
  $ cd ~/Projects/Mobile/Projects
  $ cordova create Sultanstrail io.github.martimm.sultanstrail SultansTrail
  $ cd Sultanstrail
  ```
* Add android data to this project, then build and emulate
  ```
  $ cordova platform add android
  $ cordova build android
  $ cordova emulate
  ```








<!-- References to sites and docs -------------------------->
[cdv-icons]: https://cordova.apache.org/docs/en/latest/config_ref/images.html