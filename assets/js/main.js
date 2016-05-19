model = {


	channels : [
		"freecodecamp", "storbeck", "terakilobyte", "habathcx","RobotCaleb","thomasballinger",
		"noobs2ninjas","beohoff", "starladder_cs_en","callofduty"
	],	

	channelData : {
		name: null,
		displayName : null,
		status: null,
		followers: null,
		logoURL: null,
		url: null,
		views: null,
	}
};


controller= {
	init : function(){
		controller.getChannelAPIData(model.channels[0]);
		controller.getChannelStreamStatus(model.channels[0]);
		view.init();
	},

	getChannelAPIData: function(channelName){
		$.ajax({
	  		method: "GET",
	  		url: "https://api.twitch.tv/kraken/channels/" + channelName +"?callback=?",
	  		dataType: "jsonp",

	  		success: function( response ) {
	   	 		console.log(response.display_name);
	   	 		console.log(response);
	   	 		controller.setChannelModel(response);
	   	 		
	    	},
		});
	},

	getChannelStreamStatus: function(channelName){
		$.ajax({
	  		method: "GET",
	  		url: "https://api.twitch.tv/kraken/streams/" + channelName +"?callback=?",
	  		dataType: "jsonp",

	  		success: function( response ) {
	   	 		console.log(response.stream);
	    	},
		});
	},

	setChannelModel : function(channelObj){
		model.channelData = {
			name: channelObj.name,
			displayName: channelObj.display_name,
			status: channelObj.status,
			followers: channelObj.followers,
			logoURL: channelObj.logo,
			url: channelObj.url,
			views: channelObj.views,
		};		
	},

	setChannelStatus : function(channelObj){
		var streaming;

		if(channelObj.stream===null){
			streaming = false;
		} else {
			streaming = true;
		}

		model.channelData = {
			streaming : streaming,
		};
	},

	getChannelModel : function(){
		return model.channelData;
	},

};  //end controller

view = {
	init: function(){
		$(document).ajaxStop(function () {
			console.log("view init function");
			var data = controller.getChannelModel();
			console.log(data);
			view.renderDiv(data);
		});
	},

	renderDiv: function(data){
		var followers = data.followers;
		var displayName = data.displayName;
		var status = data.status;
		var views = data.views;
		var logoURL = data.logoURL;
		var streaming = data.streaming;
		var streamStatus;

		var streamHtmlCode;

		if (streaming){
			streamHtmlCode = '<p>Live</p>';
		} else {
			streamHtmlCode = '<p>Offline</p>';
		}

		$("body").append('<h3>'+displayName+'</h3><p>'+status+'</p><p>' + followers + ' Followers</p><p>'+views+' Views</p>' + '<img src="' + logoURL+'">' + streamHtmlCode);

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

// controller.getChannelData(model.channels[0]);
controller.init();
