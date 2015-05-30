app.controller('AddMemberController', function($scope, $modalInstance, friendList){

	$scope.friends = friendList;
	
	$scope.save = function(){
		$modalInstance.close($scope.newMemberEmail);
	}

	$scope.cancel = function(){
		$modalInstance.dismiss();
	}
});