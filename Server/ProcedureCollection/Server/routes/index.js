var ContentHandler = require('./content');
//ErrorHandler = require('./error').errorHandler;
module.exports = exports = function(app){
	var contentHandler = new ContentHandler();
	//app.get('/', contentHandler.sayHello); 
	//app.get('/salut', contentHandler.raspundeLaSalut);
	app.get('/',contentHandler.generateWorkflow)
}

//.../getVremeFromLocatie?lat=23.3232&long=45.3232