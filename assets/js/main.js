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
		viewers: null,
		streaming:null,
	}
};


controller= {
	init : function(){
		// controller.getChannelAPIData(model.channels[8]);
		controller.getChannelStreamStatus(model.channels[8]);
		
		
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
	   	 		console.log("getChannelStreamStatus:");
	   	 		console.log(response.stream);
	   	 		controller.setChannelStatus(response, channelName);
	   	 		// controller.getChannelAPIData(channelName);
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
			// viewers: channelObj.views,
		};		
	},

	setChannelStatus : function(channelObj, channelName){
		var stream;

		if(channelObj.stream===null){
			stream = false;
			model.channelData = {
				streaming : stream,
			};	
			controller.getChannelAPIData(channelName);

		} else {
			stream = true;

			model.channelData = {
				name: channelObj.stream.channel.name,
				displayName: channelObj.stream.channel.display_name,
				status: channelObj.stream.channel.status,
				followers: channelObj.stream.channel.followers,
				logoURL: channelObj.stream.channel.logo,
				url: channelObj._links.self,
				viewers: channelObj.stream.viewers,
				streaming : stream,
			};	
		}

		console.log("stream is " +stream);

		
		console.log(channelObj);
		// console.log(channelObj.stream.channel.logo);

	},

	getChannelModel : function(){
		console.log("getChannelModel:");
		console.log(model.channelData);
		return model.channelData;

	},

};  //end controller

view = {
	init: function(){
		$(document).ajaxStop(function () {
			// console.log("view init function");
			var data = controller.getChannelModel();
			// console.log(data);
			view.renderDiv(data);
		});
	},

	renderDiv: function(data){
		// console.log(data);
		// console.log(data.streaming);
		var followers = data.followers;
		var displayName = data.displayName;
		var status = data.status;
		var viewers = data.viewers;
		var logoURL = data.logoURL;
		var streaming = data.streaming;
		var imgID = displayName +"IMG";

		var streamRowClass,streamIconHTML, statusHTML;

		if (streaming){
			streamRowClass = 'online';
			streamIconHTML = '<i class="fa fa-check-circle online-icon icon" aria-hidden="true"></i>';
			statusHTML = '<span>'+status+'</status>';

		} else {
			streamRowClass = 'offline';
			streamIconHTML = '<i class="fa fa-minus-circle offline-icon icon" aria-hidden="true"></i>';
			statusHTML = '<span></status>';
		}

		// console.log(logoURL);

		$("main").append(
			'<div class="col-xs-12 channel">'+
				'<div class="channel-inner">' +
					'<div class="row '+streamRowClass+'">' +
						'<div class="col-xs-2"><img src=' + logoURL + ' id="'+ imgID +'"></div>' +
						'<div class="col-xs-10 info-container">'+
							'<h3>'+displayName+'</h3>'+ statusHTML+ streamIconHTML+
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
