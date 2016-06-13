//**********MOBILE FUNCTIONS**********//

//DEVICE READY

function onDeviceReady() {
  isPhoneGapReady   = true;
  pushNotification  = window.plugins.pushNotification;

  device_platform   = device.platform.toLowerCase();  // device operating system e.g Android, Ios
  device_model      = device.model.toLowerCase();     //device model e.g Nexus One       returns "Passion
  device_version    = device.version.toLowerCase();   // device operating system version Froyo OS would return "2.2"
  
  if(device_platform == 'android' || device_platform == 'Android'){
    pushNotification.register(pushSuccessHandler, pushErrorHandler, {"senderID": "210701936697", "ecb": "onNotificationGCM"});
  }else{
    pushNotification.register(tokenSuccessHandler, tokenErrorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});  // required!
  }

  //networkDetection
  var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    if (states[networkState] !== 'No network connection' || states[networkState] == 'Unknown connection') {
      console.log("Connection State: "+states[networkState]);
    isConnected = true;
  }

  connection_type = states[networkState];
  
  document.addEventListener("online", onOnline, false);
  document.addEventListener("offline", onOffline, false);
  
  //executeEvents
  // attach events for online and offline detection
  document.addEventListener("online", onOnline, false);
  document.addEventListener("offline", onOffline, false);
  // attach events for pause and resume detection
  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);
  
  //executeCallback 
  var pages = currentUrl.split("/"); // get the name of the current html page
  currentPage = pages[pages.length - 1].slice(0, pages[pages.length - 1].indexOf(".html"));
  console.log("CURRENT PAGE: "+currentPage);

  // capitalize the first letter and execute the function
  //currentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  //if ( typeof window['on' + currentPage + 'Load'] == 'function') {
  if ( typeof window[currentPage + '_load'] == 'function') {
    window[currentPage + '_load']();
  }
}

function onOnline() {
  isConnected = true;
}

function onOffline() {
  isConnected = false;
}

function onPause() {
  isPhoneGapReady = false;
  console.log("ON PAUSE");
}

function onResume() {
  // don't run if phonegap is already ready
  console.log("ON RESUME");
  if (isPhoneGapReady == false) {
    init(currentUrl);
  }
}

function init(url) {
  if ( typeof url != 'string') {
    currentUrl = location.href;
  } else {
    currentUrl = url;
  }
  if (isPhoneGapReady) {
    onDeviceReady();
  } else {
    // Add an event listener for deviceready
    document.addEventListener("deviceready", onDeviceReady, false);
  }
}

//**********MOBILE FUNCTIONS**********//

function load_js_file(file) {
    var jsElm   = document.createElement("script");
    jsElm.type  = "application/javascript";
    jsElm.src   = file;
    document.body.appendChild(jsElm);
}

function sample_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){
      $("#"+data.actions+" .form-progress").addClass("hide");

      if(data.query_status == 0){
        load_modal(err_string(data.msg), data.action_title);
      }
      if(data.query_status == 1){
      $('#load_content').scrollTop(0);
        load_modal(success_string(data.msg), data.action_title);
        $("#"+data.actions).not(".ignore").trigger("reset");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), data.action_title);
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $("#"+data.actions+' #submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER.."), "ERROR");
    $("#"+data.actions+' #submit').prop("disabled", false);  
  }
}

function update_user_result(data){
  $("#"+data.actions+" .form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), data.action_title);
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), data.action_title);
        window.localStorage.setItem("session", data.details);
        var details           = $.parseJSON(atob(data.details));
        user_username         = details.username;
        user_level            = details.level;
        user_description      = level_description[user_level];
        user_title            = details.title;
        user_name             = details.name;
        user_surname          = details.surname;
        user_id               = details.ID;
        user_client_id        = details.client_id;
        user_client           = details.client;
        user_push_token       = details.token;
        user_student_id       = details.student_id;
        user_mobile           = details.mobile;
        user_student_pic      = details.student_pic;
        user_driver           = details.driver;
        user_car_reg          = details.car_reg;
        user_car_pic          = details.car_pic;
        user_license          = details.license;
      }

      if(data.query_status == 2){
        load_modal(info_string(data.msg), data.action_title);
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $("#"+data.actions+' #submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "SEND MESSAGE");
    $("#"+data.actions+' #submit').prop("disabled", false);
  }
}

function login_row(data){
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".login-row").removeClass('hide').addClass('active-row');
}

function login_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){
      $("#"+data.actions+" .form-progress").addClass("hide");

      if(data.query_status == 0){
        load_modal(err_string(data.msg), data.action_title);
      }
      if(data.query_status == 1){
        window.localStorage.setItem("session", data.details);
        var details           = $.parseJSON(atob(data.details));
        user_username         = details.username;
        user_level            = details.level;
        user_description      = level_description[user_level];
        user_title            = details.title;
        user_name             = details.name;
        user_surname          = details.surname;
        user_student_id       = details.student_id;
        user_mobile           = details.mobile;
        user_id               = details.ID;
        user_client_id        = details.client_id;
        user_client           = details.client;
        user_push_token       = details.token;
        user_profile          = details.profile;
        user_student_pic      = details.student_pic;

        user_driver           = details.driver;
        user_car_reg          = details.car_reg;
        user_car_pic          = details.car_pic;
        user_license          = details.license;
        availability          = details.availability;

        $(".navbar-brand").html(user_client);

        $(".inactive-user").addClass('hide');
        $(".active-user").removeClass('hide');

        //LOAD GOOGLE MAPS
        if (typeof google === 'object' && typeof google.maps === 'object') {}else{
          load_js_file("http://maps.googleapis.com/maps/api/js?key=AIzaSyATKM97y1jeNjfGRzLCnBHg0zUq7XNhVC8&signed_in=true");
        }

        //load_modal(success_string(data.msg), data.action_title);
        $("#"+data.actions).not(".ignore").trigger("reset");

        $(".login-row").removeClass('active-row').addClass('hide');
        $(".home-row").removeClass('hide').addClass('active-row');

      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), data.action_title);
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $("#"+data.actions+' #submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER.."), "ERROR");
    $("#"+data.actions+' #submit').prop("disabled", false);  
  }
}

function logout_row(data){
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".active-user").addClass('hide');
  $(".inactive-user").removeClass('hide');
  $(".home-row").removeClass('hide').addClass('active-row');
  terminate_session();
}

function logout_page(){
  login_modal();
  terminate_pusher();
  terminate_session();
}



function chats_row(data){
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".chats-row").removeClass('hide').addClass('active-row');
  get_chats();
}

function register_driver_row(){
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".register-driver-row").removeClass('hide').addClass('active-row');
  $("#register_driver #user_id").val(user_id);
  $("#register_driver #device_platform").val(device_platform.toLowerCase());
  $("#register_driver #token").val(user_push_token);
}

function register_driver_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){

      if(data.query_status == 0){
        load_modal(err_string(data.msg), data.action_title);
        $("#"+data.actions+" .form-progress").addClass("hide");
      }

      if(data.query_status == 1){
        load_modal(success_string(data.msg), data.action_title);

        user_driver         = 1;
        user_car_reg        = data.car_reg;
        user_car_pic        = data.car_pic;
        user_license        = data.license;
        
        $("#"+data.actions).not(".ignore").trigger("reset");
        $("#"+data.actions+" .form-progress").addClass("hide");

        $(".register-driver-row").removeClass('active-row').addClass('hide');
        $(".home-row").removeClass('hide').addClass('active-row');
      }

      if(data.query_status == 2){
        load_modal(info_string(data.msg), data.action_title);
        $("#"+data.actions+" .form-progress").addClass("hide");
      }

    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
      $("#"+data.actions+" .form-progress").addClass("hide");
    }

    $("#"+data.actions+' #submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER.."), "ERROR");
    $("#"+data.actions+' #submit').prop("disabled", false);  
    $("#"+data.actions+" .form-progress").addClass("hide");
  }
}

function register_row(data){
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".register-row").removeClass('hide').addClass('active-row');
  $("#device_platform").val(device_platform.toLowerCase());
  $("#device_model").val(device_model.toLowerCase());
  $("#device_version").val(device_version.toLowerCase());
  $("#token").val(user_push_token);
}

function register_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){

      if(data.query_status == 0){
        load_modal(err_string(data.msg), data.action_title);
        $("#"+data.actions+" .form-progress").addClass("hide");
      }

      if(data.query_status == 1){
        window.localStorage.setItem("session", data.details);
        var details           = $.parseJSON(atob(data.details));
        user_username         = details.username;
        user_level            = details.level;
        user_description      = level_description[user_level];
        user_name             = details.name;
        user_surname          = details.surname;
        user_id               = details.ID;
        user_client_id        = details.client_id;
        user_client           = details.client;
        user_push_token       = details.token;
        user_student_id       = details.account;
        user_mobile           = details.mobile;
        //user_profile          = details.profile;
        //user_driver           = details.driver;
        user_student_pic      = details.student_pic;

        $(".inactive-user").addClass('hide');
        $(".active-user").removeClass('hide');
        
        load_modal(success_string(data.msg), data.action_title);
        $("#"+data.actions).not(".ignore").trigger("reset");
        $("#"+data.actions+" .form-progress").addClass("hide");

        $(".register-row").removeClass('active-row').addClass('hide');
        $(".terms-conditions-row").removeClass('hide').addClass('active-row');
      }

      if(data.query_status == 2){
        load_modal(info_string(data.msg), data.action_title);
        $("#"+data.actions+" .form-progress").addClass("hide");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
      $("#"+data.actions+" .form-progress").addClass("hide");
    }

    $("#"+data.actions+' #submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER.."), "ERROR");
    $("#"+data.actions+' #submit').prop("disabled", false);  
    $("#"+data.actions+" .form-progress").addClass("hide");
  }
}

