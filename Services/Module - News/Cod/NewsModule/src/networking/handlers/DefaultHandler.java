package networking.handlers;

import com.sun.net.httpserver.HttpExchange;
import org.json.simple.JSONObject;
import utilities.JSONBuilder;
import utilities.News;
import utilities.NewsParser;
import utilities.RssExtractor;

import java.io.IOException;
import java.text.ParseException;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Stack;

public class DefaultHandler extends AbstractHandler {

    @Override
    public void handle(HttpExchange httpExchange) throws IOException {
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
            writeResponse(httpExchange, "Error accessing RSS feed!");
            System.exit(1);
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

        writeResponse(httpExchange, sb.toString());
    }
}

