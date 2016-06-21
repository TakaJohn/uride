/******APPLE FUNCTIONS******/

function onNotificationAPN(e) {
	var push_message 	= e.alert;
	var push_title 		= e.title;
	var push_image 		= e.image;

	listData =   '<article id="chat-id-" class="chat-item left">'+
                  '<a href="#" class="pull-left thumb-sm avatar"><img src="images/avatar_default.jpg" class="img-circle"></a>'+
                  '<section class="chat-body">'+
                  '<div class="panel b-light text-sm m-b-none">'+
                  '<div class="panel-body">'+
                  '<span class="arrow left"></span>'+
                  '<p class="m-b-none">'+e.alert+'</p>'+
                  '</div>'+
                  '</div>'+
                  '</section>'+
                  '</article>';

	$(".chat-"+e.chat_id).append(listData);
	
    if (e.foreground){
    	save_message(user_id, e.responder, e.chat_id, e.responder_name, e.alert, short_today_date, 0, 1);
		msg_sound.play();			
	}else{
		save_message(user_id, e.responder, e.chat_id, e.responder_name, e.alert, short_today_date, 0, 0);
		msg_sound.play();
	}
                
	if (e.badge) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
	}
}

function tokenSuccessHandler (result) {		
	user_push_token = result;				
	if(user_id !== null){
		var post_data = "actions=update_push_token&user_id="+user_id+"&device=android&token="+result;	
		query_server(post_data, "GET", "push_token_update_result");
	}
}

function tokenErrorHandler (error) {
	console.log('Error:'+ error);
}

/******ANDROID FUNCTIONS******/

/*function pushSuccessHandler (result) {
   //console.log("Success registering Push ID: "+result);
   //window.localStorage.setItem("user_push_token", result); 
}
            
function pushErrorHandler (error) {
	console.log('Error:'+ error);
}

function onNotificationGCM(e) { 
	er_sound            = new Media("/android_asset/www/beep.wav");
	msg_sound           = new Media("/android_asset/www/beep.wav");
	
	switch( e.event ){
		case 'registered':
			if ( e.regid.length > 0 ){
				if(user_push_token !== e.regid){				
					user_push_token = e.regid;				
					if(user_id !== null){
						var post_data = "actions=update_push_token&user_id="+user_id+"&device=android&token="+e.regid;	
						query_server(post_data, "GET", "push_token_update_result");
					}
				}
			}
        break;
                    
        case 'message':
        	var push_message 	= e.payload.message;
        	var push_title 		= e.payload.title;
        	var push_image 		= e.payload.image;

        	listData =   '<article id="chat-id-" class="chat-item left">'+
                          '<a href="#" class="pull-left thumb-sm avatar"><img src="images/avatar_default.jpg" class="img-circle"></a>'+
                          '<section class="chat-body">'+
                          '<div class="panel b-light text-sm m-b-none">'+
                          '<div class="panel-body">'+
                          '<span class="arrow left"></span>'+
                          '<p class="m-b-none">'+e.payload.message+'</p>'+
                          '</div>'+
                          '</div>'+
                          '</section>'+
                          '</article>';

        	$(".chat-"+e.payload.chat_id).append(listData);
        	
            if (e.foreground){
            	save_message(user_id, e.payload.responder, e.payload.chat_id, e.payload.responder_name, e.payload.message, short_today_date, 0, 1);
				msg_sound.play();			
			}else{
				save_message(user_id, e.payload.responder, e.payload.chat_id, e.payload.responder_name, e.payload.message, short_today_date, 0, 0);
				msg_sound.play();
			}
			
            break;
                    
            case 'error':
				console.log('ERROR -> MSG:' + e.msg )
            break;
                    
            default:
				console.log("EVENT -> Unknown, an event was received and we do not know what it is");
            break;
    }
}