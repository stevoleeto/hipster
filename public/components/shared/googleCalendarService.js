/*
 * FileName: GroupController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This service is responsible for requesting a user's google
 *              calendar and if successful, returns the google calendar.
 *
 * Attributes: 
 *  googleCalendar - used to hold the queried googleCal
 *  gcalApiKey -     our google API key
 *
 * Function:
 *  queryGoogleCalendar - queries google's api to get the user's calendar
 */

app.service('googleCalendarService',['$q', '$http', function($q, $http){
    var googleCalendar;

    var gcalApiKey = 'AIzaSyD3uC93ko7eXfGaBdnugIEvQ9QDo6--zK8';

    /************************************************************************
     * Name:        queryGoogleCalendar

     * Purpose:     To get the user's calendar

     * Called In:   userService.js and groupService.js

     * Description: Uses $http service to query google's api. Once the query
     *              finishes, we resolve the calendar via a promise and
     *              return the promise.
     *
     * Parameters: 
     *              calendarID - the calendar ID of the user to query
     ************************************************************************/
    var queryGoogleCalendar = function(calendarID){
        // build the url
        var calendarURL =" https://www.googleapis.com/calendar/v3/calendars/"
            + calendarID + "/events?key=" + gcalApiKey;
        // a future object
        var deferred = $q.defer();
        // http request to google's API
        $http.get(calendarURL).success( function(data, status, headers, config){
            googleCalendar = data;
            //resolve the googleCalendar
            deferred.resolve(googleCalendar);
        }).error( function(data, status, headers, config){
            deferred.reject("Error retrieving google Calendar");
        })
        return deferred.promise;
    };

    /************************************************************************
     * Name:        getGoogleCalendar

     * Purpose:     To get the googleCalendar

     * Called In:   userService.js and groupService.js

     * Description: returns the googleCalendar
     *
     * Parameters: none
     ************************************************************************/
    var getGoogleCalendar = function() {
        return googleCalendar;
    };

    // All the functions callable by any service, controller, directive that
    // injects this service as a dependancy
    return {
        queryGoogleCalendar : queryGoogleCalendar,
        getGoogleCalendar : getGoogleCalendar
    };

}]);
