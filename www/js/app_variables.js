var form_submitted      = 0;
var request_url         = "http://bouldercorp.com/uride/server_side/request.php";
var search_url          = "http://bouldercorp.com/secure247/server_side/user_search.php";
var profile_uri         = "http://bouldercorp.com/secure247/server_side/pics/profile/";
var logo_uri            = "http://bouldercorp.com/secure247/server_side/pics/logo/";
var file_uri            = "http://bouldercorp.com/secure247/server_side/files/";
var file_upload_uri     = "http://bouldercorp.com/uride/server_side/file_upload.php";
//var template_url    = "http://127.0.0.1/secure/desktop/template/";
var template_url        = "template/";

var level_description   = ["", "super_administrator", "administrator", "member", "dependent", "respondent"];

var deploy_device       = "mobile"; //desktop/mobile

var current_form;
var user_level          = null,
    user_username       = null, 
    user_description    = null,
    user_title          = null, 
    user_name           = null,
    user_surname        = null, 
    user_mobile         = null,
    user_id             = null, 
    user_client_id      = null, 
    user_client         = null, 
    user_push_token     = null, 
    user_driver         = null,
    user_car_reg        = null,
    user_car_pic        = null,
    user_license        = null,
    user_student_pic    = null,
    user_student_id     = null;

var isPhoneGapReady     = false;
var isAndroid           = false;
var isBlackberry        = false;
var isIphone            = false;
var isWindows           = false;

// NETWORK STATUS
var isConnected         = false;
var isHighSpeed         = false;
var internetInterval;

var currentUrl;
var currentPage;
var current_form        = "";

var pushNotification, latestMessage;
var device_platform, device_model, device_version, device_uuid;
var connection_type; 

var invite_name, invite_mobile;
var httpReq             = null;

var watch_id            = null;
var availability        = 0;
var reg_pics            = {};


var full_date               = new Date();
var year                    = full_date.getFullYear();
var month                   = full_date.getMonth() + 1;
var day                     = full_date.getDate();
var hour                    = full_date.getHours();
var minutes                 = full_date.getMinutes();
var seconds                 = full_date.getSeconds();
var milliseconds            = full_date.getMilliseconds();
if (minutes < 10) {
  minutes = "0" + minutes
}
if (month < 10) {
  month = "0" + month
}
var full_today_date         = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
var short_today_date        = year + "-" + month + "-" + day;
var today_time              = hour + ":" + minutes + ":" + seconds;

var past_30                 = new Date().setDate(full_date.getDate() - 30);
past_30                     = new Date(past_30);
var past_30_month            = past_30.getMonth() + 1;
var past_30_year                = past_30.getFullYear();
var past_30_date                = past_30.getDate();
if (past_30_month < 10) {
  past_30_month = "0" + past_30_month
}
var past_30_days            = past_30_year+"-"+past_30_month+"-"+past_30_date;

var footer_year             = year + "-" + (year + 1);

var pusher;
var listData;

var session             = window.localStorage.getItem("session");
if(session || session !== null){
  var details           = $.parseJSON(atob(session));
  user_username         = details.username;
  user_level            = details.level;
  user_description      = level_description[user_level];
  user_name             = details.name;
  user_surname          = details.surname;
  user_id               = details.ID;
  user_student_id       = details.student_id;
  user_mobile           = details.mobile;
  user_student_pic      = details.student_pic;
  user_profile          = details.profile;
  user_push_token       = details.token;

  user_client_id        = details.client_id;
  user_client           = details.client;  

  user_driver           = details.driver;
  user_car_reg          = details.car_reg;
  user_car_pic          = details.car_pic;
  user_license          = details.license;
  availability          = details.availability;

  $(".navbar-brand").html(user_client);
  $(".active-user").removeClass('hide');
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".home-row").removeClass('hide').addClass('active-row');

  if(availability == 1)
    $(".driver-mode-txt").html("Driver Mode <span class='text-success'>(active)</span>");
  else
    $(".driver-mode-txt").html("Driver Mode <span class='text-muted'>(inactive)</span>");
}else{
  $(".inactive-user").removeClass('hide');
  $(".active-user").addClass('hide');
  $( document ).find('.active-row').addClass('hide').removeClass('active-row');
  $(".home-row").removeClass('hide').addClass('active-row');
}


