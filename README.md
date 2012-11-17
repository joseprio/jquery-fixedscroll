fixedScroll plugin for jQuery
=============================

jQuery-fixedScroll is a jQuery plugin to make areas of the page follow other
content while scrolling.

It's similar to other plugins like jQuery-followScroll, but it uses
different techniques; for instance, it will make a following block fixed when
necessary, so it won't move even when the user scrolls.

It also handles the cases when a box is too tall for the current viewport;
it will scroll to the bottom, and then pin it there; if the user then scrolls up,
it will also scroll up the box until the top of that box is reached, and then pin
it to the top; for instance, some of the the bars at the left of this text should
be taller than your viewport; if the document is scrolled down, so will the
taller bars. Once the bottom of the area it follows is reached, it will stop there.

How to use
----------

Using this plugin is very easy; include both jQuery and this plugin scripts to
your page, then call the `fixedScroll()` method; to specify the target the block
should be following, use the an options object that contains a `follow` field;
the value of that field can be either a jQuery selector, or a jQuery object that
contains the block that will be followed:

```js
// Make all blocks with the "moving" class follow the target
$('.moving').fixedScroll( { follow: '#target' } );

// This is also valid
$('.moving').fixedScroll( { follow: $('#target') } );
```

Supported Browsers
------------------

Tested in IE9, Firefox 17 and Chrome 23. Other browsers may work, but haven't been tested. It's a safe bet that anything
based on a recent version of Gecko or WebKit will probably work.
 
