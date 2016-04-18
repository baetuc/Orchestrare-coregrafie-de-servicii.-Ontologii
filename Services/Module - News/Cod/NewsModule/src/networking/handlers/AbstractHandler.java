package networking.handlers;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

public abstract class AbstractHandler implements HttpHandler {

    protected void writeResponse(HttpExchange httpExchange, String response) throws IOException {
        httpExchange.sendResponseHeaders(200, response.getBytes("UTF-16").length);
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes("UTF-16"));
        os.close();
    }

    protected Map<String, String> queryToMap(String query) {
        if (query == null || query.equals(""))
            return null;

        Map<String, String> result = new HashMap<>();
        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length > 1)
                result.put(pair[0], pair[1]);
            else
                result.put(pair[0], "");
        }
        return result;
    }

}

