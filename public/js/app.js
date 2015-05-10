var app = angular.module("myApp", []);

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

//Intalls angular UI bootstrap
angular.module('myModule', ['ui.bootstrap']);