<?php
	//$input_url='action=vreme?lat=23.323?long=45.232?data=127377232';

  $search_lat=$_GET['lat'];
	$search_long=$_GET['long'];
	$search_date=$_GET['data'];
  //$search_lat=47.17;
  //$search_long=27.187633;
 //$search_date=1461654407;
	//echo $search_lat.$search_long.$search_date;
  $request = 'http://api.openweathermap.org/data/2.5/forecast?lat='.$search_lat.'&lon='.$search_long.'&appid=05ec9d3fe88782ad7b55b4d3cf393a2b';
   

    $response  = file_get_contents($request);
    $jsonobj  = json_decode($response,TRUE);
    $timestamp=$jsonobj['list'][4]['dt'];
    $now = new DateTime();

   
    if(($search_date-$now->getTimestamp())/(60*60*24) >5)
    {
    	$error_msg="err: Date too far away";//error
      $jsnresponse=json_encode($error_msg);
      echo $jsnresponse;
    }
    else if(($search_date-$now->getTimestamp())/(60*60*24) <-1)
    {
    	$error_msg2="err: Date already passed";//error
      $jsnresponse=json_encode($error_msg2);
      echo $jsnresponse;
    }
    else{
	//echo gmdate("Y-m-d\	T H:i:s\ ", $timestamp)."diferenta ".($search_date-$now->getTimestamp())/(60*60*24)."<br/>";

    $tosend_temp = $jsonobj['list'][4]['main']['temp'];
    $cityname=$jsonobj['city']['name'];
    $tosend_humidity = $jsonobj['list'][3]['main']['humidity'];
    $tosend_conditions = $jsonobj['list'][3]['weather'][0]['description'];
    $tosend_wind = $jsonobj['list'][3]['wind']['speed'];
    $tosend_temp=$tosend_temp-273;

    switch($tosend_conditions){
    case "clear sky": $img_url="http://openweathermap.org/img/w/01d.png";break;
     case "few clouds": $img_url="http://openweathermap.org/img/w/02d.png";break;
      case "scattered clouds": $img_url="http://openweathermap.org/img/w/03d.png";break;
       case "broken clouds": $img_url="http://openweathermap.org/img/w/04d.png";break;
        case "shower rain": $img_url="http://openweathermap.org/img/w/09d.png";break;
         case "rain": $img_url="http://openweathermap.org/img/w/10d.png";break;
          case "thunderstorm": $img_url="http://openweathermap.org/img/w/11d.png";break;
           case "snow": $img_url="http://openweathermap.org/img/w/13d.png";break;
           default: $img_url="http://openweathermap.org/img/w/50d.png";break; //mist
                             }
                             $tosend_temp=floor($tosend_temp);
       $responseobj=array('temperature'=>$tosend_temp,'humidity'=>$tosend_humidity,'wind'=>$tosend_wind,'url'=>$img_url);
       $jsnresponse=json_encode($responseobj);

       echo $jsnresponse;
  
		}
    $data = "[WEATHER] ".date('d/m/Y H:i:s')." Request: ".$search_lat." ".$search_long." ".$search_date." Response: ".$jsnresponse." \n";
    $ret = file_put_contents('log.txt', $data, FILE_APPEND | LOCK_EX);
?>