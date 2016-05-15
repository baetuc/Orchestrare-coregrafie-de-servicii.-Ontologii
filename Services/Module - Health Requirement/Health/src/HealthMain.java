import java.io.IOException;
import java.text.ParseException;

import healthmod.HealthServer;

public class HealthMain {

    public static void main(String[] args) throws IOException, ParseException 
    {
    	
    	//Create server
    	HealthServer server = new HealthServer();
        server.createServer();
        
    }

}


