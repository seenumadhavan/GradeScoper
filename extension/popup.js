//var authorizeButton = document.getElementById('authorize_button');
//var signoutButton = document.getElementById('signout_button');
//var createCalendarButton = document.getElementById('create_calendar_button');
var createEventButton = document.getElementById('create_event_button');
//var listEventsButton = document.getElementById('list_events_button');
//var scrapeButton = document.getElementById('scrape_button');

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
var API_KEY = 'AIzaSyAB-EKRa9es0KscUhWe4F5jwi4-KSumdSM';

//authorizeButton.onclick = handleAuthClick;

var test = "welcome";
document.getElementById("mytext").value = test;

function handleAuthClick(event) {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
        // test = "auth click";
        // document.getElementById("mytext").value = test;
        console.log('got the token', token);
        //authorizeButton.style.display = 'none';
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
        //scrapeButton.style.display = 'block';
        //scrapeButton.onclick = scrape_click;

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

    // var obj = {};
    // obj['u'] = 'user';
    // //console.log(obj);
    // var u = 'u';

    // chrome.storage.local.set(obj, function() {
    //     chrome.storage.local.get(u, function (result) {
    //         console.log("values " + String(result));
    //         console.log(Object.keys(result));
    //         console.log(Object.values(result));
    //     });
    // });
    // return;
    var loading = 0;
    document.getElementById("mytext").value = "loading 0%";
    
    chrome.identity.getAuthToken({interactive: true}, async function(token) {
        // Set GAPI auth token
        gapi.auth.setToken({
          'access_token': token,
        });
        //gapi.auth2.getAuthInstance().signIn();
        // chrome.storage.sync.set(obj, function() {
        //     chrome.storage.sync.get('user', function (result) {
        //         console.log("values");
        //         console.log(result.values);
        //     });
        // });
        console.log("scrape clicked");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "time to scrape"}, async function(response) {
              console.log(response.farewell);
              var arrayScraped = response.farewell;
              var gradescoperCalID = await getGradescoperCalendar();
            //   var events_obj = {
            //       events: []
            //   }

              var events = [];
              for (i = 0; i < arrayScraped[1].length; i++){
                var name = arrayScraped[1][i][1];
                if (name == null){
                    name = arrayScraped[1][i][2];
                }
                name = arrayScraped[0][0][1] + ": " + name;
                console.log("Name "+name);

                var endDate = getUTCEndFromComponents(parseInt(arrayScraped[0][0][3]), arrayScraped[1][i][3], parseInt(arrayScraped[1][i][4]), parseInt(arrayScraped[1][i][5]), parseInt(arrayScraped[1][i][6]), arrayScraped[1][i][7]);
                if (endDate==null) {
                    console.log("invalid date");
                    continue;
                }
                //console.log("End date "+endDate.toString());
                var event = {
                    'summary': name,
                    'description': 'A Gradescoped Assignment',
                    'start': {
                    'dateTime': endDate.toISOString(),
                    },
                    'end': {
                    'dateTime': endDate.toISOString(),
                    },
                    'reminders': {
                    'useDefault': false,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10}
                    ]
                    }
                };

                // check if event is in storage
                // var nameFromMem = await chrome.storage.sync.get([name], async function(result) {
                //     await console.log('Looking up: ' + name);
                //     });
                //console.log("name "+nameFromMem);

                //var nameFromMem = await checkKey(name);

                // add the event to storage if not in storage
                // if (nameFromMem==null) {
                //     console.log("Name and event pulled from memmory (rehydrated): " + nameFromMem+ " "+name);
                //     await setKey(name);
                //     events.push(event);

                // }

                //await checkSetKey(name, events_obj, event);
                let curr = await function () {
                    return new Promise((resolve, reject) => {
                        chrome.storage.sync.get(name, function(result) {
                            console.log(Object.entries(result));
                            if (Object.values(result).length == 0) {
                                //console.log("Event not found: "+name);
                                events.push(event);
                                console.log("pushed "+name);
                                chrome.storage.sync.set({name: name},  function() {
                                    console.log('Logged into memory:' + name);
                                });
                                // let c1 = await function () {
                                //     return new Promise((resolve, reject) => {
                                //         var obj = {};
                                //         obj[name] = name;
                                //         //console.log(obj);
                                //         chrome.storage.sync.set(obj,function(){
                                //             chrome.storage.sync.get(name, function(result){
                                //                 console.log("store value:");
                                //                 console.log(Object.values(result));
                                //                 resolve();
                                //             })
                                // });
                                //     });
                                // }().then(response => {
                                // }).catch(e => {
                                //     console.log(e);
                                // });
                                var obj = {};
                                obj[name] = name;
                                //console.log(obj);
                                chrome.storage.sync.set(obj,function(){
                                    chrome.storage.sync.get(name, function(result){
                                        console.log("store value:");
                                        console.log(Object.values(result));
                                        resolve(event);
                                    })
                                });
                            }
                            else {
                                reject();
                            }
                        });
                    });
                }().then(response => {
                }).catch(e => {
                    console.log(e);
                });
                    
    
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
              var total = events.length;
              console.log("total events "+total);
              if (total==0) return;
              const batch = gapi.client.newBatch();
              //var num_events= 0;
              events.map((r, j) => {
                  //num_events = num_events+1;
                  loading = loading +1;
                  document.getElementById("mytext").value = "loading"+(100*loading/total).toString()+"%";
                batch.add(gapi.client.calendar.events.insert({
                  'calendarId': gradescoperCalID,
                  'resource': events[j]
                }))
              })
              batch.then(function(){
                console.log('all jobs now dynamically done!!!');
                document.getElementById("mytext").value = "Done";
                //console.log(num_events);
              });


              
            });
        });
    });
}

