package ro.calendar.provider;

import java.sql.Timestamp;

public class Event {

	/**
	 * We can store the raw json representation of the event here
	 * to be able to easily return it.
	 */
	String rawJson;
	
	Timestamp start, end;
	
	/**
	 * Constructor that uses the json recieved from the user
	 * 
	 * @param 	rawJson	The json representation of this event
	 */
	public Event(String rawJson) {
		// TODO extract the start and end timestamps, we don't need anything else
	}
	
	// TODO
	
	public String getJson() { return null; }
	
	public Timestamp getStartTime() { return null; }
	
	public Timestamp getEndTime() { return null; }
	
}
