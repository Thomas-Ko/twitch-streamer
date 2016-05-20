model = {


	channels : [
		"freecodecamp", "storbeck", "jcarverpoker","terakilobyte", "habathcx","RobotCaleb","thomasballinger",
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
	},

	ChannelObj : function (name, displayName, status, followers, logoURL, url, streaming) {
        this.name = name;
        this.displayName = displayName;
        this.status = status;
        this.followers = followers;
        this.logoURL = logoURL;
        this.url = url;
        this.streaming = streaming;
    },

    channelsArray: [],

       
};


controller= {
	init : function(){
		// controller.getChannelAPIData(model.channels[8]);
		// controller.getChannelStreamStatus(model.channels[0]);

		for (i=0; i<=model.channels.length; i++){
			controller.getChannelStreamStatus(model.channels[i]);
		}
		
		
		view.init();
	},

	getChannelAPIData: function(channelName){
		$.ajax({
	  		method: "GET",
	  		url: "https://api.twitch.tv/kraken/channels/" + channelName +"?callback=?",
	  		dataType: "jsonp",

	  		success: function( response ) {
	   	 		// console.log(response.display_name);
	   	 		// console.log(response);
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

	setChannelModel : function(channelObj, streamStatus){
	/*	model.channelData = {
			name: channelObj.name,
			displayName: channelObj.display_name,
			status: channelObj.status,
			followers: channelObj.followers,
			logoURL: channelObj.logo,
			url: channelObj.url,
			// viewers: channelObj.views,
		};*/		

			console.log("set channel model");
			console.log(channelObj);

			var name 	= channelObj.name,
			displayName = channelObj.display_name,
			status 		= channelObj.status,
			followers 	= channelObj.followers,
			logoURL 	= channelObj.logo,
			url 		= channelObj.url;
			streaming	= streamStatus;

			var newObj = new model.ChannelObj(name, displayName, status, followers, logoURL, url, streaming);
            model.channelsArray.push(newObj);
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

			// model.channelData = {
			// 	name: channelObj.stream.channel.name,
			// 	displayName: channelObj.stream.channel.display_name,
			// 	status: channelObj.stream.channel.status,
			// 	followers: channelObj.stream.channel.followers,
			// 	logoURL: channelObj.stream.channel.logo,
			// 	url: channelObj._links.self,
			// 	viewers: channelObj.stream.viewers,
			// 	streaming : stream,
			// };	


				var name 	= channelObj.stream.channel.name,
				displayName = channelObj.stream.channel.display_name,
				status 		= channelObj.stream.channel.status,
				followers 	= channelObj.stream.channel.followers,
				logoURL 	= channelObj.stream.channel.logo,
				url 		= channelObj._links.self,
				viewers 	= channelObj.stream.viewers,
				streaming 	= stream;

				var newObj = new model.ChannelObj(name, displayName, status, followers, logoURL, url, streaming);
            	model.channelsArray.push(newObj);
			
		}

		console.log("stream is " +stream);

		
		// console.log(channelObj);
		// console.log(channelObj.stream.channel.logo);

	},

	getChannelModel : function(){
		// console.log("getChannelModel:");
		// console.log(model.channelData);
		// return model.channelData;
		return model.channelsArray;

	},

};  //end controller

view = {
	init: function(){
		$(document).ajaxStop(function () {
			// console.log("view init function");
			var data = controller.getChannelModel();
			// console.log(data);
			view.renderDiv(data);
			view.offlineButton();
			view.onlineButton();
			view.allButton();
		});
	},

	renderDiv: function(data){
		// console.log(data);
		// console.log(data.streaming);

		console.log(data);

		for (i=0; i<data.length; i++){


			var followers = data[i].followers;
			var displayName = data[i].displayName;
			var status = data[i].status;
			var viewers = data[i].viewers;
			var logoURL = data[i].logoURL;
			var streaming = data[i].streaming;
			var imgID = displayName +"IMG";

			var streamBackground,streamIconHTML, statusHTML;

			if (streaming){
				streamClass = "online";
				streamBackground = 'online-bg';
				streamIconHTML = '<i class="fa fa-check-circle online-icon icon" aria-hidden="true"></i>';
				statusHTML = '<span>'+status+'</status>';

			} else {
				streamClass = "offline";
				streamBackground = 'offline-bg';
				streamIconHTML = '<i class="fa fa-minus-circle offline-icon icon" aria-hidden="true"></i>';
				statusHTML = '<span></status>';
			}

			// console.log(logoURL);

			$("main").append(
				'<div class="col-xs-12 channel '+ streamClass +'">'+
					'<div class="channel-inner">' +
						'<div class="row '+streamBackground+'">' +
							'<div class="col-xs-2"><img src=' + logoURL + ' id="'+ imgID +'"></div>' +
							'<div class="col-xs-10 info-container">'+
								'<h3>'+displayName+'</h3>'+ statusHTML+ streamIconHTML+
							'</div>' +
						'</div>' +
					'</div>'+
				'</div>');

			$("#"+imgID ).attr( "src", logoURL );

		}

	}, //end view.renderDiv

	offlineButton: function(){
		$("#statusOffline").on("click", function(){
			$(".online").hide();
			$(".offline").show();
		});
	},

	onlineButton: function(){
		$("#statusOnline").on("click", function(){
			$(".offline").hide();
			$(".online").show();
		});
	},

	allButton: function(){
		$("#statusAll").on("click", function(){
			$(".offline").show();
			$(".online").show();
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

// controller.getChannelData(model.channels[0]);
controller.init();
