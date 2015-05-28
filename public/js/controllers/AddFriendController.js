app.controller('AddFriendController', function($scope, $modalInstance){

    $scope.ok = function(){
        $modalInstance.close($scope.newFriend);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});
