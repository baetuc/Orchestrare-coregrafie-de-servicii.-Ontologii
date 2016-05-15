package ro.calendar.provider;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;

import ro.calendar.json.JSONArray;
import ro.calendar.json.JSONObject;

import static java.nio.file.Paths.get;
import static java.nio.file.Files.readAllBytes;

public class CalendarProvider {
	public static ArrayList<Event> CalendarEvents =new ArrayList<Event>();
	
	 private static CalendarProvider instance = null;
	 protected CalendarProvider() {}
	 
	 public static CalendarProvider getInstance() {
		 if(instance == null) {
			 instance = new CalendarProvider();
	      }
	      return instance;
	 }
	 
	 
	 /**
	 * Loads a list of events from a json file.
	 * The json file must contain a list of event objects.
	 * The previous list of events will be lost.
	 * 
	 * @param jsonFilePath	The path to the file to load events from
	 */
	public void loadFromFile(String jsonFilePath) {
		try {
			
			// Read the json file into a string and create an object
			String eventsString = new String(readAllBytes(get(jsonFilePath)));
			JSONArray newList = new JSONArray(eventsString);
			
			CalendarEvents = new ArrayList<Event>();
			
			// Add the events one by one
			for (Object eventJson : newList) {
				String eventString = ((JSONObject) eventJson).toString();
				addEvent(new Event(eventString));
			}
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	
	/**
	 * Returns a list of events from the specified day.
	 * 
	 * @param 	day	A timestamp inside the day the list of events is requested in
	 * @return	The list of events taking place in this day
	 */
	public ArrayList<Event> getEvents(long eventDay) {
		Timestamp day = new Timestamp(eventDay);
		ArrayList<Event>toReturn=new ArrayList<Event>();
		Calendar cObj1 =Calendar.getInstance();
		Calendar cObj2 =Calendar.getInstance();
		cObj1.setTime(day);
		for(Event e:CalendarEvents){
			cObj2.setTime(new Timestamp(e.getStartTime()));
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
	public ArrayList<Timestamp> getEventDays(long eventsMonth) { 
		Timestamp month = new Timestamp(eventsMonth);
		ArrayList<Timestamp>toReturn=new ArrayList<Timestamp>();
		Calendar cObj1 =Calendar.getInstance();
		Calendar cObj2 =Calendar.getInstance();
		cObj1.setTime(month);
		for(Event e:CalendarEvents){
			cObj2.setTime(new Timestamp(e.getStartTime()));
			if(cObj1.get(Calendar.MONTH)==cObj2.get(Calendar.MONTH)&&
					cObj1.get(Calendar.YEAR)==cObj2.get(Calendar.YEAR)){
						toReturn.add(new Timestamp(e.getStartTime()));
			}
		}
		if(toReturn.isEmpty()){
			return new ArrayList<Timestamp>();
		}
		return toReturn;
	}
	/**
	 * Returns a specific event that matches the timestamp.
	 * 
	 * @param 	eventTime	A timestamp that indicates a single event.
	 * @return	A single event that takes place at exactly the specified time.  
	 */
	
	public String getSpecificEvent(long eventTime) {
		String toReturn;
		
		for(Event e:CalendarEvents){

			if(eventTime == e.getStartTime()){

				
				System.out.println("gasit");
				toReturn=e.getJson();
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
			System.out.println("event added");
			return true;
		}
		catch(Exception e){
			return false;
		}
	}

}
