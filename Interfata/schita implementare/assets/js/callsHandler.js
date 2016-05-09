var myLong = 27.59832;
var myLat = 47.15958;

var globalIP="http://172.17.254.226:8888";
var calendarMonthOffset = 0;

var doThisNow=0;
var swipeRightBool=0;
var globalEventDate=new Date(Date.now());

function newsClicked(){
	/*$.ajax({url:"simulare/news.json", success:function(result){
		var data=JSON.parse(result);
				
		fillNews(data);

		$('#newsButton').trigger();
	}});*/
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
	if(infos.health.err)
		alert(infos.health.err);
	else{
		$(infos.health).each(function(index,element){ 
			healthTip=healthTip+element+'\n\n';});
		alert(healthTip);
	}
}

function setCurrentLocation(){
	//alert(globalIP+"/?action=getCurrentLocation");
	/*$.ajax({
    type: "GET",
    url: globalIP+"?action=getCurrentLocation",
    dataType: "jsonp",
    success: function(){alert("DA");},
    error: function (xhr, ajaxOptions, thrownError) {
      alert(xhr.status);
      alert(thrownError);
    }
});*/
		
	$.ajax({url:globalIP+"?action=getCurrentLocation", success:function(result){
			var data=result;
			$(data.location).each(function(index,element){
				myLat=element.latitude;
				myLong=element.longitude;
			});
		}});
}

function fillNews(data){
	$('#myPanel').empty();
	if(data.news.err)
		alert(data.news.err);
	else{
		$(data.news).each(function(index,element){
			var normalTime = new Date(0); 
			normalTime.setUTCSeconds(element.date);
			
			$('#myPanel').append('<div id="newsContent">'+
			'<h2>'+element.title+'</h2>'+
			'<p style="fontSize:10px">'+element.intro+'</p>'+
			'<a href="'+element.url+'" target="_blank">'+element.url+'</a>'+
			'<p>'+normalTime+'</p>'+
			'</div>');
		});
	}
}
function fillPins(data){
	if(data.poi.length==0)
		return;
	  //var myLatLng = {lat: myLat, lng: myLong};
	  var myLatLng = {lat: data.poi[0].lat, lng: data.poi[0].long};
		  
	  var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 9,
		center: myLatLng
	  });

	$(data.poi).each(function(index,element){
	  var latAsNumber=parseFloat(element.lat);
	  var longAsNumber=parseFloat(element.long);

	  var myLatLng = {lat: latAsNumber, lng: longAsNumber};

	  var marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: element.name
	  });
	});
}

