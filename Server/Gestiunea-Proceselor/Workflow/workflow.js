function ContentHandler(){
	var that = this;
  	var async = require('async');
	var request = require('request')
	var GetInfo = require('./getinfo.js')
	var api = new GetInfo();
	this.sayHello = function(req,res,next){
	 	return res.send("Salut!");
	}
//------------------------------------------------------------------------------------------------------------------------------------
 /*
1. Cerem locatia modulului locatie
2. Folosind locatia lui, cerem modulului vreme sa afle vremea locatiei respective
*/
  var getWeatherFromLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      getInfoWeather
    ], returnResult);

    function getInfoWeather(location, callback){
		        if(location.hasOwnProperty('err')) return callback(null, location);
     api.getWeather(location['latitude'],location['longitude'],null,callback);
    }

    function returnResult(error, weatherFromLocation) {
        callback(null,{weather: weatherFromLocation});
    }

  }
 /*
1.  Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. Folosind locatia acestuia, cerem modulului vreme sa afle vremea locatiei respective
*/
  var getWeatherFromCalendarLocation = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      getInfoWeather
    ], returnResult);

    function getInfoWeather(myEvent, callback){
		         if(myEvent.hasOwnProperty('err')) return callback(null, myEvent);
      api.getWeather(myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],null,callback);
    }

    function returnResult(error, weatherFromCalendarLocation) {
        callback(null,{weather: weatherFromCalendarLocation});
    }
  }
//------------------------------------------------------------------------------------------------------------------------------------
/*
1. Cerem locatia modulului locatie
2. Folosind locatia lui, cerem modulului vreme sa afle vremea locatiei respective
3. Folosind date primite de la modulul locatie si de la modulul vreme, aflam de la
   modulul sanatate, sfaturi referitoare la conditiile meteorologice prezente (daca este cazul)
*/
  var getHealthAdvicesFromLocation = function(callback) {
	 async.waterfall([api.getLocation,
		 getHealthAdvicesInfo
	 ], returnResult);

	 function getWeatherInfo(location, callback) {
		 if (location.hasOwnProperty('err')) {
			 return callback(null, location);
		 }
		 api.getWeather(location['latitude'], location['longitude'], null, callback);
	 }

	 function getHealthAdvicesInfo(location, weather, callback) {
		 if (weather.hasOwnProperty('err')) {
			 return callback(null, weather);
		 }
		 api.getInfoAboutHealth(location['country'], weather['temperature'], callback);
	 }

	 function returnResult(error, healthAdvicesArray) {
		 callback (null, {health: healthAdvicesArray});
	 }
 }
 /*
1. Cerem locatia modulului locatie
2. Folosind date primite de la modulul locatie aflam de la modulul sanatate,
   sfaturi referitoare la conditiile meteorologice prezente in tara in care
   modulul localizare se afla.
*/
  var getHealthAdvicesFromCountry = function(callback) {
	 async.waterfall([api.getLocation,
		 getHealthAdvicesInfo
	 ], returnResult);
	 
	 function getHealthAdvicesInfo(location, callback) {
		 if (location.hasOwnProperty('err')) {
			 return callback(null, location);
		 }
		 api.getInfoAboutHealth(location['country'], null, callback);
	 }

	 function returnResult(error, healthAdvicesArray) {
		 callback (null, {health: healthAdvicesArray});
	 }
 }
 /*
1. Cerem modulului calendar indformatii despre primul eveniment dintr-o zi
2. Folosind locatia evenimentului, cerem modulului vreme sa afle vremea locatiei respective
3. Folosind date primite de la modulul calendar si de la modulul vreme, aflam de la
   modulul sanatate, sfaturi referitoare la conditiile meteorologice prezente (daca este cazul)
*/var getHealthAdvicesFromCalendarLocation = function(date, callback) {
	 async.waterfall([
	     async.apply(api.getSpecificEvent, date),
		 getHealthAdvicesInfo
	 ], returnResult);

	 function getHealthAdvicesInfo(myEvent, callback) {
		 if (myEvent.hasOwnProperty('err')) {
			 return callback(null, myEvent);
		 }
		 async.waterfall([
		   async.apply(api.getWeather, myEvent['gpsLocation']['latitude'], myEvent['gpsLocation']['longitude'], date)
		 ], partialResult);
		 
		 function partialResult(callback) {
			 if (weather.hasOwnProperty('err')) { return callback(null, weather); }
		     api.getInfoAboutHealth(myEvent['gpsLocation']['country'], weather['temperature'], callback);
		 }
	 }

	 function returnResult(error, healthAdvicesArray) {
		 callback(null, healthAdvicesArray);
	 }
 }
 /*
1. Cerem modulului calendar indformatii despre primul eveniment dintr-o zi
2. Folosind date primite de la modulul calendar, aflam de la modulul sanatate,
sfaturi referitoare la conditiile meteorologice prezente (daca este cazul)
*/
 var getHealthAdvicesFromCalendarCountry = function(date, callback) {
	 async.waterfall([async.apply(api.getSpecificEvent, date),
		 getHealthAdvicesInfo
	 ], returnResult);
	 
	 function getHealthAdvicesInfo(location, callback) {
		 if (location.hasOwnProperty('err')) {
			 return callback(null, location);
		 }
		 api.getInfoAboutHealth(location['gpsLocation']['country'], null, callback);
	 }

	 function returnResult(error, healthAdvicesArray) {
		 callback (null, {health: healthAdvicesArray});
	 }
 }
