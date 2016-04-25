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
		
		CalendarProvider cp = CalendarProvider.getInstance();
		cp.loadFromFile("C:\\Users\\alexb\\Desktop\\events.json");
		
		ArrayList<Timestamp> eventDays = cp.getEventDays(1461491398032L);
		for (Timestamp t : eventDays) {
			System.out.println(cp.getSpecificEvent(t.getTime()).getJson());
		}
	}

}
