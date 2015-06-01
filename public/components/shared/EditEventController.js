app.controller('EditEventController', function($scope, $modalInstance, modalParams){
    $scope.myEvent = modalParams;

    $scope.save = function () {
        $modalInstance.close($scope.myEvent);
    };

    $scope.deleteEvent = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };




});
