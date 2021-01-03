var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
//var createCalendarButton = document.getElementById('create_calendar_button');
var createEventButton = document.getElementById('create_event_button');
var listEventsButton = document.getElementById('list_events_button');

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var API_KEY = 'AIzaSyAB-EKRa9es0KscUhWe4F5jwi4-KSumdSM';

authorizeButton.onclick = handleAuthClick;

var test = "welcome";
document.getElementById("mytext").value = test;

function handleAuthClick(event) {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        // test = "auth click";
        // document.getElementById("mytext").value = test;
        console.log('got the token', token);
        authorizeButton.style.display = 'none';
      });
    chrome.identity.getProfileUserInfo(function(info) { 
        console.log(info);
        // var email = info.email; 
        //document.getElementById("mytext").value = email;
    });
}

function onGAPILoad() {
    gapi.client.init({
        // Don't pass client nor scope as these will init auth2, which we don't want
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
    }).then(function () {

        
        console.log('gapi initialized');
        createEventButton.onclick = create_event;
        createEventButton.style.display = 'block';
    }, function(error) {
        console.log('error', error)
    });
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

async function create_event(event) {
    //var gradescoperCalID = await getGradescoperCalendar();
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        // Set GAPI auth token
        gapi.auth.setToken({
          'access_token': token,
        });
        //gapi.auth2.getAuthInstance().signIn();

    
        var gradescoperCalID = 'primary';
        console.log(gradescoperCalID);
        var event = {
            'summary': 'Google I/O 2077',
            'location': '800 Howard St., San Francisco, CA 94103',
            'description': 'A chance to hear more about Google\'s developer products.',
            'start': {
            'dateTime': '2021-01-05T09:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
            },
            'end': {
            'dateTime': '2021-01-05T17:00:00-07:00',
            'timeZone': 'America/Los_Angeles'
            },
            'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=1'
            ],
            'reminders': {
            'useDefault': false,
            'overrides': [
                {'method': 'email', 'minutes': 24 * 60},
                {'method': 'popup', 'minutes': 10}
            ]
            }
        };

        

        var request = gapi.client.calendar.events.insert({
            'calendarId': gradescoperCalID,
            'resource': event
        });
        request.execute(function(event) {
            // appendPre('Event created: ' + event.htmlLink);
            console.log(event);
        });

    });
}

