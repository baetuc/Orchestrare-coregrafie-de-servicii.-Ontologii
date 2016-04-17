package ro.calendar.server;

import java.io.IOException;
import java.io.OutputStream;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class CalendarHttpHandler implements HttpHandler {

	@Override
	public void handle(HttpExchange h) throws IOException {
		
		// TODO handle GET and POST args using getRequestURI().getQuery():
		// GET ?action=getEventDays
		// GET ?action=getEvents
		// POST /
		
		String response = "Hello world";
		h.sendResponseHeaders(200, response.length());
		OutputStream os = h.getResponseBody();
        os.write(response.getBytes());
        os.close();
	}

}
