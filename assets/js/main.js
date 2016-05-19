model = {


	channels : [
		"freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger",
		"noobs2ninjas","beohoff", "starladder_cs_en","callofduty"
	],	
};


controller= {
	getTwitchData: function(channelName){
		$.ajax({
	  		method: "GET",
	  		url: "https://api.twitch.tv/kraken/channels/" + channelName +"?callback=?",
	  		dataType: "jsonp",

	  		success: function( response ) {
	   	 		console.log(response);
	    	},
		});
	}
};

// $.ajax({
//   	method: "GET",
//   	url: "https://api.twitch.tv/kraken/streams/freecodecamp?callback=?",
//   	dataType: "jsonp",

//   	success: function( response ) {
//    	 	console.log(response);
    	
//     },
// });

// $.getJSON('https://api.twitch.tv/kraken/streams/freecodecamp?callback=?', function(data) {
//   console.log(data);
// });

// $.getJSON('https://api.twitch.tv/kraken/channels/freecodecamp?callback=?', function(data) {
//   console.log(data);
// });

controller.getTwitchData(model.channels[0]);
