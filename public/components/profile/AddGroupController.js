app.controller('AddGroupController', function($scope, $modalInstance){
    $scope.ok = function(){
    	if ($scope.newGroupName != "" && $scope.newGroupName != undefined && $scope.color != undefined && $scope.newGroupCode != "" && $scope.newGroupCode != undefined) {
        	groupInfo = {name:$scope.newGroupName, color: $scope.groupColor, code: $scope.newGroupCode};
        	$modalInstance.close(groupInfo);
        } else {
        	$scope.errLabel = true;

        	setTimeout(function(){
        		$scope.errLabel = false;
        	}, 2000);
        }
    }
    
    
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});