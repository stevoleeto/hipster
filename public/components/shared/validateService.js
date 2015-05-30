/*
 * Filename: validateService.js
 * Purpose: To do certain validations for operations in our application.
 *          Example: When adding a member to a group, we need to ensure 
 *                   the member is not already in the list.
 * Description: Contains functions for validating operations.
 *
 */

app.service('validateService',['$q', function($q){

    /*
     * Function: isEmailInArray()
     * Purpose: To check if the passed email is in the passed array.
     * Description: Accepts an array and an email and returns true if
     *              the email is in the array, false if not.
     *
     */
    var isEmailInArray = function(arraySent, emailToCheck){
        var alreadyInGoup = false;
        for (index = 0; index < arraySent.length; index++){
            if(emailToCheck == (arraySent[index]).email){
                alreadyInGoup = true;
            }
        }
        return alreadyInGoup;
    };

    return{
        isEmailInArray: isEmailInArray
    };
}]);
