function GetInfo(){
	var request = require('request')

	this.getLocatie = function(callback){
		console.info("getLocatie called");
		request('http://127.0.0.1:3232',function(err,response,doc){
			console.info("callback with " + doc)
			callback(doc);
		});
	}

	this.getVreme = function(lat,long,data,callback){
		if(!data){
			data = new Date();
		}
		//?action=vreme&lat=23.323&long=45.232&data=127377232
		request('http://127.0.0.1?action=vreme&lat=' + lat + '&long=' + long + '&data=' + data.getTime(), function(err,response,vreme){
			callback(vreme);
		});
	}

	this.getStiri = function(oras, callback){
		request('http://127.0.0.1?action=stiri&oras=' + oras, function(err, response, stiriArray){
			callback(stiriArray);
		});
	}

	this.getInfoAboutHealth = function(tara,temperatura,callback){
		request('http://127.0.0.1?action=sanatate&tara=' + tara + '&temperatura=' + temperatura, function(err, response, sfaturiArray){
			callback(sfaturiArray);
		});
	}
	
	this.getEvents = function (data,locatie,callback){
		request('http://127.0.0.1?action=getEvents&data=' + data.getTime() + '&locatie=' + locatie, function(err, response, eventsArray){
			callback(eventsArray);
		});
	}
	this.getEventsDays = function (data,callback){
		request('http://127.0.0.1?action=Events&data=' + data.getTime(), function(err, response, eventsDaysArray){
			callback(eventsDaysArray);
		});
	}
	this.getPointsOfInterest = function (lat, long, callback){
		request('http://127.0.0.1?action=PointsOfInterest&lat=' + lat + '&long=' + long, function(err, response, PointsOfInterestArray){
			callback(PointsOfInterestArray);
		});
	}
}
module.exports = GetInfo;