/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere sfaturi de la modulul sanatate
   si informatii despre vreme de la modulul vreme
*/
  var getHealthAdvicesAndWeatherFromLocation = function (callback) {
    async.waterfall([
      api.getLocation,
      parallelHealtAndWeather
    ], returnResult);

    function parallelHealtAndWeather(location,callback){
		if (location.hasOwnProperty('err')) return callback(null, {health:location,weather:location});
      async.parallel({
		health: async.apply(api.getInfoAboutHealth,location['country'],null),        	
		weather: async.apply(api.getWeather,location['latitude'],location['longitude'], null)
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia din eveniment, vom cere sfaturi de la modulul sanatate
   si informatii despre vreme de la modulul vreme.
*/
  
  var getHealthAdvicesAndWeatherFromCalendar = function (date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelHealtAndWeather
    ], returnResult);

    function parallelHealtAndWeather(myEvent,callback){
		if (myEvent.hasOwnProperty('err')) return callback(null, {health:myEvent, weather:myEvent});
      async.parallel({
        health: async.apply(api.getInfoAboutHealth,myEvent['gpsLocation']['country'], null),
		weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date)
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }

/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere stiri de la modulul stiri
   si informatii despre vreme de la modulul vreme.
*/
  var getNewsAndWeatherFromLocation = function (callback) {
    async.waterfall([
      api.getLocation,
      parallelNewsAndWeather
    ], returnResult);

    function parallelNewsAndWeather(location,callback){
		if (location.hasOwnProperty('err')) return callback(null, { weather:location, news:location});
      async.parallel({
        news: async.apply(api.getNews,location['country'],location['city']),
		weather: async.apply(api.getWeather,location['latitude'],location['longitude'], null)
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia din eveniment, vom cere stiri de la modulul stiri
   si informatii despre vreme de la modulul vreme.
*/
var getNewsAndWeatherFromCalendar = function (date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelNewsAndWeather
    ], returnResult);

    function parallelNewsAndWeather(myEvent,callback){
		if (myEvent.hasOwnProperty('err')) return callback(null, { news:myEvent, weather:myEvent});
      async.parallel({
		news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city']),
		weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date)
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la celelalte module
*/
  var getAllFromLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      parallelAll
    ], returnResult);

    function parallelAll(location,callback){
		if (location.hasOwnProperty('err')) return callback(null, {poi:location, weather:location, news:location, health:location});
      async.parallel({
        	poi: async.apply(api.getPlacesOfInterest,location['latitude'],location['longitude']),
        	weather: async.apply(api.getWeather,location['latitude'],location['longitude'], null),
		news: async.apply(api.getNews,location['country'],location['city']),
		health: async.apply(api.getInfoAboutHealth,location['country'],null)
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
  /*
  1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
  2. In paralel, avand locatia, vom cere informatii de la celelalte module
  */
  var getAllFromCalendar = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelAll
    ], returnResult);

    function parallelAll(myEvent,callback){
		if (myEvent.hasOwnProperty('err')) return callback(null, {poi:myEvent, health:myEvent, news:myEvent, weather:myEvent});
      async.parallel({
		poi: async.apply(api.getPlacesOfInterest,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude']),
                health: async.apply(api.getInfoAboutHealth,myEvent['gpsLocation']['country'], null),
		news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city']),
		weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date)
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
  //---------------------------------------------------------------------------------------------------------------------------------
/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Sanatate (Health)
*/
var getPOIAndHealthAdvicesFromLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      parallelPoiHealth
    ], returnResult);

    function parallelPoiHealth(location,callback){
		if (location.hasOwnProperty('err')) return callback(null, {poi:location, health:location});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,location['latitude'],location['longitude']),
        health: async.apply(api.getInfoAboutHealth,location['country'],null)
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
  /*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Stiri (News)
*/
   var getPOIAndNewsFromLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      parallelPoiNews
    ], returnResult);

    function parallelPoiNews(location,callback){
		if (location.hasOwnProperty('err')) return callback(null, {poi:location, news:location});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,location['latitude'],location['longitude']),
        news: async.apply(api.getNews,location['country'],location['city'])
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }

  /*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Vreme (Weather)
*/
    var getPOIAndWeatherFromLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      parallelPoiWeather
    ], returnResult);

    function parallelPoiWeather(location,callback){
		if (location.hasOwnProperty('err')) return callback(null, {poi:location, weather:location});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,location['latitude'],location['longitude']),
        weather: async.apply(api.getWeather,location['latitude'],location['longitude'], null),
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
 /*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Sanatate (Health)
*/
 var getPOIAndHealthAdvicesFromCalendarLocation = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelPoiHealth
    ], returnResult);

    function parallelPoiHealth(myEvent,callback){
		if (myEvent.hasOwnProperty('err')) return callback(null, {poi:myEvent, health:myEvent});
      async.parallel({
		poi: async.apply(api.getPlacesOfInterest,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude']),
        health: async.apply(api.getInfoAboutHealth,myEvent['gpsLocation']['country'], null)
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }

 /*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Stiri (News)
*/
  var getPOIAndNewsFromCalendarLocation = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelPoiNews
    ], returnResult);

    function parallelPoiNews(myEvent,callback){
		if (myEvent.hasOwnProperty('err')) return callback(null, {poi:myEvent,news:myEvent});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude']),
        news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city'])
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }

 /*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Vreme (Weather)
*/
    var getPOIAndWeatherFromCalendarLocation = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelPoiWeather
    ], returnResult);

    function parallelPoiWeather(myEvent,callback){
		if (myEvent.hasOwnProperty('err')) return callback(null, {poi:myEvent, weather:myEvent});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude']),
        weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date)
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }
//---------------------------------------------------------------------------------------------------------------------------------
var getNewsBasedOnLocationFromCalendar = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      getInfoFromNews
    ], returnResult);

    function getInfoFromNews(myEvent, callback) {
			if(myEvent.hasOwnProperty('err')) return callback(null, myEvent);
      api.getNews(myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city'],callback);
    }

    function returnResult(error, newsBasedOnLocationFromCalendar) {
        callback(null,{news: newsBasedOnLocationFromCalendar});
    }
  }

  /*
  1. Cerem locatia de la modulul Locatie
  2. Folosim locatia (mai precis, orasul) pentru a afla stirile din acea zona.
  */

  var getNewsBasedOnCurrentLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      getInfoFromNews
    ], returnResult);

    function getInfoFromNews(location, callback){
			if(location.hasOwnProperty('err')) return callback(null, location);
      api.getNews(location['country'],location['city'],callback);
    }

    function returnResult(error, newsBasedOnCurrentLocation) {
        callback(null,{news: newsBasedOnCurrentLocation});
    }

  }

  /*
  1. Cerem locatia de la modulul Calendar
  2. Folosim locatia (mai precis, latitudinea si longitudinea) pentru a afla Places of Interest din acea zona.
  */

  var getPoiBasedOnLocationFromCalendar = function(date,callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      getInfoFromPoi
    ], returnResult);

    function getInfoFromPoi(myEvent, callback){
			if (myEvent.hasOwnProperty('err')) return callback(null, myEvent);
      api.getPlacesOfInterest(myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],callback);
    }

    function returnResult(error, poiBasedOnLocationFromCalendar) {
        callback(null,{poi: poiBasedOnLocationFromCalendar});
    }
  }

  /*
  1. Cerem locatia de la modulul Location
  2. Folosim locatia (mai precis, latitudinea si longitudinea) pentru a afla Places of Interest din acea zona.
  */

  var getPoiBasedOnCurrentLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      getInfoFromPoi
    ], returnResult);

    function getInfoFromPoi(location, callback){
			if (location.hasOwnProperty('err')) return callback(null, location);
      api.getPlacesOfInterest(location['latitude'],location['longitude'],callback);
    }

    function returnResult(error, poiBasedOnCurrentLocation) {
        callback(null,{poi: poiBasedOnCurrentLocation});
    }
  }


  /*
  1. Cerem locatia de la modulul Calendar
  2. Folosim locatia (mai precis, fie latitudinea si longitudinea, fie orasul) pentru a afla in paralel
    - Places of Interest
    - stiri
    - vremea
   din acea zona.
  */

  var getPoiWeatherNewsBasedOnLocationFromCalendar = function(date,callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelPoiWeatherNews
    ], returnResult);

    function parallelPoiWeatherNews(myEvent,callback){
			if (myEvent.hasOwnProperty('err')) return callback(null, {poi:myEvent, weather:myEvent, news:myEvent});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude']),
        weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date),
        news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city'])
      },
      function(error, results){
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }

  /*
  1. Cerem locatia de la modulul Location
  2. Folosim locatia (mai precis, latitudinea si longitudinea, fie orasul) pentru a afla in paralel
    - Places of Interest
    - stiri
    - vremea
   din acea zona.
  */

  var getPoiWeatherNewsBasedOnCurrentLocation = function(callback) {
    async.waterfall([
      api.getLocation,
      parallelPoiWeatherNews
    ], returnResult);

    function parallelPoiWeatherNews(location,callback){
			if (location.hasOwnProperty('err')) return callback(null, {poi:location, weather:location, news:location});
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,location['latitude'],location['longitude']),
        weather: async.apply(api.getWeather,location['latitude'],location['longitude'], null),
        news: async.apply(api.getNews,location['country'],location['city'])
      },
      function(error, results){
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }

  /*
  1. Cerem locatia de la modulul Calendar
  2. Folosim locatia (mai precis, latitudinea si longitudinea, fie orasul) pentru a afla in paralel
    - sfaturi despre sanatate
    - stiri
    - vremea
   din acea zona.
  */

  var getHealthWeatherNewsBasedOnLocationFromCalendar = function(date, callback) {
    async.waterfall([
      async.apply(api.getSpecificEvent,date),
      parallelHealthWeatherNews
    ], returnResult);

    function parallelHealthWeatherNews(myEvent,callback){
			if (myEvent.hasOwnProperty('err')) return callback(null, {health:myEvent, weather:myEvent, news:myEvent});
      async.parallel({
        health: async.apply(api.getInfoAboutHealth,myEvent['gpsLocation']['country'], null),
        weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date),
        news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city'])
      },
      function(error, results){
				callback(null,results);
      });
    }

    function returnResult(error, results) {
        callback(null,results);
    }
  }


    /*
    1. Cerem locatia de la modulul Location
    2. Folosim locatia (mai precis, latitudinea si longitudinea, fie orasul) pentru a afla in paralel
      - sfaturi despre sanatate
      - stiri
      - vremea
     din acea zona.
    */

    var getHealthWeatherNewsBasedOnCurrentLocation = function(callback) {
      async.waterfall([
        api.getLocation,
        parallelHealthWeatherNews
      ], returnResult);

      function parallelHealthWeatherNews(location,callback){
				if (location.hasOwnProperty('err')) return callback(null, {health:location, weather:location, news:location});
        async.parallel({
          health: async.apply(api.getInfoAboutHealth,location['country'],null),
          weather: async.apply(api.getWeather,location['latitude'],location['longitude'],null),
          news: async.apply(api.getNews,location['country'],location['city'])
        },
        function(error, results){
          callback(null,results);
        });
      }

      function returnResult(error, results) {
          callback(null,results);
      }
    }

	/* ------------------------------------- New Workflow ---------------------------------------- */

	/* Workflow that receives a date as a parameter and returns a list of events
	from calendar which are assigned to the specified date
	*/
	var getEventsFromDay = function (date, callback) {
		api.getEvents(date, function(err, result) {
			callback(null, {events : result});
		});
	}

	/* ------------------------------------- New Workflow ---------------------------------------- */
	/*
	Workflow that doesn't receive any parameter and return the client's current
	location
	*/
	var getCurrentLocation = function(callback) {
		api.getLocation(function(err, result) {
			callback(null, {location : result});
		});
	}

	var getMonthEvents = function(date, callback) {
		api.getEventsDays(date, function(err, result) {
			callback(null, {events : result});
		});
	}

	/* ------------------------------------- New Workflow ---------------------------------------- */
	/*
	Workflow that sends the general news, without any filtering
	*/
	var getGlobalNews = function(callback) {
		api.getGlobalNews(function(err, result) {
			callback(null, {news : result});
		});//return json
	}

	/* ------------------------------------- New Workflow ---------------------------------------- */
	/*
	Workflow that returns to the client a JSON representation of the news and
	health advices, based on the client's current location
	*/
	var getHealthAndNewsBasedOnCurrentLocation = function(callback) {
		async.waterfall([
			api.getLocation,
			parallelHealthAndNews
		], // end of async.waterfall functions array
		function(err, result) { // the callback function of async.waterfall
			callback(null, result);
		}
	);

	/* Function that returns a JSON representation of news and health advices,
	based on the location received from the output of api.getLocation method,
	and passed as parameter via async.waterfall.
	*/
	function parallelHealthAndNews(location, callback) {
		if (location.hasOwnProperty('err')) return callback(null, {health:location, news:location});
		async.parallel(
			{
				health : async.apply(api.getInfoAboutHealth, location.country, null),
				news : async.apply(api.getNews, location.country, location.city) // de modificat la Maza, de pus si tara
			},
			function(err, result) {
				callback(null, result);
			}
		); // end of async.parallel
	}
}

