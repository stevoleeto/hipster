app.service('groupService', function(){
  
  var currentGroupId = '';

  var addGroupId = function (newGroupId){
    console.log("not getting called");
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

