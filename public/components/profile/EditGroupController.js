/*
 * FileName: EditGroupController.js
 * Authors: Stephen Gilardi
 * Date Last Modified: 6/6/2014
 * 
 * Description: This controller passes information from the edit group modal back 
 *              to the Profile Controller. 
 *
 * Attributes:  $scope.groupName     - The currently selected group's name.
 *              $scope.newGroupColor - The currently selected group's new color.
 *              groupId              - The currently selected group's id number.
 *
 * Functions:
 *             okay()   - Closes the Modal, and returns the new color selected for the group.
 *             cancel() - Dismisses the model and doesn't do anything.
 * 
 */
app.controller('EditGroupController', function($scope, $modalInstance, modalParams){

    $scope.groupName = modalParams.name;
    $scope.newGroupColor = modalParams.color;
    var groupId = modalParams.id;

    /************************************************************************
    * Name:        ok
    *
    * Purpose:     Closes the Edit Group Modal and passes the new Group Color and
    *              Group ID back to the Profile Controller.
    *
    * Returns:     newGroupSettings (object): 
    *                       newColor: The new color selected by the user.
    *                       id:       The currently selected Group's ID.
    *
    * Called In:   editGroup.html
    ************************************************************************/
    $scope.ok = function(){
        console.log("Ok");
        console.log(modalParams);
        var newGroupSettings = {
            newColor: $scope.newGroupColor,
            id: groupId
        };
        $modalInstance.close(newGroupSettings);
    }

    /************************************************************************
    * Name:        cancel
    *
    * Purpose:     Dismisses the Edit Group Modal.
    *
    *
    * Called In:   editGroup.html
    ************************************************************************/
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});