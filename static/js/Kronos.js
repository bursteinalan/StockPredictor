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
	console.log(ids)

	$.post("/getDataSet", {
		stockTicker : ids 		
 	}).done(function(response) {
		alert("Server returned: " + response);
        seriesOptions = {
            name: ids,
            data: response
        };
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
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
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


