package bazadate;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;

public class CountryAdv {

	public List<String> ListaAdv;
	
	public CountryAdv(){
		
		ListaAdv=new ArrayList<>();;
		
	}
	
		public List<String> getAdvCountry(String tara) throws SQLException, ClassNotFoundException
		{
		
			// Driver
		    Class.forName ("oracle.jdbc.driver.OracleDriver");
	
		    // Conectare la baza de date
		    Connection conn =
		      DriverManager.getConnection ("jdbc:oracle:thin:@localhost:1521:xe", "student", "student");
		    
		    // Apeleaza procedura stocata din Oracle
		    {
		      CallableStatement funcin = conn.prepareCall 
		                                 ("begin  AfiseazapentruTara(?,?); end;");
		      
		      funcin.setString (1, tara);
		      funcin.registerOutParameter (2, Types.VARCHAR);
		      
		      funcin.execute ();
		      String v = funcin.getString( 2 );
		      
		      //Impartim stringul primit intr-o lista
		      String[] a = v.split("%m%");
		      for (String str : a ) {
		    	  
			      this.ListaAdv.add(str);
		          
		        }
		      
		      funcin.close();
		      
		      return this.ListaAdv;
	    }
	}
	
}
