
var dates = {
  today: Date.parse('today')
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

  this.get('#/:date/:days', function() {

    dates.start = Date.parse( this.params['date'] );
    dates.end = Date.parse( this.params['date'] );

    var days = parseInt( this.params['days'], 10 );
    
    dates.end.add( days ).days();
    
    var length = dates.end - dates.start;
    var done = dates.today - dates.start;
    var percent = (done / length) * 100;
    
    var days_left = Math.floor( (dates.end - dates.today) / DAY );
    var days_to_start = Math.ceil( (dates.start - dates.today) / DAY );
    
    
    
    var hex_section = Math.hem( Math.ceil( (percent / 100) * 16 ), 0, 16 );
    
    // $('link[rel*=shortcut]').attr( 'href', 'images/fav/fav' + hex_section + '.png' )
                            // .remove().clone().appendTo('head');
    
    $('link[rel*=shortcut]').remove();
    $('<link id="favicon" rel="shortcut icon" href="images/fav/fav' + hex_section + '.png">').appendTo('head');
    
    setTimeout(function() {
      if (dates.today > dates.end) {
        percent = 100;
      }
      
      $( '#bar' ).animate({ width: percent + "%" }, Math.max(percent * 10, 1000), function() {
        if (percent == 100) {
          setTimeout(function() {
            $('#main').addClass('complete');
          }, 500);

          $( '#status' ).html( 'You made it!' ).delay(400).fadeIn( 500 );
        } else if (percent < 0) {
          $( '#status' ).html( 'Starts in <span>' + days_to_start + '</span> day' + s(days_to_start) ).delay(400).fadeIn( 500 );
        } else {
          $( '#status' ).html('<span>' + days_left + '</span> day' + s(days_left) + ' to go' ).delay(400).fadeIn( 500 );
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