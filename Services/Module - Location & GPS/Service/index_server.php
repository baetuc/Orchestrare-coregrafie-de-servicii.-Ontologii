<?php
  if (empty($_GET)){
    //Locatia curenta
    $ipjson = file_get_contents('http://ip-api.com/json');
    $ipobj = json_decode($ipjson);
    $lat = $ipobj->lat;
    $long = $ipobj->lon;
    $altjson = file_get_contents('https://maps.googleapis.com/maps/api/elevation/json?locations='.$lat.','.$long);
    $altobj = json_decode($altjson,true);
    //Building
    $data = array(
      'lat'=> $ipobj->lat,
      'long'=> $ipobj->lon,
      'altitudine'=> $altobj['results'][0]['elevation'],
      'adresa'=> $ipobj->as,
      'oras'=> $ipobj->city,
      'tara'=> $ipobj->country
    );
    $jsondata = json_encode($data);
    echo $jsondata;
  }
  else {
    $adresa = $_GET['adresa'];
    $eadresa = urlencode($adresa);

    $gson = file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.$eadresa);
    $gobj = json_decode($gson,true);


    $lat = $gobj['results'][0]['geometry']['location']['lat'];
    $long = $gobj['results'][0]['geometry']['location']['lng'];

    $adressArray = $gobj['results'][0]['address_components'];

    foreach($adressArray as $comp){
      if ($comp['types'][0]=='locality'){
        $city = $comp['long_name'];
      }
      if ($comp['types'][0]=='country'){
        $country = $comp['long_name'];
      }
    }

    //Building
    $altjson = file_get_contents('https://maps.googleapis.com/maps/api/elevation/json?locations='.$lat.','.$long);
    $altobj = json_decode($altjson,true);


    $data = array(
      'lat'=> $lat,
      'long'=> $long,
      'altitudine'=> $altobj['results'][0]['elevation'],
      'adresa'=> $gobj['results'][0]['formatted_address'],
      'oras'=> $city,
      'tara'=> $country
    );
    $jsondata = json_encode($data);

    echo $jsondata;
  }

?>
