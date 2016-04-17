function ContentHandler(){
	var that = this;
  	var async = require('async');
	var request = require('request')
	var GetInfo = require('./getinfo.js')
	var api = new GetInfo();
	this.sayHello = function(req,res,next){
	 	return res.send("Salut!");
	}
	 /*
1. Cerem locatia modulului locatie
2. Folosind locatia lui, cerem modulului vreme sa afle vremea locatiei respective
*/
	var getWeatherFromLocation = function(callback){
		api.getLocatie(function(locatie){
			api.getVreme(locatie['lat'],locatie['long'],null,function(vreme){
				return callback(vreme);
			});
		});
	}
 /*
1.  Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. Folosind locatia acestuia, cerem modulului vreme sa afle vremea locatiei respective
*/
  var getWeatherFromCalendarLocation = function(data, callback){
    api.getEvents(function(eveniment) {
      api.getVreme(eveniment['locatieGPS']['lat'], eveniment['locatieGPS']['long'], null, function(vreme) {
          return callback(vreme);
      });
    });
  }
 /*
1. Cerem locatia modulului locatie
2. Folosind locatia lui, cerem modulului stiri sa afle stirile din preajma locatiei respective
*/
	var getNewsFromLocation = function(data, callback){
		api.getLocatie(function(locatie){
			api.getStiri(locatie['oras'],function(stiriArray){
				return callback(stiriArray);
			});
		});
	}
 /*
1. Cerem locatia modulului locatie
2. Folosind locatia lui, cerem modulului vreme sa afle vremea locatiei respective
3. Folosind date primite de la modulul locatie si de la modulul vreme, aflam de la
   modulul sanatate, sfaturi referitoare la conditiile meteorologice prezente (daca este cazul)
*/
  var getHealthAdvicesFromLocation = function(callback) {
    api.getLocatie(function(locatie) {
      api.getVreme(locatie['lat'], locatie['long'], null, function(vreme) {
        api.getInfoAboutHealth(locatie['tara'], vreme['temperatura'], function(HealthAdvicesArray) {
          return callback(HealthAdvicesArray);
        });
      });
    });
  }
 /*
1. Cerem locatia modulului locatie
2. Folosind date primite de la modulul locatie aflam de la modulul sanatate,
   sfaturi referitoare la conditiile meteorologice prezente in tara in care
   modulul localizare se afla.
*/
  var getHealthAdvicesFromCountry = function(callback) {
    api.getLocatie(function(locatie) {
      api.getInfoAboutHealth(locatie['tara'], function(HealthAdvicesArray) {
        return callback(HealthAdvicesArray);
      });
    });
  }
 /*
1. Cerem modulului calendar indformatii despre primul eveniment dintr-o zi
2. Folosind locatia evenimentului, cerem modulului vreme sa afle vremea locatiei respective
3. Folosind date primite de la modulul calendar si de la modulul vreme, aflam de la
   modulul sanatate, sfaturi referitoare la conditiile meteorologice prezente (daca este cazul)
*/
  var getHealthAdvicesFromCalendarLocation = function(data, callback) {
    api.getEvent(data, function(locatie) {
      api.getVreme(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], null, function(vreme) {
        api.getInfoAboutHealth(locatie['tara'], vreme['temperatura'], function(WeatherWithHealthAdvicesArray){
          return callback(WeatherWithHealthAdvicesArray);
        });
      });
    });
  }
 /*
1. Cerem modulului calendar indformatii despre primul eveniment dintr-o zi
2. Folosind date primite de la modulul calendar, aflam de la modulul sanatate,
sfaturi referitoare la conditiile meteorologice prezente (daca este cazul)
*/
  var getHealthAdvicesFromCalendarCountry = function(data, callback) {
    api.getEvent(data, function(locatie) {
      api.getInfoAboutHealth(locatie['tara'], function(WeatherWithHealthAdvicesArray){
        return callback(WeatherWithHealthAdvicesArray);
      });
    });
  }
/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere sfaturi de la modulul sanatate
   si informatii despre vreme de la modulul vreme.
