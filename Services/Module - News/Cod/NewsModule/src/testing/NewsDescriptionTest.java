package testing;

import org.junit.Test;
import utilities.News;

import static org.junit.Assert.assertEquals;

public class NewsDescriptionTest {
    @Test
    public void test() throws Exception {
        News teste = new News();
        String output = teste.getIntro();
        assertEquals(null, output);
    }
}
