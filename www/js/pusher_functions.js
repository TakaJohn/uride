function emergency_sound(){
  if(deploy_device == "desktop"){
    soundManager.setup({
      url: '/swf/',
        onready: function() {
          var alarm_sound = soundManager.createSound({
            id: 'aSound',
            url: '../beep.mp3'
          });
          alarm_sound.play();
        },        
        ontimeout: function() {
          console.log("SOUND FILE MISSING");
        }
    });
  }
}

function message_sound(){
  soundManager.setup({
    url: '/swf/',
      onready: function() {
        var alarm_sound = soundManager.createSound({
          id: 'bSound',
          url: '../beep.mp3'
        });
        alarm_sound.play();
      },        
      ontimeout: function() {
        console.log("SOUND FILE MISSING");
      }
  });
}

function show_notification_(id, message, time, type){
  var notification    = "";
  if($('#front-end-notification').hasClass("open")){
    $("#notification-header").html("You have a new "+type);

    notification += "<a data-link='emergency_call_details?ID="+id+"' href='#' class='media list-group-item'>\n";
    notification += "<span class='pull-left thumb-sm'>\n";
    notification += "<i class='fa fa-bullhorn fa-2x text-success'></i>\n";
    notification += "</span>\n";
    notification += "<span class='media-body block m-b-none'>\n";
    notification += message;
    notification += "<small class='text-muted'>"+time+"</small>\n";
    notification += "</span>\n";
    notification += "</a>\n";

    var num_notifications  = $('#notification-messages').children().length;
    if(num_notifications > 3) $("#notification-messages a:nth-child("+num_notifications+")").remove();
    $("#notification-messages").prepend(notification);
  
    setTimeout(function() {
      $('#front-end-notification').removeClass("open");
    }, 10*1000);

  }else{       
    $("#notification-header").html("You have a new "+type);

    notification += "<a data-link='emergency_call_details?ID="+id+"' href='#' class='media list-group-item'>\n";
    notification += "<span class='pull-left thumb-sm'>\n";
    notification += "<i class='fa fa-bullhorn fa-2x text-success'></i>\n";
    notification += "</span>\n";
    notification += "<span class='media-body block m-b-none'>\n";
    notification += message;
    notification += "<small class='text-muted'>"+time+"</small>\n";
    notification += "</span>\n";
    notification += "</a>\n";

    var num_notifications  = $('#notification-messages').children().length;
    if(num_notifications > 3) $("#notification-messages a:nth-child("+num_notifications+")").remove();
    $("#notification-messages").prepend(notification);

    $('#front-end-notification').addClass("open");
  
    setTimeout(function() {
      $('#front-end-notification').removeClass("open");
    }, 10*1000);

  }
}

function show_notification(id, message, time, type){
  var string = message+"<br><br><a data-link='emergency_call_details.php?id="+id+"' href='#'>View Details</a>";
  load_modal(emergency_string(string), "EMERGENCY CALL");
  emergency_sound();
  console.log("NOTIFICATION TO NOTIFICATION");
}

function offline_emergency(data){
  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 1){
        load_modal(emergency_string(data.msg), "OFFLINE EMERGENCY");
        emergency_sound();
      }
    }else{
      console.log(data);
    }
  }else{
    console.log("THERE WAS AN ERROR TRYING TO GET OFFLINE EMERGENCY CALLS");
  }
}

function offline_response_(data){
  i = 1;
  var notification = "";
  $.each(data, function(k, v) {
    if($('#front-end-notification').hasClass("open")){
      $("#notification-header").html("You have a new "+type);

      notification += "<a data-link='emergency_call_details?ID="+v.id+"' href='#' class='media list-group-item'>\n";
      notification += "<span class='pull-left thumb-sm'>\n";
      notification += "<i class='fa fa-bullhorn fa-2x text-success'></i>\n";
      notification += "</span>\n";
      notification += "<span class='media-body block m-b-none'>\n";
      notification += v.message;
      notification += "<small class='text-muted'>"+v.time+"</small>\n";
      notification += "</span>\n";
      notification += "</a>\n";
      $("#notification-messages").prepend(notification);
    
      setTimeout(function() {
        $('#front-end-notification').removeClass("open");
      }, 10*1000);

    }else{       
      $("#notification-header").html("You have a new "+type);

      notification += "<a data-link='emergency_call_details?ID="+v.id+"' href='#' class='media list-group-item'>\n";
      notification += "<span class='pull-left thumb-sm'>\n";
      notification += "<i class='fa fa-bullhorn fa-2x text-success'></i>\n";
      notification += "</span>\n";
      notification += "<span class='media-body block m-b-none'>\n";
      notification += v.message;
      notification += "<small class='text-muted'>"+v.time+"</small>\n";
      notification += "</span>\n";
      notification += "</a>\n";
      $("#notification-messages").prepend(notification);

      $('#front-end-notification').addClass("open");
    
      setTimeout(function() {
        $('#front-end-notification').removeClass("open");
      }, 10*1000);

    }
  });
}

