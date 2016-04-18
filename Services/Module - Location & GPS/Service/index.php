<?php
	if(empty($_GET)) {
	//Get current location
		echo '
		<script src="https://maps.google.com/maps?file=api&amp;v=3&amp;sensor=false"
		type="text/javascript"></script>
		
		<script type="text/javascript">

		function success(position) {
			var latitude  = position.coords.latitude;
			var longitude = position.coords.longitude;
			
			var elevation = 0;
			
			var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
			  var geocoder = new google.maps.Geocoder;
			  var elevator = new google.maps.ElevationService;
			  
			  elevator.getElevationForLocations({
				\'locations\': [latlng]
			  }, function(results, status) {
				if (status === google.maps.ElevationStatus.OK) {
				  // Retrieve the first result
				  if (results[0]) {
					elevation = results[0].elevation;
				  }
				}
			  });
			  
			  geocoder.geocode({\'location\': latlng}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
				  if (results[0]) {
					
					var city = "";
					var country = "";
					
					results[0][\'address_components\'].forEach(function(entry) {
						if (entry[\'types\'][0]==\'locality\'){
							city = entry[\'long_name\'];
						}
						if (entry[\'types\'][0]==\'country\'){
							country = entry[\'long_name\'];
						}
					});
					
					var obj = new Object();
					obj.latitude = latitude;
					obj.longitude = longitude;
					obj.altitude = elevation;
					obj.address = results[0][\'formatted_address\'];
					obj.city = city;
					obj.country = country;
					var jsonString= JSON.stringify(obj,null,4);
					
					console.log(jsonString);
					
					//document.write(jsonString);
					document.getElementById("target").innerHTML = jsonString;
					
				  }
				}
			  });
		  };

		  function error() {
		  };

		navigator.geolocation.getCurrentPosition(success,error);

		</script>';
	}
	else {
	//Get location by address

		//Take the address from the URL and encode it
		$address = $_GET['address'];
		$address_URL = urlencode($address);

		//Take the JSON with the location from GoogleMaps and decode it
		$google_JSON = file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$address_URL);
		$google_Object = json_decode($google_JSON,true);

		//Use the latitude and the longitude to obtain the altitude
		$latitude = $google_Object['results'][0]['geometry']['location']['lat'];
		$longitude = $google_Object['results'][0]['geometry']['location']['lng'];
		$altitude_JSON = file_get_contents('https://maps.googleapis.com/maps/api/elevation/json?locations='.$latitude.','.$longitude);
		$altitude_Object = json_decode($altitude_JSON,true);

		//Get the full address from Google and search in it for the city and the country
		$adress_Object = $google_Object['results'][0]['address_components'];
		foreach($adress_Object as $component) {
      		if ($component['types'][0]=='locality') {
       			$city = $component['long_name'];
      		}
      		if ($component['types'][0]=='country') {
        		$country = $component['long_name'];
      		}
      	}
      	//Create the response
      	$response_Object = array(
      		'latitude'=>$latitude,
      		'longitude'=>$longitude,
      		'altitude'=>$altitude_Object['results'][0]['elevation'],
      		'address'=>$google_Object['results'][0]['formatted_address'],
      		'city'=>$city,'country'=>$country);

      	//Return the location
      	$response_JSON = json_encode($response_Object);
      	echo $response_JSON;
   	}
?>

<html>
	<body>
		<div id="target"></div>
	</body>
</html>