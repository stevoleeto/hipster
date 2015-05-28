app.controller('FriendListController', function($scope, $modalInstance, modalParams){
    
    $scope.friendList = modalParams;
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
