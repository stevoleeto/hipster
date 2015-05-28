app.controller('EditEventController', function($scope, $modalInstance, myEvent){

    $scope.myEvent = myEvent;

    $scope.save = function () {
        var sendObject = {
            state: "save",
            theEvent: $scope.myEvent
        }
        $modalInstance.close(sendObject);
    };

    $scope.deleteEvent = function () {
        var sendObject = {
            state: "delete",
            theEvent: undefined
        }
        $modalInstance.close(sendObject);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };




});
