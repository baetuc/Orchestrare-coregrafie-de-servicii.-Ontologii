function GetInfo(){
	var request = require('request')

	//############################# WEATHER TEAM ####################################################################

	this.getWeather = function(lat,long,date,callback){
		if(!date){
			date = new Date();
		}
		//request('http://127.0.0.1?action=weather&lat=' + lat + '&long=' + long + '&date=' + date.getTime(), function(err,response,vreme){
			console.log("Weather: Am primit " + lat + " " + long + " "+date);
			callback(null, {temperature: 21, urlImage : "www.sebi.ro", humidity: 100, wind: 1000});
		//});
	}
	// trimit lat si long; primesc intr-un array punctele de interes din locatia cu coordonatele respective (in array am numele si descrierea fiecaruia intr-un string)
	this.getPlacesOfInterest = function (lat, long, callback){
		//request('http://127.0.0.1?action=PointsOfInterest&lat=' + lat + '&long=' + long, function(err, response, PointsOfInterestArray){
			console.log("POI: Am primit " + lat + " " + long);
			callback(null, [{lat:100,long:200,name:"cip",open_now:0,type:"restaurant"}]);//open_now e 0|1
		//});
	}

	//###############################################################################################################



	//########################## NEWS TEAM ##########################################################################

	this.getNews = function(country, city, callback){
		//request('http://127.0.0.1:5555?action=news&city=' + city +'&country=' + country, function(err, response, stiriArray){
			console.log("News: Am primit " + country+" "+city);
			callback(null, [{title: "simple news",intro:"intro",url:"url",date:1461423000}]);
		//});
	}

	/*nu primesc parametru si returnez evenimentele din toata tara*/
	this.getGlobalNews = function(callback){
		//request('http://127.0.0.1:5555', function(newsArray){
			console.log("News: Am primit nimic");
			callback(null, [{title: "global news",intro:"rwer",url:"rewrfwerfrg",date:1461423000}]);
		//});
	}

	/*primesc ca parametru un oras si returnez evenimentele din acel oras*/
	this.getEventsFromTown = function(town, callback){
		request('http://127.0.0.1:5555?action=getEvents&town=' + town, function(eventsArray){
			callback(null, eventsArray);
		});
	} //Deprecated

	//###############################################################################################################




	//################################### CALENDAR TEAM #############################################################
	//Calendar team: 6969
	// primesc o data; trimit informatii despre evenimentul de la acea data (cand incepe , cand se termina , descriere, locatie)
	this.getEvents = function (date,callback){
		//request('http://127.0.0.1:6969?action=getEvents&data=' + date.getTime(), function(err, response, infoAboutEvents){
			console.log("Events: Am primit "+date);
			callback(null, [{start:12345555,end:12344444,startString:"start",endString:"end",description:"desc",gpsLocation:{latitude:12,longitude:133,city:"botosani",country:"romanica"}}]);
		//});
	}

	// primesc o data calendaristica; trimit un array de date ale evenimentelor din ziua respectiva
	this.getEventsDays = function (date,callback){
		//request('http://127.0.0.1:6969?action=getEventsDays&data=' + date.getTime(), function(err, response, eventsDayArray){
			console.log("EventDays: Am primit "+date);
			callback(null, [{date:"date"}]);
		//});
	}

	this.getSpecificEvent = function(date, callback){
		//request('http:/127.0.0.1:6969?action=getSpecificEvent&data=' + date.getTime(), function(err, response, eventDoc){
		console.log("Events: Am primit "+date);
		callback(null, {start:12345555,end:12344444,startString:"start",endString:"end",description:"desc",gpsLocation:{latitude:12,longitude:133,city:"botosani",country:"romanica"}});
		//});
	}

	this.sendToCalendar = function(event,callback){
		//request.post('http://127.0.0.1:6969',event,function(err,response,doc){
		console.log("sendToCalendar: Am primit "+event);
		callback(null, {start:12345555,end:12344444,startString:"start",endString:"end",description:"desc",gpsLocation:{latitude:12,longitude:133,city:"botosani",country:"romanica"}});
		//});
	}
	//###############################################################################################################




	//##################################### LOCATION TEAM ###########################################################
	//Location team : 8081, sau fenrir
	// http://fenrir.info.uaic.ro/~robert.iacob/projects/ip/
	this.getLocation = function(callback){
		console.info("getLocatie called");
		request('http://127.0.0.1:80/location.php',function(err,response,doc){
			if(err) return callback(err);
			console.log("Location: received " + doc);
			callback(null, JSON.parse(doc));
			//callback(null, { "latitude": 47.1881677, "longitude": 27.563845699999998, "altitude": 144.3584136962891, "address": "Strada Locotenent Stoicescu 1-4, Iași 700496, Romania", "city": "Iași", "country": "Romania" });
		});
	}

	/*primesc ca parametru o adresa si returnez un json cu diferite informatii */
	this.getLocationFromAddress = function(address, callback){
		//request('http:127.0.0.1:8081', function(err, response, doc){
		console.info("getLocationFromAddress called "+address);
				callback(null, { "latitude": 47.1881677, "longitude": 27.563845699999998, "altitude": 144.3584136962891, "address": "Strada Locotenent Stoicescu 1-4, Iași 700496, Romania", "city": "Iași", "country": "Romania" });
		//});
	}
	//###############################################################################################################





	//####################################### HEALTH TEAM ###########################################################
	// primesc tara si temperatura; trimit intr-un array sfaturi despre sanatate
	this.getInfoAboutHealth = function(country,temperature,callback){
		//var url = 'http://127.0.0.1?action=sanatate&tara=' + country;
		if(temperature){
			url += '&temperatura=' + temperature
		}
		//request(url, function(err, response, hintsArray){
			console.log("getInfoAboutHealth "+country+" "+temperature);
			callback(null, ["sfat1","sfat2"]);
		//});
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
