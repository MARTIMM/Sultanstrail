use v6;

#-------------------------------------------------------------------------------
unit class Tracks:auth<github:MARTIMM>;

use XML;
#use SemiXML::Sxml;
use SxmlLib::SxmlHelper;
use SemiXML::Text;

#-------------------------------------------------------------------------------
#| $!tracks.list gpx-dir
method list ( XML::Element $parent, Hash $attrs --> XML::Element ) {

  append-element( $parent, 'h2', :text<Tracks>);
  my XML::Element $ul = append-element( $parent, 'ul');

  my $count = 1;
  my $gpx-dir = $attrs<gpx-dir>.Str // '.';
  for dir($gpx-dir).grep(/ '.gpx' $/).sort -> $gpx-file {
    my Str $text = $gpx-file.IO.basename;
    $text ~~ s/ '.gpx' $//;
    $text ~~ s:g/ <punct> / /;
    append-element(
      $ul, 'li', %(
        :id('track' ~ $count++.fmt('%02d')),
        :class<underline>,
        :data-gpx-file($gpx-file),
      ),
      :$text
    );
  }

  $parent;
}
