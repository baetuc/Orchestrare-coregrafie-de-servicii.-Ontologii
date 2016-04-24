package ro.calendar.main;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.sql.Timestamp;
import java.util.ArrayList;

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
		
		String str = "{ \"name\": \"Event1\", \"start\": 1461491398032, \"end\": 1461491398032 }";
		String str2 = "{ \"name\": \"Event2\", \"start\": 1461257074000, \"end\": 1461257074000 }";
		String str3 = "{ \"name\": \"Event3\", \"start\": 1453394674000, \"end\": 1453394674000 }";
		
		Event event = new Event(str);
		Event event2 = new Event(str2);
		Event event3 = new Event(str3);
		
		CalendarProvider cp = CalendarProvider.getInstance();
		cp.addEvent(event);
		cp.addEvent(event2);
		cp.addEvent(event3);
		
		ArrayList<Timestamp> eventDays = cp.getEventDays(1461491398032L);
		for (Timestamp t : eventDays) {
			System.out.println(cp.getSpecificEvent(t.getTime()).getJson());
		}
	}

}
