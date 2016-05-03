<?php
  if(empty($_GET['address'])) {
	$request = "empty";
    $locationByCurrentIP_JSON = file_get_contents('http://ip-api.com/json');
    $locationByCurrentIP_Object = json_decode($locationByCurrentIP_JSON);
    $altitude_JSON = file_get_contents('https://maps.googleapis.com/maps/api/elevation/json?locations='.$locationByCurrentIP_Object->lat.','.$locationByCurrentIP_Object->lon);
    $altitude_Object = json_decode($altitude_JSON,true);
    $response_Object = array('latitude'=>$locationByCurrentIP_Object->lat,'longitude'=>$locationByCurrentIP_Object->lon,'altitude'=>$altitude_Object['results'][0]['elevation'],'address'=>$locationByCurrentIP_Object->as,'city'=>$locationByCurrentIP_Object->city,'country'=>$locationByCurrentIP_Object->country);
    $response_JSON = json_encode($response_Object);
    echo $response_JSON;
  }
  else {
    $address = $_GET['address'];
	$request = $address;
    $address_URL = urlencode($address);
    $google_JSON = file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$address_URL);
    $google_Object = json_decode($google_JSON,true);
	
		$latitude = isset($google_Object['results'][0]['geometry']['location']['lat']) ? $google_Object['results'][0]['geometry']['location']['lat'] : '';
		$longitude = isset($google_Object['results'][0]['geometry']['location']['lng']) ? $google_Object['results'][0]['geometry']['location']['lng'] : '';
		if ($latitude=='' && $longitude==''){
			$response_Object = array('latitude'=>'','longitude'=>'','altitude'=>'','address'=>'','city'=>'','country'=>'');
			$response_JSON = json_encode($response_Object);
			echo $response_JSON;
		}
		else {
			$altitude_JSON = file_get_contents('https://maps.googleapis.com/maps/api/elevation/json?locations='.$latitude.','.$longitude);
			$altitude_Object = json_decode($altitude_JSON,true);
			$adress_Object = $google_Object['results'][0]['address_components'];
			foreach($adress_Object as $component) {
				if ($component['types'][0]=='locality') {
				  $city = $component['long_name'];
				}
				if ($component['types'][0]=='country') {
				  $country = $component['long_name'];
				}
			  }
			  $response_Object = array('latitude'=>$latitude,'longitude'=>$longitude,'altitude'=>$altitude_Object['results'][0]['elevation'],'address'=>$google_Object['results'][0]['formatted_address'],'city'=>$city,'country'=>$country);
			  $response_JSON = json_encode($response_Object);
			  echo $response_JSON;
			
		}
	
  }
	
	$data = date('d/m/Y H:i:s')." Request: ".$request." Response: ".$response_JSON." \n";
	$ret = file_put_contents('log.txt', $data, FILE_APPEND | LOCK_EX);
?>
