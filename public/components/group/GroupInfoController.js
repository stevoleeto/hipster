/*
 * FileName: GroupInfoController.js
 * Authors:  (if you edit this file, add your name to this list)
 * Description: This controller will be used to control the view of a single
 *              group. It will have all attributes and behaviors of a single
 *              group. To query the database, one must go throught the
 *              dataBaseService.
 *
 * Attributes: name     - The name of the group.
 *             currentGroupID     - unique ID of the group
 *             membersList - a list of members with the group leader in 
 *                           position zero. Each element will be a user email.
 *             groupColor - the color of this group, gotten from service
 * Functions:
 *             addMember() - Adds a member to the current group.
 *             addMemberModal() - Opens a modal to get information from the
 *                                user to add a new member.
 *
 *             
 *
 *          
 * 
 */

app.controller('GroupInfoController', function($scope, $modalInstance){
	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});