/* ------------------------------------- New Workflow ---------------------------------------- */
/*
Workflow that returns to the client a JSON representation of the news and
health advices, based on the location of the calendar event given by user as
query parameter
*/
var getHealthAndNewsBasedOnLocationFromCalendar = function(date, callback) {
	async.waterfall([
		async.apply(api.getSpecificEvent, date), // returns a JSON representation of the event
		parallelHealthAndNewsFromEvent
	], // end of async.waterfall functions array
	function(err, result) { // the callback function of async.waterfall
		callback(null, result);
	}
);

/* Function that returns a JSON representation of news and health advices,
based on the location of the event received from the output of
api.getEvent method, and passed as parameter via async.waterfall.
*/
function parallelHealthAndNewsFromEvent(myEvent, callback) {
	if (myEvent.hasOwnProperty('err')) return callback(null, {health:myEvent, news:myEvent});
	async.parallel(
		{
			health : async.apply(api.getInfoAboutHealth, myEvent.gpsLocation.country, null),
			news : async.apply(api.getNews, myEvent.gpsLocation.country, myEvent.gpsLocation.city)
		},
		function(err, result) {
			callback(null, result);
		}
	); // end of async.parallel
}
}

/* ------------------------------------- New Workflow ---------------------------------------- */
/*
Workflow that returns to the Client a JSON representation of the News,
Health Advices and Places of Interest based on the client's current location
*/
var getHealthNewsAndPOIBasedOnCurrentLocation = function(callback) {
	async.waterfall([
		api.getLocation,
		parallelHealthNewsAndPOI
	], // end of async.waterfall functions array
	function(err, result) { // the callback function of async.waterfall
		callback(null, result);
	}
);

/* Function that returns a JSON representation of news, health advices and
Places of Interest, based on the location received from the output of
api.getLocation method, and passed as parameter via async.waterfall.
*/
function parallelHealthNewsAndPOI(location, callback) {
	if (location.hasOwnProperty('err')) return callback(null, {health:location, news:location, poi:location});
	async.parallel(
		{
			health : async.apply(api.getInfoAboutHealth, location.country, null),
			news : async.apply(api.getNews, location.country, location.city),
			poi : async.apply(api.getPlacesOfInterest, location.latitude, location.longitude)
		},
		function(err, result) {
			callback(null, result);
		}
	); // end of async.parallel
}
}

