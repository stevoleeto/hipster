//ProfileController.js

// $scope.friendList = currentUser.get("friendList"); //ADDED BY SARA

  /*ADDED BY SARA*/
 /* userService.friendList($scope.email).then(function() {
    $scope.myFriendList = userService.getFriendList();
  });
  
  $scope.addFriend = function(){
    userService.addFriendEmail($scope.currentFriendEmail);
  }

*/

/*
//index.html
                    <!--ADDED BY SARA-->
                    <div id="membersInfo">
                         <h2>Friends</h2>
                         <div ng-click="addFriend()" class="friend" style="margin-top:10px;">Add New Friend</div>
                         <input type="text" ng-model="newFriendEmail" placeholder="New Friend Email">
                         <br><br>
            	      </div>

//style.cc
/*added by Sara*/
/*.friend
{
    background: red;
    width: 10%;
    height: 20px;
    cursor: pointer;
}

*/
