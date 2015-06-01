app.controller('ContactController', function($scope, $modalInstance, modalParams){

	$scope.name = modalParams.name;
	$scope.email = modalParams.email;

	$scope.ok = function() {
		if ($scope.message == "") {

		}	
		
        Parse.Cloud.run('mailContactUs', {name: $scope.name, email: $scope.email, message: $scope.message}, {
            success: function(result) {},
            error: function(error) {}
        });

        $modalInstance.dismiss('cancel');
	}

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
});