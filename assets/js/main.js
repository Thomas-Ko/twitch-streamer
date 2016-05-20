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
		var imgID = displayName;

		var streamHtmlCode;

		if (streaming){
			streamHtmlCode = '<p>Live</p>';
		} else {
			streamHtmlCode = '<p>Offline</p>';
		}

		console.log(logoURL);

		$("main").append(
			'<div class="col-xs-12 channel">'+
				'<div class="channel-inner">' +
					'<div class="row">' +
						'<div class="col-xs-2"><img src=' + logoURL + ' id="'+ imgID +'"></div>' +
						'<div class="col-xs-10 info-container">'+
							'<h3>'+displayName+'</h3>'+
						'</div>' +
					'</div>' +
				'</div>'+
			'</div>');

		$("#"+imgID ).attr( "src", logoURL );

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
