app.controller('SaveGroupEventController', function($scope, $modalInstance, modalParams){
	$scope.myEvent = modalParams;

	$scope.saveToPersonal = function(){
		$modalInstance.close({whatToDo: 'saveToPersonal', event: $scope.myEvent});
	}

    $scope.saveToGroup = function(){
        $modalInstance.close({whatToDo: 'saveToGroup', event: $scope.myEvent});
    };

    $scope.deleteEvent = function () {
        $modalInstance.close({whatToDo: 'deleteFromGroup', event: $scope.myEvent});
    };

	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