function profile_row(data){
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".profile-row").removeClass('hide').addClass('active-row');

  $("#update_user #user_id").val(user_id);
  $("#update_user #device_platform").val(device_platform);
  $("#update_user #device_model").val(device_model);
  $("#update_user #device_version").val(device_version);
  $("#update_user #token").val(user_push_token);

  $("#update_user #title").val(user_title);
  $("#update_user #name").val(user_name);
  $("#update_user #surname").val(user_surname);
  $("#update_user #student_id").val(user_student_id);
  $("#update_user #mobile").val(user_mobile);
  $("#update_user #car_reg").val(user_car_reg);
  $("#update_user #username").val(user_username);

  if(user_student_pic !== null || user_student_pic !== undefined){
    $("#update_user .id_card_uri_1_progress").html(' <i class="fa fa-thumbs-up text"></i> image attached').removeClass('hide');
    $("#update_user #id_card_uri_1_check").val(user_student_pic);
    console.log("USER STUDENT PIC: "+user_student_pic);
  }

  if(user_car_pic !== null || user_car_pic !== undefined){
    $("#update_user .car_uri_1_progress").html(' <i class="fa fa-thumbs-up text"></i> image attached').removeClass('hide');
    $("#update_user #car_uri_1_check").val(user_car_pic);
    console.log("USER CAR: "+user_car_pic);
  }

  if(user_license !== null || user_license !== undefined){
    $("#update_user .license_uri_1_progress").html(' <i class="fa fa-thumbs-up text"></i> image attached').removeClass('hide');
    $("#update_user #license_uri_1_check").val(user_license);
    console.log("USER LICENSE: "+user_license);
  }
}

function drivers_row(data){
  var content = "<span  class='er-text'><img src='images/loaders/indicator-lite.gif' class='m-r-sm form-progress'> GETTING YOUR LOCATION AND SEARCHING FOR YOUR NEAREST RIDE...</span></span>";
  var title   = "GET A RIDE";
  load_modal(content, title);

  if(deploy_device == "desktop"){
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        var post_data = "actions=taxi_call&user_id="+user_id+"&latitude="+position.coords.latitude+"&longitude="+position.coords.longitude;
        $.post(request_url+"?data="+btoa(post_data), function(data) {
          var info = $.parseJSON(data);
          console.log(info);
          if (info.hasOwnProperty("query_status")){
            if(info.query_status == 1){
              $( document ).find('.active-row').addClass('hide').removeClass('active-row');
              $(".drivers-row").removeClass('hide').addClass('active-row');
              //LIST NEAREST DRIVERS
              if(info.responders){
                var listData = "";
                $.each(info.responders, function(k, v) {
                  listData += "<li class='list-group-item'>"+
                              "<div class='media'>"+
                              "<a href='#' data-link='deploy-taxi?user_id="+user_id+"&responder="+v.responder+"&id="+info.id+"'>"+
                              "<span class='pull-left thumb-sm'><img src='images/avatar_default.jpg' class='img-circle'></span>"+
                              "<div class='pull-right text-success m-t-sm'><i class='fa fa-circle'></i></div>"+
                              "<div class='media-body'>"+
                              "<div>"+v.name+"</div>"+
                              "<small class='text-muted'>"+v.distance+" Km away</small>"+
                              "</div>"+
                              "</a>"+
                              "</div>"+
                              "</li>";
                });
                $(".drivers-list").html(listData).removeClass('hide');
                close_modal();
                $(".num-drivers").html(info.responders.length+" rides available");
              }else{
                $(".num-drivers").html("0 rides available");
                $(".modal-body .er-text").html(err_string("THERE ARE NO RIDES NEAR BY TRY AGAIN IN A FEW MINUTES"));
                $(".modal-body .er-btns").show();
              }
            }else{
              $(".modal-body .er-text").html(info_string(info.msg));
            }
          }else{
            $(".modal-body .er-text").html(err_string("ERROR TRYING TO YOU A RIDE. PLEASE TRY AGAIN LATER"));
            $(".modal-body .er-btns").show();
          }
        }).fail(function(data) {
          $(".modal-body .er-text").html(err_string("ERROR TRYING TO YOU A RIDE. PLEASE CHECK INTERNET CONNECTION AND TRY AGAIN"));
          $(".modal-body .er-btns").show();
        });
      }, function() {
        //handleNoGeolocation(browserSupportFlag);
        $(".modal-body .er-text").html(err_string("SORRY! URIDE WAS UNABLE TO GET YOUR CURRENT LOCATION. PLEASE CHECK YOUR INTERNET CONNECTION OR SWITCH ON YOUR PHONES GPS"));
        $(".modal-body .er-btns").show();
      });
    }
  }

  if(deploy_device == "mobile"){
    var options = {maximumAge : 10000, timeout: 10000, enableHighAccuracy : true}; //timeout after 30sec
  	//GET USERS LOCATION
  	navigator.geolocation.getCurrentPosition(
        function(position){
         var post_data       = "actions=taxi_call&user_id="+user_id+"&latitude="+position.coords.latitude+"&longitude="+position.coords.longitude;
         $.post(request_url+"?data="+btoa(post_data), function(data) {
           var info = $.parseJSON(data);
           console.log(info);
           if (info.hasOwnProperty("query_status")){
             if(info.query_status == 1){
              $( document ).find('.active-row').addClass('hide').removeClass('active-row');
              $(".drivers-row").removeClass('hide').addClass('active-row');
              //LIST NEAREST DRIVERS
              if(info.responders){
                var listData = "";
                $.each(info.responders, function(k, v) {
                  listData += "<li class='list-group-item'>"+
                              "<div class='media'>"+
                              "<a href='#' data-link='deploy-taxi?user_id="+user_id+"&responder="+v.responder+"&id="+info.id+"'>"+
                              "<span class='pull-left thumb-sm'><img src='images/avatar_default.jpg' class='img-circle'></span>"+
                              "<div class='pull-right text-success m-t-sm'><i class='fa fa-circle'></i></div>"+
                              "<div class='media-body'>"+
                              "<div>"+v.name+"</div>"+
                              "<small class='text-muted'>"+v.distance+" Km away</small>"+
                              "</div>"+
                              "</a>"+
                              "</div>"
                              "</li>";
                });
                $(".drivers-list").html(listData).removeClass('hide');
                close_modal();
                $(".num-drivers").html(info.responders.length+" rides available");
              }else{
                $(".modal-body .er-text").html(err_string("THERE ARE NO RIDES NEAR BY TRY AGAIN IN A FEW MINUTES"));
                $(".modal-body .er-btns").show();
                $(".num-drivers").html("0 rides available");
              }
            }else{
              $(".modal-body .er-text").html(info_string(info.msg));
            }
           }else{
             $(".modal-body .er-text").html(err_string("ERROR TRYING TO YOU A RIDE. PLEASE TRY AGAIN LATER"));
              $(".modal-body .er-btns").show();
           }
         }).fail(function(data) {
           $(".modal-body .er-text").html(err_string("ERROR TRYING TO YOU A RIDE. PLEASE CHECK INTERNET CONNECTION AND TRY AGAIN"));
           $(".modal-body .er-btns").show();
         });
        },
        function(error){
          if(error.code == 1){
            $(".modal-body .er-text").html(err_string("PLEASE SWITCH ON YOUR PHONES GPS POSITIONING ON"));
            $(".modal-body .er-btns").show();
          }
          if(error.code == 2){
            $(".modal-body .er-text").html(err_string("SORRY URIDE WAS UNABLE TO GET YOUR CURRENT LOCATION. PLEASE CHECK YOUR INTERNET CONNECTION"));
            $(".modal-body .er-btns").show();
          }
          if(error.code == 3){
            $(".modal-body .er-text").html(err_string("SORRY URIDE WAS UNABLE TO GET YOUR CURRENT LOCATION. PLEASE TRY AGAIN"));
            $(".modal-body .er-btns").show();
          }
          
        },
        options
    );
  }  
}

function chat_messages_row(data){
  document.title = "CHAT DETAILS";
  $(".navbar-brand").html(user_client);

  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".chat-messages-row").removeClass('hide').addClass('active-row');

  console.log(data);

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "responder"){
      var responder = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }
    if(data[i].substr(0, data[i].indexOf("=")) == "chat_id"){
      var chat_id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  $("#taxi_call_chat #chat_id").val(chat_id);
  $("#taxi_call_chat #responder").val(responder);
  $("#taxi_call_chat #user_id").val(user_id);

  //GET CHAT MESSAGES SAVED
  get_chat_messages(responder, chat_id);

  //GET LOCATION DETAILS
  post_data         = "actions=taxi_call_details&user_id="+user_id+"&id="+chat_id;
  $.post(request_url+"?data="+btoa(post_data), function(data) {
    console.log(data);
    try{
      var info = $.parseJSON(data);    
      
      if(info.details.latitude && info.details.longitude){
        set_up_google_map(info.details.latitude, info.details.longitude);        
      }else{
        $("#mapit").html("no map details");
      }
    }catch(err){
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER."), "ERROR");
      $(".navbar-brand").html(user_client);
    }
  }).fail(function(data) {
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR: PLEASE CHECK YOUR INTERNET CONNECTION"), "CONNECTION"); 
  });
}

