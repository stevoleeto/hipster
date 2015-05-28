app.controller('AddGroupController', function($scope, $modalInstance){
    $scope.ok = function(){
        groupInfo = {groupName:$scope.newGroupName, groupColor: $scope.groupColor};
        $modalInstance.close(groupInfo);
//        console.log("hello");
    }
    
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});