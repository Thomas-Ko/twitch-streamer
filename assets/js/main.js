/*=========================
	MODEL
=========================*/

model = {

	//These are the names of the channels that we want to get information on.
	channelsArray : [
		"freecodecamp", "storbeck", "jcarverpoker","terakilobyte", "habathcx","RobotCaleb","thomasballinger",
		"noobs2ninjas","beohoff", "starladder_cs_en","callofduty", "syndicate", "esl_csgo",
		"nightblue3", "summit1g", "riotgames", "comster404"
	],	

	//this object constructor is used in the controller; objects containing channel information will then be passed to model.channelsDataArray
	ChannelObj : function (name, displayName, status, followers, logoURL, url, streaming) {
        this.name = name;
        this.displayName = displayName;
        this.status = status;
        this.followers = followers;
        this.logoURL = logoURL;
        this.url = url;
        this.streaming = streaming;
    },

    //this array will be populated with channel objects containing information about the channels in model.channelsArray
    channelsDataArray : [],      

}; //end model


/*=========================
	CONTROLLER
=========================*/

controller= {
	init : function(){
		controller.loopThroughChannels();
		view.init();
	},

	//loops through the models.channels array and runs an API call on each channel
	loopThroughChannels : function(){
		for (i=0; i<=model.channelsArray.length; i++){
			controller.getChannelData(model.channelsArray[i]);
		}
	},

	/*this function is used to get extra data of channels that are offline from the twitch API; 
	it's used inside the model.setChannelModel function if channel is not live*/
	getOfflineChannelData: function(channelName){
		$.ajax({
	  		method: "GET",
	  		url: "https://api.twitch.tv/kraken/channels/" + channelName,
	  		headers: {
	  		   // 'Client-ID': ''
	  		 },
	  		success: function(response) {
	   	 		controller.setOfflineChannelModel(response);  	 		
	    	},
		});
	},

	/*this function is used to see get a channel's stream status from the twitch API
	Note: if a channel is streaming, then the object/response returned will contain extra data*/
	getChannelData: function(channelName){
		$.ajax({
	  		method: "GET",
	  		url: "https://api.twitch.tv/kraken/streams/" + channelName,
	  		headers: {
	  		   // 'Client-ID': ''
	  		 },
	  		success: function(response) {
	   	 		controller.setChannelModel(response, channelName);
	    	},
		});
	},

	setOfflineChannelModel : function(obj, streamStatus){
			var name 	= obj.name,
			displayName = obj.display_name,
			status 		= obj.status,
			followers 	= obj.followers,
			logoURL 	= obj.logo,
			url 		= obj.url;
			streaming	= streamStatus;

			//create new ChannelObj and push it to an array;
			var newObj = new model.ChannelObj(name, displayName, status, followers, logoURL, url, streaming);
            model.channelsDataArray.push(newObj);
	},

	setChannelModel : function(obj, channelName){
		var stream;

		//if channel is unprocessable / doesn't exist
		if (obj.error=== "Unprocessable Entity") {
            	//create new ChannelObj and push it to an array
            	model.channelsDataArray.push(new model.ChannelObj(channelName, channelName, obj.message, null, null, null, "unprocessable"));
		
		/*For some reason, even those there's no such channel as undefined in model.channelsArray, a channel called undefined still runs through an API call, 
		so this else if code prevents it from showing up as a channel on the webpage*/
		} else if(obj._links.channel==="https://api.twitch.tv/kraken/channels/undefined"){
			return;

		//if channel is not streaming now	
		}else if(obj.stream===null){
			stream = false;
			
			//get information running this function (this is needed because some information is not shown when a channel is offline);
			controller.getOfflineChannelData(channelName);

		//if channel is streaming
		} else {
			stream = true;
				var name 	= obj.stream.channel.name,
				displayName = obj.stream.channel.display_name,
				status 		= obj.stream.channel.status,
				followers 	= obj.stream.channel.followers,
				logoURL 	= obj.stream.channel.logo,
				url 		= obj.stream.channel.url,
				viewers 	= obj.stream.viewers,
				streaming 	= stream;

				//create new ChannelObj and push it to an array;
				var newObj = new model.ChannelObj(name, displayName, status, followers, logoURL, url, streaming);
            	model.channelsDataArray.push(newObj);
		}
	}, //end controller.setChannelModel

	//get the array of channels and their information from the model; used in the view.init function
	getChannelsData : function(){
		return model.channelsDataArray;
	},

};  //end controller


