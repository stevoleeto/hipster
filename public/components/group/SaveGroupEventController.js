/*
 * FileName: SaveGroupEventController.js
 * Authors: Joseph Deon
 * Date Last Modified: 6/6/2014
 * 
 * Description: This controller passes information from the Save Group Event modal back 
 *              to the Group Controller. 
 *
 * Functions:
 *             save()   - Closes the Modal, and notifies the Group Contorller that the
 * 						  user wants to save the currently selected event.
 *             cancel() - Dismisses the model and doesn't do anything.
 * 
 */
app.controller('SaveGroupEventController', function($scope, $modalInstance){
    /************************************************************************
    * Name:        save
    *
    * Purpose:     Closes the Save Group Event Modal. Lets the Group Controller
    * 				know that the user chose to save their event.
    *
    * Called In:   GroupController.js
    ************************************************************************/
    $scope.save = function(){
        $modalInstance.close();
    };

    /************************************************************************
    * Name:        cancel
    *
    * Purpose:     Dismisses the Edit Group Modal.
    *
    * Called In:   GroupController.js
    ************************************************************************/
	$scope.cancel = function () {
        $modalInstance.dismiss();
    };
});
