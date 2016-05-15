package networking;

import com.sun.net.httpserver.HttpExchange;
import org.json.simple.JSONObject;
import utilities.JSONBuilder;
import utilities.News;
import utilities.NewsParser;
import utilities.RssExtractor;

import java.io.IOException;
import java.io.OutputStream;
import java.text.ParseException;
import java.util.*;

public class WorkerRunnable implements Runnable {
    private HttpExchange httpExchange;

    public WorkerRunnable(HttpExchange httpExchange) {
        this.httpExchange = httpExchange;
    }

    @Override
    public void run() {
        String location = null;
        String query = httpExchange.getRequestURI().getQuery();
        Map<String, String> parameters = queryToMap(query);

        if (parameters != null && parameters.containsKey("city") && !parameters.get("city").equals(""))
            location = parameters.get("city");

        RssExtractor extractor = new RssExtractor();
        List<News> news = null;

        try {
            news = extractor.getNewsFromRss();
        } catch (ParseException e) {
            e.printStackTrace();
            System.out.println("Error accessing RSS feed!");
            System.exit(1);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("IO error!");
        }

        NewsParser newsParser = new NewsParser(news, location);
        Stack<News> newsStack = newsParser.generateNewsStack();

        JSONBuilder jsonBuilder = new JSONBuilder(newsStack);
        List<JSONObject> jsonArray = jsonBuilder.generateJSONArray();

        StringBuilder sb = new StringBuilder();
        sb.append("[");
        Iterator<JSONObject> jsonObjectIterator = jsonArray.iterator();
        while (jsonObjectIterator.hasNext()) {
            JSONObject obj = jsonObjectIterator.next();
            sb.append(obj);
            if (jsonObjectIterator.hasNext())
                sb.append(",");
        }
        sb.append("]");

        try {
            writeResponse(httpExchange, sb.toString());
        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("IO error!");
        }
    }

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
