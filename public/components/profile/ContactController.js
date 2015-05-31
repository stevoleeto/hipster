app.controller('ContactController', function($scope, $modalInstance, modalParams){

	$scope.name = modalParams.name;
	$scope.email = modalParams.email;

	$scope.fillBody = function() {
		$scope.message = "Good afternoon,\r\n\r\nI was perusing through your beautiful site and I just wanted say that it is " + 
						 "absolutely amazing. It is by far the best website of all time to exist on the internet." + 
						 " Props to all the members who contributed to this site.\r\n\r\nThank you for being awesome! :D";
	}

	$scope.ok = function() {		
        Parse.Cloud.run('mailContactUs', {name: $scope.name, email: $scope.email, message: $scope.message}, {
            success: function(result) {},
            error: function(error) {}
        });
	}

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
});