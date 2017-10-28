var TEMPLATE = {
	logger : null
};

TEMPLATE.documentReady = function() {
	console.log("TEMPLATE is document ready!");
	TEMPLATE.setVersion();
};


// Run search on Spotify playlists
TEMPLATE.test = function(val) {
	//Example of how to send input to server
	$.post("/example", {
		input : "input" 			
 	}).done(function(response) {
		alert("Server returned: " + response);
	}).fail(function() {
		console.log("failed to return results");
	});

};
