package bazadate;

import java.util.ArrayList;
import java.util.List;

import java.sql.*;

public class TempAdv {

	public List<String> ListaAdv;
	
	public TempAdv()
	{
		
		ListaAdv=new ArrayList<>();
		
	}
	
	public List<String> getAdvTemp(String temperatura) throws SQLException, ClassNotFoundException
	{
		// Driver
	    Class.forName ("oracle.jdbc.driver.OracleDriver");

	    // Conectare la baza de date//Impartim string'ul primit intr-o lista
	    Connection conn =
	      DriverManager.getConnection ("jdbc:oracle:thin:@localhost:1521:xe", "student", "student");
	    
	    // Apeleaza procedura stocata din Oracle
	    {
	      CallableStatement funcin = conn.prepareCall 
	                                 ("begin  AfiseazapentruTemp(?,?); end;");
	      
	      int t= Integer.parseInt(temperatura);
	      funcin.setInt (1, t);
	      
	      funcin.registerOutParameter (2, Types.VARCHAR);
	      
	      funcin.execute ();
	      String v = funcin.getString( 2 );
	      
	    //Impartim string'ul primit intr-o lista
	      String[] a = v.split("%m%");
	      for (String str : a ) {
	    	  
		      this.ListaAdv.add(str);
	          
	        }
	      
	      
	      funcin.close();
	      return this.ListaAdv;
	    }		
	}
	
}
