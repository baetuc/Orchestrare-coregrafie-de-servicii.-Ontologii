function GetInfo(){
	var request = require('request')

	//############################# WEATHER TEAM ####################################################################

	this.getWeather = function(lat,long,date,callback){
		if(!date){
			date = new Date();
		}
		request('http://127.0.0.1?action=weather&lat=' + lat + '&long=' + long + '&date=' + date.getTime(), function(err,response,vreme){
			callback(err, vreme);
		});
	}
	// trimit lat si long; primesc intr-un array punctele de interes din locatia cu coordonatele respective (in array am numele si descrierea fiecaruia intr-un string)
	this.getPlacesOfInterest = function (lat, long, callback){
		request('http://127.0.0.1?action=PointsOfInterest&lat=' + lat + '&long=' + long, function(err, response, PointsOfInterestArray){
			callback(err, PointsOfInterestArray);
		});
	}

	//###############################################################################################################



	//########################## NEWS TEAM ##########################################################################

	this.getNews = function(country, city, callback){
		request('http://127.0.0.1:5555?action=news&city=' + city +'&country=' + country, function(err, response, stiriArray){
			callback(err, stiriArray);
		});
	}

	/*nu primesc parametru si returnez evenimentele din toata tara*/
	this.getGlobalNews = function(callback){
		request('http://127.0.0.1:5555', function(newsArray){
			callback(err, newsArray);
		});
	}

	/*primesc ca parametru un oras si returnez evenimentele din acel oras*/
	this.getEventsFromTown = function(town, callback){
		request('http://127.0.0.1:5555?action=getEvents&town=' + town, function(eventsArray){
			callback(err, eventsArray);
		});
	} //Deprecated

	//###############################################################################################################


	

	//################################### CALENDAR TEAM #############################################################
	//Calendar team: 6969
	// primesc o data; trimit informatii despre evenimentul de la acea data (cand incepe , cand se termina , descriere, locatie)
	this.getEvents = function (date,callback){
		request('http://127.0.0.1:6969?action=getEvents&data=' + date.getTime(), function(err, response, infoAboutEvents){
			callback(err, infoAboutEvents);
		});
	}

	// primesc o data calendaristica; trimit un array de date ale evenimentelor din ziua respectiva 
	this.getEventsDays = function (date,callback){
		request('http://127.0.0.1:6969?action=getEventsDays&data=' + date.getTime(), function(err, response, eventsDayArray){
			callback(err, eventsDayArray);
		});
	}

	this.getSpecificEvent = function(date, callback){
		request('http:/127.0.0.1:6969?action=getSpecificEvent&data=' + date.getTime(), function(err, response, eventDoc){
			callback(err,eventDoc);
		});
	}

	this.sendToCalendar = function(event,callback){
		request.post('http://127.0.0.1:6969',event,function(err,response,doc){
			console.info("callback with " + doc)
			callback(err, doc);
		});
	}
	//###############################################################################################################

	


	//##################################### LOCATION TEAM ###########################################################
	//Location team : 8081, sau fenrir 
	// http://fenrir.info.uaic.ro/~robert.iacob/projects/ip/
	this.getLocation = function(callback){
		console.info("getLocatie called");
		request('http://127.0.0.1:8081',function(err,response,doc){
			console.info("callback with " + doc)
			callback(err, doc);
		});
	}
	
	/*primesc ca parametru o adresa si returnez un json cu diferite informatii */
	this.getLocationFromAddress = function(address, callback){
		request('http:127.0.0.1:8081', function(err, response, doc){
			callback(err, doc);
		});
	}
	//###############################################################################################################


	

	
	//####################################### HEALTH TEAM ###########################################################
	// primesc tara si temperatura; trimit intr-un array sfaturi despre sanatate
	this.getInfoAboutHealth = function(country,temperature,callback){
		var url = 'http://127.0.0.1?action=sanatate&tara=' + country;
		if(temperature){
			url += '&temperatura=' + temperature
		}
		request(url, function(err, response, hintsArray){
			callback(err, hintsArray);
		});
	}
	//###############################################################################################################
}
module.exports = GetInfo;
/*
                                                _______
                                          .,add88YYYYY88ba,
                                     .,adPP""'         `"Yba___,aaadYPPba,
                                 .,adP""                .adP""""'     .,Y8b
                              ,adP"'                __  d"'     .,ad8P""Y8I
                           ,adP"'                  d88b I  .,adP""'   ,d8I'
                         ,adP"                     Y8P" ,adP"'    .,adP"'
                        adP"                        "' dP"     ,adP""'
                     ,adP"                             P    ,adP"'
             .,,aaaad8P"                                 ,adP"
        ,add88PP""""'                                  ,dP"
     ,adP""'                                         ,dP"
   ,8P"'                                            d8"
 ,dP'                                              dP'
 `"Yba                                             Y8
   `"Yba                                           `8,
     `"Yba,                                         8I
        `"8b                                        8I
          dP                              __       ,8I
         ,8'                            ,d88b,    ,d8'
         dP                           ,dP'  `Yb, ,d8'
        ,8'                         ,dP"      `"Y8P'
        dP                        ,8P"
       ,8'                      ,dP"   
       dP                     ,dP"     
      ,8'                    ,8P'
      I8                    dP"
      IP                   dP'
      dI                  dP'
     ,8'                 dP'
     dI                 dP'
     8'                ,8'
     8                ,8I
     8                dP'
     8               ,8'
     8,              IP'
     Ib             ,dI
     `8             I8'
      8,            8I
      Yb            I8
      `8,           I8
       Yb           I8
       `Y,          I8
        Ib          I8,
        `Ib         `8I
         `8,         Yb
          I8,        `8,
          `Yb,        `8a
           `Yb         `Yb,
            I8          `Yb,
            dP            `Yb,
           ,8'              `Yb,
           dP                 `Yb,
          d88baaaad88ba,        `8,
             `"""'   `Y8ba,     ,dI
                        `""Y8baadP'
                             `""'
*/