*/
  var getHealthAdvicesAndWeatherFromLocation = function (callback) {
    api.getLocatie(function(locatie){
      var vreme;
      var sfaturiSanatate;
      async.parallel([
        api.getVreme(locatie['lat'], locatie['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getInfoAboutHealth(locatie['tara'], function(_sfaturiSanatate){
          sfaturiSanatate = _sfaturiSanatate;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['sanatate'] = sfaturiSanatate;
        return callback(finalResult);
      });
    });
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia din eveniment, vom cere sfaturi de la modulul sanatate
   si informatii despre vreme de la modulul vreme.
*/
  var getHealthAdvicesAndWeatherFromCaldendar = function (data, callback) {
    api.getEvent(data, function(locatie){
      var vreme;
      var sfaturiSanatate;
      async.parallel([
        api.getVreme(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getInfoAboutHealth(locatie['tara'], function(_sfaturiSanatate){
          sfaturiSanatate = _sfaturiSanatate;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['sanatate'] = sfaturiSanatate;
        return callback(finalResult);
      });
    });
  }
/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere stiri de la modulul stiri
   si informatii despre vreme de la modulul vreme.
*/
  var getNewsAndWeatherFromLocation = function (callback) {
    api.getLocatie(function(locatie){
      var vreme;
      var stiri;
      async.parallel([
        api.getVreme(locatie['lat'], locatie['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getStiri(locatie['oras'], function(_stiri){
          stiri = _stiri;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['stiri'] = stiri;
        return callback(finalResult);
      });
    });
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia din eveniment, vom cere stiri de la modulul stiri
   si informatii despre vreme de la modulul vreme.
*/
  var getNewsAndWeatherFromCalendar = function (data, callback) {
    api.getEvent(data, function(locatie){
      var vreme;
      var stiri;
      async.parallel([
        api.getVreme(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getStiri(locatie['oras'], function(_stiri){
          stiri = _stiri;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['stiri'] = stiri;
        return callback(finalResult);
      });
    });
  }
/*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la celelalte module
*/
  var getAllFromLocation = function(callback) {
    api.getLocatie(function(locatie){
      var vreme;
      var stiri;
      var sfaturiSanatate;
      var locuriDeInteres;
      async.parallel ([
        api.getVreme(locatie['lat'], locatie['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getStiri(locatie['oras'], function(_stiri){
          stiri = _stiri;
        }),
        api.getInfoAboutHealth(locatie['tara'], function(_sfaturiSanatate){
          sfaturiSanatate = _sfaturiSanatate;
        }),
        api.getPointsOfInterest(locatie['lat'], locatie['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['stiri'] = stiri;
        finalResult['sanatate'] = sfaturiSanatate;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la celelalte module
*/
  var getAllFromCalendarLocation = function(data, callback) {
    api.getEvent(data, function(locatie){
      var vreme;
      var stiri;
      var sfaturiSanatate;
      var locuriDeInteres;
      async.parallel ([
        api.getVreme(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getStiri(locatie['oras'], function(_stiri){
          stiri = _stiri;
        }),
        api.getInfoAboutHealth(locatie['tara'], function(_sfaturiSanatate){
          sfaturiSanatate = _sfaturiSanatate;
        }),
        api.getPointsOfInterest(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['stiri'] = stiri;
        finalResult['sanatate'] = sfaturiSanatate;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
  /*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Sanatate (Health)
*/
var getPOIAndHealthAdvicesFromLocation = function(callback) {
    api.getLocatie(function(locatie){
      var sfaturiSanatate;
      var locuriDeInteres;
      async.parallel ([
        api.getInfoAboutHealth(locatie['tara'], function(_sfaturiSanatate){
          sfaturiSanatate = _sfaturiSanatate;
        }),
        api.getPointsOfInterest(locatie['lat'], locatie['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['sanatate'] = sfaturiSanatate;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
  /*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Stiri (News)
*/
   var getPOIAndNewsFromLocation = function(callback) {
    api.getLocatie(function(locatie){
      var stiri;
      var locuriDeInteres;
      async.parallel ([
        api.getStiri(locatie['oras'], function(_stiri){
          stiri = _stiri;
        }),
        api.getPointsOfInterest(locatie['lat'], locatie['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['stiri'] = stiri;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
  
  /*
1. Cerem modulului locatie sa ne dea locatia lor
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Vreme (Weather)
*/
   var getPOIAndWeatherFromLocation = function(callback) {
    api.getLocatie(function(locatie){
      var vreme;
      var locuriDeInteres;
      async.parallel ([
        api.getVreme(locatie['lat'], locatie['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getPointsOfInterest(locatie['lat'], locatie['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
 /*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Sanatate (Health)
*/
 var getPOIAndHealthAdvicesFromCalendarLocation = function(data, callback) {
    api.getEvent(data, function(eveniment){
      var sfaturiSanatate;
      var locuriDeInteres;
      async.parallel ([
        api.getInfoAboutHealth(eveniment['tara'], function(_sfaturiSanatate){
          sfaturiSanatate = _sfaturiSanatate;
        }),
        api.getPointsOfInterest(eveniment['locatieGPS']['lat'], eveniment['locatieGPS']['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['sanatate'] = sfaturiSanatate;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
 /*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Stiri (News)
*/ 
   var getPOIAndNewsFromCalendarLocation = function(data, callback) {
    api.getEvent(data, function(eveniment){
      var stiri;
      var locuriDeInteres;
      async.parallel ([
        api.getStiri(eveniment['oras'], function(_stiri){
          stiri = _stiri;
        }),
        api.getPointsOfInterest(eveniment['locatieGPS']['lat'], eveniment['locatieGPS']['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['stiri'] = stiri;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }
 /*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia, vom cere informatii de la modulele : POI (Places Of Interest) si Vreme (Weather)
*/ 
   var getPOIAndWeatherFromCalendarLocation = function(data, callback) {
    api.getEvent(data, function(eveniment){
      var vreme;
      var locuriDeInteres;
      async.parallel ([
        api.getVreme(eveniment['locatieGPS']['lat'], eveniment['locatieGPS']['long'], null, function(_vreme){
          vreme = _vreme;
        }),
        api.getPointsOfInterest(eveniment['locatieGPS']['lat'], eveniment['locatieGPS']['long'], function (_locuriDeInteres){
          locuriDeInteres = _locuriDeInteres;
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['poi'] = locuriDeInteres;
        return callback(finalResult);
      });
    });
  }

  var getNewsBasedOnLocationFromCalendar = function(date, callback) {
    async.waterfall([
      async.apply(api.getEvent,date),
      getInfoFromNews
    ], returnResult);

    function getInfoFromNews(myEvent, callback){
      api.getNews(myEvent['gpsLocation']['city'],myEvent['gpsLocation']['country'],callback);
    }

    function returnResult(error, newsBasedOnLocationFromCalendar) {
        if (error) return callback(error);
        callback(null,{news: newsBasedOnLocationFromCalendar});
    }
  }

  /*
  1. Cerem locatia de la modulul Locatie
  2. Folosim locatia (mai precis, orasul) pentru a afla stirile din acea zona.
  */

  var getNewsBasedOnCurrentLocation = function(callback) {
    async.watterfall([
      api.getLocation,
      getInfoFromNews
    ], returnResult);

    function getInfoFromNews(location, callback){
      api.getNews(location['city'],location['country'],callback);
    }

    function returnResult(error, newsBasedOnCurrentLocation) {
        if (error)
          return callback(error);
        callback(null,{news: newsBasedOnCurrentLocation});
    }

  }

  /*
  1. Cerem locatia de la modulul Calendar
  2. Folosim locatia (mai precis, latitudinea si longitudinea) pentru a afla Places of Interest din acea zona.
  */

  var getPoiBasedOnLocationFromCalendar = function(date,callback) {
    async.waterfall([
      async.apply(api.getEvent,date),
      getInfoFromPoi
    ], returnResult);

    function getInfoFromPoi(myEvent, callback){
      api.getPlacesOfInterest(myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],callback);
    }

    function returnResult(error, poiBasedOnLocationFromCalendar) {
        if (error) return callback(error);
        callback(null,{poi: poiBasedOnLocationFromCalendar});
    }
  }

  /*
  1. Cerem locatia de la modulul Location
  2. Folosim locatia (mai precis, latitudinea si longitudinea) pentru a afla Places of Interest din acea zona.
  */

  var getPoiBasedOnCurrentLocation = function(callback) {
    async.watterfall([
      api.getLocation,
      getInfoFromPoi
    ], returnResult);

    function getInfoFromPoi(location, callback){
      api.getPlacesOfInterest(location['latitude'],location['longitude'],callback);
    }

    function returnResult(error, poiBasedOnCurrentLocation) {
        if (error)
          return callback(error);
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
      async.apply(api.getEvent,date),
      parallelPoiWeatherNews
    ], returnResult);

    function parallelPoiWeatherNews(myEvent,callback){
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude']),
        weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date),
        news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city'])
      },
      function(error, results){
        if(error) return callback(error);
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        if (error) return callback(error);
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
      async.parallel({
        poi: async.apply(api.getPlacesOfInterest,location['latitude'],location['longitude']),
        weather: async.apply(api.getWeather,location['latitude'],location['longitude'], null),
        news: async.apply(api.getNews,location['country'],location['city'])
      },
      function(error, results){
        if(error) return callback(error);
        callback(null, results);
      });
    }

    function returnResult(error, results) {
        if (error) return callback(error);
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
      async.apply(api.getEvent,date),
      parallelHealthWeatherNews
    ], returnResult);

    function parallelHealthWeatherNews(myEvent,callback){
      async.parallel({
        health: async.apply(api.getInfoAboutHealth,myEvent['gpsLocation']['country'], null),
        weather: async.apply(api.getWeather,myEvent['gpsLocation']['latitude'],myEvent['gpsLocation']['longitude'],date),
        news: async.apply(api.getNews,myEvent['gpsLocation']['country'],myEvent['gpsLocation']['city'])
      },
      function(error, results){
        if(error) return callback(error);
        callback(null,results);
      });
    }

    function returnResult(error, results) {
        if (error) return callback(error);
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
        async.parallel({
          health: async.apply(api.getInfoAboutHealth,location['country'],null),
          weather: async.apply(api.getWeather,location['latitude'],location['longitude'],null),
          news: async.apply(api.getNews,location['country'],location['city'])
        },
        function(error, results){
          if(error) return callback(error);
          callback(null,results);
        });
      }

      function returnResult(error, results) {
          if (error) return callback(error);
          callback(null,results);
      }
    }
    
    /* ------------------------------------- New Workflow ---------------------------------------- */

/* Workflow that receives a date as a parameter and returns a list of events
  from calendar which are assigned to the specified date
*/
var getEventsFromDay = function (date, callback) {
  api.getEventsDay(date, function(err, result) {
    if(err) return callback(err);
    callback({events : result});
  });
}

     /* ------------------------------------- New Workflow ---------------------------------------- */
/*
  Workflow that doesn't receive any parameter and return the client's current
  location
*/
var getCurrentLocation = function(callback) {
  api.getLocation(function(err, result) {
    if(err) return callback(err);
    callback({location : result});
  });//return json
}

	/* ------------------------------------- New Workflow ---------------------------------------- */
/*
  Workflow that takes the general news, without any filtering
*/
var getGlobalNews = function(callback) {
  api.getGlobalNews(function(err, result) {
    if(err) return callback(err);
    callback({news : result});
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
      if(err) return callback(err);
      callback(null, result);
    }
  );

  /* Function that returns a JSON representation of news and health advices,
    based on the location received from the output of api.getLocation method,
    and passed as parameter via async.waterfall.
  */
  function parallelHealthAndNews(location, callback) {
    async.parallel(
      {
        health : async.apply(api.getInfoAboutHealth, location.country, null),
        news : async.apply(api.getNews, location.country, location.city) // de modificat la Maza, de pus si tara
      },
      function(err, result) {
        if(err) return callback(err);
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
    async.apply(api.getEvent, date), // returns a JSON representation of the event
    parallelHealthAndNewsFromEvent
    ], // end of async.waterfall functions array
    function(err, result) { // the callback function of async.waterfall
      if(err) return callback(err);
      callback(null, result);
    }
  );

  /* Function that returns a JSON representation of news and health advices,
    based on the location of the event received from the output of
    api.getEvent method, and passed as parameter via async.waterfall.
  */
  function parallelHealthAndNewsFromEvent(myEvent, callback) {
    async.parallel(
      {
        health : async.apply(api.getInfoAboutHealth, myEvent.gpsLocation.country, null),
        news : async.apply(api.getNews, myEvent.gpsLocation.country, myEvent.gpsLocation.city)
      },
      function(err, result) {
        if(err) return callback(err);
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
      if(err) return callback(err);
      callback(null, result);
    }
  );

  /* Function that returns a JSON representation of news, health advices and
    Places of Interest, based on the location received from the output of
    api.getLocation method, and passed as parameter via async.waterfall.
  */
  function parallelHealthNewsAndPOI(location, callback) {
    async.parallel(
      {
        health : async.apply(api.getInfoAboutHealth, location.country, null),
        news : async.apply(api.getNews, location.country, location.city),
        poi : async.apply(api.getPlacesOfInterest, location.latitude, location.longitude)
      },
      function(err, result) {
        if(err) return callback(err);
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
    async.apply(api.getEvent, date), // returns a JSON representation of the event
    parallelHealthNewsAndPOIFromEvent
    ], // end of async.waterfall functions array
    function(err, result) { // the callback function of async.waterfall
      if(err) return callback(err);
      callback(null, result);
    }
  );

  /* Function that returns a JSON representation of News, Health Advices
    based on the location of the event received from the output of
    api.getEvent method, and passed as parameter via async.waterfall.
  */
  function parallelHealthNewsAndPOIFromEvent(myEvent, callback) {
    async.parallel(
      {
        health : async.apply(api.getInfoAboutHealth, myEvent.gpsLocation.country, null),
        news : async.apply(api.getNews, myEvent.gpsLocation.country, myEvent.gpsLocation.city),
        poi : async.apply(api.getPlacesOfInterest, myEvent.gpsLocation.latitude, myEvent.gpsLocation.longitude)
      },
      function(err, result) {
        if(err) return callback(err);
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
      if(err) return callback(err);
      callback(null, result);
    }
  );

  /* Function that returns a JSON representation of news, health advices and
    Places of Interest, based on the location received from the output of
    api.getLocation method, and passed as parameter via async.waterfall.
  */
  function parallelHealthWeatherAndPOI(location, callback) {
    async.parallel(
      {
        health : async.apply(api.getInfoAboutHealth, location.country, null),
        weather : async.apply(api.getWeather, location.latitude, location.longitude, null),
        poi : async.apply(api.getPlacesOfInterest, location.latitude, location.longitude)
      }, // NU AR MERGE DOAR CALLBACK AICI, IN LOC DE CARNAT?
      function(err, result) {
        if(err) return callback(err);
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
    async.apply(api.getEvent, date), // returns a JSON representation of the event
    parallelHealthWeatherAndPOIFromEvent
    ], // end of async.waterfall functions array
    function(err, result) { // the callback function of async.waterfall
      if(err) return callback(err);
      callback(null, result);
    }
  );

  /* Function that returns a JSON representation of Weather, Health Advices and
    Places of Interest, based on the location of the event received from the
    output of api.getEvent method, and passed as parameter via async.waterfall.
  */
  function parallelHealthWeatherAndPOIFromEvent(myEvent, callback) {
    async.parallel(
      {
        health : async.apply(api.getInfoAboutHealth, myEvent.gpsLocation.country, null),
        weather : async.apply(api.getWeather, myEvent.gpsLocation.latitude, myEvent.gpsLocation.longitude, date),
        poi : async.apply(api.getPlacesOfInterest, myEvent.gpsLocation.latitude, myEvent.gpsLocation.longitude)
      },
      function(err, result) {
        if(err) return callback(err);
        callback(null, result);
      }
    ); // end of async.parallel
  }
}


	this.generateWorkflow = function(req, res, next){
		switch(req.query.action){
			case "getWatherFromLocation" : getWatherFromLocation(function(result) {return res.send(result);}); break;
			case "getWatherFromCalendarLocation" : getWatherFromCalendarLocation(req.query.data, function(result) {return res.send(result);}); break;
			case "getNewsFromLocation" : getNewsFromLocation(function(result) {return res.send(result);}); break;
      			case "getHeathAdvicesFromLocation" : getHeathAdvicesFromLocation(function(result) {return res.send(result);}); break;
      			case "getHealthAdvicesFromCountry" : getHealthAdvicesFromCountry(function(result) {return res.send(result);}); break;
  			case "getHealthAdvicesFromCalendarLocation" : getHealthAdvicesFromCalendarLocation(req.query.data, function(result) {return res.send(result);}); break;
      			case "getHealthAdvicesFromCalendarCountry" : getHealthAdvicesFromCalendarCountry(req.query.data, function(result) {return res.send(result);}); break;
      			case "getHealthAdvicesAndWeatherFromLocation" : getHealthAdvicesAndWeatherFromLocation(function(result) {return res.send(result);}); break;
      			case "getHealthAdvicesAndWeatherFromCalendar" : getHealthAdvicesAndWeatherFromCalendar(req.query.data, function(result) {return res.send(result);}); break;
      			case "getNewsAndWeatherFromLocation" : getNewsAndWeatherFromLocation(function(result) {return res.send(result);}); break;
      			case "getNewsAndWeatherFromCalendar" : getNewsAndWeatherFromCalendar(req.query.data, function(result) {return res.send(result);}); break;
            		case "getAllFromLocation" : getAllFromLocation(function(result) {return res.send(result);}); break;
            		case "getAllFromCalendar" : getAllFromCalendar(function(req.query.data, result) {return res.send(result);}); break;
            		case "getPOIAndHealthAdvicesFromLocation" : getPOIAndHealthAdvicesFromLocation(function(result) {return res.send(result);}); break;
            		case "getPOIAndNewsFromLocation" : getPOIAndNewsFromLocation(function(result) {return res.send(result);}); break;
            		case "getPOIAndWeatherFromLocation" : getPOIAndWeatherFromLocation(function(result) {return res.send(result);}); break;
            		case "getPOIAndHealthAdvicesFromCalendarLocation" : getPOIAndHealthAdvicesFromCalendarLocation(req.query.data, function(result) {return res.send(result);}); break;
            		case "getPOIAndNewsFromCalendarLocation" : getPOIAndNewsFromCalendarLocation(req.query.data, function(result) {return res.send(result);}); break;
            		case "getPOIAndWeatherFromCalendarLocation" : getPOIAndWeatherFromCalendarLocation(req.query.data, function(result) {return res.send(result);}); break;
            		case "getNewsBasedOnLocationFromCalendar" : getNewsBasedOnLocationFromCalendar(req.query.date,function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getNewsBasedOnCurrentLocation" : getNewsBasedOnCurrentLocation(function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getPoiBasedOnLocationFromCalendar" : getPoiBasedOnLocationFromCalendar(req.query.date,function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getPoiBasedOnCurrentLocation" : getPoiBasedOnCurrentLocation(function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getPoiWeatherNewsBasedOnLocationFromCalendar" : getPoiWeatherNewsBasedOnLocationFromCalendar(req.query.date,function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getPoiWeatherNewsBasedOnCurrentLocation" : getPoiWeatherNewsBasedOnCurrentLocation(function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getHealthWeatherNewsBasedOnLocationFromCalendar" : getHealthWeatherNewsBasedOnLocationFromCalendar(req.query.date,function(error,result) {if(error) throw error; return res.send(result);}); break;
		        case "getHealthWeatherNewsBasedOnCurrentLocation" : getHealthWeatherNewsBasedOnCurrentLocation(function(error,result) {if(error) throw error; return res.send(result);}); break;
  			case "getEventsFromDay" : getEventsFromDay(req.query.date, function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getCurrentLocation" : getCurrentLocation(function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getGlobalNews" : getGlobalNews(function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getHealthAndNewsBasedOnCurrentLocation" : getHealthAndNewsBasedOnCurrentLocation(function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getHealthAndNewsBasedOnLocationFromCalendar" : getHealthAndNewsBasedOnLocationFromCalendar(req.query.date, function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getHealthNewsAndPOIBasedOnCurrentLocation" : getHealthNewsAndPOIBasedOnCurrentLocation(function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getHealthNewsAndPOIBasedOnLocationFromCalendar" : getHealthNewsAndPOIBasedOnLocationFromCalendar(req.query.date, function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getHealthWeatherAndPOIBasedOnCurrentLocation" : getHealthWeatherAndPOIBasedOnCurrentLocation(function(err, result) {if(err) throw err; return res.send(result);}); break;
			case "getHealthWeatherAndPOIBasedOnLocationFromCalendar" : getHealthWeatherAndPOIBasedOnLocationFromCalendar(req.query.date, function(err, result) {if(err) throw err; return res.send(result);}); break;

		}
	}
}