function terminate_session(){
    window.localStorage.removeItem("session");
    user_id             = null;
    user_level          = null;
    user_name           = null;
    user_client_id      = null;
    user_client         = null;
    user_profile        = null;
    user_push_token     = null;
    user_student_pic      = null;
    user_driver           = null;
    user_car_reg          = null;
    user_car_pic          = null;
    user_license          = null;
    availability          = null;
}

function err_string(err){
  var string =  '<span class="fa-stack fa-2x pull-left m-r-sm">'+
                '<i class="fa fa-circle fa-stack-2x text-danger"></i>'+
                '<i class="fa fa-times fa-stack-1x text-white"></i>'+
                '</span>'+
                '<div class="clear"><p>'+err+'</p></div>';
  return string;
}

function success_string(err){
  var string =  '<span class="fa-stack fa-2x pull-left m-r-sm">'+
                '<i class="fa fa-circle fa-stack-2x text-success"></i>'+
                '<i class="fa fa-check fa-stack-1x text-white"></i>'+
                '</span>'+
                '<div class="clear"><p>'+err+'</p></div>';
  return string;
}

function info_string(err){
  var string =  '<span class="fa-stack fa-2x pull-left m-r-sm">'+
                '<i class="fa fa-circle fa-stack-2x text-info"></i>'+
                '<i class="fa fa-info fa-stack-1x text-white"></i>'+
                '</span>'+
                '<div class="clear"><p>'+err+'</p></div>';
  return string;
}

function emergency_string(err){
  var string =  '<span class="fa-stack fa-2x pull-left m-r-sm">'+
                '<i class="fa fa-circle fa-stack-2x text-danger"></i>'+
                '<i class="fa fa-bullhorn fa-stack-1x text-white"></i>'+
                '</span>'+
                '<div class="clear"><p>'+err+'</p></div>';
  return string;
}

function message_string(err){
  var string =  '<span class="fa-stack fa-2x pull-left m-r-sm">'+
                '<i class="fa fa-circle fa-stack-2x text-primary"></i>'+
                '<i class="fa fa-envelope fa-stack-1x text-white"></i>'+
                '</span>'+
                '<div class="clear"><p>'+err+'</p></div>';
  return string;
}

function advert_string(client, msg, title, img){
  var string =  '<article class="media">'+
                '<span class="pull-left thumb-md"><img src="'+img+'"></span>'+
                '<div class="media-body">'+
                '<h4>'+title+'</h4>'+
                '<small class="block">'+client+'</small>'+
                '<small class="block m-t-sm">'+msg+'</small>'+
                '</div>'+
                '</article>';
  return string;
}

function retract_menu(){
  if(deploy_device == "mobile"){
    $(".mobile-menu-btn").click();
  } 
}

//QUERY
function query_server(post_data, method, result){
  if(method == "POST"){
    $.post(request_url+"?data="+btoa(post_data), function(data) {
      console.log(data);
      try{
        var info = $.parseJSON(data);
        $.each(info, function(k, v) { 
          console.log(k+" - "+v);
        });
        $('#submit').prop("disabled", false); 
        window[result](info); 
        retract_menu();
      }catch(err){
        load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER."), "ERROR");
        $(".navbar-brand").html(user_client);
        retract_menu();
        console.log(err);
        $('#submit').prop("disabled", false);
        //hide form progress
        if (!$(".form-progress").hasClass("hide")) {
          $(this).addClass('hide');
        }
      }
    }).fail(function(data) {
      $(".navbar-brand").html(user_client);
      retract_menu();
      load_modal(err_string("ERROR: PLEASE CHECK YOUR INTERNET CONNECTION"), "CONNECTION");
      console.log("ERROR POSTING DETAILS");
      $('#submit').prop("disabled", false);
      //hide form progress
      if (!$(".form-progress").hasClass("hide")) {
        $(this).addClass('hide');
      } 
    });    
  }

  if(method == "GET"){
    $.post(request_url+"?data="+btoa(post_data), function(data) {
      console.log(data);
      try{
        var info = $.parseJSON(data);
        $.each(info, function(k, v) { 
          console.log(k+" - "+v);
        });
        $('#submit').prop("disabled", false); 
        window[result](info);
        retract_menu();
      }catch(err){
        load_modal(err_string("THERE WAS AN ERROR PROCESSING YOUR REQUEST. PLEASE TRY AGAIN LATER."), "ERROR");
        $(".navbar-brand").html(user_client);
        retract_menu();
        console.log(err);
        $('#submit').prop("disabled", false);
        //hide form progress
        if (!$(".form-progress").hasClass("hide")) {
          $(this).addClass('hide');
        }
      }
    }).fail(function(data) {
      $(".navbar-brand").html(user_client);
      retract_menu();
      load_modal(err_string("ERROR: PLEASE CHECK YOUR INTERNET CONNECTION"), "CONNECTION");
      console.log("ERROR POSTING DETAILS");
      $('#submit').prop("disabled", false);
      //hide form progress
      if (!$(".form-progress").hasClass("hide")) {
        $(this).addClass('hide');
      } 
    });    
  }
}

