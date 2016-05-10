package healthmod;

import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;

public class HealthServer {

    private int PORT = 8897;
    private String bk_sl = "/";

    public void createServer() throws IOException 
    {
    	
    	//Dam PORT-ul si numarul maxim de conectati(default)
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        
        server.createContext(bk_sl, new MyHandler());
        
        server.start();
        
        System.out.println(">> Serverul astepata request-uri la portul " + PORT +" ...");
        
    }
}
