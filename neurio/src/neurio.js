var ajax = require('ajax');
var neurio = {
  url : "https://alpha.neur.io/v1",
  login : function(user, pass, success, fail) {
    console.log('in login');
    var URL = this.url + "/oauth2/token";
    var data = { "grant_type" : "password", "username" : user, "password" : pass };
    ajax(
      {
        url: URL,
        data: data,
        type: 'application/x-www-form-urlencoded; charset=utf-8',
        method: 'POST',
      },
      function(data) {
        // Success!
        console.log("Successfully logged in!", data);          
        if(success) success(this, data, JSON.parse(data));
      },
      function(error) {
        // Failure!
        console.log('Failed logging in: ' + error);
        
        if(fail) fail(this, error);
      }
    )},
  currentUser : function(auth, success, fail) {
    console.log('in currentUser');
    var URL = this.url + "/users/current";
    console.log("--->" + auth.access_token);
    var headers = {"Authorization" : "Bearer " + auth.access_token};
    ajax(
      {
        url: URL,
        type: 'json',
        headers: headers,
      },
      function(data) {
        // Success!
        console.log("Successfully fetched current user data!" + data);  
        if(success) success(this, data);
      },
      function(error) {
        // Failure!
        console.log('Failed fetching data: ' + error);
        for(var e in error) {
          console.log(e + "=" + error[e]);
        }
        if(fail) fail(this, error);
      }
    )},
    sensorStats : function(auth, sensorId, success, fail) {
      console.log('in sensorStats');
      var today = new Date();   
      var yesterday = new Date(today);
      yesterday.setDate(today.getDate()-1);
      
      var URL = this.url + "/samples/live?last=" + yesterday.toISOString()+"&sensorId=" + sensorId;
      console.log(URL);
      var headers = {"Authorization" : "Bearer " + auth.access_token};
      ajax(
        {
          url: URL,
          type: 'json',
          headers: headers,
        },
        function(data) {
          // Success!
          console.log("Successfully fetched sensor stats!" + data);  
          if(success) success(this, data);
        },
        function(error) {
          // Failure!
          console.log('Failed fetching location stats: ' + error);
          for(var e in error) {
            console.log(e + "=" + error[e]);
          }
          if(fail) fail(this, error);
        }
    )},
};

this.exports = neurio;  















