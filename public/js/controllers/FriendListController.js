app.controller('FriendListController', function($scope, $modalInstance, friendList){
    
    $scope.friendList = friendList;
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});