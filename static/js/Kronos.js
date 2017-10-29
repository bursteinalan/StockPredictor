var KRONOS = {
	logger : null
};

var seriesData=[]
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
    KRONOS.getStats(ids);
	$.post("/getDataSet", {
		stockTicker : ids 		
 	}).done(function(response) {
		// console.dir("Server returned: " + response);
        response=JSON.parse(response)
        // console.dir(response)
        seriesData=[]
        seriesOptions = {
            name: ids,
            data: response
        };
        seriesData.push(seriesOptions)
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.createChart();
        KRONOS.showSettings();
        
        window.scrollTo(0,document.body.scrollHeight);
		
	}).fail(function() {
		console.log("failed to return results");
	});

	// KRONOS.makeChart()
}
KRONOS.overlayIndices=function(){
    $.post("/marketData").done(function(response) {
        // console.dir("Server returned: " + response);
        response=JSON.parse(response)
        // console.dir(response)
        SP=response[0]
        NASD=response[1]
        console.log(response)
        seriesOptions = {
            name: 'S&P',
            data: SP
        }
        seriesData.push(seriesOptions)

        seriesOptions = {
            name: 'NASDAQ',
            data: NASD
        }
        seriesData.push(seriesOptions)
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.createChart();
        KRONOS.showSettings();
        
        window.scrollTo(0,document.body.scrollHeight);
        
    }).fail(function() {
        console.log("failed to return results");
    });
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
                showInNavigator: true,
                turboThreshold: 0,
                compare: 'percent'
            }
        },

        tooltip: {
            // pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}<br/>',
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        legend: {
        enabled: true
        // align: 'right',
        // backgroundColor: '#FCFFC5',
        // borderColor: 'black',
        // borderWidth: 2,
        // layout: 'vertical',
        // verticalAlign: 'top',
        // y: 100,
        // shadow: true
    },

        series: seriesData
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
            // console.log(JSON.stringify(seriesOptions))
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
KRONOS.getStats=function(ids){
    console.log('Getting Stats')
    $.post("/getStat", {
        stockTicker : ids       
    }).done(function(response) {
        // console.dir("Server returned: " + response);
        data=JSON.parse(response)
        table=$("#customers")
        resultsTableBody = table.find("tbody");

        table.find("thead").remove();
        $("#customers" + " tr:has(td)").remove();
        // console.dir(response)
        for(label in data ){
            resultsTableBody.append($('<tr/>').append(
                $('<td/>').append($("<span/>").text(label)))
        
        .append(
                $('<td/>').append($("<span/>").text(data[label]))))
    }
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.createChart();
        KRONOS.showStats();
        
        window.scrollTo(0,document.body.scrollHeight);
        
    }).fail(function() {
        console.log("failed to return results");
    });
    
}
KRONOS.showSettings=function(){
	// $("#settings").css("display", "block");
	$("#settings").fadeIn("slow");
}
KRONOS.showStats=function(){
    // $("#settings").css("display", "block");
    $("#stats").fadeIn("slow");
}