/*=========================
	VIEW
=========================*/

view = {
	init: function(){
		$(document).ajaxStop(function () {
			var data = controller.getChannelsData();
			view.renderDivs(data);
			view.buttons.buttonsInit();	
		});
	},

	renderDivs: function(data){
		//loops through the channels
		for (i=0; i<data.length; i++){
			var followers = data[i].followers;
			var displayName = data[i].displayName;
			var status = data[i].status;
			var viewers = data[i].viewers;
			var streaming = data[i].streaming;
			var imgID = displayName +"IMG";
			var url = data[i].url;
			var logoURL = data[i].logoURL;

			//if there is no logo, assign a placeholder image
			if(logoURL ===null){
				logoURL="assets/img/twitch-icon.svg";
			}

			//these variables will be usedd when appended html to the main section
			var streamBackground,streamIconHTML, statusHTML, urlHTML, urlHTMLend;

			//if channel is unprocessable / doesn't exist
			if (streaming==="unprocessable"){
				streamClass = "offline";
				streamBackground = 'unprocessable-bg';
				streamIconHTML = '<i class="fa fa-times-circle icon" aria-hidden="true"></i>';
				statusHTML = '<span>'+status+'</status>';
				urlHTML="";
				urlHTMLend="";
			
			// if channel is live (streaming=true  here)
			} else if (streaming){
				streamClass = "online";
				streamBackground = 'online-bg';
				streamIconHTML = '<i class="fa fa-check-circle online-icon icon" aria-hidden="true"></i>';
				statusHTML = '<span>'+status+'</status>';
				urlHTML = '<a href="' +url +'" target="_blank">';
				urlHTMLend='</a>';
			
			// if channel is offline
			} else {
				streamClass = "offline";
				streamBackground = 'offline-bg';
				streamIconHTML = '<i class="fa fa-minus-circle offline-icon icon" aria-hidden="true"></i>';
				statusHTML = '<span></status>';
				urlHTML = '<a href="' +url +'" target="_blank">';
				urlHTMLend='</a>';
			}

			//code is tabbed here to resemble an html file
			$("#mainRow").append(
				'<div class="col-xs-12 channel '+ streamClass +'">'+
					urlHTML +
						'<div class="channel-inner">' +
							'<div class="row '+streamBackground+'">' +
								'<div class="col-xs-2"><img src=' + logoURL + ' id="'+ imgID +'"></div>' +
								'<div class="col-xs-10 info-container">'+
									'<h3>'+displayName+'</h3>'+ 
									statusHTML+ 
									streamIconHTML+
									
								'</div>' +
							'</div>' +
						'</div>'+ 
					urlHTMLend+
				'</div>');

			//this is needed because sometimes the image doesn't display in the append above
			$("#"+imgID ).attr( "src", logoURL );
		} //end for-loop

	}, //end view.renderDivs

	
	//object contains all methods dealing with buttons
	buttons : {
		
		//contains all button methods; used in view.init function
		buttonsInit: function(){
			this.offlineButton();
			this.onlineButton();
			this.allButton();
		},

		offlineButton: function(){
			$("#statusOffline").on("click", function(){
				$(".online").slideUp("400", function(){
					$(".offline").slideDown("400");
				});
			  //adds class to proper navbar tab (Offline)
				$("#statusOnline").removeClass("active");
				$("#statusOffline").addClass("active");
				$("#statusAll").removeClass("active");
			});
		},

		onlineButton: function(){
			$("#statusOnline").on("click", function(){
				$(".offline").slideUp("400", function(){
					$(".online").slideDown("400");
				});
			  //adds class to proper navbar tab (Online)
				$("#statusOnline").addClass("active");
				$("#statusOffline").removeClass("active");
				$("#statusAll").removeClass("active");

			});
		},

		allButton: function(){
			$("#statusAll").on("click", function(){
				$(".offline").slideDown("400");
				$(".online").slideDown("400");
			  //adds class to proper navbar tab (All)
				$("#statusOnline").removeClass("active");
				$("#statusOffline").removeClass("active");
				$("#statusAll").addClass("active");
			});
		},

	}, //end view.buttons
}; //end view


/*=========================
	INITIALIZE
=========================*/
controller.init();
