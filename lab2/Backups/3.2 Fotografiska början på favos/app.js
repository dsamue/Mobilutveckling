// JavaScript code for the Arduino Beacon example app.

// Application object.
var app = {}

//Favorites
app.favorites = [];

//art info
app.artInfo = { Patrick : {name: 'Patrick Demarchelier', info: 'something', imgFile: 'photos/Patrick1.png'},
				Nilsson : {name: 'Lennart Nilsson', info: 'Delar ur utställningen Ett Barn Blir Till', imgFile: 'photos/Nilsson1.png'},
				Cooper : {name: 'Cooper and Gorfer', info: 'I Know Not These My Hands', imgFile: 'photos/Cooper1.png'}
				};

//Start page on page-home (introduction)
var state = 1;


//slänga?
app.myVar = 0;


// Regions that define which page to show for each beacon.
app.beaconRegions =
[
	{
		id: 'Nilsson',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major: 46146,
		minor: 34612
	},
	{
		id: 'Cooper',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D', 
		major: 57356,
		minor: 14220
	},
	{ 
		id: 'Patrick',
		uuid:'B9407F30-F5F8-466E-AFF9-25556B57FE6D',
		major: 22296,
		minor: 48975
	}
]

// Currently displayed page.
app.currentPage = 'page-home'

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
	app.gotoPage(app.currentPage)
}

// Called when Cordova are plugins initialised,
// the iBeacon API is now available.
app.onDeviceReady = function()
{
	// Specify a shortcut for the location manager that
	// has the iBeacon functions.
	window.locationManager = cordova.plugins.locationManager

	// Start tracking beacons!
	app.startScanForBeacons()
}

app.startScanForBeacons = function()
{
	//console.log('startScanForBeacons')

	// The delegate object contains iBeacon callback functions.
	var delegate = new cordova.plugins.locationManager.Delegate()

	delegate.didDetermineStateForRegion = function(pluginResult)
	{
		//console.log('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
	}

	delegate.didStartMonitoringForRegion = function(pluginResult)
	{
		//console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
	}

	delegate.didRangeBeaconsInRegion = function(pluginResult)
	{
		//console.log('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
		app.didRangeBeaconsInRegion(pluginResult)
	}

	// Set the delegate object to use.
	locationManager.setDelegate(delegate)

	// Start monitoring and ranging our beacons.
	for (var r in app.beaconRegions)
	{
		var region = app.beaconRegions[r]

		var beaconRegion = new locationManager.BeaconRegion(
			region.id, region.uuid, region.major, region.minor)

		// Start monitoring.
		locationManager.startMonitoringForRegion(beaconRegion)
			.fail(console.error)
			.done()

		// Start ranging.
		locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail(console.error)
			.done()
	}
}

// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function(pluginResult)
{
	//console.log('numbeacons in region: ' + pluginResult.beacons.length)

	// There must be a beacon within range.
	if (0 == pluginResult.beacons.length)
	{
		return 
	}
	// console.log(pluginResult.beacons.length)
	// Our regions are defined so that there is one beacon per region.
	// Get the first (and only) beacon in range in the region.
	var beacon = pluginResult.beacons[0]

	// The region identifier is the page id.
	var pageId = pluginResult.region.identifier
	// console.log(pageId);

	//console.log('ranged beacon: ' + pageId + ' ' + beacon.proximity)
	//Go to first page
	if(state == 1){
		// gotoPage('page-home')
		return
	}

	//Go to favorites
	if(state == 3){
		// gotoPage('page-favorites')
		return
	}


	// If the beacon is close and represents a new page, then show the page.
	if ((beacon.proximity == 'ProximityImmediate' || beacon.proximity == 'ProximityNear')
		&& app.currentPage == 'page-default')
	{
		//här vill jag ha in något nytt
		// app.reorder(pluginResult) 
		app.gotoPage(pageId)  
		return
	}

	// If the beacon represents the current page but is far away,
	// then show the default page.
	if (beacon.proximity == 'ProximityFar' && app.currentPage == pageId)
	{
		app.gotoPage('page-default')
		return
	}
}
 
app.gotoPage = function(pageId)
{
	app.hidePage(app.currentPage)
	app.showPage(pageId)
	app.currentPage = pageId
}

