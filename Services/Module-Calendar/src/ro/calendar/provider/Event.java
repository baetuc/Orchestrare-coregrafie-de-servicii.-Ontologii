package ro.calendar.provider;

import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import ro.calendar.json.JSONObject;

public class Event {

	/**
	 * We can store the raw json representation of the event here
	 * to be able to easily return it.
	 */
	String eventJson;
	
	Timestamp start, end;
	
	/**
	 * Constructor that uses the json received from the user
	 * 
	 * @param 	rawJson	The json representation of this event
	 */
	public Event(String rawJson) {
		eventJson = rawJson;
		
		JSONObject json = new JSONObject(eventJson);
		String startString = json.getString("start");
		String endString = json.getString("end");
		// o sa modific formatul cand o sa stabilim care e cel final
		DateFormat format = new SimpleDateFormat("MMMM d, yyyy");
		Date startDate = null, endDate = null;
		try {
			startDate = format.parse(startString);
			endDate = format.parse(endString);
		} catch (ParseException e) {
			System.out.println("Error parsing date");
			System.out.println(e.getMessage());
		}
		long startTime = startDate.getTime();
		long endTime = endDate.getTime();
		
		start = new Timestamp(startTime);
		end = new Timestamp(endTime);
	}
	
	public String getJson() { 
		return eventJson;
	}
	
	public Timestamp getStartTime() { 
		return start;
	}
	
	public Timestamp getEndTime() { 
		return end;
	}
	
}
