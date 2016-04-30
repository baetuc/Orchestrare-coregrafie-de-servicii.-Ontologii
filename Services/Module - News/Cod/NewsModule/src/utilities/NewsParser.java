package utilities;

import java.util.List;
import java.util.Stack;

public class NewsParser {
    private String location;
    private List<News> newsList;

    public NewsParser(List<News> newsList, String location) {
        this.newsList = newsList;
        this.location = location;
    }

    public List<News> getNewsList() {
        return newsList;
    }

    public void setNewsList(List<News> newsList) {
        this.newsList = newsList;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Stack<News> generateNewsStack() {
        Stack<News> newsStack = new Stack<>();

        if (location == null) {
            while (!newsList.isEmpty()) {
                News aux = newsList.get(newsList.size() - 1);
                newsStack.push(aux);
                newsList.remove(newsList.size() - 1);
            }
            return newsStack;
        }

        String noDiacriticalLocation = "";
        String descriptionSearchTerm = "";

        // parse location to determine search terms
        for (int i = 0; i < this.location.length(); i++)
            //Capital Letters:
            switch (this.location.charAt(i)) {
                case 'Ă':
                    noDiacriticalLocation = noDiacriticalLocation + 'A';
                    descriptionSearchTerm = descriptionSearchTerm + 'Ă';
                    break;
                case 'Â':
                    noDiacriticalLocation = noDiacriticalLocation + 'A';
                    descriptionSearchTerm = descriptionSearchTerm + "&amp;amp;Acirc;";
                    break;
                case 'Î':
                    noDiacriticalLocation = noDiacriticalLocation + 'I';
                    descriptionSearchTerm = descriptionSearchTerm + "&amp;amp;Icirc;";
                    break;
                case 'Ș':
                    noDiacriticalLocation = noDiacriticalLocation + 'S';
                    descriptionSearchTerm = descriptionSearchTerm + 'Ș';
                    break;
                case 'Ț':
                    noDiacriticalLocation = noDiacriticalLocation + 'T';
                    descriptionSearchTerm = descriptionSearchTerm + 'Ț';
                    break;

                //Lower Case Letters:
                case 'ă':
                    noDiacriticalLocation = noDiacriticalLocation + 'a';
                    descriptionSearchTerm = descriptionSearchTerm + 'ă';
                    break;
                case 'â':
                    noDiacriticalLocation = noDiacriticalLocation + 'a';
                    descriptionSearchTerm = descriptionSearchTerm + "&amp;amp;acirc";
                    break;
                case 'î':
                    noDiacriticalLocation = noDiacriticalLocation + 'i';
                    descriptionSearchTerm = descriptionSearchTerm + "&amp;amp;icirc;";
                    break;
                case 'ş':
                    noDiacriticalLocation = noDiacriticalLocation + 's';
                    descriptionSearchTerm = descriptionSearchTerm + 'ș';
                    break;
                case 'ț':
                    noDiacriticalLocation = noDiacriticalLocation + 't';
                    descriptionSearchTerm = descriptionSearchTerm + 'ț';
                    break;
                default:
                    noDiacriticalLocation = noDiacriticalLocation + this.location.charAt(i);
                    descriptionSearchTerm = descriptionSearchTerm + this.location.charAt(i);
            }

        Stack<News> localNews = new Stack<>();

        for (News temp : newsList) {
            if (temp.getTitle().contains(location)
                    || temp.getDescription().contains(descriptionSearchTerm)
                    || temp.getTitle().contains(noDiacriticalLocation)
                    || temp.getDescription().contains(noDiacriticalLocation))
                localNews.push(temp);
            else
                newsStack.push(temp);
        }

        while (!localNews.isEmpty()) {
            newsStack.push(localNews.pop());
        }

        return newsStack;
    }
}
