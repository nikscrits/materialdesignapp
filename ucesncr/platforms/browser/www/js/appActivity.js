var client;
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

var testMarkerDRed = L.AwesomeMarkers.icon({ 
	icon: 'play',
	markerColor: 'darkred'
	});
	
var testMarkerRed = L.AwesomeMarkers.icon({ 
	icon: 'play',
	markerColor: 'red'
	});
	
var testMarkerGreen = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'darkgreen'
	}); 
 
var testMarkerOrange = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'orange'
	}); 
	
function loadMap() {	// load the tiles
	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',{
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' + 
	'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +
'Imagery © <a href="http://mapbox.com">Mapbox</a>',
id: 'mapbox.streets'
}).addTo(mymap);
}

// create the code to get the Earthquakes data using an XMLHttpRequest
function getEarthquakes() {
	client = new XMLHttpRequest();
	client.open('GET','https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
	client.onreadystatechange = earthquakeResponse; // note don't use earthquakeResponse() with brackets as that doesn't work
	client.send();
}

function earthquakeResponse() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
	}
}
	
// convert the received data - which is text - to JSON format and add it to the map
function loadEarthquakelayer(earthquakedata) {
	alert("Loading Earthquakes");
	
	// convert the text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	
	//load the geoJSON layer using custom icons
	var earthquakelayer = L.geoJson(earthquakejson,
	{
		//use point to layer to create the points
		pointToLayer:function(feature,latlng)
		{
			//look at the GeoJSON file - specifically at the properties - to see the
			//earthquake magnitude and use a different marker depending on this value
			//also include a pop-up that shows the place value of the earthquake
			
			if(feature.properties.mag > 5.00) {
				return L.marker(latlng, {icon:testMarkerDRed}).bindPopup("<b>"+"Place: "+feature.properties.place
				+"<br>"+"Magnitude: "+feature.properties.mag+"</b>");
			}
			else if (feature.properties.mag > 3.00) {
				return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+"Place: "+feature.properties.place
				+"<br>"+"Magnitude: "+feature.properties.mag+"</b>");

			}
			else if (feature.properties.mag > 1.75) {
				return L.marker(latlng, {icon:testMarkerOrange}).bindPopup("<b>"+"Place: "+feature.properties.place
				+"<br>"+"Magnitude: "+feature.properties.mag+"</b>");

			}
			else {
				//magnitude is 1.75 or less
				return L.marker(latlng, {icon:testMarkerGreen}).bindPopup("<b>"+"Place: "+feature.properties.place
				+"<br>"+"Magnitude: "+feature.properties.mag+"</b>");;
			}
		},
	}).addTo(mymap);
	
	mymap.fitBounds(earthquakelayer.getBounds());
}

// make sure that there is a variable for the earthquake layer to be referenced by
// this should be GLOBAL – i.e. not inside a function – so that any code can see the variable
var earthquakelayer;
function removeEarthquakes() {
	alert("Earthquake data will be removed");
	mymap.removeLayer(earthquakelayer);
}


//https://gis.stackexchange.com/questions/182068/getting-current-user-location-automatically-every-x-seconds-to-put-on-leaflet
// placeholders for the L.marker and L.circle representing user's current position and accuracy    
var current_position, current_accuracy;

function onLocationFound(e) {
// if position defined, then remove the existing position marker and accuracy circle from the map
if (current_position) {
    mymap.removeLayer(current_position);
    mymap.removeLayer(current_accuracy);
}

var radius = e.accuracy / 2;

current_position = L.marker(e.latlng).addTo(mymap).bindPopup("You are within " + radius + " meters from this point").openPopup();
current_accuracy = L.circle(e.latlng, radius).addTo(mymap);
}

function trackLocation() {
      mymap.locate({setView: true, maxZoom: 16});
	  var currentlocation = position.coords;
	  alert(currentlocation);
}