function page_loader_show(msg){
}

function page_loader_hide(msg){
}

function responder_info_window(name, surname, account, company){
  '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">'+name+' '+surname+'</h1>'+
  '<div id="bodyContent"><p>'+
  '<b>RESPONDER #: </b>'+account+' <br> ' +
  '<b>COMPANY: </b>'+company+' <br> ' +
  '</p></div>'+
  '</div>';
}

//**********MAP DIRECTIONS**********//
function desktop_geolocation(){
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
}

//**********LOGIN / LOGOUT**********//

function login_modal(){
  $('#ajaxModal').remove();
  var $remote  = "modal.lockme.html";
  var $modal   = $('<div class="modal" id="ajaxModal"><div class="modal-body"></div></div>');  
  $('body').append($modal);
  $modal.modal();
  $modal.load($remote);
  //TERMINATE SESSION
  terminate_session();
  document.title = "SIGN IN";
}

function load_modal(content, title){
  $('#ajaxModal').remove();
  var $remote  = "modal.html";
  var $modal   = $('<div class="modal" id="ajaxModal"><div class="modal-body"></div></div>');
  $('body').append($modal);
  $modal.modal();
  $modal.load($remote, function(){
    $(".modal-title").html(title);
    $(".modal-body").html(content);
    //CONFIRM EMERGENCY CALL
    $(".modal-body").on('click', "a", function(e){      
        var page = $(this).attr("data-link");
        if(page == undefined){
          //alert("link un defined");
        }else{
          loadingShow();
          var variables       = page.slice(page.indexOf('?') + 1).split('&');
          var num_variables   = variables.length;
          var url             = page.substr(0, page.indexOf('?'));
          
          if(url == "")
            actions = page.replace(".php", "_page");
          else
            actions = url.replace(".php", "_page");
          
          if ( typeof window[actions] == 'function') {
            if(num_variables > 0){
              window[actions](variables);
            }else{
              window[actions]();
            }
          }
  
          return false;
        }
    });    
  });  
}

//**********SESSION LOGIN / LOGOUT**********//

function session_countdown(){
  //session lockout
  this.addEventListener("mousemove", resetTimer, false);
  this.addEventListener("mousedown", resetTimer, false);
  this.addEventListener("keypress", resetTimer, false);
  this.addEventListener("DOMMouseScroll", resetTimer, false);
  this.addEventListener("mousewheel", resetTimer, false);
  this.addEventListener("touchmove", resetTimer, false);
  this.addEventListener("MSPointerMove", resetTimer, false);

  startTimer();
}

function startTimer() {
    // wait 15minutes seconds before calling goInactive
    timeoutID = window.setTimeout(goInactive, 15*60000);
}
 
function resetTimer(e) {
    window.clearTimeout(timeoutID);   
    //goActive();
    startTimer();
}

function goInactive(){
    login_modal();
    pusher.disconnect();
}

//**********SEND RESPONDER CURRENT LOCATION**********//

function driver_mode(){
  if(user_driver == 1){
    if(availability == 1){ //deactivate driver mode
      var post_data       = "actions=update_availability&id=0&user_id="+user_id;
      query_server(post_data, "GET", "driver_mode_result");
    }else{ //activate driver mode
      var post_data       = "actions=update_availability&id=1&user_id="+user_id;
      query_server(post_data, "GET", "driver_mode_result");
    }
  }else{
    load_modal(info_string("REGISTER AS A DRIVER FIRST"), "DRIVER MODE");
    register_driver_row();
  }
}

