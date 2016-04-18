package ro.calendar.provider;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;

public class CalendarProvider {
	public static ArrayList<Event> CalendarEvents =new ArrayList<Event>();
	/**
	 * De sters daca nu vrem sa fie singleton 
	 */
	
	 private static CalendarProvider instance = null;
	 protected CalendarProvider() {}
	 
	 public static CalendarProvider getInstance() {
		 if(instance == null) {
			 instance = new CalendarProvider();
	      }
	      return instance;
	 }
	
	
	/**
	 * Returns a list of events from the specified day.
	 * 
	 * @param 	day	A timestamp inside the day the list of events is requested in
	 * @return	The list of events taking place in this day
	 */
	public ArrayList<Event> getEvents(Timestamp day) { 
		ArrayList<Event>toReturn=new ArrayList<Event>();
		Calendar cObj1 =Calendar.getInstance();
		Calendar cObj2 =Calendar.getInstance();
		cObj1.setTime(day);
		for(Event e:CalendarEvents){
			cObj2.setTime(e.getStartTime());
			if(cObj1.get(Calendar.DAY_OF_MONTH)==cObj2.get(Calendar.DAY_OF_MONTH)&&
					cObj1.get(Calendar.MONTH)==cObj2.get(Calendar.MONTH)&&
					cObj1.get(Calendar.YEAR)==cObj2.get(Calendar.YEAR)){
						toReturn.add(e);
			}
		}
		if(toReturn.isEmpty()){
			return null;
		}
		return toReturn;
	}
	/**
	 * Returns a list of days in the specified month that have events.
	 * 
	 * @param 	month	A timestamp inside the requested month
	 * @return	A list of timestamps inside the days when events take place
	 */
	public ArrayList<Timestamp> getEventDays(Timestamp month) { 
		ArrayList<Timestamp>toReturn=new ArrayList<Timestamp>();
		Calendar cObj1 =Calendar.getInstance();
		Calendar cObj2 =Calendar.getInstance();
		cObj1.setTime(month);
		for(Event e:CalendarEvents){
			cObj2.setTime(e.getStartTime());
			if(cObj1.get(Calendar.MONTH)==cObj2.get(Calendar.MONTH)&&
					cObj1.get(Calendar.YEAR)==cObj2.get(Calendar.YEAR)){
						toReturn.add(e.getStartTime());
			}
		}
		if(toReturn.isEmpty()){
			return null;
		}
		return toReturn;
	}
	/**
	 * Returns a specific event that matches the timestamp.
	 * 
	 * @param 	eventTime	A timestamp that indicates a single event.
	 * @return	A single event that takes place at exactly the specified time.  
	 */
	
	public Event getSpecificEvent(Timestamp eventTime) { 
		Event toReturn;
		for(Event e:CalendarEvents){
			if(eventTime.equals(e.getStartTime())){
				toReturn=e;
				return toReturn;
			}
		}
		
		return null;
	}
	
	
	
	
	/**
	 * Adds the specified event to the calendar between the specified timestamps
	 * 
	 * @param  	event	The event to add
	 * @param  	start	The time this event starts at
	 * @param	end		The time this event ends at
	 * @return	true if the event has been added successfully, false if
	 * 			there is a schedule conflict
	 */
	public boolean addEvent(Event event) {
		
		try{
			CalendarEvents.add(event);
			return true;
		}
		catch(Exception e){
			return false;
		}
	}

}