$(document).ready(function(){
	setCurrentLocation();
	
	//calendar button
	/*$('#swipeRight').click(function(){
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
	});*/


	//health and weather from location
	$('#HnW').click(function(){	
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url: globalIP+"/?action=getHealthAdvicesAndWeatherFromCalendar&date="+globalEventDate.getTime().toString(), success:function(result){
			var data=result;
						
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
		$.ajax({url:globalIP+"/?action=getNewsAndWeatherFromCalendar&date="+globalEventDate.getTime().toString(), success:function(result){
			var data=result;
			
			fillWeatherElement(data);
			fillNews(data);
			
			var checkIt = $('#myPanel').attr("class");
			if(checkIt.indexOf("open")==-1)
				document.getElementById("newsButton").click();

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
			}
		}});		
	});	
	//everything from location
	$('#EfL').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:globalIP+"/?action=getAllFromCalendar&date="+globalEventDate.getTime().toString(), success:function(result){
			var data=result;
			
			showHealth(data);
			fillWeatherElement(data);
			fillNews(data);
			
			var checkIt = $('#myPanel').attr("class");
			if(checkIt.indexOf("open")==-1)
				document.getElementById("newsButton").click();
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
			}
		}});		
	});	
	//P.O.I and health
	$('#PnH').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url: globalIP+"/?action=getPOIAndHealthAdvicesFromCalendarLocation&date="+globalEventDate.getTime().toString(), success:function(result){
			var data=result;
			
			showHealth(data);
			fillPins(data);
		}});		
	});	
	//P.O.I and news
	$('#PnN').click(function(){
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url: globalIP+"/?action=getPOIAndNewsFromCalendarLocation&date="+globalEventDate.getTime().toString(), success:function(result){
			var data=result;
			
			fillNews(data);
			fillPins(data);
			
			doThisNow=1;
			var checkIt = $('#myPanel').attr("class");
			if(checkIt.indexOf("open")==-1)
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
		$.ajax({url: globalIP+"/?action=getPOIAndWeatherFromCalendarLocation&date="+globalEventDate.getTime().toString(), success:function(result){
			var data=result;
			
			fillWeatherElement(data);
			fillPins(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main")
				$( "#swipeLeft" ).trigger( "click" );
		}});		
	});	
	//P.O.I and news and weather
	$('#PnNnW').click(function(){
		setCurrentLocation();
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url: globalIP+"?action=getPoiWeatherNewsBasedOnCurrentLocation", success:function(result){
			var data=result;
			
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
		setCurrentLocation();
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:globalIP+"?action=getAllFromLocation", success:function(result){
			var data=result;
			
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
		setCurrentLocation();
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:globalIP+"/?action=getHealthAdvicesAndWeatherFromLocation", success:function(result){
			var data=result;
						
			showHealth(data);
			fillWeatherElement(data);

			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main")
				$( "#swipeLeft" ).trigger( "click" );
		}});		
	});	
	//news and weather from current location
	$('#NnWC').click(function(){
		setCurrentLocation();
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:globalIP+"/?action=getNewsAndWeatherFromLocation", success:function(result){
			var data=result;
			
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
	/*$('#EfCL').click(function(){
		setCurrentLocation();
		$('#swipeme-left').find(".centerAndColor").empty();
		$.ajax({url:globalIP+"/?action=getAllFromLocation", success:function(result){
			var data=result;
			
			showHealth(data);
			fillWeatherElement(data);
			fillNews(data);
			
			var checkClass = $('#swipeme').attr("class");
			if(checkClass==="main"){
				$( "#swipeLeft" ).trigger( "click" );
				document.getElementById("newsButton").click();
			}
		}});		
	});	*/
	
	$('#swipeRight').click(function(){
		swipeRightBool=0; // 2 luni in urma aicisa. TODO
		$(".responsive-calendar").responsiveCalendar();
		
		var checkClass = $('#swipeme').attr("class");
			if(checkClass!=="main"){
							
				//aici butonul next
				var rightBut= $('.pull-right')[0];
				rightBut.addEventListener('click', function() { 
					calendarMonthOffset=calendarMonthOffset+1; 
					colorCalendarDays();
					//apel color calendar days
					}, false);
				
				//aici butonul prev
				var leftBut= $('.pull-left')[1];
				leftBut.addEventListener('click', function() { 
					//apel color calendar days
					calendarMonthOffset=calendarMonthOffset-1;
					colorCalendarDays();					
				}, false);
				
				if(swipeRightBool==0){
					colorCalendarDays();
					swipeRightBool=1;
				}
				
	}});		
});

function colorCalendarDays(){
	setTimeout( function(){ 
				//parameter of call
				var d = new Date(Date.now());
				d.setMonth(d.getMonth() + calendarMonthOffset);
					//globalIP+"/?action=getMonthEvents&date="+d.getTime().toString() | "simulare/generalEvents.json"
					$.ajax({url: globalIP+"/?action=getMonthEvents&date="+d.getTime().toString(), success:function(result){
					var data=result;					
					
					$(data.events).each(function(index,element){
						var normalTime = new Date(0); 
						normalTime.setUTCMilliseconds(element.date);
					
						var auxDay=normalTime.getDate();						
						var matchingElement = $("a:contains('"+auxDay+"')").filter(function() {return $(this).text() === String(auxDay)}).parent().filter(function(){return $(this).attr("class").indexOf("not-current")==-1})[0];
						
						matchingElement.addEventListener('click', function() { $.ajax({url:globalIP+"/?action=getEventsFromDay&date="+element.date, success:function(result){
																var data=result;
																$('#calendarText').empty();
												
																var auxDate = new Date(0);
																
																$(data.events).each(function(index,element){
																	var choose = confirm("Global location set to event location. Click action containing \"current location\" to set global location to current location");
																	
																	if(choose===true){
																		myLat = element.gpsLocation.latitude;
																		myLong = element.gpsLocation.longitude;
																	}													
																																		
																	auxDate.setUTCMilliseconds(element.start);
																	globalEventDate=auxDate;
																	
																	$('#calendarText').append('<div>'+'<h3>Locatie: '+element.gpsLocation.city+'</h3>'+
																	'<div>'+'Descriere: ' +element.description+'</div>'+
																	'<div>'+'Start la data: ' +auxDate+'</div>'+
																	'</div>');
						})}})	
						}, false);
						
						var classAsString = String(matchingElement.className);
						if(classAsString.indexOf("not-current")==-1){
							matchingElement.className=classAsString+" active";
						}
					});
					}})
				}  , 1000 );
}
