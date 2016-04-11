function GetInfo(){
	var request = require('request')

	this.getLocatie = function(callback){
		console.info("getLocatie called");
		request('http://127.0.0.1:3232',function(err,response,doc){
			console.info("callback with " + doc)
			callback(doc);
		});
	}

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
		request('http://127.0.0.1?action=stiri&oras=' + oras, function(stiriArray){
			callback(stiriArray);
		});
	}
}
module.exports = GetInfo;