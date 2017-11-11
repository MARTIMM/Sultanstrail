#!/usr/bin/env perl6
use v6;

my Array $cmd .= new(
  'bin/gpx-edit.pl6', '-author=Sultanstrail',
  '-copy=Sultanstrail', '-link=http://www.sultanstrail.com/',
  '-description="hiking routes from Vienna to Istanbul"',
  '-keys="hike,Vienna,Istanbul"'
);

for dir('www/tracks').grep(/ '.gpx' $/) -> $track {
say |@$cmd, '-name=' ~ $track.IO.basename, $track;
  run( @$cmd, '-name=' ~ $track.IO.basename, $track);
last;
}
