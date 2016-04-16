function ContentHandler(){
	var that = this;
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
	var getWatherFromLocation = function(callback){
		api.getLocatie(function(locatie){
			api.getVreme(locatie['lat'],locatie['long'],null,function(vreme){
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
    api.getEvent(function(locatie) {
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
    api.getEvent(function(locatie) {
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
      async.parallel([
        api.getVreme(locatie['lat'], locatie['long'], null, function(vreme){
          callback(vreme);
        }),
        api.getInfoAboutHealth(locatie['tara'], function(sanatate){
          callback(sanatate);
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['sanatate'] = sanatate;
        return callback(finalResult); // inca nu stiu cum facem asta...
      });
    });
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia din eveniment, vom cere sfaturi de la modulul sanatate
   si informatii despre vreme de la modulul vreme.
*/
  var getHealthAdvicesAndWeatherFromCaldendar = function (data, callback) {
    api.getEvent(function(locatie){
      async.parallel([
        api.getVreme(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], null, function(vreme){
          callback(vreme);
        }),
        api.getInfoAboutHealth(locatie['tara'], function(sanatate){
          callback(sanatate);
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['sanatate'] = sanatate;
        return callback(finalResult); // inca nu stiu cum facem asta...
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
      async.parallel([
        api.getVreme(locatie['lat'], locatie['long'], null, function(vreme){
          callback(vreme);
        }),
        api.getStiri(locatie['oras'], function(stiri){
          callback(stiri);
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['stiri'] = stiri;
        return callback(finalResult); // inca nu stiu cum facem asta...
      });
    });
  }
/*
1. Cerem modulului calendar sa ne dea primul eveniment din ziua curenta
2. In paralel, avand locatia din eveniment, vom cere stiri de la modulul stiri
   si informatii despre vreme de la modulul vreme.
*/
  var getNewsAndWeatherFromCalendar = function (data, callback) {
    api.getEvent(function(locatie){
      async.parallel([
        api.getVreme(locatie['locatieGPS']['lat'], locatie['locatieGPS']['long'], null, function(vreme){
          callback(vreme);
        }),
        api.getStiri(locatie['oras'], function(stiri){
          callback(stiri);
        })
      ], function(finalResult){
        finalResult['vreme'] = vreme;
        finalResult['stiri'] = stiri;
        return callback(finalResult); // inca nu stiu cum facem asta...
      });
    });
  }

	this.generateWorkflow = function(req, res, next){
		switch(req.query.action){
			case "getWatherFromLocation" : getWatherFromLocation(function(result) {return res.send(result);}); break;
			case "getNewsFromLocation" : getNewsFromLocation(function(result) {return res.send(result);}); break;
      			case "getHeathAdvicesFromLocation" : getHeathAdvicesFromLocation(function(result) {return res.send(result);}); break;
      			case "getHealthAdvicesFromCountry" : getHealthAdvicesFromCountry(function(result) {return res.send(data, result);}); break;
  			case "getHealthAdvicesFromCalendarLocation" : getHealthAdvicesFromCalendarLocation(function(result) {return res.send(result);}); break;
      			case "getHealthAdvicesFromCalendarCountry" : getHealthAdvicesFromCalendarCountry(function(result) {return res.send(data, result);}); break;
      			case "getHealthAdvicesAndWeatherFromLocation" : getHealthAdvicesAndWeatherFromLocation(function(result) {return res.send(data, result);}); break;
      			case "getHealthAdvicesAndWeatherFromCalendar" : getHealthAdvicesAndWeatherFromCalendar(function(result) {return res.send(data, result);}); break;
      			case "getNewsAndWeatherFromLocation" : getNewsAndWeatherFromLocation(function(result) {return res.send(data, result);}); break;
      			case "getNewsAndWeatherFromCalendar" : getNewsAndWeatherFromCalendar(function(result) {return res.send(data, result);}); break;
		}
	}
}
