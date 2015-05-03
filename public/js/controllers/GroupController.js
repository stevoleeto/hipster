/*
 * GroupController.js
 * Description: This controller will be used to control the group view.
 * 
 */

 var currentUser = Parse.User.current();

app.controller('GroupController', ['$scope', function($scope) { 
   // $scope.title = 'This Month\'s Bestsellers'; 
   $scope.companyName = 'HIPSTERinc';
   $scope.userParticipatedGroups = currentUser.get("Groups");
   $scope.numberOfGroups = $scope.userParticipatedGroups.length;

   $scope.addGroup = function(){
    $scope.userParticipatedGroups[$scope.numberOfGroups] = $scope.numberOfGroups;
    $scope.numberOfGroups++;
    currentUser.set("Groups", $scope.userParticipatedGroups);
    currentUser.save(null, {
  		success: function(user) {}
	});
}
  
}]);
