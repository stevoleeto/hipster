/*
 * FileName: eventService.js
 * Authors: Stephen Gilardi, Joseph Deon
 * Date Last Modified: 6/6/2014
 * 
 * Description: This service will be used to create, copy, and return 
 *              events back to the Profile Controller. 
 *
 *
 * Attributes: eventsToAdd - An array of events to be returned to the Profile Controller.
 *
 * Functions:
 *             createEvent() - Create's a event using specific parameters and adds them to eventsToAdd.
 *             getEvents()   - Returns the eventsToAdd array.
 *             clearEvents() - Clears eventsToAdd array. 
 *             copyEvent()   - Returns a new unique copy of an event.
 * 
 */

 app.service('eventService',['$q', function($q){
 	var eventsToAdd = [];


    /************************************************************************
    * Name:        createEvent
    *
    * Purpose:     Adds additional new events to the eventsToAdd array.
    *
    * Parameters:  eventName:     Name of the new event.
    *              eventColor:    Color of the new event.
    *              startDate:     The date the event begins on.
    *              startHour:     The hour that the event starts at.
    *              startMin:      The minute that the event starts at.
    *              endHour:       The hour that the event ends at.
    *              endMin:        The minute that the event ends at.
    *              repeating:     If the event is repeating or not. (Boolean).
    *              repeatingDays: An array containing the days that the event repeats on.
    *
    * Called In:   ProfileController.js
    ************************************************************************/
 	var createEvent = function(eventName, eventColor, startDate, startHour, startMin, endDate, endHour, endMin, repeating, repeatingDays){
 		// sets the eventID to epoch time, chosen to be unique.
        var eventID = (moment().local()).unix();
 		
        // if the event is a repeating event.
 		if (repeating){
            // Define the reccurence to be between the start and end dates.
 			var myRecurRules = (moment(startDate)).recur(endDate);

            // Define the reccurence to repeat on the specific days of the week as defined 
            // by the repeating events array parameter.
 			myRecurRules = (myRecurRules.every(repeatingDays)).daysOfWeek();

            // Grab al of the dates within the reccurence.
 			var allDates = myRecurRules.all();

            // Iterate through all of the dates in the reccurence, add them to eventsToAdd.
 			for (index = 0; index < allDates.length; index++){
 				eventsToAdd.push({
 					id    : eventID,
 					title : eventName,
 					start : ((allDates[index].set('hour', startHour)).set('minute', startMin)).toISOString(),
 					end   : ((allDates[index].set('hour', endHour)).set('minute', endMin)).toISOString(),
 					color : eventColor,
 					stick : true,
                    textColor: "black"
 				});
 			}
 		}
        //if the event is not a repeating event. Just push the event onto eventsToAdd array.
 		else{
 			eventsToAdd.push({
 				id    : eventID,
 				title : eventName,
 				start : ((startDate.set('hour', startHour)).set('minute', startMin)).toISOString(),
 				end   : ((endDate.set('hour', endHour)).set('minute', endMin)).toISOString(),
 				color : eventColor,
 				stick : true,
        textColor: "black"
 			});
 		}
 	}

    /************************************************************************
    * Name:        getEvents
    *
    * Purpose:     Returns the eventsToAdd array.
    *
    * Called In:   ProfileController.js
    ************************************************************************/
 	var getEvents = function(){
 		return eventsToAdd;
 	};

    /************************************************************************
    * Name:       clearEvents
    *
    * Purpose:    Clears the eventsToAdd array.
    *
    * Called In:  ProfileController.js
    ************************************************************************/
 	var clearEvents = function(){
 		eventsToAdd.length = 0;
 	};

    /************************************************************************
    * Name:        copyEvent
    *
    * Purpose:     Copys an event 
    *
    * Parameters:  event : The event to be copied.
    *
    * Returns:     The copied event with a new refence.
    *
    * Called In:   ProfileController.js, GroupController.js, 
    ************************************************************************/
    var copyEvent = function(event){
        return{
            id: event.id,
            title: event.title,
            start: event.start.toString(),
            end: event.end.toString(),
            rendering: event.rendering,
            color: event.color,
            textColor : event.textColor,
            stick : event.stick
        }
    };



 	return {
 		createEvent : createEvent,
 		clearEvents : clearEvents,
 		getEvents : getEvents,
        copyEvent : copyEvent
 	}
 }]);
