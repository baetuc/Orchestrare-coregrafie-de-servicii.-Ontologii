package ro.calendar.provider;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;

import ro.calendar.json.JSONObject;

public class Event {

	/**
	 * We can store the raw json representation of the event here
	 * to be able to easily return it.
	 */
	String eventJson;
	
	long start, end;
	
	/**
	 * Constructor that uses the json received from the user
	 * 
	 * @param 	rawJson	The json representation of this event
	 */
	public Event(String rawJson) {
		eventJson = rawJson;
		
		JSONObject json = new JSONObject(eventJson);
		start = json.getLong("start");
		end = json.getLong("end");
	}
	
	public String getJson() { 
		return eventJson;
	}
	
	public long getStartTime() { 
		return start;
	}
	
	public long getEndTime() { 
		return end;
	}
	
}
