package ro.calendar.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.util.ArrayList;
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
			
			
			System.out.println("Am primit Get "+action+" "+data);

			//Convert the timestamp received from long to java.timestamp
			Timestamp timp=new Timestamp(0);
			timp.setTime(Long.parseLong(data));
			
			
			//getEvents received
			if("getEvents".equalsIgnoreCase(action)){
				CalendarProvider c=CalendarProvider.getInstance();
				long time = timp.getTime();
				ArrayList<Event> returnData = c.getEvents(time);
				System.out.println(returnData);
				if(returnData==null){
					responseJSON.put("[]");
				}else{
					for(Event e :returnData){
						JSONObject obj = new JSONObject(e.getJson());
						responseJSON.put(obj);
					}
					response = responseJSON.toString();
				}
			//getEventDays received
			}else if("getEventDays".equalsIgnoreCase(action)){
				CalendarProvider c=CalendarProvider.getInstance();
				long time = timp.getTime();
				ArrayList<Timestamp> returnData = c.getEventDays(time);
					System.out.println(returnData);
				if(returnData==null){
					responseJSON.put("[]");
				}else{
					for(Timestamp e :returnData){
						//responseJSON.put(URLDecoder.decode(e.toString(),"Utf-8"));
						JSONObject myString = new JSONObject().put("date",e.getTime());
						
						responseJSON.put(myString);
					}
				}
				response = responseJSON.toString();
			}
			//getSpecificEvent received
			else if("getSpecificEvent".equalsIgnoreCase(action)){
				CalendarProvider c=CalendarProvider.getInstance();
				long time = timp.getTime();
				String eventJson = c.getSpecificEvent(time);
				if(eventJson == null)
					eventJson = "[]";
				//responseJSON.put(eventJson);
				System.out.println(eventJson);
				response = eventJson;
				
			}
			//Error parsing arguments
			else{
				responseJSON.put("[]");
			}
			
			
			h.sendResponseHeaders(200, response.length());
			OutputStream os = h.getResponseBody();
			os.write(response.getBytes());
			os.close();	
		}
		
		//nu mai este folosita
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
