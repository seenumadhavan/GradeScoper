var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');
//var createCalendarButton = document.getElementById('create_calendar_button');
var createEventButton = document.getElementById('create_event_button');
var listEventsButton = document.getElementById('list_events_button');
var scrapeButton = document.getElementById('scrape_button');

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
        scrapeButton.style.display = 'block';
        scrapeButton.onclick = scrape_click;

    }, function(error) {
        console.log('error', error)
    });
}

function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

async function scrape_click(event) {
    console.log("scrape clicked");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "time to scrape"}, function(response) {
          console.log(response.farewell);
        });
      });
  }

async function scrape_click_noListen() {
    console.log("scrape clicked");
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
        await chrome.tabs.sendMessage(tabs[0].id, {greeting: "time to scrape"}, function(response) {
          console.log(response.farewell);
          return response.farewell;
        });
      });
  }


async function create_event(event) {
    //var gradescoperCalID = await getGradescoperCalendar();
    chrome.identity.getAuthToken({interactive: true}, async function(token) {
        // Set GAPI auth token
        gapi.auth.setToken({
          'access_token': token,
        });
        //gapi.auth2.getAuthInstance().signIn();
            
        console.log("scrape clicked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "time to scrape"}, async function(response) {
              console.log(response.farewell);
              var arrayScraped = response.farewell;
              var gradescoperCalID = await getGradescoperCalendar();
              var events = [];  
              for (i = 0; i < arrayScraped[1].length; i++){
                var name = arrayScraped[1][i][1];
                if (name == null){
                    name = arrayScraped[1][i][2];
                }
                name = arrayScraped[0][0][1] + ": " + name;
                console.log(name);

                var endDate = getUTCEndFromComponents(arrayScraped[1][i][3], parseInt(arrayScraped[1][i][4]), parseInt(arrayScraped[1][i][5]), parseInt(arrayScraped[1][i][6]), arrayScraped[1][i][7]);
                var event = {
                    'summary': name,
                    'description': 'A Gradescoped Assignment',
                    'start': {
                    'dateTime': endDate,
                    'timeZone': 'America/Los_Angeles'
                    },
                    'end': {
                    'dateTime': endDate,
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
                    events.push(event);
    
                    // var request = gapi.client.calendar.events.insert({
                    //     'calendarId': gradescoperCalID,
                    //     'resource': event
                    // });
                    // request.execute(function(event) {
                    //     // appendPre('Event created: ' + event.htmlLink);
                    //     console.log(event);
                    // });
                    // await new Promise(r => setTimeout(r, 500));
              }
              const batch = gapi.client.newBatch();
              //var num_events= 0;
              events.map((r, j) => {
                  //num_events = num_events+1;
                batch.add(gapi.client.calendar.events.insert({
                  'calendarId': gradescoperCalID,
                  'resource': events[j]
                }))
              })
              batch.then(function(){
                console.log('all jobs now dynamically done!!!');
                //console.log(num_events);
              });


              
            });
        });
    });
}


// Please dont ask me how this works
function getUTCEndFromComponents(month, date, hours, mins, ampm){
    //month str, date int, hours int, mins int, ampm str



    //var year = new Date().getFullYear;
    var year = 2020
    var result = "";

    //year
    result += year + "-";


    //month
    if (month == "January"){
        result += "01-";
    } else if (month == "February"){
        result += "02-";
    } else if (month == "March"){
        result += "03-";
    } else if (month == "April"){
        result += "04-";
    } else if (month == "May"){
        result += "05-";
    } else if (month == "June"){
        result += "06-";
    } else if (month == "July"){
        result += "07-";
    } else if (month == "August"){
        result += "08-";
    } else if (month == "September"){
        result += "09-";
    } else if (month == "October"){
        result += "10-";
    } else if (month == "November"){
        result += "11-";
    } else if (month == "December"){
        result += "12-";
    }


    //date
    if (date < 10){
        result += "0" + date + "T";
    } else{
        result += date + "T";
    }


    //hours
    if(ampm == "PM"){
        hours += 12;
    }

    if (hours < 10){
        result += "0" + hours + ":";
    } else {
        result += hours + ":";
    }

    //mins

    if (mins < 10){
        result += "0" + mins + ":00-07:00";
    } else {
        result += mins + ":00-07:00";
    }
    console.log(result);
    return result;
}


/*Creates a calendar*/
function create_calendar() {
    return gapi.client.calendar.calendars.insert({
        "resource": {
        "summary": "GradeScoper"
        }
    })
        .then(function(response) {
        // Handle the results here (response.result has the parsed body).
        // console.log("Response", response);
        console.log("created calendar");
        return JSON.parse(response.body).id;
        },
        function(err) { console.error("Execute error", err); });
}
    
// function to create calendar if doesn't exist, and ultimately return calendar ID (for future event creation)
function getGradescoperCalendar() {


    var response_raw;
    var cal_id;
    var cal_found = false;


    return gapi.client.calendar.calendarList.list({})
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                // console.log("Response", response);
                response_raw = response;
                var cal_items = JSON.parse(response_raw.body).items;
                // console.log(cal_found);
                for (var i = 0; i < cal_items.length; i++) {
                if (cal_items[i].summary == "GradeScoper") {
                    cal_id = cal_items[i].id;
                    console.log("found");
                    cal_found = true;
                }
                }
                if (cal_found) return cal_id;
                return create_calendar();
            },
            function(err) { console.error("Execute error", err); });
    // console.log(typeof(response_raw));
}
