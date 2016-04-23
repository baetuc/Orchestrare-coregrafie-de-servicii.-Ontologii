package utilities;

public class News {

    private String title;
    private String description;
    private String link;
    private long pubDate;

    public News() {
        this.title = null;
        this.description = null;
        this.link = null;
        this.pubDate = 0;
    }

    public News(String title, String description, String link, long pubDate) {
        this.title = title;
        this.description = description;
        this.link = link;
        this.pubDate = pubDate;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String titlu) {
        this.title = titlu;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public long getPubDate() {
        return pubDate;
    }

    public void setPubDate(long pubDate) {
        this.pubDate = pubDate;
    }

    @Override
    public String toString() {
        return this.getTitle() + "\n\t" +
                this.getDescription() + "\n\t" +
                this.getLink() + "\n\t" +
                this.getPubDate() + "\n";
    }
}

