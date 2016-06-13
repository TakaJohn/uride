$(".mapdirection").show();
var lat = <?php echo $emergency['latitude'];?>;
var lng = <?php echo $emergency['longitude'];?>;
var clientPostion = new google.maps.LatLng(lat, lng);
var marker;
var map;

//var W = ($(window).width()*0.56), H = $(window).height();
var W = $("#widget-content").width(), H = $(window).height();
$('#mapit').width(W+"px").height(H+"px");

if (typeof google === 'object' && typeof google.maps === 'object') {
	initialize();
} else {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyB_fADxdJI_0SSF1J7NVAOWilHUBb-6uCc&sensor=false&callback=initialize";
	document.body.appendChild(script);
}

function initialize() {
    var mapOptions = {
      center: clientPostion,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var map = new google.maps.Map(document.getElementById("mapit"), mapOptions);
    
    marker = new google.maps.Marker({
    	map:map,
    	draggable:true,
    	animation: google.maps.Animation.DROP,
    	position: clientPostion
	});
	marker.setAnimation(google.maps.Animation.BOUNCE);    
}

function toggleBounce() {
	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}    
//google.maps.event.addDomListener(window, 'load', initialize);
//initialize();