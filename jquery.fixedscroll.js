/**
 * jquery.fixedscroll.js
 * Copyright (c) 2012 Josep del Rio (http://www.joseprio.com/)
 * Licensed under the MIT License (http://www.opensource.org/licenses/mit-license.php)
 * 
 * @author Josep del Rio
 *
 * @projectDescription	jQuery plugin to make areas of the page follow other content while scrolling..
 * 
 * @version 0.1.0
 * 
 * @requires jquery.js (tested with 1.8.2)
 * 
 * @param follow		string or jQuery container - string containing a jQuery selector, or jQuery container; will be used as the box to follow.
 * 								default: box's parent
 */

( function( $ ) {
    // Flag to ensure we register the scroll and resize events only once, and
    // only when needed
    var isCapturingEvents = false;
    
    // Current boxes that follow
    var boxes = [];
    
    // Cached instances
    var jWindow = $( window );
    var jDocument = $( document );

    function check() {
			var viewportHeight = parseInt( jWindow.height() );	
			var pageScroll =  parseInt( jDocument.scrollTop() );
			var pageHeight =  parseInt( jDocument.height() );
      var parentTop = 0;
      var parentHeight = 0;
      var follow = null;
      for (var c=0;c<boxes.length;c++) {
        // If we're following the same object, no need to get the data again.
        if (follow != boxes[c].follow) {
          parentTop = boxes[c].follow.cachedTop;
          parentHeight = parseInt(boxes[c].follow.innerHeight() );
          follow = boxes[c].follow;
        }
        checkBox(boxes[c], viewportHeight, pageScroll, pageHeight, parentTop, parentHeight);
      }
    }
    
		function checkBox(box, viewportHeight, pageScroll, pageHeight, parentTop, parentHeight)
		{		
      var boxHeight = box.innerHeight();
      var boxOffsetTop = parseInt( box.offset().top);
      var currentTop = parseInt( box.css( 'top' ) ) || 0;
			
      // In case it's currently pinned somewhere
      if (box.isFixed) {
        if (boxHeight > parentHeight) {
          // If our box is larger than followed box, we just want to stick it to the top
          box.css('top', "" + (parentTop - box.offsetDiff) + "px");
          box.css('bottom', 'auto');
          box.css('position', 'absolute');
          box.isFixed = false;
        } else if (pageScroll < parentTop) {
          // If the scroll of the page is smaller than the position of the followed box, we just want to stick it to the top
          box.css('top', "" + (parentTop - box.offsetDiff) + "px");
          box.css('bottom', 'auto');
          box.css('position', 'absolute');
          box.isFixed = false;
        } else if ((pageScroll + viewportHeight) > (parentTop + parentHeight)) {
          // Our scroll will show the bottom of the followed box, so stick the follower to the bottom position
          if ((boxHeight > viewportHeight) || (boxHeight > (parentTop + parentHeight - pageScroll))){
            box.css('top', "" + (parentTop + parentHeight - boxHeight - box.offsetDiff) + "px");
            box.css('bottom', 'auto');
            box.css('position', 'absolute');
            box.isFixed = false;
          }
        } else if (boxHeight > viewportHeight){
          if ((box.previousScroll - pageScroll) > 0) {
            // scrolling up
            if (box.get(0).style.bottom != 'auto') {
              // If it's currently stuck in the bottom
              if ((box.previousScroll + viewportHeight - boxHeight) > pageScroll) {
                // If the new target position wouldn't show the full box, stick it fixed to the bottom
                box.css('top', 0);
                box.css('bottom', 'auto');
              } else {
                // Revert to absolute positioning to show more of the follower box
                box.css('top', "" + (box.previousScroll + viewportHeight - boxHeight) + "px");
                box.css('bottom', 'auto');
                box.css('position', 'absolute');
                box.isFixed = false;
              }
            }
          } else if ((box.previousScroll - pageScroll) < 0) {
            // scrolling down
            if (box.get(0).style.top != 'auto') {
              // If it's currently stuck in the top
              if ((box.previousScroll + boxHeight) < (pageScroll + viewportHeight)) {
                // If the new position would go past the end of the box, stick it to the bottom
                box.css('top', 'auto');
                box.css('bottom', 0);
              } else {
                box.css('top', "" + (box.previousScroll - box.offsetDiff) + "px");
                box.css('bottom', 'auto');
                box.css('position', 'absolute');
                box.isFixed = false;
              }
            }
          }
        }
      } else { // Position is absolute
        if ((pageScroll < parentTop) 
          || (boxHeight >= parentHeight)) {
          box.css('top', "" + (parentTop - box.offsetDiff) + "px");
          box.css('bottom', 'auto');
        } else if (((pageScroll + viewportHeight) > (parentTop + parentHeight)) 
          && (boxHeight > viewportHeight)
          ) {
          box.css('top', "" + (parentTop + parentHeight - boxHeight- box.offsetDiff) + "px");
          box.css('bottom', 'auto');
        } else if ((pageScroll > parentTop) 
          && ((boxHeight < viewportHeight) || (boxOffsetTop > pageScroll))
          && (boxHeight < parentHeight)
          && (boxHeight < (parentTop + parentHeight - pageScroll))
          ) {
         
          box.css('top', 0);
          box.css('bottom', 'auto');
          box.css('position', 'fixed');
          box.isFixed = true;
        } else if (((pageScroll + viewportHeight) > (boxOffsetTop + boxHeight)) 
          && (boxHeight > viewportHeight)
          && (boxHeight < parentHeight)
          ) {
          box.css('top', 'auto');
          box.css('bottom', 0);
          box.css('position', 'fixed');
          box.isFixed = true;
        }
      }
      
      box.previousScroll = pageScroll;
		};
    
	$.fixedScroll = function ( box, options )
	{ 
		// Convert box into a jQuery object
		box = $( box );
		
		// 'box' is the object to be animated
		var position = box.css( 'position' );
				
		// If no follow target was specified, and the immediate parent does not have an ID
    if ( options.follow ) {
      if (typeof options.follow == 'string') {
        box.follow = $( options.follow );
      } else {
        box.follow = options.follow;
      }
      box.follow.cachedTop = parseInt( box.follow.offset().top );
    } else {
      box.follow = box.parent();
    }
		
		// Finds the default positioning of the box.
		box.initialOffsetTop =  parseInt( box.offset().top );
		box.initialTop = parseInt( box.css("top") ) || 0;
		box.offsetDiff = box.initialOffsetTop - box.initialTop;
		
		if (!isCapturingEvents) {
      // Animate the box when the page is scrolled
      $( window ).scroll( function () { check(); } );
      
      // Animate the box when the page is resized
      $( window ).resize( function () { check(); } );
  
      isCapturingEvents = true;
    }
    
    boxes.push(box);
		
    // Perform initial check
    var viewportHeight = parseInt( jWindow.height() );	
    var pageScroll =  parseInt( jDocument.scrollTop() );
    var pageHeight =  parseInt( jDocument.height() );
    var parentTop = box.follow.cachedTop;
    var parentHeight = parseInt(box.follow.innerHeight() );
		checkBox(box, viewportHeight, pageScroll, pageHeight, parentTop, parentHeight);
	};
	
	$.fn.fixedScroll = function ( options )	{
		options = options || {};
		options.follow = options.follow || null;
		
		this.each( function() {
				new $.fixedScroll( this, options );
			});
		
		return this;
	};
})( jQuery );



