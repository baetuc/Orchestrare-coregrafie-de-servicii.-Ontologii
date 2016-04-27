var myLong = 27.59832;
var myLat = 47.15958;

var doThisNow=0;

function newsClicked(){
	$.ajax({url:"simulare/news.json", success:function(result){
		var data=JSON.parse(result);
				
		fillNews(data);

		$('#newsButton').trigger();
	}});
}

function showCalendarDays(data){
	$(data.calendar).each(function(index,element){
		var normalTime = new Date(0); 
		normalTime.setUTCSeconds(element.start);
		alert("start on"+normalTime);

		normalTime.setUTCSeconds(element.end);
		alert("ending at "+normalTime);
	});
}

function fillWeatherElement(data){
	var index=1;
	$(data.weather).each(function(index,element){
					$('#swipeme-left').find(".centerAndColor").append('<div>'+'<h3>Temperatura: '+element.temperature+'</h3>'+
					'<img id="weatherPic'+index+'" src="'+element.urlImage+'" alt="" style="width:270px;height:228px;">'+
					'<div>'+'Umiditate:' +element.humidity+
					'<div>'+'Vanturi:' +element.wind+
					'</div>');
					$("#weatherPic"+index.toString()).error(function(){
						if(element.temperature>25)
							$(this).attr('src', './assets/images/sunny.png');
						else
							$(this).attr('src', './assets/images/cloudy.png');
			index=index+1;
		});
	});
}
function showHealth(infos){
	var healthTip = "";
	$(infos.health).each(function(index,element){ 
		healthTip=healthTip+element+'\n\n';});
	alert(healthTip);
}

function setCurrentLocation(){
	$.ajax({url:"simulare/currentLocation.json", success:function(result){
			var data=JSON.parse(result);
			$(data.location).each(function(index,element){
				myLat=element.latitude;
				myLong=element.longitude;
			});
		}});
}

function fillNews(data){
	$('#myPanel').empty();
	$(data.news).each(function(index,element){
		var normalTime = new Date(0); 
		normalTime.setUTCSeconds(element.date);
		
		$('#myPanel').append('<div id="newsContent">'+
		'<h2>'+element.title+'</h2>'+
		'<p style="fontSize:10px">'+element.intro+'</p>'+
		'<a href="'+element.url+'">'+element.url+'</a>'+
		'<p>'+normalTime+'</p>'+
		'</div>');
	});
}
function fillPins(data){
	  var myLatLng = {lat: myLat, lng: myLong};
		  
	  var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: myLatLng
	  });

	$(data.POI).each(function(index,element){
	  var latAsNumber=parseFloat(element.latitude);
	  var longAsNumber=parseFloat(element.longitude);

	  var myLatLng = {lat: latAsNumber, lng: longAsNumber};

	  var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: ''
	  });
	});
}

$(document).ready(function(){
	setCurrentLocation();
	
	//calendar button
	$('#swipeRight').click(function(){
		//$('#swipeme-right').find(".centerAndColor").empty();
		$.ajax({url:"simulare/calendar.json", success:function(result){
			var data=JSON.parse(result);
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass!=="main" || doThisNow===1){
				doThisNow=0;
				showCalendarDays(data);
				//$( "#swipeRight" ).trigger( "click" );
			}			
		}});	
	});


	//health and weather from location
	$('#HnW').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/weatherAndHealth.json", success:function(result){
			var data=JSON.parse(result);
						
			showHealth(data);
			fillWeatherElement(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main")
				$( "#swipeLeft" ).trigger( "click" );
		}});		
	});	
	//news and weather from location
	$('#NnW').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/newsAndWeather.json", success:function(result){
			var data=JSON.parse(result);
			
			fillWeatherElement(data);
			fillNews(data);
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});	
	//everything from location
	$('#EfL').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/everythingFromLocation.json", success:function(result){
			var data=JSON.parse(result);
			
			showHealth(data);
			fillWeatherElement(data);
			fillNews(data);
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});	
	//P.O.I and health
	$('#PnH').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/POIandHealth.json", success:function(result){
			var data=JSON.parse(result);
			
			showHealth(data);
			fillPins(data);
		}});		
	});	
	//P.O.I and news
	$('#PnN').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/POIandNews.json", success:function(result){
			var data=JSON.parse(result);
			
			fillNews(data);
			fillPins(data);
			
			doThisNow=1;
			document.getElementById("newsButton").click();

			var checkClass = $('#swipeme').attr("class");
			if(checkClass!=="main"){
				$( "#swipeLeft" ).trigger( "click" );
			}
		}});		
	});	
	//P.O.I and weather
	$('#PnW').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/POIandWeather.json", success:function(result){
			var data=JSON.parse(result);
			
			fillWeatherElement(data);
			fillPins(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main")
				$( "#swipeLeft" ).trigger( "click" );
		}});		
	});	
	//P.O.I and news and weather
	$('#PnNnW').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/POIandNewsandWeather.json", success:function(result){
			var data=JSON.parse(result);
			
			fillWeatherElement(data);
			fillNews(data);
			fillPins(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});
	//P.O.I and everything else
	$('#PnAll').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/POIandAll.json", success:function(result){
			var data=JSON.parse(result);
			
			showHealth(data);
			fillWeatherElement(data);
			fillNews(data);
			fillPins(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});	
	//health and weather from current location
	$('#HnWC').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/weatherAndHealth.json", success:function(result){
			var data=JSON.parse(result);
						
			showHealth(data);
			fillWeatherElement(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main")
				$( "#swipeLeft" ).trigger( "click" );
		}});		
	});	
	//news and weather from current location
	$('#NnWC').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/newsAndWeather.json", success:function(result){
			var data=JSON.parse(result);
			
			fillWeatherElement(data);
			fillNews(data);
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});	
	//everything from location
	$('#EfCL').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:"simulare/everythingFromLocation.json", success:function(result){
			var data=JSON.parse(result);
			
			showHealth(data);
			fillWeatherElement(data);
			fillNews(data);
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});	
});
