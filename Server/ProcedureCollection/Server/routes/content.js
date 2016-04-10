function ContentHandler(){
	var that = this;
	this.sayHello = function(req,res,next){
	 	return res.send("Salut!");
	}
	this.raspundeLaSalut = function(req, res, next){
		var nume = req.query.nume;
		return res.send("Salut domnule/doamna " + nume);
		request.get('127.0.0.1:3232?lat=' + req.query.lat + '&long='  + req.query.long,function(data){
			return res.send(data);
		});
	}
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
	var getVremeFromLocatie = function(long, lat, callback){
		getLocatie(long, lat, function(streetName){
			getVreme(streetName,function(vreme){
				return callback(vreme);
			}
		});
	}

	var getStiriFromLocatie = function(long, lat, callback){
		getLocatie(long, lat, function(streetName){
			getStiri(streetName,function(stiriArray){
				return callback(stiriArray);
			})
		})
	}

	this.generateWorkflow = function(req,res,next){
		switch(req.query.action){
			case "getVremeFromLocatie" : getVremeFromLocatie(req.query.long, req.query.lat, function(result){return res.send(result);}); break;
			case "getStiriFromLocatie" : getStiriFromLocatie(req.query.long, req.query.lat, function(result){return res.send(result);}); break;
		}
	}
	//IP_Nostru?action=getVremeFromLocatie&lat=23.32&long=29.4343
}
module.exports = ContentHandler;