function message_seen(id){
  var post_data       = "actions=message_seen&id="+user_id+"&msg_id="+id;
  query_server(post_data, "GET", "message_seen");
}

function initiate_pusher(){
  pusher                 = new Pusher('38f31f68223cac5af20a');
  var channel            = pusher.subscribe('secure247-channel');

  var pusher_state      = pusher.connection.state;
  var channel           = pusher.subscribe(user_id);

  channel.bind("message", function(data) {
    show_notification(data.id, data.message, data.time, data.type);
    message_seen(data.id);
    message_sound();
  });

  
  if(user_level == 1 || user_level == 2){
    //BIND TO CLIENT CHANNEL
    var cl_channel       = pusher.subscribe(user_client_id+'_channel');
    cl_channel.bind("message", function(data) {
      show_notification(data.id, data.message, data.time, data.type);
    });

    //BIND TO EMERGENCY CALL CHANNEL
    var er_channel       = pusher.subscribe(user_client_id+'_emergency_call');
    er_channel.bind("emergency_call", function(data) {
      show_notification(data.id, data.message, data.time, data.type);
    });

    //BIND TO MEMBER REGISTRATION CHANNEL
    var reg_channel      = pusher.subscribe(user_client_id+'_member_registration');
    channel.bind('member_registration', function(data) {
      show_notification(data.id, data.message, data.time, data.type);
    });
  }

  if(user_level == 5){
    //BIND TO EMERGENCY CALL RESPONSE CHANNEL
    var resp_channel      = pusher.subscribe(user_id+'_response_call');
    resp_channel.bind('response_call', function(data) {
      show_notification(data.id, data.message, data.time, data.type);
      emergency_sound();
    });
  }

  pusher.connection.bind('state_change', function(states) {
    // states = {previous: 'oldState', current: 'newState'}
    //connecting, connected, unavailable, failed, disconnected
    if(states.current == "disconnected"){
      if(user_level == 1 || user_level == 2){
        $(".server-connection").removeClass("hide");
        $(".server-connection .server-status").html("SERVER OFFLINE: CHECK INTERNET CONNECTION");
      }
      if(user_level == 3 || user_level == 4 || user_level == 5){
        $(".server-connection").removeClass("hide");
        $(".server-connection .server-status").html("OFFLINE: CHECK INTERNET CONNECTION");
      }
    }

    if(states.current == "connecting"){
      $(".server-connection").removeClass("hide");
      $(".server-connection .server-status").html("CONNECTING...");
    }

    if(states.current == "connected"){
      if(user_level == 1 || user_level == 2){
        $(".server-connection").removeClass("hide");
        $(".server-connection .server-status").html("SERVER CONNECTED");

        window.setTimeout(
          function(){ $(".server-connection").addClass("hide"); }, 
          5000
        );

        var post_data       = "actions=offline_emergency&user_id="+user_id;
        query_server(post_data, "GET", "offline_emergency_result");
      }

      if(user_level == 3 || user_level == 4){
        $(".server-connection").removeClass("hide");
        $(".server-connection .server-status").html("CONNECTED");

        window.setTimeout(
          function(){ $(".server-connection").addClass("hide"); }, 
          5000
        );
      }

      if(user_level == 5){
        $(".server-connection").removeClass("hide");
        $(".server-connection .server-status").html("CONNECTED");

        window.setTimeout(
          function(){ $(".server-connection").addClass("hide"); }, 
          5000
        );

        /*ar post_data       = "actions=offline_response&user_id="+user_id;
        query_server(post_data, "GET", "offline_emergency_result");*/
      }
    }
    
  });
}

function terminate_pusher(){
  pusher.disconnect();
}

//pusher.connection.bind('connecting', function() {
  //All dependencies have been loaded and Pusher is trying to connect. 
  //The connection will also enter this state when it is trying to reconnect after a connection failure.
//    console.log("Pusher services trying to connect");
//    $("#server-connection").html("<i class='fa fa-spinner fa fa-spin fa fa-large'></i> Connecting to Secure 24/7 server services....");
//});