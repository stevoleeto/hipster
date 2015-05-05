/*
 * Filename: Schedule.js
 * Description: This is the Schedule prototype. It will contain behaviors 
 *              and attributes of a schedule. The main attribute is the week,
 *              which is an array of days which are in turn an array of events.
 * Authors: Joe d'Eon (if you edit this file, add your name TODO)
 *
 * Used by: ProfileController.js, GroupController.js
 *
 *
 *
 */
function Schedule(sched){
  this.schedule = sched;
}

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
  this.addMeeting = function(meeting, dayNum){
    switch(dayNum){
      case 0:
        //inserted sort into day0
        break;
      case 1:
        //code
        break;
      case 2:
        //code
        break;
      case 3:
        //code
        break;
      case 4:
        //code
        break;
      case 5:
        //code
        break;
      case 6:
        //code
        break;
      default:
        //default code

    }
  }

}


