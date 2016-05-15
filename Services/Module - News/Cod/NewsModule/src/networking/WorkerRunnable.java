package networking;

import com.sun.net.httpserver.HttpExchange;
import utilities.JSONBuilder;
import utilities.News;
import utilities.NewsParser;
import utilities.RssExtractor;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

public class WorkerRunnable implements Runnable {
    private HttpExchange httpExchange;

    public WorkerRunnable(HttpExchange httpExchange) {
        this.httpExchange = httpExchange;
    }

    @Override
    public void run() {
        String location = null;
        StringBuilder logBuilder = new StringBuilder();
        String query = httpExchange.getRequestURI().getQuery();
        Map<String, String> parameters = queryToMap(query);

        if (parameters != null && parameters.containsKey("city") && !parameters.get("city").equals("")) {
            location = parameters.get("city");
            logBuilder.append("Received request with location " + location + "\n");
        } else {
            logBuilder.append("Received request for general news\n");
        }

        RssExtractor extractor = new RssExtractor();
        List<News> news = null;

        try {
            news = extractor.getNewsFromRss();
            logBuilder.append("   Extracted RSS feed\n");
        } catch (ParseException e) {
            e.printStackTrace();
            System.out.println("Error accessing RSS feed!");
            logBuilder.append("   Failed to extract RSS feed (ParseException)\n");
            System.exit(1);
        } catch (IOException e) {
            e.printStackTrace();
            logBuilder.append("  Failed to extract RSS (IOException)\n");
            System.out.println("IO error!");
        }

        NewsParser newsParser = new NewsParser(news, location);

        Stack<News> newsStack = newsParser.generateNewsStack();
        logBuilder.append("   Generated news stack\n");

        JSONBuilder jsonBuilder = new JSONBuilder(newsStack);
        String jsonArray = jsonBuilder.generateJSONArray();
        logBuilder.append("   Generated JSON response\n");
        //System.out.println(jsonArray);

        try {
            writeResponse(httpExchange, jsonArray);
            logBuilder.append("   Wrote response to client\n\n");
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("IO error!");
            logEvent("   Failed to write response to client (IOException)\n");
        }

        logEvent(logBuilder.toString());
    }

    private void writeResponse(HttpExchange httpExchange, String response) throws IOException {
        httpExchange.sendResponseHeaders(200, response.getBytes().length);
        OutputStream os = httpExchange.getResponseBody();
        os.write(response.getBytes());
        os.close();
    }

    private Map<String, String> queryToMap(String query) {
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

    private boolean logEvent(String message) {
        File logFile = new File("log.txt");
        try {
            FileWriter logWriter = new FileWriter(logFile, true);
            logWriter.write(message);
            logWriter.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
