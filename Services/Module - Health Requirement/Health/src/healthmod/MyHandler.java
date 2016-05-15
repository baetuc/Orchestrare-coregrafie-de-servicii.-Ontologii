package healthmod;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

public class MyHandler implements HttpHandler 
{

    @Override
    public void handle(HttpExchange httpExchange) throws IOException 
    {
    	
        (new Thread ( new Response(httpExchange ))).start();
        
    }
    
}