app.showPage = function(pageId)
{
	document.getElementById(pageId).style.display = 'block'
}

app.hidePage = function(pageId)
{
	document.getElementById(pageId).style.display = 'none'
}

//My functions
app.reorder = function(pluginResult) 
{	

	console.log(app.beaconRegions[0].major);
	// Clear beacon list.
	$('#image-grid-2').empty();

	app.myVar++; 
	hyper.log('in reorder');


	var div = document.createElement("div");
	div.style.width = "100px";
	div.style.height = "100px";
	div.style.background = "red";
 	div.style.color = "white";
	div.innerHTML = app.myVar;

	// var div2 = document.createElement("div");
	// div.style.marginLeft = '100px';
	// div.style.width = "100px";
	// div.style.height = "100px";
	// div.style.background = "yellow";
	// div.style.color = "white";
	// div.innerHTML = pluginResult.beacons.length;

	var test = document.createElement('p');
	test.innerHTML = pluginResult.beacons.length;

	document.getElementById("image-grid-2").appendChild(div);
	//document.getElementById("image-grid-2").appendChild(div2);
	document.getElementById("image-grid-2").appendChild(test);

	//ok, kan fortsätta kolla i ibeacon-scan appen om hur jag gör ett element för varje beacon. 
	//Får se om jag har en lista av beacons att jobba med i denna template eller om jag måste sno från andra exemplet.

}

function loadFavorites(){
	var page = document.getElementById('favoritesDiv');
	$('#favoritesDiv').empty();

	console.log('in loading');
	for(i=0; i<app.favorites.length; i++){

		var artist = app.favorites[i]; 

		var favoDiv = document.createElement('div');
		favoDiv.className = 'favoDiv';
		favoDiv.addEventListener("click", function(){app.gotoPage('Nilsson')}); 

		var textDiv = document.createElement('div');
		textDiv.className = 'textDiv';
		textDiv.innerHTML = '<h2>' + app.artInfo[artist].name + '</h2>';
		// textDiv.innerHTML = '<h2>' + app.artInfo[artist].name + '</h2></br><h3>' + app.artInfo[artist].info + '<h3>';

		var img = document.createElement("img");
		img.src = app.artInfo[artist].imgFile;
		img.className = 'miniImg';

		page.appendChild(favoDiv);
		favoDiv.appendChild(img);
		favoDiv.appendChild(textDiv);
	}
}




function myFunction(num) {
	var textValue = "myText" + num;
	// console.log(textValue);
	// console.log('hej');

    var x = document.getElementById(textValue).value;
    document.getElementById(textValue).value = '';

    var comment = document.createElement('div');  
    comment.className = 'comment';

 //    	var test = document.createElement('p');
	// test.innerHTML = 'test';
  
    comment.innerHTML = x; 

    comDiv = "comments" + num;
    document.getElementById(comDiv).appendChild(comment);

 //    var obj = {comment: x, date: "unknown"};
	// saveText( JSON.stringify(obj), "filename.json" );
}

// function saveText(text, filename){
//   var a = document.createElement('a');
//   a.setAttribute('href', 'data:text/plain;charset=utf-u,'+encodeURIComponent(text));
//   a.setAttribute('download', filename);
//   a.click()
// }


//
// Interaction

document.getElementById("home").addEventListener("click", goHome);
document.getElementById("explore").addEventListener("click", goExplore);
document.getElementById("favorites").addEventListener("click", goFavorites);
var favoriteButtons = document.getElementsByClassName("addFavorite");

for (var i = 0; i < favoriteButtons.length; i++) {
    favoriteButtons[i].addEventListener("click", addFavorite);
}


 
function goHome(){
 	state = 1; 
 	app.gotoPage("page-home");
 }

 function goExplore(){
 	state = 2; 
 	app.gotoPage("page-default");
 }

 function goFavorites(){
 	state = 3; 
 	loadFavorites();
 	app.gotoPage("page-favorites");

 }

 function addFavorite(){

 	//Check if already in favorites
 	var index = app.favorites.indexOf(app.currentPage);

 	//if so remove
 	if (index > -1) {app.favorites.splice(index, 1);}

	//Else add
	else{app.favorites.push(app.currentPage);}
 }

// Set up the application.
app.initialize()
