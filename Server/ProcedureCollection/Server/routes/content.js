function ContentHandler(){
	var that = this;
	var request = require('request')
	var GetInfo = require('./getinfo.js')
	var api = new GetInfo();
	this.sayHello = function(req,res,next){
	 	return res.send("Salut!");
	}

	var getVremeFromLocatie = function(callback){
		api.getLocatie(function(doc){
			api.getVreme(doc['lat'],doc['long'],null,function(vreme){
				return callback(vreme);
			});
		});
	}

	var getStiriFromLocatie = function(callback){
		api.getLocatie(function(doc){
			api.getStiri(doc['oras'],function(stiriArray){
				return callback(stiriArray);
			});
		});
	}

	this.generateWorkflow = function(req, res, next){
		switch(req.query.action){
			case "getVremeFromLocatie" : getVremeFromLocatie(function(result){return res.send(result);}); break;
			case "getStiriFromLocatie" : getStiriFromLocatie(function(result){return res.send(result);}); break;
		}
	}
	//IP_Nostru?action=getVremeFromLocatie&lat=23.32&long=29.4343
}
module.exports = ContentHandler;