function set_up_google_map(latitude, longitude){
  var call_status = ["", "INITIATED", "DRIVER NOTIFIED", "DRIVER RESPONDED"];
  var clientPostion;
  var marker;
  var map;
  //var W = $(".map-details").width();
  var W = $(window).width() - 60; 
  var H = $(window).height();
  var infowindow = null;
  var window_content;
  var i = 0;

  $("#mapit").html("<img src='images/loaders/squares-circle.gif'>LOADING LOCATION ...");
  if (typeof google === 'object' && typeof google.maps === 'object') {
    clientPostion = new google.maps.LatLng(latitude, longitude);
    $('#mapit').width(W+"px").height(H+"px");
    
    var mapOptions = {center: clientPostion, zoom: 15, mapTypeId: google.maps.MapTypeId.ROADMAP }        
    var map = new google.maps.Map(document.getElementById("mapit"), mapOptions);
    
    //set members position
    marker = new google.maps.Marker({
      map:map,
      draggable:false,
      animation: google.maps.Animation.DROP,
      position: clientPostion
    });
    marker.setAnimation(google.maps.Animation.BOUNCE); 

  }else{
    $("#mapit").html("<P>MAP FAILED TO LOAD PLEASE RESTART THE APP TO GET THE LOCATION</P><P>OR CHAT WITH EACH OTHER TO GET LOCATIONS");
  }
}

function get_responders_page(data){
  $(".get-responders-progress").removeClass("hide");
  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }
    if(data[i].substr(0, data[i].indexOf("=")) == "latitude"){
      var latitude = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }
    if(data[i].substr(0, data[i].indexOf("=")) == "longitude"){
      var longitude = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }      
  }

  post_data         = "actions=get_respondents_positions&user_id="+user_id+"&id="+id+"&latitude="+latitude+"&longitude="+longitude;
  query_server(post_data, "GET", "get_respondents_result");
}

function get_respondents_result(data){
  $(".get-responders-progress").addClass("hide");
  var listData = "";
  if (data.hasOwnProperty("responders")){
    if(data.responders){
      $.each(data.responders, function(k, v) {
        listData += '<div class="panel-body">'+
                      '<a href="#" class="thumb pull-right m-l">'+
                        '<img src="images/avatar_default.jpg" class="img-circle">'+
                      '</a>'+
                      '<div class="clear">'+
                        '<a href="#" class="text-info">'+v.name+' ('+v.account+')<i class="icon-twitter"></i></a>'+
                        '<small class="block text-muted">'+v.distance+' km from incident</small>'+
                        '<a data-link='+v.deploy+' href="#" class="btn btn-xs btn-success m-t-xs">Deploy</a>'+
                        '<img src="images/loaders/indicator-lite.gif" class="m-r-sm pull-right deploy-responder-'+v.responder+' hide">'+
                      '</div>'+
                    '</div>';

        i++;
      });

      if(listData){
        $(".responders-available").html(listData).removeClass("hide");
      }else{
        var content = '<div class="panel-body"><a href="#" class="thumb pull-right m-l"><i class="fa fa-ban"></i></a><div class="clear">There are no responders with in 30Km radius of this emergency call</div></div>';
        $(".responders-available").html(content).removeClass("hide");
      }
    }else{
      var content = "THERE ARE NO RESPONDERS WITH IN A 30KM RADIUS OF THIS EMERGENCY CALL";
      var title   = "RESPONDERS";
      load_modal(content, title);
    }
  }else{
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function deploy_taxi(data){
  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }      
  }
  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "responder"){
      var responder_id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }      
  }
  $(".deploy-responder-"+responder_id).removeClass("hide");
  post_data         = "actions=deploy_taxi&user_id="+user_id+"&id="+id+"&responder_id="+responder_id;
  query_server(post_data, "GET", "deploy_taxi_result");
}

function deploy_taxi_result(data){
  $("[class*='deploy-responder-']").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "GET A RIDE");
        console.log(data.dbh_err);
      }

      if(data.query_status == 1){
        //$('#load_content').load(user_description+"/taxi_call_details.php", function(){
          $("#taxi_call_chat #user_id").val(user_id);
          $("#taxi_call_chat #responder").val(data.responder);

          console.log("RESPONDER: "+data.responder);
          console.log("CHAT ID: "+data.id);

          save_message(user_id, data.responder, data.id, data.name, "Need a ride are you available :)", full_today_date, 1, 1)

          var listData  = '<article id="chat-id-1" class="chat-item right">'+
                          '<a href="#" class="pull-right thumb-sm avatar"><img src="images/avatar_default.jpg" class="img-circle"></a>'+
                          '<section class="chat-body">'+
                          '<div class="panel bg bg-primary text-sm m-b-none">'+
                          '<div class="panel-body">'+
                          '<span class="arrow right"></span>'+
                          '<p class="m-b-none">Need a ride are you available :)</p>'+
                          '</div>'+
                          '</div>'+
                          '</section>'+
                          '</article>';

          $(".chat-messages-list").html("<div class='chat-"+data.id+"'>"+listData+"</div>");
          var data_variables = ["responder="+data.responder, "chat_id="+data.id];
          chat_messages_row(data_variables);

          //SAVE CHATS
        //});
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "GET A RIDE");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "GET A RIDE");
    }
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "GET A RIDE");
  }
}

function taxi_call_chat_result(data){
  $("#"+data.actions+" .form-progress").addClass("hide"); 
  $("#"+data.actions+" #submit").prop("disabled", false);
  $("#"+data.actions).not(".ignore").trigger("reset");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "GET A RIDE");
        console.log(data.dbh_err);
      }
      if(data.query_status == 1){
        console.log("RESPONDER: "+data.responder);
          console.log("CHAT ID: "+data.id);
        save_message(user_id, data.responder, data.id, data.name, data.response, full_today_date, 1, 1);

        var listData  = '<article id="chat-id-1" class="chat-item right">'+
                          '<a href="#" class="pull-right thumb-sm avatar"><img src="images/avatar_default.jpg" class="img-circle"></a>'+
                          '<section class="chat-body">'+
                          '<div class="panel bg bg-primary text-sm m-b-none">'+
                          '<div class="panel-body">'+
                          '<span class="arrow right"></span>'+
                          '<p class="m-b-none">'+data.response+'</p>'+
                          '</div>'+
                          '</div>'+
                          '</section>'+
                          '</article>';

        $(".chat-"+data.id).append(listData);
      }

      if(data.query_status == 2){
        load_modal(info_string(data.msg), "GET A RIDE");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "GET A RIDE");
    }
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "GET A RIDE");
  }
}

function update_emergency_call_details_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "EMERGENCY CALL DETAILS");
        console.log(data.dbh_err);
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "EMERGENCY CALL DETAILS");
        $("#create_member_form").trigger("reset");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "EMERGENCY CALL DETAILS");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "EMERGENCY CALL DETAILS");
    }
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "EMERGENCY CALL DETAILS");
  }
}

function calculate_closest_distance(){
  //determine closest
  var lat2 = v.latitude;
  var lon2 = v.longitude;

  var chLat = lat2-latitude;
  var chLon = lon2-longitude;

  var dLat = chLat*(pi/180);
  var dLon = chLon*(pi/180);

  var rLat1 = lat1*(pi/180);
  var rLat2 = lat2*(pi/180);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rLat1) * Math.cos(rLat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;

  distances[i] = d;
  if ( closest == -1 || d < distances[closest] ) {
      closest = i;
      closest_respondent = v.name+" "+v.surname+" "+v.company;
  }
}

function members_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");
  post_data         = "actions=members&user_id="+user_id;
  query_server(post_data, "GET", "members_list");
}

