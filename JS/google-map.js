var station_click;
var stations;
var Map = {
	api : 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=d501d6cc9781bdc6125f708aa04a3620a1608c63',
	reservationPanel: $('.booking'),
	stationName: $('.station-name'),
	stationAddress: $('.station-address'),
	availableBikes: $('.available-bikes'),
	infoStationPanel: $('.station'),
	reservationButton: $('.booking-button'),
	submitButton: $('#submit'),
	currentReservMessage: $('.footer-text'),
	cancelReservation: $('.cancel'),
	timerText: $('.timer-text'),
	x:null,
	init: function(){
		Map.map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 45.7579341,
				lng: 4.8419855
			},
			styles: [
				{
					'featureType': 'poi',
					'elementType': 'labels',
					'stylers': [
						{'visibility':'off'}
					]
				}
			],
			zoom:12,
		});
	},
	hideCountDownPanel: function () {
		Map.timerText.hide();
		Map.cancelReservation.hide();
	},
	hideInfosStation: function () {
		Map.reservationPanel.fadeOut();
		Map.stationName.hide();
		Map.stationAddress.hide();
		Map.availableBikes.hide();
	},
	countDown: function() {
		var finishDate = new Date().getTime() + 1200000;
		Map.x = setInterval(function() {
			var now = new Date().getTime();

			var temps = finishDate - now;

			var minutes = Math.floor((temps % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((temps % (1000 * 60)) / 1000);

			Map.timerText.fadeIn();
			Map.timerText.text(minutes + 'm ' + seconds + 's ');
			sessionStorage.expiration =Date.now() + 1200000;
			if (temps < 0) {
				clearInterval(Map.x);
				Map.currentReservMessage.text('Votre réservation a expiré');
				Map.timerText.text('');
			}
		}, 1000);
	},
	ShowMarkersCluster: function (map,markers){
		var markerCluster = new MarkerClusterer(this.map, markers, {imagePath: 'img/m/m',});
	},
	ShowMarkers:function(){
		ajaxGet(Map.api, function(answer){
			var veliv= JSON.parse(answer);
			stations=veliv;
			console.log(stations);
			var icon = function (stations){
				var imgs='';
				var stationMoitier=stations.bike_stands/2;
				var stationQuart=stations.bike_stands/4;
				if (stations.available_bikes === 0 ) {
					imgs = 'img/velib/station-0.png';
				} else if(stations.available_bikes === stations.bike_stands){
					imgs = 'img/velib/station-100.png';
				}else if(stations.available_bikes ===  stationQuart){
					imgs='img/velib/station-25.png';
				}else if(stations.available_bikes === stationMoitier){
					imgs='img/velib/station-50.png';
				}else{
					imgs='img/velib/station-25.png';
				}
				return imgs;
			};
			this.markers = [ ];
			veliv.forEach(function(stations) {
				var marker = new google.maps.Marker({
					position: stations.position,
					map:Map.map,
					icon:icon(stations),
					title:stations.name,
					id:stations.number,
				});
				this.markers.push(marker);
				marker.addListener('click', function () {
					Map.hideInfosStation();
					var url ='https://api.jcdecaux.com/vls/v1/stations/'+marker.id+'?contract=Lyon&apiKey=d501d6cc9781bdc6125f708aa04a3620a1608c63';
					ajaxGet(url,function(answerstation){
						var infostation=JSON.parse(answerstation);
						station_click = infostation;
						console.log(station_click);
						console.log(station_click.name);
						if(station_click.available_bikes === 0 ){
							Map.reservationButton.css('display','none');
						}else{
							Map.reservationButton.css('display','block');
						}
						Map.stationName.text(station_click.name);
						Map.stationAddress.text('Adresse : ' + station_click.address);
						Map.availableBikes.text('Vélib(s) disponible(s) : ' + station_click.available_bikes);
						Map.stationName.fadeIn('slow');
						Map.stationAddress.fadeIn('slow');
						Map.availableBikes.fadeIn('slow');
					});
				});
			});
			Map.ShowMarkersCluster(map, markers);
		});  /*fin de ShowMarkers*/
	},
};

Map.reservationButton.click(function () {
	if (station_click.available_bikes > 0) {
		Map.reservationPanel.css('display', 'block');
		Map.reservationButton.css('display','block');
		Map.availableBikes.text('Il y a ' + station_click.available_bikes + ' vélib(s) disponible(s) à réserver !');
	}
	$('html, body').animate({
		scrollTop: Map.reservationPanel.offset().top},
	'slow'
	);
});

Map.submitButton.click(function () {
	sessionStorage.setItem('name', station_click.name);
	Map.reservationPanel.css('display', 'none');
	Map.reservationButton.css('display', 'none');
	Map.availableBikes.text('Vous avez réservé 1 vélib à cette station');
	Map.currentReservMessage.text('Vous avez réservé 1 vélib à la station ' + sessionStorage.name + ' pour ');
	Map.cancelReservation.show();
	clearInterval(Map.x);
	Map.countDown();
});

window.addEventListener('load',function(){
	var stations = sessionStorage.getItem('name');
	if(typeof( sessionStorage.name) == 'undefined'){
		console.log(stations);
		Map.currentReservMessage.text('Aucune reservations en cours');
	}else{
		console.log(stations);
		Map.availableBikes.text('Vous avez réservé 1 vélib à cette station');
		Map.currentReservMessage.text('Vous avez réservé 1 vélib à la station ' + sessionStorage.name + ' pour ');
		Map.x = setInterval(function(){
			var minutes_left = Math.floor((sessionStorage.expiration - Date.now())/60000);
			var seconds_left = Math.floor(((sessionStorage.expiration - Date.now())%60000)/1000);
			Map.timerText.fadeIn();
			Map.timerText.text(minutes_left + 'm ' + seconds_left + 's ');
			if (minutes_left && seconds_left < 0) {
				clearInterval(Map.x);
				Map.currentReservMessage.text('Votre réservation a expiré');
				sessionStorage.removeItem('expiration');
				sessionStorage.removeItem('name');
				Map.timerText.text('');
			}
		},1000);
	}
	Map.cancelReservation.click(function () {
		clearInterval(Map.x);
		sessionStorage.removeItem('expiration');
		sessionStorage.removeItem('name');
		Map.currentReservMessage.text('');
		Map.availableBikes.text('');
		Map.timerText.text('Réservation annulée');
		Map.cancelReservation.hide();
		Map.reservationPanel.hide();
	});
});


var GoogleMap = Object.create(Map);
GoogleMap.init();
GoogleMap.ShowMarkers();
GoogleMap.ShowMarkersCluster();