/* ------------------------------------- New Workflow ---------------------------------------- */
/*
Workflow that returns to the client a JSON representation of the News,
Health Advices and Places of Interest, based on the location of the calendar
event given by user as query parameter.
*/
var getHealthNewsAndPOIBasedOnLocationFromCalendar = function(date, callback) {
	async.waterfall([
		async.apply(api.getSpecificEvent, date), // returns a JSON representation of the event
		parallelHealthNewsAndPOIFromEvent
	], // end of async.waterfall functions array
	function(err, result) { // the callback function of async.waterfall
		callback(null, result);
	}
);

/* Function that returns a JSON representation of News, Health Advices
based on the location of the event received from the output of
api.getEvent method, and passed as parameter via async.waterfall.
*/
function parallelHealthNewsAndPOIFromEvent(myEvent, callback) {
	if (myEvent.hasOwnProperty('err')) return callback(null, {health:myEvent, news:myEvent, poi:myEvent});
	async.parallel(
		{
			health : async.apply(api.getInfoAboutHealth, myEvent.gpsLocation.country, null),
			news : async.apply(api.getNews, myEvent.gpsLocation.country, myEvent.gpsLocation.city),
			poi : async.apply(api.getPlacesOfInterest, myEvent.gpsLocation.latitude, myEvent.gpsLocation.longitude)
		},
		function(err, result) {
			callback(null, result);
		}
	); // end of async.parallel
}
}

