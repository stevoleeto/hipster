app.controller('EditGroupController', function($scope, $modalInstance, modalParams){

    $scope.newGroupName = modalParams.name;
    $scope.newGroupColor = modalParams.color;
    var groupId = modalParams.id;

    $scope.ok = function(){
        console.log("Ok");
        console.log(modalParams);
        var newGroupSettings = {
            newColor: $scope.newGroupColor,
            id: groupId
        };
        $modalInstance.close(newGroupSettings);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});