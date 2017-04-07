// JavaScript code for the Arduino Beacon example app.

// Application object.
var app = {}

//Favorites
app.favorites = [];

//Art info
app.artInfo = { Patrick : {name: 'Patrick Demarchelier', info: 'something', imgFile: 'photos/Patrick1.png'},
				Nilsson : {name: 'Lennart Nilsson', info: 'Delar ur utställningen Ett Barn Blir Till', imgFile: 'photos/Nilsson1.png'},
				Cooper : {name: 'Cooper and Gorfer', info: 'I Know Not These My Hands', imgFile: 'photos/Cooper1.png'}
				};

//Start page on page-home (introduction)
var state = 1;




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
function loadFavorites(){
	//Get favorite div and erease old items
	var page = document.getElementById('favoritesDiv');
	$('#favoritesDiv').empty();

	//Go through favorites list and create div for each item
	for(i=0; i<app.favorites.length; i++){

		(function(){
			var artist = app.favorites[i]; 

			var favoDiv = document.createElement('div');
			favoDiv.className = 'favoDiv';
			//varför funkar inte denna?? pga ingen closure.. 
			favoDiv.addEventListener("click", function(){app.gotoPage(artist)});  

			var textDiv = document.createElement('div');
			textDiv.className = 'textDiv';
			textDiv.innerHTML = '<h2>' + app.artInfo[artist].name + '</h2>';

			var img = document.createElement("img");
			img.src = app.artInfo[artist].imgFile;
			img.className = 'miniImg';

			page.appendChild(favoDiv);
			favoDiv.appendChild(img);
			favoDiv.appendChild(textDiv);
		}()); 
	}
}



function makeComment(num) {
	var textValue = "myText" + num;

    var x = document.getElementById(textValue).value;
    document.getElementById(textValue).value = '';

    var comment = document.createElement('div');  
    comment.className = 'comment';
  
    comment.innerHTML = x; 

    comDiv = "comments" + num;
    document.getElementById(comDiv).appendChild(comment);
}




 function addFavorite(){
 	var evoURL = 'http://eu-central-1-deploy.evothings.com/hyper/b63088ad-7212-42c8-a944-6fc3c131d424/eee3d642-8410-4712-9fcd-01f92fd2ba8f'

 	//Change icon
 	if(this.src == evoURL + '/icons/favorites-icon.png'){
 		console.log('bli filled')
 		this.src = 'icons/favorites-icon-filled.png';
 	}
 
 	else{this.src = 'icons/favorites-icon.png'}


 	//Check if already in favorites
 	var index = app.favorites.indexOf(app.currentPage);

 	//if so remove
 	if (index > -1) {app.favorites.splice(index, 1);}

	//Else add
	else{app.favorites.push(app.currentPage);}
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



// Interaction
document.getElementById("home").addEventListener("click", goHome);
document.getElementById("explore").addEventListener("click", goExplore);
document.getElementById("favorites").addEventListener("click", goFavorites);
var favoriteButtons = document.getElementsByClassName("addFavorite");

for (var i = 0; i < favoriteButtons.length; i++) {
    favoriteButtons[i].addEventListener("click", addFavorite);
}



// Set up the application.
app.initialize()
