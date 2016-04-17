function swipeToLeftAction(){
	$.ajax({url:"simulare/vreme.json", success:function(result){
		var checkClass = $('#swipeme').attr("class");
		if(checkClass!=="main")
			getWeatherJSON(result);
	}});
}
function swipeToRightAction(){
	$.ajax({url:"simulare/calendar.json", success:function(result){
		var checkClass = $('#swipeme').attr("class");
		if(checkClass!=="main")
			getCalendarJSON(result);
	}});
}

//weather json function
function getWeatherJSON(result){
	var data=JSON.parse(result);
			$(data.vreme).each(function(index,element){
				if(String(element.active)!=="false"){
					$('#swipeme-left').append('<div>'+'<h3>'+element.locatie+'</h3>'+
					'<div>Prognoza pe azi, '+element.zi+'/'+element.luna+'/'+element.an+'</div>'+
					'<div>'+'Temperatura:' +element.gradeCelsius+' grade Celsius'+'</div>'+
					'<div>'+'Temperatura:' +element.gradeFahrenheit+' grade Fahrenheit'+'</div>'+
					'</div>');
				}
			});
	alert("Zambeste! Esti perfect sanatos!")
}
function getCalendarJSON(result){
	var data=JSON.parse(result);
		$(data.calendar).each(function(index,element){
					if(String(element.active)!=="false"){
						$('#swipeme-right').append('<div>'+'<h3>'+element.nume+'</h3>'+
						'<div style="backgroundColor:Color.red">'+'Exclusiv, doar la ' +element.locatie+' , ora '+element.ora+' pretul biletului '+element.pret+'</div>'+
						'<div>'+element.descriere+'</div>'+
						'<div>Organizator '+element.organizator+'</div>'+
						'</div>');
					}
				});
}

function getNews(){
	$.ajax({url:"simulare/news.json", success:function(result){
		//var checkClass = $('#swipeme').attr("class");
		//if(checkClass!=="main")
		getCalendarJSON(result);
		var data=JSON.parse(result);
		
		$('#leContain p').remove();
		$(data.results).each(function(index,element){
						$('#leContain').append('<a href="'+element.unescapedUrl+'">'+element.title+'</a>'+
						'<div>'+element.content+'</div>'+
						/*'<div style="backgroundColor:Color.red">'+'Exclusiv, doar la ' +element.locatie+' , ora '+element.ora+' pretul biletului '+element.pret+'</div>'+
						'<div>'+element.descriere+'</div>'+
						'<div>Organizator '+element.organizator+'</div>'+*/
						'</div><br/>');
				});
	}});
}