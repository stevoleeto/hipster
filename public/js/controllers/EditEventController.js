app.controller('EditEventController', function($scope, $modalInstance, myEvent){

    $scope.myEvent = myEvent;

    $scope.save = function () {
        $modalInstance.close(myEvent);
    };

    $scope.deleteEvent = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };




});
