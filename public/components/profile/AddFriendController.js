/*
 * FileName: AddFriendController.js
 * Authors: Joe d'Eon (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the adding of a friend to a user's friendlist.
 *
 * Attributes: $scope.newFriend     - grabs users input of newFriend 
 * Functions:
 *             ok() - closes modal and grabs the newFriend email from the input field and returns it to ProfileController.js
 *             cancel() - closes modal
 * 
 */

app.controller('AddFriendController', function($scope, $modalInstance){
    $scope.ok = function(){
        $modalInstance.close($scope.newFriend);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
