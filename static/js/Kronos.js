var KRONOS = {
	logger : null
};

var ids
var seriesData=[]
var currentValue
var originalSearch={}
var seriesOptions = [],
    seriesCounter = 0,

    names = ['MSFT', 'AAPL', 'GOOG'];

KRONOS.documentReady = function() {
    $("#searchIds").keyup(function (e) {
        if (e.which == 13) {
           $("#searchButton").click();
        }
     });



	console.log("Kronos is document ready!");
    $("html, body").animate({ scrollTop: 0 }, "slow");
};

KRONOS.runLoader=function(){

var data1 = []
var data2 = []
var data3 = []

for(i=0; i < 15; i++){
  data1[i] = Math.floor(Math.random() * 30 + 20 + i);
  data2[i] = Math.floor(Math.random() * 20 + 10 + i*3);
  data3[i] = Math.floor(Math.random() * 40 + 30 + i*2);
}

var chart = new CanvasJS.Chart("loader", {
  animationEnabled: true,
  theme: "light2",
  backgroundColor: "#00171f",
  animationDuration: 3000,
  axisY:{
       title: "",
       tickLength: 0,
       lineThickness:0,
       gridThickness:0,
       includeZero: false,
       margin:0,
       valueFormatString:" " //comment this to show numeric values
  },
  axisX:{
       title: "",
       tickLength: 0,
       margin:0,
       lineThickness:0,
       gridThickness:0,

       valueFormatString:" " //comment this to show numeric values
  },
  data: [{        
    type: "line", 
    lineThickness: 5,
    color: "#FFFFFF",      
    dataPoints: [
      { y: data1[0] },
      { y: data1[1]},
      { y: data1[2] },
      { y: data1[3]},
      { y: data1[4] },
      { y: data1[5]},
      { y: data1[6] },
      { y: data1[7] },
      { y: data1[8] },
      { y: data1[9] },
      { y: data1[10] },
      { y: data1[11] },
      { y: data1[12]},
      { y: data1[13]},
      {y: data1[14]}
    ]
  },
  {        
    type: "line", 
    lineThickness: 5,
    color: "#FFBD33",      
    dataPoints: [
      { y: data2[0] },
      { y: data2[1]},
      { y: data2[2] },
      { y: data2[3]},
      { y: data2[4] },
      { y: data2[5]},
      { y: data2[6] },
      { y: data2[7] },
      { y: data2[8] },
      { y: data2[9] },
      { y: data2[10] },
      { y: data2[11] },
      { y: data2[12] },
      { y: data2[13] },
      { y: data2[14] }
    ]
  },
  {        
    type: "line", 
    lineThickness: 5,
    color: "#FFBD33",      
    dataPoints: [
      { y: data3[0] },
      { y: data3[1]},
      { y: data3[2] },
      { y: data3[3]},
      { y: data3[4] },
      { y: data3[5]},
      { y: data3[6] },
      { y: data3[7] },
      { y: data3[8] },
      { y: data3[9] },
      { y: data3[10] },
      { y: data3[11] },
      { y: data3[12] },
      { y: data3[13] },
      { y: data3[14] }
    ]
  }]
});
chart.render();
}

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
    KRONOS.showLoader();
    //clear Tables
    $("#machineLearning").find("thead").remove();
    $("#machineLearning"+ " tr:has(td)").find("thead").remove();

    $("#customers").find("thead").remove();
    $("#customers" + " tr:has(td)").remove();

	ids=$('#searchIds').val()
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
        originalSearch=seriesOptions
        currentValue=response[response.length-1][1]
        seriesData.push(seriesOptions)
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.createChart();
        KRONOS.showSettings();
        KRONOS.showStats();
        KRONOS.hideLoader();

        $('#search').hide().addClass('search-clicked').fadeIn();
        $('#comp-title').hide();
        $('.name').css('padding', '0 15px');
        $('#container').css('background-color', '#fff');
		
	}).fail(function() {
		console.log("failed to return results");
	});

    $("html, body").animate({ scrollTop: 0 }, "slow");

	// KRONOS.makeChart()
}
KRONOS.overlayIndices=function(){
    $.post("/marketData").done(function(response) {
        // console.dir("Server returned: " + response);
        response=JSON.parse(response)
        // console.dir(response)
        SP=response[0]
        NASD=response[1]
        DOW=response[2]
        seriesData=[]
        seriesData.push(originalSearch)
        console.log(response)
        seriesOptions = {
            name: 'S&P 500',
            data: SP
        }
        seriesData.push(seriesOptions)

        seriesOptions = {
            name: 'NASDAQ',
            data: NASD
        }
        seriesData.push(seriesOptions)

        seriesOptions = {
            name: 'DOW Jones',
            data: DOW
        }
        seriesData.push(seriesOptions)

        for(i=0;i<seriesData.length;i++){
            seriesData[i]._colorIndex=i;
        }
        console.log(seriesData)
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.createChart();
        KRONOS.showSettings();
        
        window.scrollTo(0,document.body.scrollHeight);

    }).fail(function() {
        console.log("failed to return results");
    });
}
KRONOS.hideIndices=function(){
    
        seriesData=[]
        seriesData.push(originalSearch)
        
        KRONOS.createChart();
        KRONOS.showSettings();
        
        window.scrollTo(0,document.body.scrollHeight);
}
KRONOS.getML=function(){
    data=[]
    data['Current Stock Price']= currentValue
    KRONOS.showLoader()
    $.when(
        $.post("/getMLStats",{
            stockTicker : ids       
        }).done(function(response) {
            
            response=JSON.parse(response)
            console.log(response)
            jQuery.extend(data, response);
            // data.push(response)
        })

    ).then(function() {
        
        $("#machineLearning" + " tr:has(td)").remove();
        // console.dir(response)
        console.log(data)
        table=$("#machineLearning")
        $("#machineLearning" + " tr:has(td)").remove();
        resultsTableBody = table.find("tbody");
        table.find("thead").remove();
        for(label in data ){
            
            resultsTableBody.append($('<tr/>').append(
                $('<td/>').append($("<span/>").text(label)))
        
        .append(
                $('<td/>').append($("<span/>").text(data[label]))))
    }
        // console.log("object is: " + JSON.stringify(seriesOptions));
        KRONOS.showStats();
        KRONOS.hideLoader();
    });
}

