package ro.calendar.main;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

import ro.calendar.server.CalendarHttpHandler;

public class Main {
	
	public static final short PORT = 6969;

	public static void main(String[] args) throws IOException {
		HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
		server.createContext("/", new CalendarHttpHandler());
		server.setExecutor(null); // creates a default executor
		server.start();
	}

}
