app.controller('EditEventController', function($scope, $modalInstance, myEvent){

    $scope.myEvent = myEvent;

    $scope.save = function () {
        $modalInstance.close("save", myEvent);
    };

    $scope.deleteEvent = function () {
        $modalInstance.close("delete", undefined);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };




});