/* ------------------------------------- New Workflow ---------------------------------------- */
/*
Workflow that returns to the Client a JSON representation of the Weather,
Health Advices and Places of Interest based on the client's current location
*/
var getHealthWeatherAndPOIBasedOnCurrentLocation = function(callback) {
	async.waterfall([
		api.getLocation,
		parallelHealthWeatherAndPOI
	], // end of async.waterfall functions array
	function(err, result) { // the callback function of async.waterfall
		callback(null, result);
	}
);

/* Function that returns a JSON representation of news, health advices and
Places of Interest, based on the location received from the output of
api.getLocation method, and passed as parameter via async.waterfall.
*/
function parallelHealthWeatherAndPOI(location, callback) {
	if (location.hasOwnProperty('err')) return callback(null, {health:location, weather:location, poi:location});
	async.parallel(
		{
			health : async.apply(api.getInfoAboutHealth, location.country, null),
			weather : async.apply(api.getWeather, location.latitude, location.longitude, null),
			poi : async.apply(api.getPlacesOfInterest, location.latitude, location.longitude)
		}, // NU AR MERGE DOAR CALLBACK AICI, IN LOC DE CARNAT?
		function(err, result) {
			callback(null, result);
		}
	); // end of async.parallel
}
}

/* ------------------------------------- New Workflow ---------------------------------------- */
/*
Workflow that returns to the client a JSON representation of the Weather,
Health Advices and Places of Interest, based on the location of the calendar
event given by user as query parameter.
*/
var getHealthWeatherAndPOIBasedOnLocationFromCalendar = function(date, callback) {
	async.waterfall([
		async.apply(api.getSpecificEvent, date), // returns a JSON representation of the event
		parallelHealthWeatherAndPOIFromEvent
	], // end of async.waterfall functions array
	function(err, result) { // the callback function of async.waterfall
		callback(null, result);
	}
);

/* Function that returns a JSON representation of Weather, Health Advices and
Places of Interest, based on the location of the event received from the
output of api.getEvent method, and passed as parameter via async.waterfall.
*/
function parallelHealthWeatherAndPOIFromEvent(myEvent, callback) {
	if (myEvent.hasOwnProperty('err')) return callback(null, {health:myEvent, weather:myEvent, poi:myEvent});
	async.parallel(
		{
			health : async.apply(api.getInfoAboutHealth, myEvent.gpsLocation.country, null),
			weather : async.apply(api.getWeather, myEvent.gpsLocation.latitude, myEvent.gpsLocation.longitude, date),
			poi : async.apply(api.getPlacesOfInterest, myEvent.gpsLocation.latitude, myEvent.gpsLocation.longitude)
		},
		function(err, result) {
			callback(null, result);
		}
	); // end of async.parallel
}
}

