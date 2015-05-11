/*
 * Filename: Schedule.js
 * Description: This is the Schedule and Event prototype. It will contain behaviors 
 *              and attributes of a schedule. The main attribute is the week,
 *              which is an array of days which are in turn an array of events.
 * Authors: Joe d'Eon (if you edit this file, add your name TODO)
 *
 * Used by: ProfileController.js, GroupController.js
 *
 *
 *
 */


/*
 * Prototype name: Event
 * Implementation: Called with new to create a new Event object
 * Description: Contains attrubutes of an Event.
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
 * Implementation: Called with new to create a new Schedule object.
 * Description: Contains attributes and behaviors of a schedule.
 */
function Schedule(){
  /* the array of days */
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

  /*
   * Function name: addEvent
   *
   * Parameters:
   *              newEvent - the new event to be added to the specified day 
   *                         array
   *              dayNum   - an integer 0-6 to represent days of the week 
   *                         Mon-Sun
   * Description: 
   *              Adds a new event to the schedule. It does so by finding
   *              which day to insert into, using a case-switch, then it 
   *              calls sorted insert to insert into the array based on start
   *              time.
   *
   * */
  this.addEvent = function(dayNum, newEvent){
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
        console.log("Please insert a day 0-6");

    }
  }
  /*
   * Function name: sortedInsert
   * Parameters: 
   *            day      - an array of events
   *            newEvent - the event to be inserted into the day array
   * Description: Finds the event to sort before based on start time, then
   *              inserts the event.
   *
   * */
  this.sortedInsert = function(day, newEvent){
    if(day.length === 0){
      day.push(newEvent);
    }
    else{
      /* iterate over array, looking for where to insert based on start time */
      for(i=0; i < day.length; i++){
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




