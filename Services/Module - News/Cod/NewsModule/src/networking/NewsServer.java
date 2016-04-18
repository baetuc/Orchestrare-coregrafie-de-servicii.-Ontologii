package networking;

import com.sun.net.httpserver.HttpServer;
import networking.handlers.DefaultHandler;

import java.io.IOException;
import java.net.InetSocketAddress;

public class NewsServer {

    private final int PORT = 5555;
    private final String DEFAULT_CONTEXT_PATH = "/";

    public void createServer() throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.createContext(DEFAULT_CONTEXT_PATH, new DefaultHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("The server is running at port number " + PORT);
    }
}
