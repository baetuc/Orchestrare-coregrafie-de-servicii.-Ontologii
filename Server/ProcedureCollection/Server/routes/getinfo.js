function GetInfo(){
	
	var getLocatie = function(lat,long,callback){
		request.get('127.0.0.1:3232?lat=' + locatie.lat + '&long='  + locatie.long,function(strada){
			callback(strada);
		});
	}

	var getVreme = function(streetName,callback){
		request.get('127.0.0.1:3232?streetName=' + streetName,function(vreme){
			callback(vreme);
		});
	}

	var getStiri = function(streetName,callback){
		request.get('127.0.0.1:3232?streetName=' + streetName,function(stiri){
			callback(stiri);
		});
	}
}
module.exports = GetInfo;