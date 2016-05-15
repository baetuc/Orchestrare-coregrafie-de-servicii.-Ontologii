<?php
	//$lat=$_get['lat'];
	//$lat=45.471929;
	//$long=9.187633;
	$lat=$_get['lat'];
	$long=$_get['long'];
	$key=	'AIzaSyD3aiPkRdbRFb13gjD4C3rmWCNPRZ3eEbg';
	$request = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' .$lat.','.$long.'&keyword=museum|restaurant|amusement_park|night_club|bar|cafe|church&radius=10000&sensor=false&key=' .$key;
	
        $response  = file_get_contents($request);
        $fullarray=array();
       
    $jsonobj  = json_decode($response,TRUE);
    foreach ($jsonobj['results'] as $POI) 
    {
    	# code...
    	$icon_url= $POI['icon'];
    	$name=$POI['name'];
    	$lat_tosend=$POI['geometry']['location']['lat'];
    	$long_tosend=$POI['geometry']['location']['lng'];
    	
 		
  
 		if(isset($POI['opening_hours']['open_now']))
		{
 		 $open_tosend='1';
 		}
		 else
		 {
		 	$open_tosend='0';
		 }

		$responseobj=array('name'=>$name,'lat'=>$lat_tosend,'long'=>$long_tosend,'open_now'=>$open_tosend);
		array_push($fullarray,$responseobj);
		
		

    }
    $jsonresponse=json_encode($fullarray);
	echo $jsonresponse.'<br/>';
   

    
?>