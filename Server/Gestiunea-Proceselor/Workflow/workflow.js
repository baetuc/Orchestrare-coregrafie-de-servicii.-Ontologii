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
		api.getLocatie(function(doc){
			api.getVreme(doc['lat'],doc['long'],null,function(vreme){
				return callback(vreme);
			});
		});
	}
 /*
1. Cerem locatia modulului locatie
2. Folosind locatia lui, cerem modulului stiri sa afle stirile din preajma locatiei respective
*/
	var getNewsFromLocation = function(data, callback){
		api.getLocatie(function(doc){
			api.getStiri(doc['oras'],function(stiriArray){
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
    api.getLocatie(function(doc) {
      api.getVreme(doc['locatieGPS']['lat'], doc['locatieGPS']['long'], null, function(doc2) {
        api.getInfoAboutHealth(doc['tara'], doc2['temperatura'], function(HealthAdvicesArray) {
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
    api.getLocatie(function(doc) {
      api.getInfoAboutHealth(doc['tara'], function(HealthAdvicesArray) {
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
    api.getEvent(function(doc) {
      api.getVreme(doc['locatieGPS']['lat'], doc['locatieGPS']['long'], null, function(doc2) {
        api.getInfoAboutHealth(doc['tara'], doc2['temperatura'], function(WeatherWithHealthAdvicesArray){
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
    api.getEvent(function(doc) {
      api.getInfoAboutHealth(doc['tara'], doc2['temperatura'], function(WeatherWithHealthAdvicesArray){
        return callback(WeatherWithHealthAdvicesArray);
      });
    });
  }

	this.generateWorkflow = function(req, res, next){
		switch(req.query.action){
			case "getWatherFromLocation" : getWatherFromLocation(function(result) {
          return res.send(result);
        });
        break;
			case "getNewsFromLocation" : getNewsFromLocation(function(result) {
          return res.send(result);
        });
        break;
      case "getHeathAdvicesFromLocation" : getHeathAdvicesFromLocation(function(result) {
          return res.send(result);
        });
        break;
      case "getHealthAdvicesFromCountry" : getHealthAdvicesFromCountry(function(result) {
          return res.send(result);
        });
        break;
  		case "getHealthAdvicesFromCalendarLocation" : getHealthAdvicesFromCalendarLocation(function(result) {
          return res.send(result);
        });
        break;
      case "getHealthAdvicesFromCalendarCountry" : getHealthAdvicesFromCalendarCountry(function(result) {
          return res.send(result);
        });;
		}
	}
}
