app.controller('ContactController', function($scope, $modalInstance, modalParams){

	// grab the data passed in from modalParams
	$scope.name = modalParams.name;
	$scope.email = modalParams.email;

	// When the user clicks the ok button in the modal
	$scope.ok = function() {
		// Check if the user didn't type anything into the message field
		if ($scope.message != "" && $scope.message != undefined) {
			// Email the dev team ( Joe, Steven, Mikey, Saveen ) the user's feedback
			Parse.Cloud.run('mailContactUs', {name: $scope.name, email: $scope.email, message: $scope.message}, {
	            success: function(result) {},
	            error: function(error) {}
	        });

			// Notify the user that their message was sent
	        $scope.sent = true;

	        setTimeout(function(){
                $scope.sent = false;
            }, 2000);

	        // Reset the message field
            $scope.message = "";
		} else {
			// if the user didn't enter anything, notify user with an error
			$scope.error = true;

	        setTimeout(function(){
                $scope.error = false;
            }, 2000);
		}
	}

	// If the user clicked the cancel button on the modal
	$scope.cancel = function(){
		// Close the modal.
		$modalInstance.dismiss('cancel');
	}
});