// Create an empty sensor object as a global 
var sensor = {};

// Where the sensor data is stored
var mSensorDataURL = 'http://backup.evothings.com:8082/output/';

// A subscriber's key (Five other keys also availble at http://smartspaces.r1.kth.se:8082)
sensor.key = "J3Wgj9qegGFX4r9KlxxGfaeMXQB";

// A bitmap image describing where the sensor is located
sensor.image = "https://evothings.com/demos/dome_pics/IMG_1758.JPG";

//For line chart
google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);


// Function to retrieve data, placing it in a "response" object
function getJSON() 
    {
    if (window.cordova) 
        {
            console.log('Using Apache Cordova HTTP GET function');
            cordovaHTTP.get(
                mSensorDataURL + sensor.key + '.json?gt[timestamp]=now-1day&page=1&limit=100',
                function (response) 
                    {
                        if (response) 
                            {
                                sensor.data = JSON.parse(response.data)[0];
                                sensor.fullData = JSON.parse(response.data);
                                printData();
;                            }
                    },
                function (error) 
                    {
                    console.log(JSON.stringify(error));
                    });
        }    
    else 
        {
            console.log('Not using Cordova, fallback to AJAX via jquery');
            $.ajax({
                    url: mSensorDataURL + sensor.key + ".json?gt[timestamp]=now-1day&page=1&limit=100",
                    jsonp: "callback",
                    cache: true,
                    dataType: "jsonp",
                    data: 
                        {
                            page: 1
                        },
                    success: function(response) 
                        {
                            if (response && response[0]) 
                                {
                                    sensor.data = response[0];
                                    sensor.fullData = response;
                                    printData();
                                    // drawChart();
                                }
                        }
                });
        }
}


function printData()   
    {
        // console.log(sensor) 

        if (sensor && sensor.data) 
            {
            // Display the info.
                html = '<h1>Sensor Data</h1>'
                 + '<br /><div id="time">Time  ' + sensor.data.timestamp + '</div>'
                 + '<div id="hum">Humidity ' + sensor.data.h + ' % (rel)</div>'
                 + '<div id="temp">Temperature ' + sensor.data.t + ' celcius</div>'
                 // + '<img style="width:100%" src="' + sensor.image + '" />'
            } 
    else 
            {
                html = '<h1>Sensor Data</h1>'
                 + '<br />Sorry, sensor data not available right now :(</br>'
                 + '<img src="' + sensor.image + '" />'
            }
    document.getElementById("printHere").innerHTML= html;
    }






function drawChart() {
    //Create data aray for temp
    var tableForChart = [['Date', 'Temp']];

    for (i=0; i<sensor.fullData.length; i++){
        tableForChart.push([new Date(sensor.fullData[i].timestamp), parseFloat(sensor.fullData[i].t)])
    }


    var data = google.visualization.arrayToDataTable(tableForChart);

    var options = {
      title: 'Temperature',
      curveType: 'function',
      legend: { position: 'bottom' },
      explorer: {axis: 'horizontal', keepInBounds: true}

    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}


getJSON();