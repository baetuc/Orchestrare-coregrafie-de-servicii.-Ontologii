package testing;

import org.junit.Test;
import utilities.RssExtractor;

import static org.junit.Assert.assertEquals;

public class RssExtractorTest {
    @Test
    public void test() throws Exception {
        RssExtractor teste = new RssExtractor();
        String output = teste.getSource();
        assertEquals("http://rss.realitatea.net/stiri.xml", output);
    }
}
