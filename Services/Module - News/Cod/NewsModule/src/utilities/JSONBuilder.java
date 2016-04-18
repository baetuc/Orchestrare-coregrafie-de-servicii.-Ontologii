package utilities;

import org.json.simple.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

public class JSONBuilder {
    Stack<News> newsStack;

    public JSONBuilder(Stack<News> newsStack) {
        this.newsStack = newsStack;
    }

    public List<JSONObject> generateJSONArray() {
        List<JSONObject> jsonNews = new ArrayList<>();
        News temp;

        while (!newsStack.isEmpty()) {
            temp = newsStack.pop();

            JSONObject obj = new JSONObject();
            obj.put("title", temp.getTitle());
            obj.put("intro", temp.getDescription());
            obj.put("url", temp.getLink());
            obj.put("date", temp.getPubDate());

            jsonNews.add(obj);
        }

        return jsonNews;
    }
}
