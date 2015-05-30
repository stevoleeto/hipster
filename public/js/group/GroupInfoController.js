app.controller('GroupInfoController', function($scope, $modalInstance){
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});