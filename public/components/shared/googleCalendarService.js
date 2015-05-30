app.service('googleCalendarService',['$q', '$http', function($q, $http){
  var googleCalendar;

  var gcalApiKey = 'AIzaSyD3uC93ko7eXfGaBdnugIEvQ9QDo6--zK8';
  
  var queryGoogleCalendar = function(calendarID){
    var calendarURL =" https://www.googleapis.com/calendar/v3/calendars/"
                + calendarID + "/events?key=" + gcalApiKey;
    var deferred = $q.defer();
      $http.get(calendarURL).success( function(data, status, headers, config){
        googleCalendar = data;
        deferred.resolve(googleCalendar);
      }).error( function(data, status, headers, config){
        console.log("Error retieving Google Calendar");
      })
    return deferred.promise;
  };

  var getGoogleCalendar = function() {
    return googleCalendar;
  };

  return {
    queryGoogleCalendar : queryGoogleCalendar,
      getGoogleCalendar : getGoogleCalendar
  };

}]);
