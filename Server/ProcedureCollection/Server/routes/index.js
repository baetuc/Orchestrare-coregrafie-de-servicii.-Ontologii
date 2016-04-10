var ContentHandler = require('./content');
//ErrorHandler = require('./error').errorHandler;
module.exports = exports = function(app){
	var contentHandler = new ContentHandler();
	app.get('/', contentHandler.sayHello); 
}