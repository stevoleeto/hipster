/*
 * Filename: Schedule.js
 * Description: This is the Schedule prototype. It will contain behaviors 
 *              and attributes of a schedule. The main attribute is the week,
 *              which is an array of days which are in turn an array of events.
 *              It also contains a prototype for an Event object.
 * Authors: Joe d'Eon (if you edit this file, add your name TODO)
 *
 * Used by: ProfileController.js, GroupController.js
 *
 *
 *
 */


/*
 * Prototype name: Event
 * Purpose: Called with new to create a new Event object
 */
function Event(name, startTime, endTime, startDate, endDate, recurring){

  this.name = name,
  this.startTime = startTime,
  this.endTime = endTime,
  this.startDate = startDate,
  this.endDate = endDate,
  this.recurring = recurring

}


/*
 * Prototype name: Schedule
 * Purpose: Called with new to create a new Schedule object.
 */
function Schedule(){
  this.week = [
    day0 = [
           ],
    day1 = [
           ],
    day2 = [
           ],
    day3 = [
           ],
    day4 = [
           ],
    day5 = [
           ],
    day6 = [
           ]
               ]

  this.test = function(){
      alert("test");
  }
  /* function to add event to schedule */
  this.addEvent = function(newEvent, dayNum){
    switch(dayNum){
      case 0:
        //inserted sort into day0
        this.sortedInsert(day0, newEvent);
        break;
      case 1:
        this.sortedInsert(day1, newEvent);
        break;
      case 2:
        this.sortedInsert(day2, newEvent);
        break;
      case 3:
        this.sortedInsert(day3, newEvent);
        break;
      case 4:
        this.sortedInsert(day4, newEvent);
        break;
      case 5:
        this.sortedInsert(day5, newEvent);
        break;
      case 6:
        this.sortedInsert(day6, newEvent);
        break;
      default:
        //default code

    }
  }
  /* takes a day array and an event and inserts it into the array */
  this.sortedInsert = function(day, newEvent){
    if(day.length === 0){
      day.push(newEvent);
    }
    else{
      /* iterate over array, looking for where to insert based on start time */
      for(i=0; i < day.length; i++){
        console.log(day.length);
        if(newEvent.startTime <= day[i].startTime){ 
          day.splice(i, 0, newEvent);//insert before 
          return;
        }
        else if (i == day.length - 1){
          day.splice(i + 1, 0, newEvent);//insert at end
          return;
        }
      }//end iteration
    }
  }//end function

}




