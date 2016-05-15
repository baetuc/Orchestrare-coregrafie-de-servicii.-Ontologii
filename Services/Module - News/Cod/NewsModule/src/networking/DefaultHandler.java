package networking;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

public class DefaultHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
        (new Thread(new WorkerRunnable(httpExchange))).start();
    }
}

