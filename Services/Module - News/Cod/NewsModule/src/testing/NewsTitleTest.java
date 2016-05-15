package testing;

import org.junit.Test;
import utilities.News;

import static org.junit.Assert.assertEquals;

public class NewsTitleTest {
    @Test
    public void test() throws Exception {
        News testee = new News();
        String output = testee.getTitle();
        assertEquals(null, output);
    }
}
