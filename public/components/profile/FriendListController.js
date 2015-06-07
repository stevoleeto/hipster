/*
 * FileName: addFreindController.js
 * Authors: Saveen Chadalawada, Michael Cho (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the viewing of a user's friendList
 *
 * Attributes: $scope.friendList     - friendList of user pulled from view $scope 
 * Functions:
 *             cancel() - closes modal
 */


app.controller('FriendListController', function($scope, $modalInstance, modalParams){
    
    $scope.friendList = modalParams;
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