this.generateWorkflow = function(req, res, next){

	function finalCallback(err, result) {
		 return res.send(result);
	}
	 
	switch(req.query.action){
		case "getWeatherFromLocation" : getWeatherFromLocation(finalCallback); break;
		case "getWeatherFromCalendarLocation" : getWeatherFromCalendarLocation(req.query.date, finalCallback); break;
		case "getHeathAdvicesFromLocation" : getHeathAdvicesFromLocation(finalCallback); break;
		case "getHealthAdvicesFromCountry" : getHealthAdvicesFromCountry(finalCallback); break;
		case "getHealthAdvicesFromCalendarLocation" : getHealthAdvicesFromCalendarLocation(req.query.date, finalCallback); break;
		case "getHealthAdvicesFromCalendarCountry" : getHealthAdvicesFromCalendarCountry(req.query.date, finalCallback); break;
		case "getHealthAdvicesAndWeatherFromLocation" : getHealthAdvicesAndWeatherFromLocation(finalCallback); break;
		case "getHealthAdvicesAndWeatherFromCalendar" : getHealthAdvicesAndWeatherFromCalendar(req.query.date, finalCallback); break;
		case "getNewsAndWeatherFromLocation" : getNewsAndWeatherFromLocation(finalCallback); break;
		case "getNewsAndWeatherFromCalendar" : getNewsAndWeatherFromCalendar(req.query.date, finalCallback); break;
		case "getAllFromLocation" : getAllFromLocation(finalCallback); break;
		case "getAllFromCalendar" : getAllFromCalendar(req.query.date, finalCallback); break;
		case "getPOIAndHealthAdvicesFromLocation" : getPOIAndHealthAdvicesFromLocation(finalCallback); break;
		case "getPOIAndNewsFromLocation" : getPOIAndNewsFromLocation(finalCallback); break;
		case "getPOIAndWeatherFromLocation" : getPOIAndWeatherFromLocation(finalCallback); break;
		case "getPOIAndHealthAdvicesFromCalendarLocation" : getPOIAndHealthAdvicesFromCalendarLocation(req.query.date, finalCallback); break;
		case "getPOIAndNewsFromCalendarLocation" : getPOIAndNewsFromCalendarLocation(req.query.date, finalCallback); break;
		case "getPOIAndWeatherFromCalendarLocation" : getPOIAndWeatherFromCalendarLocation(req.query.date, finalCallback); break;
		case "getNewsBasedOnLocationFromCalendar" : getNewsBasedOnLocationFromCalendar(req.query.date,finalCallback); break;
		case "getNewsBasedOnCurrentLocation" : getNewsBasedOnCurrentLocation(finalCallback); break;
		case "getPoiBasedOnLocationFromCalendar" : getPoiBasedOnLocationFromCalendar(req.query.date,finalCallback); break;
		case "getPoiBasedOnCurrentLocation" : getPoiBasedOnCurrentLocation(finalCallback); break;
		case "getPoiWeatherNewsBasedOnLocationFromCalendar" : getPoiWeatherNewsBasedOnLocationFromCalendar(req.query.date,finalCallback); break;
		case "getPoiWeatherNewsBasedOnCurrentLocation" : getPoiWeatherNewsBasedOnCurrentLocation(finalCallback); break;
		case "getHealthWeatherNewsBasedOnLocationFromCalendar" : getHealthWeatherNewsBasedOnLocationFromCalendar(req.query.date,finalCallback); break;
		case "getHealthWeatherNewsBasedOnCurrentLocation" : getHealthWeatherNewsBasedOnCurrentLocation(finalCallback); break;
		case "getEventsFromDay" : getEventsFromDay(req.query.date, finalCallback); break;
		case "getCurrentLocation" : getCurrentLocation(finalCallback); break;
		case "getGlobalNews" : getGlobalNews(finalCallback); break;
		case "getHealthAndNewsBasedOnCurrentLocation" : getHealthAndNewsBasedOnCurrentLocation(finalCallback); break;
		case "getHealthAndNewsBasedOnLocationFromCalendar" : getHealthAndNewsBasedOnLocationFromCalendar(req.query.date, finalCallback); break;
		case "getHealthNewsAndPOIBasedOnCurrentLocation" : getHealthNewsAndPOIBasedOnCurrentLocation(finalCallback); break;
		case "getHealthNewsAndPOIBasedOnLocationFromCalendar" : getHealthNewsAndPOIBasedOnLocationFromCalendar(req.query.date, finalCallback); break;
		case "getHealthWeatherAndPOIBasedOnCurrentLocation" : getHealthWeatherAndPOIBasedOnCurrentLocation(finalCallback); break;
		case "getHealthWeatherAndPOIBasedOnLocationFromCalendar" : getHealthWeatherAndPOIBasedOnLocationFromCalendar(req.query.date, finalCallback); break;
	}
}
}
module.exports = ContentHandler;
