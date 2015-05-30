app.controller('AddGroupController', function($scope, $modalInstance){
    $scope.ok = function(){
        groupInfo = {name:$scope.newGroupName, color: $scope.groupColor, code: $scope.newGroupCode};
        $modalInstance.close(groupInfo);
    }
    
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});