function members_list(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "MEMBERS";
      $(".navbar-brand").html(user_client);
      
      $('#load_content').load(user_description+"/members.php", function(){
        
        if (data.hasOwnProperty("num_results")){
          //$(".members .panel-heading").html(data.num_results+" MEMBERS");
          $("#search_msg").html(data.num_results+" MATCHING RESULTS");
        }else{
          $("#search_msg").html("");
          //$(".members .panel-heading").html("MEMBERS");
        }      

        if(data.members){
          // fuelux datagrid
          var response  = data.members;
          var div       = "#members_grid";

          $(function(){
            // fuelux datagrid
            var DataGridDataSource = function (options) {
              this._formatter = options.formatter;
              this._columns = options.columns;
              this._delay = options.delay;
            };

            DataGridDataSource.prototype = {

              columns: function () {
                return this._columns;
              },

              data: function (options, callback) {
                var self = this;

                setTimeout(function () {

                  var data = $.extend(true, [], self._data);

                  data = response;
                    // SEARCHING
                    if (options.search) {
                      data = _.filter(data, function (item) {
                        var match = false;

                        _.each(item, function (prop) {
                          if (_.isString(prop) || _.isFinite(prop)) {
                            if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                          }
                        });

                        return match;
                      });
                    }

                    // FILTERING
                    if (options.filter) {
                      data = _.filter(data, function (item) {
                        switch(options.filter.value) {
                          case 'lt5m':
                            if(item.status == "Active") return true;
                            break;
                          case 'gte5m':
                            if(item.population == "In-active") return true;
                            break;
                          default:
                            return true;
                            break;
                        }
                      });
                    }

                    var count = data.length;

                    // SORTING
                    if (options.sortProperty) {
                      data = _.sortBy(data, options.sortProperty);
                      if (options.sortDirection === 'desc') data.reverse();
                    }

                    // PAGING
                    var startIndex = options.pageIndex * options.pageSize;
                    var endIndex = startIndex + options.pageSize;
                    var end = (endIndex > count) ? count : endIndex;
                    var pages = Math.ceil(count / options.pageSize);
                    var page = options.pageIndex + 1;
                    var start = startIndex + 1;

                    data = data.slice(startIndex, endIndex);

                    if (self._formatter) self._formatter(data);

                    callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                }, self._delay);
              }
            };

            $(div).each(function() {
              $(this).datagrid({
                  dataSource: new DataGridDataSource({
                  // Column definitions for Datagrid
                  columns: [
                  {
                    property: 'name',
                    label: 'Name',
                    sortable: true
                  },
                  {
                    property: 'account',
                    label: 'Account #',
                    sortable: true
                  },
                  {
                    property: 'client',
                    label: 'Company',
                    sortable: true
                  },
                  {
                    property: 'dependents',
                    label: 'Dependents',
                    sortable: true
                  },
                  {
                    property: 'status',
                    label: 'Status',
                    sortable: true
                  },
                  {
                    property: 'view',
                    label: 'Details',
                    sortable: true
                  }
                ],

                  // Create IMG tag for each returned image
                  formatter: function (items) {
                    $.each(items, function (index, item) {
                      //item.ID = '<a data-link="user_details.php?id='+item.ID+'" href="#"><i class="fa fa-eye"></i></a>';
                    });
                  }
              })
              });
            });
            
          });
        }
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function create_member_page(){
  document.title = "CREATE NEW MEMBER";
  if(user_level == 1 || user_level == 2){
    $('#load_content').load(user_description+"/create_member.php", function(){
      $("#user_id").val(user_id);

      $(function () {
        'use strict';
        // Change this to the location of your server-side upload handler:
        var post_data = base64_encode("actions=pic_uploads");

        $('#profile_pic').fileupload({
            url: request_url+"?data="+post_data,
            dataType: 'json',
            done: function (e, data) {
                $.each(data.result.files, function (index, file) {
                    $("#profile_uri").val(file.name);
                });
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css(
                    'width',
                    progress + '%'
                );
            }
        }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');
      });
    });
  }

  if(user_level == 3 || user_level == 4 || user_level == 5){
    load_modal(err_string(data.msg), "PERMISSIONS");
  }
}

function create_member_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "CREATE MEMBER");
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "CREATE MEMBER");
        $("#create_member_form").trigger("reset");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "CREATE MEMBER");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "CREATE MEMBER");
    }

    $('#submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "CREATE MEMBER");
    $('#submit').prop("disabled", false);  
  }
}

function members_report_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");
  post_data         = "actions=members_report&user_id="+user_id;
  query_server(post_data, "GET", "members_report");
}

function members_report(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "MEMBERS REPORT";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/members_report.php", function(){
        
        if (data.hasOwnProperty("current_month")){
          $(".current-month-num").html(data.current_month+" ACCOUNTS");
          $(".current-month-heading").html(data.current_month_name);
        }

        if (data.hasOwnProperty("previous_month")){
          $(".previous-month-num").html(data.previous_month+" ACCOUNTS");
          $(".previous-month-heading").html(data.previous_month_name);
        }

        if (data.hasOwnProperty("previous_year")){
          $(".previous-year-num").html(data.previous_year+" ACCOUNTS");
          $(".previous-year-heading").html(data.previous_year_name);
        }

        if (data.hasOwnProperty("current_year")){
          $(".current-year-num").html(data.current_year+" ACCOUNTS");
          $(".current-year-heading").html(data.current_year_name);
          $(".members-graph-heading").html(data.current_year_name+" MEMBER ACCOUNTS");        
        }

        if(data.registrations)
          load_graph("#members_graph", data.registrations);
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function respondents_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  post_data         = "actions=respondents&user_id="+user_id;
  query_server(post_data, "GET", "respondents_list");
}

function respondents_list(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "RESPONDERS";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/respondents.php", function(){
        
        if (data.hasOwnProperty("num_results")){
          //$(".members .panel-heading").html(data.num_results+" MEMBERS");
          $("#search_msg").html(data.num_results+" MATCHING RESULTS");
        }else{
          $("#search_msg").html("");
          //$(".members .panel-heading").html("MEMBERS");
        }

        if(data.respondents){
          // fuelux datagrid
          var response  = data.respondents;
          var div       = "#members_grid";

          $(function(){
            // fuelux datagrid
            var DataGridDataSource = function (options) {
              this._formatter = options.formatter;
              this._columns = options.columns;
              this._delay = options.delay;
            };

            DataGridDataSource.prototype = {

              columns: function () {
                return this._columns;
              },

              data: function (options, callback) {
                var self = this;

                setTimeout(function () {

                  var data = $.extend(true, [], self._data);

                  data = response;
                    // SEARCHING
                    if (options.search) {
                      data = _.filter(data, function (item) {
                        var match = false;

                        _.each(item, function (prop) {
                          if (_.isString(prop) || _.isFinite(prop)) {
                            if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                          }
                        });

                        return match;
                      });
                    }

                    // FILTERING
                    if (options.filter) {
                      data = _.filter(data, function (item) {
                        switch(options.filter.value) {
                          case 'lt5m':
                            if(item.status == "Active") return true;
                            break;
                          case 'gte5m':
                            if(item.population == "In-active") return true;
                            break;
                          default:
                            return true;
                            break;
                        }
                      });
                    }

                    var count = data.length;

                    // SORTING
                    if (options.sortProperty) {
                      data = _.sortBy(data, options.sortProperty);
                      if (options.sortDirection === 'desc') data.reverse();
                    }

                    // PAGING
                    var startIndex = options.pageIndex * options.pageSize;
                    var endIndex = startIndex + options.pageSize;
                    var end = (endIndex > count) ? count : endIndex;
                    var pages = Math.ceil(count / options.pageSize);
                    var page = options.pageIndex + 1;
                    var start = startIndex + 1;

                    data = data.slice(startIndex, endIndex);

                    if (self._formatter) self._formatter(data);

                    callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                }, self._delay);
              }
            };

            $(div).each(function() {
              $(this).datagrid({
                  dataSource: new DataGridDataSource({
                  // Column definitions for Datagrid
                  columns: [
                  {
                    property: 'name',
                    label: 'Name',
                    sortable: true
                  },
                  {
                    property: 'client',
                    label: 'Company',
                    sortable: true
                  },
                  {
                    property: 'account',
                    label: 'Responder #',
                    sortable: true
                  },
                  {
                    property: 'status',
                    label: 'Status',
                    sortable: true
                  },                
                  {
                    property: 'view',
                    label: 'Details',
                    sortable: true
                  }
                ],

                  // Create IMG tag for each returned image
                  formatter: function (items) {
                    $.each(items, function (index, item) {
                    });
                  }
              })
              });
            });
            
          });
        }
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function create_respondent_page(){

  if(user_level == 1 || user_level == 2){
    document.title = "CREATE NEW RESPONDER";
    $('#load_content').load(user_description+"/create_respondent.php", function(){
      $("#user_id").val(user_id);
    });
  }
  if(user_level == 3 || user_level == 4 || user_level == 5){
    load_modal(err_string("ACCESS DENIED"), "PERMISSIONS");
  }
}

function create_responder_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "CREATE RESPONDER");
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "CREATE RESPONDER");
        $("#create_responder_form").trigger("reset");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "CREATE RESPONDER");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $('#submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "CREATE RESPONDER");
    $('#submit').prop("disabled", false);  
  }
}

function respondents_report_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");
  post_data         = "actions=respondents_report&user_id="+user_id;
  query_server(post_data, "GET", "respondents_report");
}

function respondents_report(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "RESPONDERS REPORT";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/respondents_report.php", function(){
        
        if (data.hasOwnProperty("current_month")){
          $(".current-month-num").html(data.current_month+" ACCOUNTS");
          $(".current-month-heading").html(data.current_month_name);
        }

        if (data.hasOwnProperty("previous_month")){
          $(".previous-month-num").html(data.previous_month+" ACCOUNTS");
          $(".previous-month-heading").html(data.previous_month_name);
        }

        if (data.hasOwnProperty("previous_year")){
          $(".previous-year-num").html(data.previous_year+" ACCOUNTS");
          $(".previous-year-heading").html(data.previous_year_name);
        }

        if (data.hasOwnProperty("current_year")){
          $(".current-year-num").html(data.current_year+" ACCOUNTS");
          $(".current-year-heading").html(data.current_year_name);
          $(".respondents-graph-heading").html(data.current_year_name+" MEMBER ACCOUNTS");        
        }

        if(data.registrations)
          load_graph("#respondents_graph", data.registrations);
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "PERMISSIONS");
  }
}

function administrators_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");
  post_data         = "actions=administrators&user_id="+user_id;
  query_server(post_data, "GET", "administrators_list");
}