// function checkKey(name) {
//     return chrome.storage.sync.get(name, function(result) {
//         console.log('Looking up: ' + name);
//         console.log('Found: ' + result);
//         });
// }
// function setKey(name) {
//     chrome.storage.sync.set({name: name}, async function() {
//         console.log('Logged into memory:' + name);
//     });
// }
// function checkSetKey(name, events_obj, event) {
//     return chrome.storage.sync.get(name, function(result) {
//         console.log('Looking up: ' + name);
//         console.log('Found: ' + result);
//         if (result==null){
//             chrome.storage.sync.set({name: name}, function() {
//                 console.log('Logged into memory:' + name);
//                 events_obj.events.push(event);
//             });
//         }
        
//     });
// }

// Please dont ask me how this works
function getUTCEndFromComponents(year, month, date_input, hours, mins, ampm){
    //month str, date int, hours int, mins int, ampm str
    //console.log("Month"+month);

    //var year = new Date().getFullYear;
    var date = new Date();

    date.setFullYear(year);

    var result = "";

    //year
    result += year + "-";


    //month
    if (month == "January"){
        result += "01-";
        date.setMonth(0);
    } else if (month == "February"){
        result += "02-";
        date.setMonth(1);
    } else if (month == "March"){
        result += "03-";
        date.setMonth(2);
    } else if (month == "April"){
        result += "04-";
        date.setMonth(3);
    } else if (month == "May"){
        result += "05-";
        date.setMonth(4);
    } else if (month == "June"){
        result += "06-";
        date.setMonth(5);
    } else if (month == "July"){
        result += "07-";
        date.setMonth(6);
    } else if (month == "August"){
        result += "08-";
        date.setMonth(7);
    } else if (month == "September"){
        result += "09-";
        date.setMonth(8);
    } else if (month == "October"){
        result += "10-";
        date.setMonth(9);
    } else if (month == "November"){
        result += "11-";
        date.setMonth(10);
    } else if (month == "December"){
        result += "12-";
        date.setMonth(11);
    }


    date.setDate(date_input);
    // if (date_input < 10){
    //     result += "0" + date_input + "T";
    // } else{
    //     result += date_input + "T";
    // }
    date.setSeconds(0);
    date.setMinutes(mins);
    date.setHours(hours);
    if (ampm == "PM") {
        date.setHours(12 + hours);
    } 
    

    // //hours
    // if(ampm == "PM"){
    //     hours += 12;
    // }

    // if (hours < 10){
    //     result += "0" + hours + ":";
    // } else {
    //     result += hours + ":";
    // }

    //mins

    // if (mins < 10){
    //     result += "0" + mins + ":00-08:00";
    // } else {
    //     result += mins + ":00-08:00";
    // }
    // console.log(result);
    // return result;

    return date;
}


/*Creates a calendar*/
async function create_calendar() {
    console.log("in create_calendar");
    timezone = await getPrimaryCalendarTimezone();
    console.log(timezone);

    return gapi.client.calendar.calendars.insert({
        "resource": {
        "summary": "GradeScoper",
        "timeZone": timezone
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

function getPrimaryCalendarTimezone() {
    var response_raw;
    var timezone;
    var cal_found = false;


    return gapi.client.calendar.calendarList.list({})
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                // console.log("Response", response);
                response_raw = response;
                var cal_items = JSON.parse(response_raw.body).items;
                console.log(cal_items);
                for (var i = 0; i < cal_items.length; i++) {
                if (cal_items[i].primary == true) {
                    timezone = cal_items[i].timeZone;
                    console.log("found");
                    cal_found = true;
                }
                }
                if (cal_found) return timezone;
            },
            function(err) { console.error("Execute error", err); });
    // console.log(typeof(response_raw));
}
