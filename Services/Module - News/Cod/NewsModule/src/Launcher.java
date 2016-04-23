import networking.NewsServer;

import java.io.IOException;
import java.text.ParseException;

public class Launcher {

    public static void main(String[] args) throws IOException, ParseException {
        NewsServer server = new NewsServer();
        server.createServer();
    }

}