function administrators_list(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "ADMINISTRATORS";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/administrators.php", function(){
        
        if (data.hasOwnProperty("num_results")){
          //$(".members .panel-heading").html(data.num_results+" MEMBERS");
          $("#search_msg").html(data.num_results+" MATCHING RESULTS");
        }else{
          $("#search_msg").html("");
          //$(".members .panel-heading").html("MEMBERS");
        }

        if(data.administrators){
          // fuelux datagrid
          var response  = data.administrators;
          var div       = "#members_grid";

          $(function(){
            // fuelux datagrid
            var DataGridDataSource = function (options) {
              this._formatter = options.formatter;
              this._columns = options.columns;
              this._delay = options.delay;
            };

            DataGridDataSource.prototype = {

              columns: function () {
                return this._columns;
              },

              data: function (options, callback) {
                var self = this;

                setTimeout(function () {

                  var data = $.extend(true, [], self._data);

                  data = response;
                    // SEARCHING
                    if (options.search) {
                      data = _.filter(data, function (item) {
                        var match = false;

                        _.each(item, function (prop) {
                          if (_.isString(prop) || _.isFinite(prop)) {
                            if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                          }
                        });

                        return match;
                      });
                    }

                    // FILTERING
                    if (options.filter) {
                      data = _.filter(data, function (item) {
                        switch(options.filter.value) {
                          case 'lt5m':
                            if(item.status == "Active") return true;
                            break;
                          case 'gte5m':
                            if(item.population == "In-active") return true;
                            break;
                          default:
                            return true;
                            break;
                        }
                      });
                    }

                    var count = data.length;

                    // SORTING
                    if (options.sortProperty) {
                      data = _.sortBy(data, options.sortProperty);
                      if (options.sortDirection === 'desc') data.reverse();
                    }

                    // PAGING
                    var startIndex = options.pageIndex * options.pageSize;
                    var endIndex = startIndex + options.pageSize;
                    var end = (endIndex > count) ? count : endIndex;
                    var pages = Math.ceil(count / options.pageSize);
                    var page = options.pageIndex + 1;
                    var start = startIndex + 1;

                    data = data.slice(startIndex, endIndex);

                    if (self._formatter) self._formatter(data);

                    callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                }, self._delay);
              }
            };

            $(div).each(function() {
              $(this).datagrid({
                  dataSource: new DataGridDataSource({
                  // Column definitions for Datagrid
                  columns: [
                  {
                    property: 'name',
                    label: 'Name',
                    sortable: true
                  },
                  {
                    property: 'client',
                    label: 'Company',
                    sortable: true
                  },
                  {
                    property: 'status',
                    label: 'Status',
                    sortable: true
                  },                
                  {
                    property: 'view',
                    label: 'Details',
                    sortable: true
                  }
                ],

                  // Create IMG tag for each returned image
                  formatter: function (items) {
                    $.each(items, function (index, item) {
                      //item.ID = '<a data-link="user_details.php?id='+item.ID+'" href="#"><i class="fa fa-eye"></i></a>';
                    });
                  }
              })
              });
            });
            
          });
        }
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "PERMISSIONS");
  }    
}

function create_administrator_page(){
  if(user_level == 1 || user_level == 2){
    document.title = "CREATE NEW ADMINISTRATOR";
    $('#load_content').load(user_description+"/create_administrator.php", function(){
      $("#user_id").val(user_id);
    });
  }
  if(user_level == 3 || user_level == 4 || user_level == 5){
    load_modal(err_string("ACCESS DENIED"), "PERMISSIONS");
  }
}

function create_administrator_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "CREATE ADMINISTRATOR");
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "CREATE ADMINISTRATOR");
        $("#create_administrator_form").trigger("reset");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "CREATE ADMINISTRATOR");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $('#submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "CREATE ADMINISTRATOR");
    $('#submit').prop("disabled", false);  
  }
}

function profile_page(){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  post_data         = "actions=profile&user_id="+user_id;
  query_server(post_data, "GET", "profile");
}

function profile(data){
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "PROFILE";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/profile.php", function(){

        if(data.details){
          var details = data.details;
          $(".profile-name").html(details.name+" "+details.surname);
          $(".profile-area").html("<i class='fa fa-map-marker'> "+details.area+", "+details.city);
          $(".profile-address").html(details.address+"<br>"+details.area+" "+details.city);
          $(".profile-mobile").html(details.mobile);
          $(".profile-email").html(details.email);


          $("#title").val(details.title);
          $("#name").val(details.name);
          $("#surname").val(details.surname);
          $("#idnumber").val(details.idnumber);
          $("#birthdate").val(details.birthdate);
          $("#mobile").val(details.mobile);
          $("#email").val(details.email);
          $("#account").val(details.account);
          $("#gender").val(details.gender);
          $("#address").val(details.address);
          $("#area").val(details.area);
          $("#city").val(details.city);
        }
      });  
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function user_details_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  post_data         = "actions=user_profile&user_id="+user_id+"&id="+id;
  query_server(post_data, "GET", "user_details");
}

function user_details(data){
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "USER DETAILS";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/user_details.php", function(){
        //PIC LOADER
        load_pic_loader("pic_uploads"); 
        $("#user_id").val(user_id);
        //DETAILS
        if(data.details){
          var details = data.details;
          $(".profile-name").html(details.name+" "+details.surname);
          $(".profile-area").html("<i class='fa fa-map-marker'> "+details.area+", "+details.city);
          $(".profile-address").html(details.address+"<br>"+details.area+" "+details.city);
          $(".profile-mobile").html(details.mobile);
          $(".profile-email").html(details.email);

          //account link creater
          $("#add_user_transactions").attr("data-link", "add_user_transactions.php?id="+details.ID);

          $("#id").val(details.ID);
          $("#level").val(details.level);
          $("#title").val(details.title);
          $("#name").val(details.name);
          $("#surname").val(details.surname);
          $("#idnumber").val(details.idnumber);
          $("#birthdate").val(details.birthdate);
          $("#mobile").val(details.mobile);
          $("#email").val(details.email);
          $("#account").val(details.account);
          $("#gender").val(details.gender);
          $("#address").val(details.address);
          $("#area").val(details.area);
          $("#city").val(details.city);
          $("#status").val(details.status);
          $("#username").val(details.username);

          $("#send_user_message #id").val(details.ID);
          $("#send_user_message #user_id").val(user_id);
        }
        //EMERGENCY CALLS
        var listData = "";
        if(data.emergency_calls){
          $.each(data.emergency_calls, function(k, v) {
            console.log(k+"-"+v);
            listData += "<tr>";
              listData += "<td>"+v.name+"</td>";
              listData += "<td>"+v.type+"</td>";
              listData += "<td>"+v.date+"</td>";
              listData += "<td>"+v.status+"</td>";
              listData += "<td><a data-link='emergency_call_details.php?id="+v.ID+"' href='#'><i class='fa fa-eye'></i></a></td>";
            listData += "<tr>";
          });

          $("#emergency_calls_grid").html(listData);
        }
        //DEPENDENTS
        var listData = "";
        if(data.dependents){
          $.each(data.dependents, function(k, v) {
            console.log(k+"-"+v);
            listData += "<tr>";
              listData += "<td>"+v.name+"</td>";
              listData += "<td>"+v.status+"</td>";
              listData += "<td><a data-link='user_details.php?id="+v.ID+"' href='#'><i class='fa fa-eye'></i></a></td>";
            listData += "<tr>";
          });

          $("#dependents_grid").html(listData);
        }

        //ACCOUNT BALANCE
        $(".account-balance").text("$"+data.account_balance);
        //TRANSCTIONS
        if(data.accounts){
          // fuelux datagrid
          var response  = data.accounts;
          var div       = "#accounts_grid";

          $(function(){
            // fuelux datagrid
            var DataGridDataSource = function (options) {
              this._formatter = options.formatter;
              this._columns = options.columns;
              this._delay = options.delay;
            };

            DataGridDataSource.prototype = {

              columns: function () {
                return this._columns;
              },

              data: function (options, callback) {
                var self = this;

                setTimeout(function () {

                  var data = $.extend(true, [], self._data);

                  data = response;
                    // SEARCHING
                    if (options.search) {
                      data = _.filter(data, function (item) {
                        var match = false;

                        _.each(item, function (prop) {
                          if (_.isString(prop) || _.isFinite(prop)) {
                            if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                          }
                        });

                        return match;
                      });
                    }

                    // FILTERING
                    if (options.filter) {
                      data = _.filter(data, function (item) {
                        switch(options.filter.value) {
                          case 'lt5m':
                            if(item.status == "Active") return true;
                            break;
                          case 'gte5m':
                            if(item.population == "In-active") return true;
                            break;
                          default:
                            return true;
                            break;
                        }
                      });
                    }

                    var count = data.length;

                    // SORTING
                    if (options.sortProperty) {
                      data = _.sortBy(data, options.sortProperty);
                      if (options.sortDirection === 'desc') data.reverse();
                    }

                    // PAGING
                    var startIndex = options.pageIndex * options.pageSize;
                    var endIndex = startIndex + options.pageSize;
                    var end = (endIndex > count) ? count : endIndex;
                    var pages = Math.ceil(count / options.pageSize);
                    var page = options.pageIndex + 1;
                    var start = startIndex + 1;

                    data = data.slice(startIndex, endIndex);

                    if (self._formatter) self._formatter(data);

                    callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                }, self._delay);
              }
            };

            $(div).each(function() {
              $(this).datagrid({
                  dataSource: new DataGridDataSource({
                  // Column definitions for Datagrid
                  columns: [
                  {
                    property: 'date',
                    label: 'Date',
                    sortable: true
                  },
                  {
                    property: 'receipt',
                    label: 'Receipt',
                    sortable: true
                  },
                  {
                    property: 'description',
                    label: 'Description',
                    sortable: true
                  },
                  {
                    property: 'cr',
                    label: 'Credit',
                    sortable: true
                  },
                  {
                    property: 'db',
                    label: 'Debit',
                    sortable: true
                  },
                  {
                    property: 'balance',
                    label: 'Balance',
                    sortable: true
                  },
                  {
                    property: 'view',
                    label: 'Details',
                    sortable: true
                  }
                ],

                  // Create IMG tag for each returned image
                  formatter: function (items) {
                    $.each(items, function (index, item) {
                      //item.ID = '<a data-link="invoice.php?id='+item.ID+'" href="#"><i class="fa fa-eye"></i></a>';
                    });
                  }
              })
              });
            });
            
          });
        }
      });  
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function users_list_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "level"){
      var level = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  post_data         = "actions=administrators&user_id="+user_id;
  query_server(post_data, "GET", "users_list");
}



