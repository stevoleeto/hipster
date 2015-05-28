app.controller('EditGroupController', function($scope, $modalInstance, oldInfo){

    $scope.newGroupName = oldInfo.name;
    $scope.newGroupColor = oldInfo.color;

    $scope.ok = function(){
        $scope.newGroupSettings = {
            newName: $scope.newGroupName,
            newColor: $scope.newGroupColor
        };
        $modalInstance.close($scope.newGroupSettings);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});