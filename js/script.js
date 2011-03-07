/* YODO
  - cache manifest
  - better 'starts in' visualisation
  - interface for adding new ones
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
    $('form').hide();
    
  });

  this.get('#/add', function() {
    $('form').show();
  });

  this.get('#/:date/:days(.*)', function() {
    
    $('form').fadeIn();
    var $today = $('#today');

    var text = this.params['splat'] + "";
    text = text.replace(/^\//g, ''); // kill the slash


    $( '#bar' ).css({ width: 0 });

    // reset
    $( 'h1' ).text( text );
    $( 'body' ).removeClass('complete');
    
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

    $( 'form #duration_div span' ).html( '<b>' + days_during + '</b><br> day' + s(days_during) );
    
    var format = "yyyy-MM-dd";
    $( 'input#from ').val( dates.start.toString( format ) );
    $( 'input#to ').val( dates.end.toString( format ) );
    $( 'input#title ').val( text );

    $('link[rel*=shortcut]').remove();
    
    var hex_section = Math.hem( Math.ceil( (percent / 100) * 16 ), 0, 16 );
    $('head').append( 
      $( '<link id="favicon" rel="shortcut icon" href="images/fav/fav' + hex_section + '.png">' )
    );
    
    if (percent < 0) {
      $( '#status' ).hide().html( 'Starts in <span>' + days_to_start + '</span> day' + s(days_to_start) ).delay(400).fadeIn( 500 );
      return;
    }
    
    setTimeout(function() {
      if (dates.today > dates.end) {
        percent = 100;
      }
      
      $( '#bar' ).stop().animate({ width: percent + "%" }, {
        duration: Math.max((percent * 10) + days_during, 1000), 
        easing: 'easeInOutQuad',
        complete: function() {
          if (percent == 100) {
            setTimeout(function() {
              $('body').addClass('complete');
            }, 500);

            $( '#status' ).html( 'You made it!' ).delay(400).fadeIn( 500 );
          } else if (percent < 0) {
    
          } else {
            $( '#status span' ).delay( 50 ).animate( { opacity: 0 }, 0).delay( 150 ).animate( { opacity: 1 }, 1200);
          }
        },
        step: function(now, fx) {
          var days_passed = Math.ceil(days_during * (now / 100));
          
          var date_today = dates.start.clone();
          date_today.addDays(days_passed);
          
          var format = 'ddd, d MMMM yyyy';
          
          $today.css({ left: now + "%"}).find('span').text( date_today.toString( format ) );
          
          var d = Math.floor( 
            days_during - days_passed
          );        
          $('#status').html( '<span>' + d + '</span> day' + s(d) + (percent < 100 ? ' to go' : '') );
        }
      });
    }, 300);
  });

});



$(function(){
  app.run();
  
  $('.cancel').click(function() {
    window.history.back();
    return false;
  });
  
  $('form').submit( function(foo) {
    var new_url = '#/' + $('#from', this).val() +
                  '/'  + $('#to', this).val() + 
                  '/'  + $('#title', this).val();
    
    window.location = new_url;
    return false;
  })
});

Math.hem = function (n, low, high) {
  return Math.min(high, Math.max(low, n));
}

function s (n) {
  return n != 1 ? 's' : '';
}