/**
 * Create the chart when all data is loaded
 * @returns {undefined}
 */
KRONOS.createChart=function() {

    Highcharts.stockChart('container', {

        
        chart: {
        zoomType: 'x'
      },
           

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
        xAxis: {
        crosshair: {
            enabled: true
        }
        },


        plotOptions: {
             series:{
                // showInNavigator: true,
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

        series: seriesData,

         credits: {
        text: '\xAE Kronos',
        href: 'http://www.reddit.com'
    },
  
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
    $("#stats").css("float", "right").css("max-width", "45%");
}

KRONOS.showLoader = function() {
    $("#loading").css("display", "block");
};
KRONOS.hideLoader = function() {
    $("#loading").css("display", "none");
};

//Handle HTML for voice recording
KRONOS.startRecording = function() {
    var mic=$("#micIcon");
    mic.attr("src","/static/resources/mic-2.png");
    KRONOS.handleVoice();
}

//Stop recording visually
KRONOS.stopRecording = function() {
    var mic=$("#micIcon");
    mic.attr("src","/static/resources/mic-icon.png");
}

//webkit speech to handle audio
KRONOS.handleVoice = function() {
    console.log("voice")
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.start();
    recognition.onresult = function(event) {
        console.log("done listening");
        console.log(event);
        recognition.stop();
        text=event["results"][0][0]["transcript"];
        console.log(text);
        $("#searchIds").val(text);
        KRONOS.stopRecording();
        
    }
    recognition.onerror = function(event) {
          console.log('Speech recognition error detected');
          recognition.abort();
          KRONOS.stopRecording();
        }
    
 }