function users_list(data){
  var listData = "";
  if(data.query_status == 1){
    $(".navbar-brand").html(user_client);

    $('#load_content').load(user_description+profile_page, function(){
      if (data.hasOwnProperty("num_results"))
        $("#search_msg").html(data.num_results+" MATCHING RESULTS");
      else
        $("#search_msg").html("");
      
      $.each(data.data_array, function(k, v) {
        listData += "<tr>";
          listData += "<td>"+v.name+"</td>";
          listData += "<td>"+v.area+"</td>";
          listData += "<td>"+v.city+"</td>";
          listData += "<td><a data-link='respondents_details.php?ID="+v.ID+"' href='#'><i class='fa fa-eye'></i></a></td>";
        listData += "<tr>";
      });

      $("#data_grid").html(listData);
    });
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string(data.msg), "PERMISSIONS");
  }
}

function emergency_calls_today_list(data){
  var listData = "";
  if(data.query_status == 1){

    if (data.hasOwnProperty("num_results"))
      $("#search_msg").html(data.num_results+" MATCHING RESULTS");
    else
      $("#search_msg").html("");
    
    $.each(data.data_array, function(k, v) {
      listData += "<tr>";
        listData += "<td>"+v.name+"</td>";
        listData += "<td>"+v.type+"</td>";
        listData += "<td>"+v.date+"</td>";
        listData += "<td>"+v.status+"</td>";
        listData += "<td><a data-link='emergency_call_details.php?id="+v.ID+"' href='#'><i class='fa fa-eye'></i></a></td>";
      listData += "<tr>";
    });

    $("#data_grid").html(listData);
  }else{
    $("#search_msg").html(data.msg);
  }
}

function transactions_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  post_data         = "actions=transactions&user_id="+user_id;
  query_server(post_data, "GET", "transactions_list");
}

function transactions_list(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "TRANSACTIONS";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/transactions.php", function(){
        
        if (data.hasOwnProperty("num_results")){
          //$(".members .panel-heading").html(data.num_results+" MEMBERS");
          $("#search_msg").html(data.num_results+" MATCHING RESULTS");
        }else{
          $("#search_msg").html("");
          //$(".members .panel-heading").html("MEMBERS");
        }

        if(data.transactions){
          // fuelux datagrid
          var response  = data.transactions;
          var div       = "#transactions_grid";

          if(user_level == 1){
            $(function(){
              // fuelux datagrid
              var DataGridDataSource = function (options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
                this._delay = options.delay;
              };

              DataGridDataSource.prototype = {

                columns: function () {
                  return this._columns;
                },

                data: function (options, callback) {
                  var self = this;

                  setTimeout(function () {

                    var data = $.extend(true, [], self._data);

                    data = response;
                      // SEARCHING
                      if (options.search) {
                        data = _.filter(data, function (item) {
                          var match = false;

                          _.each(item, function (prop) {
                            if (_.isString(prop) || _.isFinite(prop)) {
                              if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                            }
                          });

                          return match;
                        });
                      }

                      // FILTERING
                      if (options.filter) {
                        data = _.filter(data, function (item) {
                          switch(options.filter.value) {
                            case 'lt5m':
                              if(item.status == "Active") return true;
                              break;
                            case 'gte5m':
                              if(item.population == "In-active") return true;
                              break;
                            default:
                              return true;
                              break;
                          }
                        });
                      }

                      var count = data.length;

                      // SORTING
                      if (options.sortProperty) {
                        data = _.sortBy(data, options.sortProperty);
                        if (options.sortDirection === 'desc') data.reverse();
                      }

                      // PAGING
                      var startIndex = options.pageIndex * options.pageSize;
                      var endIndex = startIndex + options.pageSize;
                      var end = (endIndex > count) ? count : endIndex;
                      var pages = Math.ceil(count / options.pageSize);
                      var page = options.pageIndex + 1;
                      var start = startIndex + 1;

                      data = data.slice(startIndex, endIndex);

                      if (self._formatter) self._formatter(data);

                      callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                  }, self._delay);
                }
              };

              $(div).each(function() {
                $(this).datagrid({
                    dataSource: new DataGridDataSource({
                    // Column definitions for Datagrid
                    columns: [
                    {
                      property: 'date',
                      label: 'Date',
                      sortable: true
                    },
                    {
                      property: 'client',
                      label: 'Company',
                      sortable: true
                    },
                    {
                      property: 'receipt',
                      label: 'Receipt #',
                      sortable: true
                    },
                    {
                      property: 'description',
                      label: 'Description',
                      sortable: true
                    },
                    {
                      property: 'quantity',
                      label: 'Quantity',
                      sortable: true
                    },
                    {
                      property: 'amount',
                      label: 'Amount',
                      sortable: true
                    },
                    {
                      property: 'total',
                      label: 'Total',
                      sortable: true
                    },
                    {
                      property: 'view',
                      label: 'Details',
                      sortable: true
                    }
                  ],

                    // Create IMG tag for each returned image
                    formatter: function (items) {
                      $.each(items, function (index, item) {
                        //item.ID = '<a data-link="user_details.php?id='+item.ID+'" href="#"><i class="fa fa-eye"></i></a>';
                      });
                    }
                })
                });
              });
              
            });
          } 

          if(user_level == 2){
            $(function(){
              // fuelux datagrid
              var DataGridDataSource = function (options) {
                this._formatter = options.formatter;
                this._columns = options.columns;
                this._delay = options.delay;
              };

              DataGridDataSource.prototype = {

                columns: function () {
                  return this._columns;
                },

                data: function (options, callback) {
                  var self = this;

                  setTimeout(function () {

                    var data = $.extend(true, [], self._data);

                    data = response;
                      // SEARCHING
                      if (options.search) {
                        data = _.filter(data, function (item) {
                          var match = false;

                          _.each(item, function (prop) {
                            if (_.isString(prop) || _.isFinite(prop)) {
                              if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                            }
                          });

                          return match;
                        });
                      }

                      // FILTERING
                      if (options.filter) {
                        data = _.filter(data, function (item) {
                          switch(options.filter.value) {
                            case 'lt5m':
                              if(item.status == "Active") return true;
                              break;
                            case 'gte5m':
                              if(item.population == "In-active") return true;
                              break;
                            default:
                              return true;
                              break;
                          }
                        });
                      }

                      var count = data.length;

                      // SORTING
                      if (options.sortProperty) {
                        data = _.sortBy(data, options.sortProperty);
                        if (options.sortDirection === 'desc') data.reverse();
                      }

                      // PAGING
                      var startIndex = options.pageIndex * options.pageSize;
                      var endIndex = startIndex + options.pageSize;
                      var end = (endIndex > count) ? count : endIndex;
                      var pages = Math.ceil(count / options.pageSize);
                      var page = options.pageIndex + 1;
                      var start = startIndex + 1;

                      data = data.slice(startIndex, endIndex);

                      if (self._formatter) self._formatter(data);

                      callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
                  }, self._delay);
                }
              };

              $(div).each(function() {
                $(this).datagrid({
                    dataSource: new DataGridDataSource({
                    // Column definitions for Datagrid
                    columns: [
                    {
                      property: 'date',
                      label: 'Date',
                      sortable: true
                    },
                    {
                      property: 'receipt',
                      label: 'Receipt #',
                      sortable: true
                    },
                    {
                      property: 'description',
                      label: 'Description',
                      sortable: true
                    },
                    {
                      property: 'quantity',
                      label: 'Quantity',
                      sortable: true
                    },
                    {
                      property: 'amount',
                      label: 'Amount',
                      sortable: true
                    },
                    {
                      property: 'total',
                      label: 'Total',
                      sortable: true
                    },
                    {
                      property: 'view',
                      label: 'Details',
                      sortable: true
                    }
                  ],

                    // Create IMG tag for each returned image
                    formatter: function (items) {
                      $.each(items, function (index, item) {
                        //item.ID = '<a data-link="user_details.php?id='+item.ID+'" href="#"><i class="fa fa-eye"></i></a>';
                      });
                    }
                })
                });
              });
              
            });
          }

          if(user_level == 3 || user_level == 4){

          }       
        }
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function add_user_transactions_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  post_data         = "actions=get_receipt_num&user_id="+user_id+"&id="+id;
  query_server(post_data, "GET", "add_user_transactions");
}

