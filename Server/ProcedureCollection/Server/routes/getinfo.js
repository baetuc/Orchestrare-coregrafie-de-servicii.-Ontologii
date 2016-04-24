function GetInfo(){
	var request = require('request');
	var weatherURL = 'http://127.0.0.1';
	var newsURL = 'http://127.0.0.1:5555';
	var calendarURL = 'http://127.0.0.1:6969';
	var locationURL = 'http://127.0.0.1:8081';
	var healthURL = 'http://127.0.0.1'
	//############################# WEATHER TEAM ####################################################################

	this.getWeather = function(lat,long,date,callback){
		if(!date){
			date = new Date();
		}
		request(weatherURL + '?action=weather&lat=' + lat + '&long=' + long + '&date=' + date.getTime(), function(err,response,vreme){
			if(err){
				return callback(null,{'err' : 'Weather unavailable'});
			} else {
				if (typeof vreme === 'string' || vreme instanceof String){
					vreme = JSON.parse(vreme);
				}
				return callback(null, vreme);
			}
		});
	}
	// trimit lat si long; primesc intr-un array punctele de interes din locatia cu coordonatele respective (in array am numele si descrierea fiecaruia intr-un string)
	this.getPlacesOfInterest = function (lat, long, callback){
		request(weatherURL + '?action=PointsOfInterest&lat=' + lat + '&long=' + long, function(err, response, PointsOfInterestArray){
			if(err){
				return callback(null,{'err' : 'Places of interest unavailable'});
			}
			else {
				if (typeof PointsOfInterestArray === 'string' || PointsOfInterestArray instanceof String){
					PointsOfInterestArray = JSON.parse(PointsOfInterestArray);
				}
				return callback(null, PointsOfInterestArray);
			}
		});
	}

	//###############################################################################################################



	//########################## NEWS TEAM ##########################################################################

	this.getNews = function(country, city, callback){
		request(newsURL + '?action=news&city=' + city +'&country=' + country, function(err, response, newsArray){
			if(err){
				return callback(null,{'err' : 'News unavailable'});
			} else {
				if (typeof newsArray === 'string' || newsArray instanceof String){
					newsArray = JSON.parse(newsArray);
				}
				return callback(null, newsArray);
			}
		});
	}

	/*nu primesc parametru si returnez evenimentele din toata tara*/
	this.getGlobalNews = function(callback){
		request(newsURL, function(err, response, newsArray){
			if(err){
				return callback(null,{'err' : 'Global news unavailable'});
			}
			else {
				if (typeof newsArray === 'string' || newsArray instanceof String){
					newsArray = JSON.parse(newsArray);
				}
				return callback(null, newsArray);
			}
		});
	}

	/*primesc ca parametru un oras si returnez evenimentele din acel oras*/
	this.getEventsFromTown = function(town, callback){
		request(newsURL + '?action=getEvents&town=' + town, function(err, response, eventsArray){
			if(err){
				return callback(null,{'err' : 'Town events unavailable'});
			}
			else {
				if (typeof eventsArray === 'string' || eventsArray instanceof String){
					eventsArray = JSON.parse(eventsArray);
				}
				return callback(null, eventsArray);
			}
		});
	} //Deprecated

	//###############################################################################################################


	

	//################################### CALENDAR TEAM #############################################################
	//Calendar team: 6969
	// primesc o data; trimit informatii despre evenimentul de la acea data (cand incepe , cand se termina , descriere, locatie)
	this.getEvents = function (date,callback){
		request(calendarURL + '?action=getEvents&data=' + date.getTime(), function(err, response, infoAboutEvents){
			if(err){
				return callback(null,{'err' : 'Events info unavailable'});
			}
			else {
				if (typeof infoAboutEvents === 'string' || infoAboutEvents instanceof String){
					infoAboutEvents = JSON.parse(infoAboutEvents);
				}
				return callback(null, infoAboutEvents);
			}
		});
	}

	// primesc o data calendaristica; trimit un array de date ale evenimentelor din ziua respectiva 
	this.getEventsDays = function (date,callback){
		request(calendarURL + '?action=getEventsDays&data=' + date.getTime(), function(err, response, eventsDayArray){
			if(err){
				return callback(null,{'err' : 'Events days unavailable'});
			}
			else {
				if (typeof eventsDayArray === 'string' || eventsDayArray instanceof String){
					eventsDayArray = JSON.parse(eventsDayArray);
				}
				return callback(null, eventsDayArray);
			}
		});
	}

	this.getSpecificEvent = function(date, callback){
		request(calendarURL + '?action=getSpecificEvent&data=' + date.getTime(), function(err, response, eventDoc){
			if(err){
				return callback(null,{'err' : 'Specific event unavailable'});
			}
			else {
				if (typeof eventDoc === 'string' || eventDoc instanceof String){
					eventDoc = JSON.parse(eventDoc);
				}
				return callback(null, eventDoc);
			}
		});
	}

	this.sendToCalendar = function(event,callback){
		request.post(calendarURL,event,function(err,response,doc){
			if(err){
				return callback(null,{'err' : 'Send to calendar unavailable'});
			}
			else {
				if (typeof doc === 'string' || doc instanceof String){
					doc = JSON.parse(doc);
				}
				return callback(null, doc);
			}
		});
	}
	//###############################################################################################################

	


	//##################################### LOCATION TEAM ###########################################################
	//Location team : 8081, sau fenrir 
	// http://fenrir.info.uaic.ro/~robert.iacob/projects/ip/
	this.getLocation = function(callback){
		console.info("getLocatie called");
		request(locationURL,function(err,response,doc){
			if(err){
				return callback(null,{'err' : 'Location unavailable'});
			}
			else {
				if (typeof doc === 'string' || doc instanceof String){
					doc = JSON.parse(doc);
				}
				return callback(null, doc);
			}
		});
	}
	
	/*primesc ca parametru o adresa si returnez un json cu diferite informatii */
	this.getLocationFromAddress = function(address, callback){
		request(locationURL + '&address=' + address, function(err, response, doc){
			if(err){
				return callback(null,{'err' : 'Location from address unavailable'});
			}
			else {
				if (typeof doc === 'string' || doc instanceof String){
					doc = JSON.parse(doc);
				}
				return callback(null, doc);
			}
		});
	}
	//###############################################################################################################


	

	
	//####################################### HEALTH TEAM ###########################################################
	// primesc tara si temperatura; trimit intr-un array sfaturi despre sanatate
	this.getInfoAboutHealth = function(country,temperature,callback){
		var url = healthURL +'?action=sanatate&tara=' + country;
		if(temperature){
			url += '&temperatura=' + temperature
		}
		request(url, function(err, response, hintsArray){
			if(err){
				return callback(null,{'err' : 'Health info unavailable'});
			}
			else {
				if (typeof hintsArray === 'string' || hintsArray instanceof String){
					hintsArray = JSON.parse(hintsArray);
				}
				return callback(null, hintsArray);
			}
		});
	}
	//###############################################################################################################
}
module.exports = GetInfo;
