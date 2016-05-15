package utilities;

import com.google.gson.Gson;

import java.util.Stack;

public class JSONBuilder {
    Stack<News> newsStack;

    public JSONBuilder(Stack<News> newsStack) {
        this.newsStack = newsStack;
    }

    public String generateJSONArray() {

        News temp;
        News[] finalNews = new News[newsStack.size()];
        int i = 0;
        while (!newsStack.isEmpty()) {
            temp = newsStack.pop();
            temp.setDate(temp.getDate() / 1000);
            finalNews[i++] = temp;
        }
        Gson gson = new Gson();
        return gson.toJson(finalNews);
    }

}
