app.controller('EditGroupController', function($scope, $modalInstance, modalParams){

    $scope.newGroupName = modalParams.name;
    $scope.newGroupColor = modalParams.color;

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