function driver_mode_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        load_modal(err_string(data.msg), "DRIVER MODE");
        $("#"+data.actions+" .form-progress").addClass("hide");
      }
      if(data.query_status == 1){
        if(data.availability == 1){
          load_modal(success_string("YOU ARE NOW IN DRIVER MODE"), "DRIVER MODE");
          $(".driver-mode-txt").html("Driver Mode <span class='text-success'>(active)</span>");
          availability = 1;
          watch_location();
        }

        if(data.availability == 0){
          load_modal(success_string("DRIVER MODE HAS BEEN DEACTIVATED"), "DRIVER MODE");
          $(".driver-mode-txt").html("Driver Mode <span class='text-muted'>(inactive)</span>");
          clear_watching_location();
          availability = 0;
        }        
      }
    }
  }
}

function watch_location(){  
  var options   = {maximumAge : 30000, timeout: 30000, enableHighAccuracy : true}; //timeout after 30sec
  var timeouts  = 0;
  watch_id = navigator.geolocation.watchPosition(
    function(position) {
      var post_data       = "actions=update_taxi_location&user_id="+user_id+"&latitude="+position.coords.latitude+"&longitude="+position.coords.longitude;
      query_server(post_data, "GET", "watch_location_result");
    },
    function (error) {
      if (error.code == 3){
          timeouts++;
          if (timeouts >= 3) {
              navigator.geolocation.clearWatch(watch_id);
              load_modal(err_string("UNABLE TO DETERMINE YOUR GPS LOCATION. TRY AND RESTART YOUR DEVICE"), "LOCATION");
          }
      }
    },
    options
  ); 
}

function watch_location_result(data){
  if(data){
    if (data.hasOwnProperty("query_status")){
      if(data.query_status == 0){
        console.log(data.msg);
      }
      if(data.query_status == 1){
        console.log(data.msg);        
      }
    }
  }
}

function clear_watching_location(){
  if (watch_id !== null) {
      navigator.geolocation.clearWatch(watch_id);
      watch_id = null;
      load_modal(success_string("URIDE NO LONGER UPDATING YOUR GPS LOCATION"), "LOCATION");
  }
}


//**********MENUS**********//

function user_side_menu(){
  $(".nav-primary").load(user_description+"/menu.html");
}

function close_modal(){
  $('#ajaxModal').remove();
  $('.modal-backdrop').remove();
  $("body").removeClass("modal-open");
}

//OBJECTS IN ARRAY OBJECTS
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

$(document).on('click', ".pic-load", function(e){
  var pic_link = $(this).attr('id');
  navigator.camera.getPicture(
    function onSuccess(imageURI) {
      reg_pics[pic_link] = imageURI;
      console.log("NUM OF PICTURES: "+Object.size(reg_pics));
    }, 
    function onFail(message) {
      load_modal(err_string(message), "ERROR");
    }, 
    { 
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: Camera.MediaType.PICTURE
    }
  );
  return false;
});

$(document).on('click', ".pic-upload", function(e){
  var pic_link = $(this).attr('id');
  navigator.camera.getPicture(
    function onSuccess(imageURI) {
      uploadPhoto(imageURI, pic_link);
    }, 
    function onFail(message) {
      load_modal(err_string(message), "ERROR");
    }, 
    { 
      quality: 70,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
      mediaType: Camera.MediaType.PICTURE
    }
  );
  return false;
});

//FILE TRANSFER
function uploadPhoto(imageURI, id) {
  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
  options.mimeType = "image/jpeg";

  var params = {};
  params.pic_link = id;
  options.params  = params;

  //$("#"+id).addClass('hide');
  $("."+id+"_progress").html("<img src='images/loaders/indicator-lite.gif'> attaching image").removeClass("hide");

  var ft = new FileTransfer(id);
  ft.upload(imageURI, encodeURI(file_upload_uri), 
    function (r) {      
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);

      $("."+id+"_progress").html(' <i class="fa fa-thumbs-up text"></i> image attached');
      var rvalues = JSON.parse(r.response);
      $("#"+id+"_check").val(rvalues.pic_name);
      console.log(rvalues.pic_name);      
    }, 
    function (error) {
      //alert("An error has occurred: Code = " + error.code);
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
      //$("#"+id).removeClass('hide');
      $("."+id+"_progress").html(' <i class="fa fa-times-circle text"></i> Error: please try again');
    }, options
  );
}





