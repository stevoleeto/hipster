app.service('validateService',['$q', function($q){
	var isEmailInArray = function(arraySent, emailToCheck){
		var alreadyInGoup = false;
		for (index = 0; index < arraySent.length; index++){
    		if(emailToCheck == (arraySent[index]).email){
          		alreadyInGoup = true;
    		}
    	}
    	return alreadyInGoup;
    };

    return{
    	isEmailInArray: isEmailInArray
    };
}]);