function add_user_transactions(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "CREATE TRANSACTION";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/add_user_transactions.php", function(){
        
        $("#user_id").val(user_id);

        if (data.hasOwnProperty("account"))
          $("#account").val(data.account);

        if (data.hasOwnProperty("receipt"))
          $("#receipt").val(data.receipt);

        if (data.hasOwnProperty("member_id"))
          $("#id").val(data.member_id);

      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function add_transaction_page(){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  post_data         = "actions=get_receipt_num&user_id="+user_id;
  query_server(post_data, "GET", "add_user_transactions");
}

function add_transaction(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/add_transactions.php", function(){
        
        $("#user_id").val(user_id);

        if (data.hasOwnProperty("account"))
          $("#account").val(data.account);

        if (data.hasOwnProperty("receipt"))
          $("#receipt").val(data.receipt);

        if (data.hasOwnProperty("member_id"))
          $("#id").val(data.member_id);

      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function add_transaction_line_page(data){

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  $(".line-"+id).removeClass("hide");
}

function add_transaction_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "SEND MESSAGE");
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "SEND MESSAGE");
        $(":input", "#add_transaction_form").not("#user_id, #actions").val("").removeAttr("checked").removeAttr("selected");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "SEND MESSAGE");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $('#submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "SEND MESSAGE");
    $('#submit').prop("disabled", false);  
  }
}

function invoice_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  post_data         = "actions=invoice&user_id="+user_id+"&id="+id;
  query_server(post_data, "GET", "invoice");
}

function invoice(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "INVOICE";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/invoice.php", function(){
        
        var member = data.member;
        $(".member-name").html(member.name+" "+member.surname);
        $(".member-address").html(member.address+"<br>"+member.area+" "+member.city);
        $(".member-mobile").html(member.mobile);
        $(".member-email").html(member.email);

        var client = data.client;
        if(client.details.logo){
          $(".invoice-logo").html("<img src='"+logo_uri+"thumbnail/"+client.details.logo+"'>");
          console.log(client.details.logo);
        }
        $(".client-name").html(client.details.name);
        $(".client-address").html(client.details.address+"<br>"+client.details.area+" "+client.details.city);
        $(".client-mobile").html(client.details.mobile);
        $(".client-email").html(client.details.email);

        var details   = data.details;
        $(".receipt-num").html(details.receipt);
        $(".receipt-date").html(details.date);

        //TRANSACTION LINES
        $.each(data.transactions, function(k, v) {
          listData += "<tr>";
            listData += "<td>"+v.quantity+"</td>";
            listData += "<td>"+v.description+"</td>";
            listData += "<td>$"+v.amount+"</td>"; 
            listData += "<td>$"+v.total+"</td>";
          listData += "<tr>";
        });

        //SUB-TOTAL
        listData += '<tr>';
          listData += '<td colspan="3" class="text-right"><strong>Subtotal</strong></td>';
          listData += '<td>$'+data.transaction_sub_total+'</td>';
        listData += '<tr>';

        //VAT
        listData += '<tr>';
          listData += '<td colspan="3" class="text-right no-border"><strong>VAT Included in Total</strong></td>';
          listData += '<td>$'+data.transaction_total_vat+'</td>';
        listData += '<tr>';

        //TRANSACTION-TOTAL
        listData += '<tr>';
          listData += '<td colspan="3" class="text-right no-border"><strong>Total</strong></td>';
          listData += '<td>$'+data.transaction_total+'</td>';
        listData += '<tr>';

        $("#transaction_lines").html(listData);
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }

  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function send_user_message_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "SEND MESSAGE");
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "SEND MESSAGE");
        $(":input", "#add_transaction_form").not("#user_id, #actions").val("").removeAttr("checked").removeAttr("selected");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "SEND MESSAGE");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $('#submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "SEND MESSAGE");
    $('#submit').prop("disabled", false);  
  }
}

function settings_page(){
  post_data         = "actions=settings&user_id="+user_id;
  query_server(post_data, "GET", "settings");
}

function settings(data){
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "SETTINGS";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/settings.php", function(){     
        load_pic_loader("logo_uploads");
        $("#user_id").val(user_id);
        $("#update_company_financials #user_id").val(user_id);
        $("#update_company_communications #user_id").val(user_id);

        var details = data.settings.details;
        if (details.hasOwnProperty("logo")){
          $("#logo").html(details.logo);
          if(details.logo){
            $("#pic_uri").val(details.logo);
            $(".pic-holder").html("<img width='120px' src='"+logo_uri+details.logo+"'>");
          }
        }
        $("#name").val(details.name);
        $("#address").val(details.address);
        $("#area").val(details.area);
        $("#city").val(details.city);
        $("#phone").val(details.phone);
        $("#mobile").val(details.mobile);
        $("#email").val(details.email);

        console.log(data.settings.communications)
        var communications = data.settings.communications;
        $("#smtp_host").val(communications.smtp_host);
        $("#smtp_port").val(communications.smtp_port);
        $("#smtp_username").val(communications.smtp_username);
        $("#smtp_password").val(communications.smtp_password);
        $("#sms_username").val(communications.sms_username);
        $("#sms_password").val(communications.sms_password);
        $("#admin_email").val(communications.admin_email);
        $("#marketing_email").val(communications.marketing_email);

        var financials = data.settings.financials;
        console.log(financials);
        $("#vat").val(financials.vat);
        $("#vat_number").val(financials.vat_number);
        $("#bank").val(financials.bank);
        $("#account_number").val(financials.account_number);
        $("#account_name").val(financials.account_name);
        $("#branch").val(financials.branch);
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function update_company_details_result(data){
  $(".form-progress").addClass("hide");

  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "COMPANY DETAILS");
      }
      if(data.query_status == 1){
        load_modal(success_string(data.msg), "COMPANY DETAILS");
      }
      if(data.query_status == 2){
        load_modal(info_string(data.msg), "COMPANY DETAILS");
      }
    }else{
      load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER"), "ERROR");
    }

    $('#submit').prop("disabled", false);  
  }else{
    load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE CHECK YOUR INTERNET CONNECTION"), "COMPANY DETAILS");
    $('#submit').prop("disabled", false);  
  }
}

function push_token_update_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        //load_modal(err_string(data.msg), "COMPANY DETAILS");
        console.log("error updating pushtoken");
      }
      if(data.query_status == 1){
        //load_modal(success_string(data.msg), "COMPANY DETAILS");
        console.log("pushtoken successfully updated");
      }
    }else{
      console.log("ERROR UPDATING PUSH TOKEN. CHECK INTERNET CONNECTION");
    }  
  }else{
    console.log("ERROR UPDATING PUSH TOKEN. CHECK INTERNET CONNECTION");  
  }
}

//**********MESSAGES**********//

function messages_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");
  post_data         = "actions=list_messages&user_id="+user_id;
  query_server(post_data, "GET", "messages_list");
}

