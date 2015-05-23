/*
 * Filename: eventService.js
 * Description: Service for creating events.
 *
 *
 */

 app.service('eventService',['$q', function($q){
 	var eventsToAdd = [];

 	var createEvent = function(eventName, eventColor, startDate, startHour, startMin, endDate, endHour, endMin, repeating, repeatingDays){
 		var eventID = (moment().local()).unix();
 		
 		if (repeating){
 			var myRecurRules = (moment(startDate)).recur(endDate);
 			myRecurRules = (myRecurRules.every(repeatingDays)).daysOfWeek();
 			var allDates = myRecurRules.all();

 			for (index = 0; index < allDates.length; index++){
 				eventsToAdd.push({
 					id    : eventID,
 					title : eventName,
 					start : ((allDates[index].set('hour', startHour)).set('minute', startMin)).toISOString(),
 					end   : ((allDates[index].set('hour', endHour)).set('minute', endMin)).toISOString(),
 					color : eventColor,
 					stick : true
 				});
 			}
 		}
 		else{
 			eventsToAdd.push({
 				id    : eventID,
 				title : eventName,
 				start : ((startDate.set('hour', startHour)).set('minute', startMin)).toISOString(),
 				end   : ((endDate.set('hour', endHour)).set('minute', endMin)).toISOString(),
 				color : eventColor,
 				stick : true
 			});
 		}
 	}

 	var getEvents = function(){
 		return eventsToAdd;
 	}

 	var clearEvents = function(){
 		eventsToAdd.length = 0;
 	}

 	return {
 		createEvent : createEvent,
 		clearEvents : clearEvents,
 		getEvents : getEvents 
 	}
 }]);