app.controller('ContactController', function($scope, $modalInstance, modalParams){

	$scope.name = modalParams.name;
	$scope.email = modalParams.email;

	$scope.fillBody = function() {
		$scope.message = "Good afternoon,\r\n\r\nI was perusing through your site and I just wanted say that it is " + 
						 "absolutely amazing. It is by far the best website of all time to exist on the internet." + 
						 " Props to all the members who contributed to this site.\r\n\r\nThank you for being awesome! :D";
	}

	$scope.ok = function() {
		console.log("send clicked!");
		
        Parse.Cloud.run('mailContactUs', {name: $scope.name, email: $scope.name, message: $scope.message}, {
            success: function(result) {console.log("SUCCESS");console.log(result);},
            error: function(error) {console.log("ERROR");console.log(error);}
        });

        console.log("email sent");
	}

	$scope.cancel = function(){
		$modalInstance.dismiss('cancel');
	}
});