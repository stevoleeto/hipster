app.controller('AddMemberController', function($scope, $modalInstance){

	$scope.save = function(){
		$modalInstance.close($scope.newMemberEmail);
	}

	$scope.close = function(){
		$modalInstance.close();
	}
});