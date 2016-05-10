package healthmod;

import com.sun.net.httpserver.HttpExchange;

import bazadate.CountryAdv;
import bazadate.TempAdv;

import com.google.gson.Gson;


import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.*;

public class Response implements Runnable {
	
    private HttpExchange httpex;

    public Response(HttpExchange httpExchange) {
        this.httpex = httpExchange;
    }

	@Override
    public void run() {
    	
        String v_parametru = null;
        String context_parametri = httpex.getRequestURI().getQuery();
        Map<String, String> parametru = ParamList(context_parametri);

        List<String> lista_avertismente=new ArrayList<>();
        
        if (parametru != null && parametru.containsKey("tara") && !parametru.get("tara").equals(""))
        {
        	
            v_parametru = parametru.get("tara");
            
            System.out.println(">> Am primit tara:  "+ v_parametru);
            
            CountryAdv adv_country = new CountryAdv();
            
            try {
				lista_avertismente = adv_country.getAdvCountry(v_parametru);
			} catch (ClassNotFoundException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            
        }
        else  if(parametru != null && parametru.containsKey("temperatura") && !parametru.get("temperatura").equals(""))
        {
            v_parametru =parametru.get("temperatura");

            System.out.println(">> Am primit temperatura:  "+ v_parametru);
            
            TempAdv adv_temp = new TempAdv();
            
            try {
				lista_avertismente = adv_temp.getAdvTemp(v_parametru);
			} catch (ClassNotFoundException | SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            
        }
        
        //trimitem intr-un format elegant
		String json = new Gson().toJson(lista_avertismente);
		System.out.println(">> Am raspuns:   "+ json);
		
        try 
        {
            writeResponse(httpex, json);   
        } catch (IOException e) 
        {
            e.printStackTrace();
            System.out.println("Eroare la trimiterea raspunsului!");
        }
    }

    protected void writeResponse(HttpExchange httpExchange, String response) throws IOException 
    {
    	
        httpExchange.sendResponseHeaders(200, response.getBytes().length);
        
        OutputStream output = httpExchange.getResponseBody();
        
        output.write(response.getBytes());
        
        output.close();
        
    }
    
    
    protected Map<String, String> ParamList(String context_param) 
    {
    	
		if (context_param == null || context_param.equals(""))
		        return null;
		
		Map<String, String> result = new HashMap<>();
		
		for (String param : context_param.split("&")) {
		  
		        String[] pair = param.split("=");
		if (pair.length > 1)
		    result.put(pair[0], pair[1]);
		else
		    result.put(pair[0], "");
		}
		return result;
    }
}
