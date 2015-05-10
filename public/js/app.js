var app = angular.module("myApp", ['ui.bootstrap']);

app.service('groupService', function(){
  
  var currentGroupId = '';

  var addGroupId = function (newGroupId){
      currentGroupId = newGroupId;
  };

  var getGroupId = function(){
      return currentGroupId;
  };

  return {
      addGroupId: addGroupId,
      getGroupId: getGroupId
  };
});
