/*
 * FileName: validateService.js
 * Authors: Stephen Gilardi
 * Date Last Modified: 6/6/2014
 * 
 * Description: This service will be used to verify certain assertions.
 *
 * Functions:
 *             isEmailInArray() - Determines is a specific user's email is in an array.
 * 
 */
app.service('validateService',['$q', function($q){
    /************************************************************************
    * Name:        isEmailInArray
    *
    * Purpose:     Checks to see if a passed email is in a passed array.
    *
    * Parameters:  eventName:     Name of the new event.
    *              eventColor:    Color of the new event.
    *
    * Returns:     alreadyInGroup: Boolean value, True if Email is in Array.
    *                                             False if Email is not in Array.
    *
    * Called In:   ProfileController.js
    ************************************************************************/
    var isEmailInArray = function(arraySent, emailToCheck){
        var alreadyInGoup = false;
        for (index = 0; index < arraySent.length; index++){
            if(emailToCheck == (arraySent[index]).email){
                //if the email is found in the arry, set the alreadyInGroup flag to true.
                alreadyInGoup = true;
            }
        }
        return alreadyInGoup;
    };

    return{
        isEmailInArray: isEmailInArray
    };
}]);
