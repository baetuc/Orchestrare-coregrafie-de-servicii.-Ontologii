package utilities;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class RssExtractor {
    private String source;

    public RssExtractor() {
        this.source = "http://rss.realitatea.net/stiri.xml";
    }

    public RssExtractor(String source) {
        this.source = source;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public List<News> getNewsFromRss() throws IOException, ParseException {
        URL rssUrl = new URL(source);
        News news = new News();
        List<News> newsList = new ArrayList<>();
        BufferedReader in = new BufferedReader(new InputStreamReader(rssUrl.openStream()));
        String line;
        boolean inItem = false;

        while ((line = in.readLine()) != null) {
            if (line.contains("<item>")) {
                news = new News();
                inItem = true;
                continue;
            }

            if (line.contains("</item>")) {
                newsList.add(news);
                inItem = false;
                continue;
            }

            if (line.contains("<title>") && inItem) {
                int firstPos = line.indexOf("<title>");
                int lastPos = line.indexOf("</title>");
                if (lastPos == -1)
                    lastPos = line.indexOf("</title>");
                String temp = line.substring(firstPos, lastPos);
                temp = temp.replace("<title>", "");
                news.setTitle(temp);
                continue;
            }

            if (line.contains("<description>") && inItem) {
                int firstPos = line.indexOf("<description>");
                int lastPos = line.indexOf("&lt;br");
                if (lastPos == -1)
                    lastPos = line.indexOf("</description>");
                String temp = line.substring(firstPos, lastPos);
                temp = temp.replace("<description>", "");
                news.setIntro(temp);
                continue;
            }

            if (line.contains("<link>") && inItem) {
                int firstPos = line.indexOf("<link>");
                int lastPos = line.indexOf("</link>");
                if (lastPos == -1)
                    lastPos = line.indexOf("</link>");
                String temp = line.substring(firstPos, lastPos);
                temp = temp.replace("<link>", "");
                news.setUrl(temp);
                continue;
            }

            if (line.contains("<pubDate>") && inItem) {
                int firstPos = line.indexOf("<pubDate>");
                int lastPos = line.indexOf("</pubDate>");
                if (lastPos == -1)
                    lastPos = line.indexOf("</pubDate>");
                String temp = line.substring(firstPos, lastPos);
                temp = temp.replace("<pubDate>", "");

                DateFormat format = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss Z");
                Date date = format.parse(temp);

                news.setDate(date.getTime());
            }
        }

        in.close();
        return newsList;
    }

}
