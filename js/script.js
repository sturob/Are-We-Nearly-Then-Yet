/* YODO
  - cache manifest
  - interface for adding new ones
  - explaination text
*/



var dates = {
  today: Date.parse( 'today' )
};

var DAY = 1000 * 60 * 60 * 24;

var app = $.sammy(function() {
  
  this.after(function() {
  });
  
  this.before(function() {
  });
  
  this.get('#/', function() {
    // display date entry
  });

  this.get('#/:date/:days(.*)', function() {

    var text = this.params['splat'] + "";

    text = text.replace(/^\//g, ''); // kill the slash

    $( 'h1' ).text( text );
    $('#main').removeClass('complete');
    // $('#status').hide();

    dates.start = Date.parse( this.params['date'] );

    if (this.params['days'].match(/\-/)) {
      dates.end = Date.parse( this.params['days'] );
    } else {
      dates.end = Date.parse( this.params['date'] );
      var days = parseInt( this.params['days'], 10 );
      dates.end.add( days ).days();
    }

    
    var length = dates.end - dates.start;
    var done = dates.today - dates.start;
    var percent = (done / length) * 100;
    
    var days_during = Math.floor( (dates.end - dates.start) / DAY );
    var days_left = Math.floor( (dates.end - dates.today) / DAY );
    var days_to_start = Math.ceil( (dates.start - dates.today) / DAY );

    $('link[rel*=shortcut]').remove();
    
    var hex_section = Math.hem( Math.ceil( (percent / 100) * 16 ), 0, 16 );
    $('head').append( 
      $( '<link id="favicon" rel="shortcut icon" href="images/fav/fav' + hex_section + '.png">' )
    );
    
    setTimeout(function() {
      if (dates.today > dates.end) {
        percent = 100;
      }

      
      $( '#bar' ).animate({ width: percent + "%" }, {
        duration: Math.max(percent * 30, 1000), 
        easing: 'easeInOutQuad',
        complete: function() {
          if (percent == 100) {
            setTimeout(function() {
              $('#main').addClass('complete');
            }, 500);

            $( '#status' ).html( 'You made it!' ).delay(400).fadeIn( 500 );
          } else if (percent < 0) {
            $( '#status' ).html( 'Starts in <span>' + days_to_start + '</span> day' + s(days_to_start) ).delay(400).fadeIn( 500 );
          } else {
            // $( '#status' ).html().delay(400).fadeIn( 500 );
          }
        },
        step: function(now, fx) {
          // var data = fx.elem.id + ' ' + fx.prop + ': ' + now;
          // $('body').append('<div>' + data + '</div>');
          var d = Math.floor( 
            days_during - (days_during * (now / 100))
          );
          $('#status').html( '<span>' + d + '</span> day' + s(d) + ' to go' )  
        }
      });
    }, 300);
  });

});



$(function(){
  app.run();
});

Math.hem = function (n, low, high) {
  return Math.min(high, Math.max(low, n));
}

function s (n) {
  return n != 1 ? 's' : '';
}