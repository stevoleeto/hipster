/*
 * FileName: EditEventController.js
 * Authors: Stephen Gilardi
 * Date Last Modified: 6/6/2014
 * 
 * Description: This controller passes information from the Edit Event Modal back 
 *              to the Profile Controller. 
 *
 * Attributes:  $scope.myEvent - The currently selected event.
 *
 * Functions:
 *             save()        - Closes the Modal, and returns the new color selected for the group.
 *             deleteEvent() - Closes the Modal, and lets the Profile Controller know that the user 
 *                              chose to delete the event by returning nothing.
 *             cancel()      - Dismisses the model and doesn't do anything.
 * 
 */
app.controller('EditEventController', function($scope, $modalInstance, modalParams){
    $scope.myEvent = modalParams;

    /************************************************************************
    * Name:        save
    *
    * Purpose:     Closes the Edit Event Modal and passes the new modified event back
    *               to the Profile Controller.
    *
    * Returns:     $scope.myEvent: the newly modified event. 
    *
    * Called In:   editMyEvent.html
    ************************************************************************/
    $scope.save = function () {
        $modalInstance.close($scope.myEvent);
    };

    /************************************************************************
    * Name:        deleteEvent
    *
    * Purpose:     Closes the Edit Event Modal and returns nothing signiflying
    *               to the Profile Controller that the user chose to delete the 
    *               event.
    *
    * Called In:   editMyEvent.html
    ************************************************************************/
    $scope.deleteEvent = function () {
        $modalInstance.close();
    };

    /************************************************************************
    * Name:        cancel
    *
    * Purpose:     Dismisses the Edit Group Modal.
    *
    *
    * Called In:   editMyEvent.html
    ************************************************************************/
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
