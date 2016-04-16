function GetInfo(){
	var request = require('request')

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
	
	// primesc tara si temperatura; trimit intr-un array sfaturi despre sanatate
	this.getInfoAboutHealth = function(tara,temperatura,callback){
		request('http://127.0.0.1?action=sanatate&tara=' + tara + '&temperatura=' + temperatura, function(err, response, sfaturiArray){
			callback(sfaturiArray);
		});
	}
	// primesc o data; trimit informatii despre evenimentul de la acea data (cand incepe , cand se termina , descriere, locatie)
	this.getEvent = function (data,callback){
		request('http://127.0.0.1?action=getEvent&data=' + data.getTime(), function(err, response, infoAboutEvent){
			callback(infoAboutEvent);
		});
	}
	// primesc o data calendaristica; trimit un array de date ale evenimentelor din ziua respectiva 
	this.getEventsDay= function (data,callback){
		request('http://127.0.0.1?action=getEventsDay&data=' + data.getTime(), function(err, response, eventsDayArray){
			callback(eventsDayArray);
		});
	}
	// trimit lat si long; primesc intr-un array punctele de interes din locatia cu coordonatele respective (in array am numele si descrierea fiecaruia intr-un string)
	this.getPointsOfInterest = function (lat, long, callback){
		request('http://127.0.0.1?action=PointsOfInterest&lat=' + lat + '&long=' + long, function(err, response, PointsOfInterestArray){
			callback(PointsOfInterestArray);
		});
	}
	this.getLocatie = function(callback){
		console.info("getLocatie called");
		request('http://127.0.0.1:3232',function(err,response,doc){
			console.info("callback with " + doc)
			callback(doc);
		});
	}
	
	/*primesc ca parametru o adresa si returnez un json cu diferite informatii */
	this.getLocationFromAddress = function(address, callback){
		request('http:127.0.0.1:3213', function(err, response, doc){
			callback(doc);
		});
	}
	
	/*primesc ca parametru un oras si returnez evenimentele din acel oras*/
	this.getEventsFromTown = function(town, callback){
		request('http://127.0.0.1?action=events&town=' + town, function(eventsArray){
			callback(eventsArray);
		});
	}

	/*nu primesc parametru si returnez evenimentele din toata tara*/
	this.getGlobalNews = function(callback){
		request('http://127.0.0.1', function(newsArray){
			callback(newsArray);
		});
	}

	/*trimit un request catre adresa ip */
	this.sendToCalendar = function(event,callback){
		console.info("getLocatie called");
		request.post('http://127.0.0.1:3232',event,function(err,response,doc){
			console.info("callback with " + doc)
			callback(doc);
		});
	}
}
module.exports = GetInfo;
