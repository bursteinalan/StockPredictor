var KRONOS = {
	logger : null
};


var seriesOptions = [],
    seriesCounter = 0,
    names = ['MSFT', 'AAPL', 'GOOG'];

KRONOS.documentReady = function() {
	console.log("Kronos is document ready!");
};


//Post example
KRONOS.test = function(val) {
	//Example of how to send input to server
	$.post("/example", {
		input : "input" 			
 	}).done(function(response) {
		alert("Server returned: " + response);
	}).fail(function() {
		console.log("failed to return results");
	});

};


KRONOS.search=function(){
	var ids=$('#searchIds').val()
    if(ids==''){
        ids='AAPL'
    }
	// console.log(ids)

	$.post("/getDataSet", {
		stockTicker : ids 		
 	}).done(function(response) {
		// console.dir("Server returned: " + response);
        response=JSON.parse(response)
        // console.dir(response)
        seriesOptions = {
            name: ids,
            data: response
        };
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.createChart()
        KRONOS.showSettings();
        window.scrollTo(0,document.body.scrollHeight);
		
	}).fail(function() {
		console.log("failed to return results");
	});

	// KRONOS.makeChart()
}


/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */
KRONOS.createChart=function() {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                showInNavigator: true,
                turboThreshold: 0
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}<br/>',
            valueDecimals: 2,
            split: true
        },

        series: [seriesOptions]
    });
}
KRONOS.makeChart=function(){
	$.each(names, function (i, name) {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',    function (data) {

        seriesOptions[i] = {
            name: name,
            data: data
        };

        // As we're loading the data asynchronously, we don't know what order it will arrive. So
        // we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === names.length) {
            console.log(JSON.stringify(seriesOptions))
            KRONOS.createChart();
            KRONOS.showSettings();
            window.scrollTo(0,document.body.scrollHeight);
        }
    	});
	});
}
KRONOS.showAgg=function(){

}
KRONOS.showAll=function(){

}
KRONOS.showSettings=function(){
	// $("#settings").css("display", "block");
	$("#settings").fadeIn("slow");
}


