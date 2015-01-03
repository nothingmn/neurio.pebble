

////////////////////////Configuration
var initialized = false;
var options = {};

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

Pebble.addEventListener("showConfiguration", function() {
  console.log("showing configuration");
  Pebble.openURL('https://dl.dropboxusercontent.com/u/6186393/neurio/configurable.html?'+encodeURIComponent(JSON.stringify(options)));
});

Pebble.addEventListener("webviewclosed", function(e) {
  console.log("configuration closed");
  // webview closed
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    options = JSON.parse(decodeURIComponent(e.response));
    console.log("Options = " + JSON.stringify(options));
    config.setConfig(options);
    
  } else {
    console.log("Cancelled");
  }
});

var config = {
  
  getConfig : function() {
    try {
    return JSON.parse(localStorage.getItem("options"));  
    } catch(e) {
      return {};
    }    
  },
  setConfig : function(options) {
    localStorage.setItem("options", JSON.stringify(options));
    Pebble.sendAppMessage("config.updated", options);
  },
};


this.exports = config;  
