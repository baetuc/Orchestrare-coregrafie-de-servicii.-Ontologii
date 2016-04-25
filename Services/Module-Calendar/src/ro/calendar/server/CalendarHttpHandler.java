package ro.calendar.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.net.URLDecoder;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import ro.calendar.json.JSONArray;
import ro.calendar.json.JSONException;
import ro.calendar.json.JSONObject;
import ro.calendar.provider.CalendarProvider;
import ro.calendar.provider.Event;

public class CalendarHttpHandler implements HttpHandler {

	//Function to convert URI data to JSONString
	private String queryToJSON(String query){
	    String result = new String();
	    result += "{ ";
	    for (String param : query.split("&")) {
	        String pair[] = param.split("=");
	        if (pair.length>1) {
	            result+= "\""+pair[0]+"\""+" : " +"\""+ pair[1]+"\"";
	        }
	        result+=", ";
	    }
	    
	    if(result.endsWith(", "))
	    {
	    	result = result.substring(0,result.length() - 2);
	    }
	    return result+" }";
	}
	
	
	@Override
	public void handle(HttpExchange h) throws IOException {
		
		//String to be sent back
		String response = null;
		//Local response json
		JSONArray responseJSON = new JSONArray();
		
		
		
		/**
		 * Handle get requests 
		 */
		if ("get".equalsIgnoreCase(h.getRequestMethod())){
			String str=h.getRequestURI().getQuery();
			str=queryToJSON(str);
			JSONObject requestObject= new JSONObject(str);
			String action = null;
			String data = null;

			//Validating arguments
			try{
				action = requestObject.getString("action");
				data = requestObject.getString("data");
			}catch(JSONException  e) {
					System.out.println("Failed to validate get arguments");
					System.out.println(e.getMessage());
					responseJSON.put("Parse error");
					response = responseJSON.toString();
					h.sendResponseHeaders(200, response.length());
					OutputStream os = h.getResponseBody();
					os.write(response.getBytes());
					os.close();	
			}

			//Validating arguments' values
			//TODO De modificat formatul
			DateFormat format = new SimpleDateFormat("MMMM d, yyyy");
			Date eventDate = null;
			try {
				eventDate = format.parse(data);
			} catch (ParseException e) {
				System.out.println("Error parsing date argument");
				System.out.println(e.getMessage());
				responseJSON.put("Parse error");
				response = responseJSON.toString();
				h.sendResponseHeaders(200, response.length());
				OutputStream os = h.getResponseBody();
				os.write(response.getBytes());
				os.close();	
			}
			
			//getEvents received
			if("getEvents".equalsIgnoreCase(action)){
				CalendarProvider c=CalendarProvider.getInstance();
				long time = eventDate.getTime();
				ArrayList<Event> returnData = c.getEvents(time);
				
				if(returnData==null){
					responseJSON.put("0events");
				}else{
					for(Event e :returnData){
						JSONObject obj = new JSONObject(e.getJson());
						responseJSON.put(obj);
					}
				}
			//getEventDays received
			}else if("getEventDays".equalsIgnoreCase(action)){
				CalendarProvider c=CalendarProvider.getInstance();
				long time = eventDate.getTime();
				ArrayList<Timestamp> returnData = c.getEventDays(time);
				
				if(returnData==null){
					responseJSON.put("0eventDays");
				}else{
					for(Timestamp e :returnData){
						responseJSON.put(URLDecoder.decode(e.toString(),"Utf-8"));
					}
				}
			}
			//Error parsing arguments
			else{
				responseJSON.put("Parse error");
			}
			
			response = responseJSON.toString();
			h.sendResponseHeaders(200, response.length());
			OutputStream os = h.getResponseBody();
			os.write(response.getBytes());
			os.close();	
		}
		
		if ("post".equalsIgnoreCase(h.getRequestMethod())){
	            InputStreamReader isr = new InputStreamReader(h.getRequestBody(),"utf-8");
	            BufferedReader br = new BufferedReader(isr);
	            String query = br.readLine();
	            System.out.println(query);
	            Event newEvent = new Event(query);
	            
	            CalendarProvider c=CalendarProvider.getInstance();
	            c.addEvent(newEvent);
	            
			
		}
	
		
	}
	

}