function messages_list(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "MESSAGES";
      $(".navbar-brand").html(user_client);
      
      $('#load_content').load(user_description+"/messages.php", function(){
        if(data.hasOwnProperty("messages")){
          $.each(data.messages, function(k, v) {
            listData +=   '<article class="media">'+
                          '<span class="pull-left thumb-sm"><img src="images/avatar_default.jpg" class="img-circle"></span>'+
                          '<div class="media-body">'+
                          '<div class="pull-right media-xs text-center text-muted">'+
                          '<strong class="h4">'+v.date+'</strong><br>';
                          '</div>'+
                          '<a href="#" class="h4">'+v.title+'</a>'+
                          '<small class="block"><a href="#" class="">'+v.from_name+'</a></small>'+
                          '<small class="block m-t-sm">'+v.message+'</small>';
                          '</div>'+
                          '</article>'+
                          '<div class="line pull-in"></div>';
          });
          
          $(".messages-list").html(listData);
        }
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }
  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function message_details_page(data){
  $(".navbar-brand").html("<img src='images/loaders/facebook.gif' class='m-r-sm'> LOADING");

  var num_variable  = data.length - 1;

  for (i = 0; i <= num_variable; i++){
    if(data[i].substr(0, data[i].indexOf("=")) == "id"){
      var id = data[i].substr(data[i].indexOf("=") + 1, data[i].length);
    }        
  }

  post_data         = "actions=message_details&user_id="+user_id+"&id="+id;
  query_server(post_data, "GET", "message_details");
}

function message_details(data){
  var listData = "";
  if (data.hasOwnProperty("query_status")){
    if(data.query_status == 1){
      document.title = "MESSAGE DETAILS";
      $(".navbar-brand").html(user_client);

      $('#load_content').load(user_description+"/message_details.php", function(){
        $(".msg-title").html(data.title);
        $(".msg-date").html(data.date);
        $(".msg-client").html(data.client+" to me");
        if(data.image){
          $(".msg-body").html("<div class='col-sm-5 text-center clearfix m-t-xl fadeInLeftBig animated' data-ride='animated' data-animation='fadeInLeftBig'><img src='"+data.img+"'></div><div class='col-sm-7'><p class='h4 m-b-lg l-h-1x'>"+data.msg+"</p></div>");
        }else{
          $(".msg-body").html("<div class='col-sm-12'><p class='h4 m-b-lg l-h-1x'>"+data.msg+"</p></div>");
        }

        //UPDATE MESSAGE AS READ
        var post_data = "actions=message_seen&user_id="+user_id+"&="+data.ID;  
        query_server(post_data, "GET", "push_token_update_result");
        
      });
    }else{
      $(".navbar-brand").html(user_client);
      load_modal(err_string(data.msg), "PERMISSIONS");
    }

  }else{
    $(".navbar-brand").html(user_client);
    load_modal(err_string("ERROR PROCESSING YOUR REQUEST. PLEASE TRY LATER."), "ERROR");
  }
}

function offline_message_result(data){
  $(".new-msg").text(data.num);
  msg_sound.play();
}

//**********STAND ALONE FUNCTIONS**********//

function load_graph(div, data){
  var xaxis = [];
  var yaxis = [];
  var i     = 0; 

  $.each(data.xaxis, function(k, v) {
    xaxis.push([k, v]);    
  });

  $.each(data.yaxis, function(k, v) {
    yaxis.push([k, v]);    
  });

  $(div).length && $.plot($(div), [{
          data: yaxis
      }], 
      {
        series: {
            lines: {
                show: true,
                lineWidth: 2,
                fill: true,
                fillColor: {
                    colors: [{
                        opacity: 0.0
                    }, {
                        opacity: 0.2
                    }]
                }
            },
            points: {
                radius: 3,
                show: true
            },
            shadowSize: 2
        },
        grid: {
            hoverable: true,
            clickable: true,
            tickColor: "#f0f0f0",
            borderWidth: 1,
            color: '#f0f0f0'
        },
        colors: ["#65bd77"],
        xaxis:{
          ticks: xaxis,
          tickDecimals: 0
        },
        yaxis: {
          ticks: 10,
          tickDecimals: 0
        },
        tooltip: true,
        tooltipOpts: {
          content: "%y",
          defaultTheme: false,
          shifts: {
            x: 0,
            y: 20
          }
        }
      }
  );
}

function load_data_grid(div, response){
  $(function(){
    var post_data = "?data="+base64_encode("actions=desktop_list_new_users");
    // fuelux datagrid
    var DataGridDataSource = function (options) {
      this._formatter = options.formatter;
      this._columns = options.columns;
      this._delay = options.delay;
    };

    DataGridDataSource.prototype = {

      columns: function () {
        return this._columns;
      },

      data: function (options, callback) {
        var url = request_url+post_data;
        var self = this;

        setTimeout(function () {

          var data = $.extend(true, [], self._data);

          $.ajax(url, {
            dataType: 'json',
            async: false,
            type: 'GET'
          }).done(function (response) {

            data = response.data_grid;
            // SEARCHING
            if (options.search) {
              data = _.filter(data, function (item) {
                var match = false;

                _.each(item, function (prop) {
                  if (_.isString(prop) || _.isFinite(prop)) {
                    if (prop.toString().toLowerCase().indexOf(options.search.toLowerCase()) !== -1) match = true;
                  }
                });

                return match;
              });
            }

            // FILTERING
            if (options.filter) {
              data = _.filter(data, function (item) {
                switch(options.filter.value) {
                  case 'lt5m':
                    if(item.status == "Active") return true;
                    break;
                  case 'gte5m':
                    if(item.population == "In-active") return true;
                    break;
                  default:
                    return true;
                    break;
                }
              });
            }

            var count = data.length;

            // SORTING
            if (options.sortProperty) {
              data = _.sortBy(data, options.sortProperty);
              if (options.sortDirection === 'desc') data.reverse();
            }

            // PAGING
            var startIndex = options.pageIndex * options.pageSize;
            var endIndex = startIndex + options.pageSize;
            var end = (endIndex > count) ? count : endIndex;
            var pages = Math.ceil(count / options.pageSize);
            var page = options.pageIndex + 1;
            var start = startIndex + 1;

            data = data.slice(startIndex, endIndex);

            if (self._formatter) self._formatter(data);

            callback({ data: data, start: start, end: end, count: count, pages: pages, page: page });
          }).fail(function(e){

          });
        }, self._delay);
      }
    };

    $(div).each(function() {
      $(this).datagrid({
          dataSource: new DataGridDataSource({
          // Column definitions for Datagrid
          columns: [
          {
            property: 'name',
            label: 'Name',
            sortable: true
          },
          {
            property: 'level',
            label: 'User Level',
            sortable: true
          },
          {
            property: 'status',
            label: 'Status',
            sortable: true
          },
          {
            property: 'ID',
            label: 'View',
            sortable: true
          }
        ],

          // Create IMG tag for each returned image
          formatter: function (items) {
            $.each(items, function (index, item) {
              item.ID = '<a data-link="profile.php?ID='+item.ID+'" href="#"><i class="fa fa-eye"></i></a>';
            });
          }
      })
      });
    });
    
  });
}

function load_pie_chart(div, data){
  var xaxis = [];
  var yaxis = [];
  var i     = 0; 

  $.each(data.xaxis, function(k, v) {
    xaxis.push([k, v]);    
  });

  $.each(data.yaxis, function(k, v) {
    yaxis.push([k, v]);    
  });

  da1[i] = {
      label: "Series" + (i + 1),
      data: Math.floor(Math.random() * 100) + 1
    }

  $(div).length && $.plot($(div), da, {
    series: {
      pie: {
        combine: {
              color: "#999",
              threshold: 0.05
            },
        show: true
      }
    },    
    colors: ["#99c7ce","#999999","#bbbbbb","#dddddd","#f0f0f0"],
    legend: {
      show: false
    },
    grid: {
        hoverable: true,
        clickable: false
    },
    tooltip: true,
    tooltipOpts: {
      content: "%s: %p.0%"
    }
  });
}

function getUrlVars(url) {
  var vars = [], hash;
  var hashes = url.slice(url.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}

function md5(str) {
  //  discuss at: http://phpjs.org/functions/md5/
  // original by: Webtoolkit.info (http://www.webtoolkit.info/)
  // improved by: Michael White (http://getsprink.com)
  // improved by: Jack
  // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //    input by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //  depends on: utf8_encode
  //   example 1: md5('Kevin van Zonneveld');
  //   returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

  var xl;

  var rotateLeft = function(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  };

  var addUnsigned = function(lX, lY) {
    var lX4, lY4, lX8, lY8, lResult;
    lX8 = (lX & 0x80000000);
    lY8 = (lY & 0x80000000);
    lX4 = (lX & 0x40000000);
    lY4 = (lY & 0x40000000);
    lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
    if (lX4 & lY4) {
      return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
      } else {
        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
      }
    } else {
      return (lResult ^ lX8 ^ lY8);
    }
  };

  var _F = function(x, y, z) {
    return (x & y) | ((~x) & z);
  };
  var _G = function(x, y, z) {
    return (x & z) | (y & (~z));
  };
  var _H = function(x, y, z) {
    return (x ^ y ^ z);
  };
  var _I = function(x, y, z) {
    return (y ^ (x | (~z)));
  };

  var _FF = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _GG = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _HH = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var _II = function(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  };

  var convertToWordArray = function(str) {
    var lWordCount;
    var lMessageLength = str.length;
    var lNumberOfWords_temp1 = lMessageLength + 8;
    var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    var lWordArray = new Array(lNumberOfWords - 1);
    var lBytePosition = 0;
    var lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  };

  var wordToHex = function(lValue) {
    var wordToHexValue = '',
      wordToHexValue_temp = '',
      lByte, lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  };

  var x = [],
    k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
    S12 = 12,
    S13 = 17,
    S14 = 22,
    S21 = 5,
    S22 = 9,
    S23 = 14,
    S24 = 20,
    S31 = 4,
    S32 = 11,
    S33 = 16,
    S34 = 23,
    S41 = 6,
    S42 = 10,
    S43 = 15,
    S44 = 21;

  str = this.utf8_encode(str);
  x = convertToWordArray(str);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;

  xl = x.length;
  for (k = 0; k < xl; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }

  var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

  return temp.toLowerCase();
}

function base64_encode(data) {    
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
}

function base64_decode(data) {
  var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    dec = '',
    tmp_arr = [];

  if (!data) {
    return data;
  }

  data += '';

  do { // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

    o1 = bits >> 16 & 0xff;
    o2 = bits >> 8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1);
    } else if (h4 == 64) {
      tmp_arr[ac++] = String.fromCharCode(o1, o2);
    } else {
      tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
    }
  } while (i < data.length);

  dec = tmp_arr.join('');

  return dec.replace(/\0+$/, '');
}

function loadingShow(){
  $( '.loading-overlay' ).show();
}

function loadingHide(){
  $( '.loading-overlay' ).hide();
} 
  
function window_redirect(location){
  window.location.replace(location+".php");
}
  
function form_err_message(err){
  $(".alert-danger").removeClass("hide");
  $(".alert-danger p").html(err);
  setTimeout(function(){
    $(".alert-danger").addClass("hide");
    $(".alert-danger p").html("");
  }, 15000);  
}

function form_success_message(err){
  $(".alert-success").removeClass("hide");
  $(".alert-success p").html(err);
  setTimeout(function(){
    $(".alert-success").addClass("hide");
    $(".alert-success p").html("");
  }, 15000);
}

function reset_hide_form(current_form){
  $("#"+current_form).hide();
  $("#"+current_form)[0].reset();
}

//**********PIC UPLOADS**********//

function load_pic_loader(action){
  $(function () {
      'use strict';
      var pic_data = btoa("actions="+action);
      $('#pic-load').fileupload({
          url: request_url+"?data="+pic_data,
          dataType: 'json',
          done: function (e, data) {
              $.each(data.result.files, function (index, file) {
                  $("#pic_uri").val(file.name);
              });
              $(".upload-status").html("IMAGE SUCCESSFULY ATTACHED").removeClass("hide");
              $('.progress').addClass("hide");
              $('.progress .progress-bar').css(
                'width', '1%'
              );
              //$('#submit').prop("disabled", true);
          },
          progressall: function (e, data) {
              var progress = parseInt(data.loaded / data.total * 100, 10);
              $('.progress').removeClass("hide");
              $('.progress .progress-bar').css(
                  'width',
                  progress + '%'
              );
          }
      }).prop('disabled', !$.support.fileInput)
          .parent().addClass($.support.fileInput ? undefined : 'disabled');
  });
}