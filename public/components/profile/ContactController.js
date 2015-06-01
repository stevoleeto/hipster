app.controller('ContactController', function($scope, $modalInstance, modalParams){

	$scope.name = modalParams.name;
	$scope.email = modalParams.email;

	$scope.ok = function() {
		if ($scope.message != "" && $scope.message != undefined) {
			Parse.Cloud.run('mailContactUs', {name: $scope.name, email: $scope.email, message: $scope.message}, {
	            success: function(result) {},
	            error: function(error) {}
	        });

	        $scope.sent = true;

	        setTimeout(function(){
                $scope.sent = false;
            }, 2000);

            $scope.message = "";
		} else {
			$scope.error = true;

	        setTimeout(function(){
                $scope.error = false;
            }, 2000);
		}
	}

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
});