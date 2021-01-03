var myToken = "";

console.log("hello");
chrome.identity.getAuthToken({interactive: true}, function(token) {
    console.log('got the token', token);
    myToken = token;
  })

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var API_KEY = 'AIzaSyAB-EKRa9es0KscUhWe4F5jwi4-KSumdSM';

function onGAPILoad() {
    gapi.client.init({
        // Don't pass client nor scope as these will init auth2, which we don't want
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    }).then(function () {
        console.log('gapi initialized');
        gapi.auth.setToken({
            'access_token': myToken,
          });
    }, function(error) {
        console.log('error', error)
    });
}

