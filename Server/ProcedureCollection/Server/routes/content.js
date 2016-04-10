function ContentHandler(){
	var that = this;
	this.sayHello = function(req,res,next){
	 	return res.send("Salut!");
	}
}
module.exports = ContentHandler;
