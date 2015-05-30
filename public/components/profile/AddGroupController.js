app.controller('AddGroupController', function($scope, $modalInstance){
    $scope.ok = function(){
        groupInfo = {name:$scope.newGroupName, color: $scope.groupColor, code: $scope.newGroupCode};
        console.log($scope.newGroupCode);
        $modalInstance.close(groupInfo);
//        console.log("hello");
    }
    
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});