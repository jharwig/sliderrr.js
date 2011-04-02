var Sliderrr = function() {
  var current, $ = jQuery, currentTranslate, currentScale, currentScaleVal, currentTransX, currentTransY;

  function doToVideo(section, func) {
    if (section.find('video').length > 0) {
      section.find('video')[0][func]();
    }
  }
  
  function showSlide(section) {   
    var s = $(section),
        w = s.width(),
        h = s.height(),
        vW = $(window).width(),
        vH = $(window).height(),
        scaleX = vW / w,
        scaleY = vH / h,
        scale = Math.min(scaleX, scaleY),
        transX = (s.data('offset').left*scale*-1 + vW/2 - w*scale/2),
        transY = (s.data('offset').top*scale*-1 + vH/2 - h*scale/2);
    
    currentTransX = transX;
    currentTransY = transY;
    currentTranslate = 'translate('+ transX.toFixed(4) + 'px,' + transY.toFixed(4) + 'px)';
    currentScaleVal = scale;
    currentScale = 'scale(' + currentScaleVal.toFixed(4) + ')';
    
    var transform = currentTranslate + ' ' + currentScale;
    s.addClass('current');
    $(document.body).addClass('presentmode');      
    $('.slides').css({
      '-moz-transform': transform,
      '-webkit-transform': transform          
    });
    
  }
  function move(func) {
    $('.popover').hide();
    
    // builds
    if (func == 'next') {
      for (var i = 0; i < 6; i++) {
        var cls = 'b' + i;
        if (current.find('.' + cls).length === 0) {
          break;
        }
        
        if (!current.hasClass(cls)) {
          current.addClass('b' + i);
          return;
        }
      }      
    }
      
    doToVideo(current, 'pause');  
      
    var el = current[func]('section');
    if (el && el.length) {
      current.removeClass('current');
      current = el;
      current.removeClass('b0 b1 b2 b2 b3 b4 b5');        
      showSlide(current);
    }        
  }
  function moveNext() {
    move('next');
  }
  function movePrevious() {
    move('prev');
  }
  function enablePresentMode() {
    if (!$(document.body).hasClass('presentmode')) {    
      document.body.scrollTop = 0;    
      document.body.scrollLeft = 0;                  
      showSlide(current);    
    }
  }
  function disablePresentMode() {
    if ($(document.body).hasClass('presentmode')) {        
      $(document.body).removeClass('presentmode');
      $('.slides').css({'-moz-transform': '', '-webkit-transform': ''});            
      document.body.scrollTop = Math.max(0, current.offset().top - 100);    
      document.body.scrollLeft = Math.max(0, current.offset().left - 100);          
    }
  }
  function togglePresentMode() {
    if ($(document.body).hasClass('presentmode')) {            
      disablePresentMode();
    } else {
      enablePresentMode();
    }
  }
              
  function init() {
    var PAGE_UP = 33,
      PAGE_DOWN = 34,
      ARROW_LEFT = 37,
      ARROW_UP = 38,
      ARROW_RIGHT = 39,
      ARROW_DOWN = 40,
      TAB = 9,
      ESC = 27;

    $(document).keydown(function(e) {            
      switch (e.keyCode) {
        case TAB: 
          e.preventDefault();
          break;
        case PAGE_UP:
        case ARROW_LEFT: 
          movePrevious();
          e.preventDefault();
          break;     
        case PAGE_DOWN:               
        case ARROW_RIGHT:
          moveNext();
          e.preventDefault();
          break;
        case 66:
          togglePresentMode();
          break;
        case ESC:
          if (e.metaKey) {
            disablePresentMode();
          }
          break;
      }
    });
    
    $('.slides section').live('dblclick', function() {
      current = $(this);
      enablePresentMode();      
    });
    
    $('.popover').live('click', function(e) {
      e.preventDefault();
      $(this).hide();
    })
    $('button').live('click', function(e){
      e.preventDefault();
    });
    
    
    // Handle links to open in iframes, and popovers
    $('a').live('click', function(e) {
      e.preventDefault();      
      
      var popoverId = $(this).attr('data:popover');
      if (popoverId) {
        $('#' + popoverId).appendTo(document.body).show();        
        return;
      }
      
      window.open(this.href);
    });

    // Cache sections offset
    $('.slides section').each(function(){
      $(this).data('offset', $(this).offset());
    });
            
    current = $('.slides section').first();
    showSlide(current);
  }


  return  {
    current: current,
    init: function() {
      setTimeout(init, 1000);
    }
  }
}();

