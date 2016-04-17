package ro.calendar.provider;

import java.sql.Timestamp;
import java.util.ArrayList;

public class CalendarProvider {
	
	/**
	 * Returns a list of events from the specified day.
	 * 
	 * @param 	day	A timestamp inside the day the list of events is requested in
	 * @return	The list of events taking place in this day
	 */
	public ArrayList<Event> getEvents(Timestamp day) { return null; }
	
	
	/**
	 * Returns a list of days in the specified month that have events.
	 * 
	 * @param 	month	A timestamp inside the requested month
	 * @return	A list of timestamps inside the days when events take place
	 */
	public ArrayList<Timestamp> getEventDays(Timestamp month) { return null; }
	
	
	/**
	 * Adds the specified event to the calendar between the specified timestamps
	 * 
	 * @param  	event	The event to add
	 * @param  	start	The time this event starts at
	 * @param	end		The time this event ends at
	 * @return	true if the event has been added successfully, false if
	 * 			there is a schedule conflict
	 */
	public boolean addEvent(Event event, Timestamp start, Timestamp end) { return false; }

}
