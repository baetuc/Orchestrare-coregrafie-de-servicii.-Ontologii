package ro.calendar.main;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

import ro.calendar.json.JSONObject;
import ro.calendar.provider.CalendarProvider;
import ro.calendar.provider.Event;
import ro.calendar.server.CalendarHttpHandler;

public class Main {
	
	public static final short PORT = 6969;

	public static void main(String[] args) throws IOException {
		HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
		server.createContext("/", new CalendarHttpHandler());
		server.setExecutor(null); // creates a default executor
		server.start();
		
		String str = "{ \"start\": 1461491398032, \"end\": 1461491398032 }";
		Event event = new Event(str);
		
		CalendarProvider cp = CalendarProvider.getInstance();
		cp.addEvent(event);
		
		//long startTime = 1461491398032L;
		Event e = cp.getSpecificEvent(1461491398032L);
		System.out.println(e.getJson());
		
		System.out.println(cp.getEventDays(1461491398032L));
		System.out.println(cp.getEvents(1461491398032L).size());
	}

}
