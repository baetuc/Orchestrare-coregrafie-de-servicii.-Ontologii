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

            temp.setTitle(replaceSpecialCharacters(temp.getTitle()));
            temp.setDescription(replaceSpecialCharacters(temp.getDescription()));

            JSONObject obj = new JSONObject();
            obj.put("title", temp.getTitle());
            obj.put("intro", temp.getDescription());
            obj.put("url", temp.getLink());
            obj.put("date", temp.getPubDate());

            jsonNews.add(obj);
        }

        return jsonNews;
    }

    private String replaceSpecialCharacters(String string) {
        // ă Ă â Â î Î ș Ș ț Ț ţ Ţ ş Ş î â "
        String[] special = {"\u0103", "\u0102", "\u00E2", "\u00C2", "\u00EE", "\u00CE",
                "\u0219", "\u0218", "\u021B", "\u021A", "\u0163", "\u0162", "\u015F", "\u015E",
                "&amp;amp;icirc;", "&amp;amp;acirc;", "&amp;quot;", "&amp;amp;nbsp;"};
        String aux = string;

        for (int i = 0; i < special.length; i++) {
            int firstCut = aux.indexOf(special[i]);
            int secondCut;

            while (firstCut != -1) {
                StringBuilder sb = new StringBuilder();
                secondCut = firstCut + special[i].length();
                sb.append(aux.substring(0, firstCut));

                switch (i) {
                    case 0:
                        sb.append("\\u0103");
                        break;
                    case 1:
                        sb.append("\\u0102");
                        break;
                    case 2:
                        sb.append("\\u00E2");
                        break;
                    case 3:
                        sb.append("\\u00C2");
                        break;
                    case 4:
                        sb.append("\\00EE");
                        break;
                    case 5:
                        sb.append("\\u00CE");
                        break;
                    case 6:
                        sb.append("\\u0219");
                        break;
                    case 7:
                        sb.append("\\u0218");
                        break;
                    case 8:
                        sb.append("\\u021B");
                        break;
                    case 9:
                        sb.append("\\u021A");
                        break;
                    case 10:
                        sb.append("\\u0163");
                        break;
                    case 11:
                        sb.append("\\u0162");
                        break;
                    case 12:
                        sb.append("\\u015F");
                        break;
                    case 13:
                        sb.append("\\u015E");
                        break;
                    case 14:
                        sb.append("\\u00EE");
                        break;
                    case 15:
                        sb.append("\\u00E2");
                        break;
                    case 16:
                        sb.append("\\u0022");
                        break;
                    case 17:
                        sb.append(" ");
                        break;
                    default:
                        break;
                }

                sb.append(aux.substring(secondCut));
                aux = sb.toString();
                firstCut = aux.indexOf(special[i]);
            }
        }
        return aux;
    }

}
