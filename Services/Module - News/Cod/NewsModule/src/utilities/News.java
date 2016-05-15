package utilities;

public class News {

    private String title;
    private String intro;
    private String url;
    private long date;

    public News() {
        this.title = null;
        this.intro = null;
        this.url = null;
        this.date = 0;
    }

    public News(String title, String description, String url, long date) {
        this.title = title;
        this.intro = description;
        this.url = url;
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String titlu) {
        this.title = titlu;
    }

    public String getIntro() {
        return intro;
    }

    public void setIntro(String intro) {
        this.intro = intro;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public long getDate() {
        return date;
    }

    public void setDate(long date) {
        this.date = date;
    }

    @Override
    public String toString() {
        return this.getTitle() + "\n\t" +
                this.getIntro() + "\n\t" +
                this.getUrl() + "\n\t" +
                this.getDate() + "\n";
    }
}

