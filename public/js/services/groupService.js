app.service('groupService', function(){
  
  var currentGroupId;
  var groupColor;

  var addGroupId = function (newGroupId){
      currentGroupId = newGroupId;
  };

  var getGroupId = function(){
      return currentGroupId;
  };

  var addGroupColor = function(color){
    groupColor = color;
  };

  var getGroupColor = function(){
    return groupColor;
  };

  return {
      addGroupId: addGroupId,
      getGroupId: getGroupId,
      addGroupColor: addGroupColor,
      getGroupColor: getGroupColor
  };

});

