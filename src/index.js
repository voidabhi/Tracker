'use strict';

// endpoint where data needs to be sent
var SERVER_URL = 'http://localhost:3030/clientdetails',
    // unique cookie set at the backend for the script
    visitCookie = '-some-cookie-';

/*
- encodes js object into query parameters
*/
function getQueryString(e) {
    var n = '';
    for (var obj in e) {
        if (e.hasOwnProperty(obj)) {
            n += obj + '=' + encodeURIComponent(e[obj]) + '&';
        }
    }
    return n + 'cookie=' + visitCookie + '&time=' + new Date();
}

/*
- loading script async into html head from source src
*/
function sendDataToTracker(src) {
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = function () {
        script.remove();
    };
    script.src = src;
    head.appendChild(script);
}

/*
- posting event data (js object) to serve
*/
function doAsyncEventPost(obj) {
    var visitEvent = 'http://localhost:3030/visit';
    sendDataToTracker(visitEvent + '?' + getQueryString(obj));
}

/*
- sends all the events in event queue to the server
*/

function flushTrackerEventQueue() {
    if ('_TrackerEventQueue' in window) {
        for (var e = 0; e < _TrackerEventQueue.length; ++e) {
            var n = _TrackerEventQueue[e];
            doAsyncEventPost(n);
        }
    }
}

/*
 - setting document cookie
 - initializing track function to send event data to server
    - send data to server with Track(<js object>)
 - sending all the events already present in event queue to server
 - sending user details to server
*/
document.cookie = visitCookie;
window.Track = function (e) {
    doAsyncEventPost(e);
};
flushTrackerEventQueue();
if ('TRACKER_CLIENT_DATA' in window) {
    // posting client details to backend api
    var clientApi = SERVER_URL;
    sendDataToTracker(clientApi + '?' + getQueryString(TRACKER_CLIENT_DATA));
} else {
    window.console.error('Tracker : TRACKER_CLIENT_DATA variable is required');
}
