var UI = require('ui');
var neurio = require("neurio");
var Accel = require('ui/accel');
var Vibe = require('ui/vibe');
var config = require("configuration");

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'neurio',
  subtitle:'initializing...',
});



// Display the Card
card.show();
Update();


function errMsg(e) {
  card.subtitle('error');
  card.body('could not connect to neurio service!');
}

card.on('accelTap', function(e) {
  card.subtitle('updating consumption');
  UpdateWithAuth();
});

var authentication = {};
function UpdateWithAuth() {
    neurio.currentUser(authentication, function(n, user){
      var b = false;
      for(var location in user.locations) {    
        for(var sensor in user.locations[location].sensors) {
          for(var channel in user.locations[location].sensors[sensor].channels) {
            var c = user.locations[location].sensors[sensor].channels[channel];
            if(c.channelType == "consumption") {
              var sensorId = c.sensorId;
              neurio.sensorStats(authentication, sensorId, function(n, data) {
                  card.subtitle('sensor stats updated');
                  var body = "";
                  var max = 5;
                  var count = 0;
                  var now = new Date();
                  for(var e in data) {                  
                    if(typeof data[e].consumptionPower != 'undefined') {                      
                      count++;                                       
                      var then = new Date(data[e].timestamp);
                      var diff = Math.round( (now - then)/3600, 1);
                      body = body + data[e].consumptionPower + "w, " +  diff + " sec ago\n";
                    }
                    if(count>=max) break;
                  }
                  card.subtitle('consumption');
                  card.body(body);
                  Vibe.vibrate('short');
                  b = true;
  
              }, errMsg);    
            }
            if(b) break;
          }
          if(b) break;
        }
        if(b) break;
      }
    }, errMsg);  
}

Pebble.addEventListener("config.updated", function() {
  Update();  
});

function Update() {
  
  var options = config.getConfig();
  
  if(!options || typeof options == 'undefined' || typeof options.username == 'undefined' ||typeof options.password == 'undefined'  ) {
    card.subtitle('app not configured!');
  } else {
    neurio.login(options.username, options.password, function(n, raw, auth) { 
      card.subtitle('login successful, querying locations and sensors');
      authentication = auth;
      card.subtitle('location and sensors queried, pulling consumption');
      UpdateWithAuth();
    }, errMsg);
  }
};
Accel.init();

