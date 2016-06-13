//**********SQL FUNCTIONS**********//
	
var db = window.openDatabase("uridedb", "1.0", "uride database", 1000000);
db.transaction(
	function populateDB(tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, user_id INTEGER, responder INTEGER, chat_id INTEGER, name TEXT, message TEXT, date TEXT, status INT, state INT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS chats (ID INT, taxi_id INT, user_id INT, date TEXT)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS users (ID INTEGER PRIMARY KEY, level INTEGER, name TEXT, surname TEXT, client_id INTEGER, client TEXT, token TEXT)');
		//tx.executeSql('INSERT INTO users (id, nname, surname, mobile, email, medaid, medaidnumber, bloodtype, allergies, disabilities, regdate) VALUES ("1", 1, "Test", "Client", "address", "", "", "", 0)');
	}, 
	function errorCB(err) {
		console.log("Error processing SQL: " + err.code);
	}, 
	function successCB() {
		console.log("Database successfully populated")
	}
);

function get_user(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM users", [], 
	 		function success(tx, results){
	 			var len = results.rows.length
			    if(len !== 0){
			    	user_id 	= results.rows.item(0).ID;
			    	user_name 	= results.rows.item(0).name+" "+results.rows.item(i).surname;
			    	user_level 	= results.rows.item(i).level;
			    	user_client = results.rows.item(i).client;
			    	user_client_id 	= results.rows.item(i).client_id;
			    	user_token 		= results.rows.item(i).token;
			    }
	 		}, 
	 		function error(tx,err){
	 			console.log(err.message);
	 		}
	 	);
	 });	
}

//save chat
function save_chat(ID, taxi_id, user_id, date){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO chats (ID, taxi_id, user_id, date) VALUES (?, ?, ?, ?)", [ID, taxi_id, user_id, date], 
	 		function success(){
	 			//console.log(results.insertId); //last inserted id
	 		}, 
	 		function error(){
	 			console.log("Error saving chat to database");
	 		}
	 	);
	});	
}

//save chat message
function save_message(user_id, responder, chat_id, name, message, date, status, state){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO messages (user_id, responder, chat_id, name, message, date, status, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [user_id, responder, chat_id, name, message, date, status,state], 
	 		function success(){
	 			console.log("message successfully saved");
	 		}, 
	 		function error(tx,err){
	 			console.log(err.message);
	 		}
	 	);
	});	
}

//get chat list
function get_chats(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM messages WHERE date BETWEEN ? AND ? GROUP BY chat_id ORDER BY date", [past_30_days, full_today_date], 
	 		function success(tx, results){
	 			var len = results.rows.length
			    if(len !== 0){
			    	listData = "";
			    	for (var i = 0; i < len; i++){
				    	listData +=   "<li class='list-group-item'>"+
		                              "<div class='media'>"+
		                              "<a href='#' data-link='chat_messages_row?responder="+results.rows.item(i).responder+"&chat_id="+results.rows.item(i).chat_id+"'>"+
		                              "<span class='pull-left thumb-sm'><img src='images/avatar_default.jpg' class='img-circle'></span>"+
		                              "<div class='pull-right text-success m-t-sm'><i class='fa fa-circle'></i></div>"+
		                              "<div class='media-body'>"+
		                              "<div>"+results.rows.item(i).name+"</div>"+
		                              "<small class='text-muted'>"+results.rows.item(i).message+"</small><br>"+
		                              "<small class='text-muted'>"+results.rows.item(i).date+"</small>"+		                              
		                              "</div>"+
		                              "</a>"+
		                              "</div>"+
		                              "</li>";
		    		}
		    		$(".chats-list").html(listData);
			    }
	 		}, 
	 		function error(tx,err){
	 			console.log(err.message);
	 		}
	 	);
	 });	
}

//get chat list
function get_chat_messages(responder, chat_id){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM messages WHERE chat_id = ? AND date BETWEEN ? AND ? ORDER BY date", [chat_id, past_30_days, full_today_date], 
	 		function success(tx, results){
	 			var len = results.rows.length
			    if(len !== 0){
			    	listData = "";
			    	for (var i = 0; i < len; i++){
			    		if(results.rows.item(i).status == 1){
				    		listData +=   '<article id="chat-id-"'+i+' class="chat-item right">'+
				                          '<a href="#" class="pull-right thumb-sm avatar"><img src="images/avatar_default.jpg" class="img-circle"></a>'+
				                          '<section class="chat-body">'+
				                          '<div class="panel bg bg-primary text-sm m-b-none">'+
				                          '<div class="panel-body">'+
				                          '<span class="arrow right"></span>'+
				                          '<p class="m-b-none">'+results.rows.item(i).message+'</p>'+
				                          '</div>'+
				                          '</div>'+
				                          /*'<small class="text-muted"><i class="fa fa-ok text-success"></i> 2 minutes ago</small>'+*/
				                          '</section>'+
				                          '</article>';
                        }else{
                        	listData +=   '<article id="chat-id-"'+i+' class="chat-item left">'+
				                          '<a href="#" class="pull-left thumb-sm avatar"><img src="images/avatar_default.jpg" class="img-circle"></a>'+
				                          '<section class="chat-body">'+
				                          '<div class="panel b-light text-sm m-b-none">'+
				                          '<div class="panel-body">'+
				                          '<span class="arrow left"></span>'+
				                          '<p class="m-b-none">'+results.rows.item(i).message+'</p>'+
				                          '</div>'+
				                          '</div>'+
				                          /*'<small class="text-muted"><i class="fa fa-ok text-success"></i> 2 minutes ago</small>'+*/
				                          '</section>'+
				                          '</article>';
                        }
		    		}
		    		$(".chat-messages-list").html("<div class='chat-"+chat_id+"'>"+listData+"</div>");
			    }
	 		}, 
	 		function error(tx,err){
	 			console.log(err.message);
	 		}
	 	);
	 });	
}

//save to phonebok
function save_contacts(name, number){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO phonebook (name, number) VALUES (?, ?)", [name, number], 
	 		function success(){
	 			//console.log("Contacts saved to database");
	 		}, 
	 		function error(){
	 			console.log("Error saving to database");
	 		}
	 	);
	 });	
}

//get contacts
function get_contacts(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM phonebook ORDER BY name", [], 
	 		function success(tx, results){
	 			var len = results.rows.length, listData = "";
			    if(len !== 0){
			    	var listData = "";
			    	for (var i=0; i<len; i++){
			    		var contact_name = results.rows.item(i).name;
			    		var contact_mobile = results.rows.item(i).number;
				    	listData += "<a id='data-foo' data-link='tell_friend' data-name='"+contact_name+"' data-mobile='"+contact_mobile+"' href='#' style='display:block; height:45px; padding:5px; line-height:15px'>";
		    			listData += "<img align='left' height='42px' src='images/ui/contact.png' style='margin-right:5px'>";
		    			listData += "<b>"+ contact_name +"</b><br>";		    			
		    			listData += contact_mobile;
		    			listData += "</a>";
		    		}
		    		$("#phonebook").html(listData);
			    }else{
			    	var phonebook_contact = [];
					var options = new ContactFindOptions();
				    options.filter = "";
				    options.multiple=true;
				    var fields = ["displayName", "phoneNumbers", "name"];
				    navigator.contacts.find(
				    	fields, 
				    	function success(contacts){
				    		var listData = "";
						    for (var i = 0; i < contacts.length; i++) {
						    	if(contacts[i].phoneNumbers){
						    		for (var x = 0; x < contacts[i].phoneNumbers.length; x++) {
						    			var contact_name;
						    			var mobile;
						    			if(contacts[i].displayName == undefined || contacts[i].displayName == null){
						    				mobile = contacts[i].phoneNumbers[x].value;
						    				contact_name = contacts[i].name;
						    				phonebook_contact.push(contact_name+"|"+mobile);
						    				//save_contacts(contact_name, mobile);
						    			}else{
						    				mobile = contacts[i].phoneNumbers[x].value;
						    				contact_name = contacts[i].displayName;
						    				phonebook_contact.push(contact_name+"|"+mobile);
						    				//save_contacts(contact_name, mobile);
						    			}
						    		}
						    	}
						    }
						    phonebook_contact.sort();
						    //window.localStorage.setItem("user_phonebook", phonebook_contact);
						    setTimeout(function(){
						    	for (var i = 0; i < phonebook_contact.length; i++) {
									var spliter 		= phonebook_contact[i].indexOf("|");
									var contact_name 	= phonebook_contact[i].slice(0, spliter);
									var contact_mobile 	= phonebook_contact[i].slice(spliter + 1, phonebook_contact[i].length);
									listData += "<a id='data-foo' data-link='tell_friend' data-name='"+contact_name+"' data-mobile='"+contact_mobile+"' href='#' style='display:block; height:45px; padding:5px; line-height:15px'>";
					    			listData += "<img align='left' height='42px' src='images/ui/contact.png' style='margin-right:5px'>";
					    			listData += "<span class='name'><b>"+ contact_name +"</b></span><br>";		    			
					    			listData += "<span class='mobile'>"+contact_mobile+"</span>";
					    			listData += "</a>";
						    	}
								$("#phonebook").html(listData);
								var options = {
								  valueNames: [ 'name', 'mobile' ]
								};

								var userList = new List('phonebook_search', options);
							}, 2000);
						    
				    	}, 
				    	function failure(){
				    		$("#phonebook").html("Error getting your contacts");
				    	}, 
				    	options
				    );
			    }
	 		}, 
	 		function error(){
	 			console.log("Error getting phonebook contacts");
	 		}
	 	);
	 });	
}

//get users details
function get_user_details(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM user LIMIT ?", [1], 
	 		function user_details_success(tx, results){
				var len = results.rows.length, listData = "";
			    if(len !== 0){	
			    	var i = 0;				
			    	user_ID = results.rows.item(i).ID;
					user_profile_pic = results.rows.item(i).profile;
					user_title = results.rows.item(i).title;
					user_name = results.rows.item(i).name;
					user_surname = results.rows.item(i).surname; 
					
					user_gender = results.rows.item(i).gender; 
					user_birthdate = results.rows.item(i).birthdate;
					user_idnumber = results.rows.item(i).idnumber; 
					  
					user_address = results.rows.item(i).address;
					user_area = results.rows.item(i).area;
					user_city = results.rows.item(i).city; 
					
					user_phone = results.rows.item(i).phone;
					user_mobile = results.rows.item(i).mobile;
					user_email = results.rows.item(i).email;
					user_push_token = results.rows.item(i).pushtoken;
				}else{
					console.log("There are no users details in db.");
				}
			}, 
	 		function user_details_fail(){
	 			console.log("Error: Retireving users details from db.");
	 		}
	 	);
	 });	
}

function save_user_details(ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO user (ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
	 		[ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email], 
	 		function save_user_details_success(){
	 			//successfull registration
	 			showAlert("Thank you! you have successfully Registered\n", "Registration", "Close");
	 		}, 
	 		function save_user_details_error(){
	 			console.log("Error: retireving users details from db.");
	 		}
	 	);
	 });	
}

function update_user_details(ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"UPDATE user SET profile = ?, title = ?, name = ?, surname = ?, gender = ?, birthdate = ? idnumber = ?, address = ?, area = ?, city = ?, phone = ?, mobile =?, email = ? WHERE ID = ?", [profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email, ID], 
	 		function update_user_details_success(){
	 			showAlert("Your details have been successfully updated.\n", "Update", "Close");
	 		}, 
	 		function update_user_details_success(){
	 			console.log("Error: updating users details to db");
	 		}
	 	);
	 });	
}

function delete_user_details(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"DELETE FROM user)", [], 
	 		function delete_user_details_success(){
	 			console.log("Old user details have been successfully deleted.");
	 		}, 
	 		function delete_user_details_error(){
	 			console.log("Error: deleting old user details.");
	 		}
	 	);
	 });	
}

//list messages in database
function list_messages(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM messages ORDER BY msgdate DESC LIMIT ?", [10], 
	 		success_message_list, 
	 		error_message_list
	 	);
	 });	
}

function success_message_list(tx, results){
	var len = results.rows.length, listData = "";
    if(len !== 0){
    	for (var i=0; i<len; i++){
    		var title = results.rows.item(i).title;
    		var body = results.rows.item(i).body;
    		var date = results.rows.item(i).msgdate;
                
			listData += "<p>";
			listData += "<span style='float:left; display:inline-block; width:35px; text-align:center'><img align='center' src='images/ui/mail.png' width='30px' style=''/></span>";
			listData += "<span style='float:left; display:inline-block;'>";
			listData += "<b>"+title+"</b>";
			listData += body;
			listData += "</span>";
			listData += "</p>";
			
		}
		$("#list_messages").html(listData);
	}else{
		$("#list_messages").html("<p>Sorry you dont have any messages.</p>");
	}
}

function success_message_list_(tx, results){
	var len = results.rows.length, listData = "";
    if(len !== 0){
    	for (var i=0; i<len; i++){
    		var title = results.rows.item(i).title;
    		var body = results.rows.item(i).body;
    		var image = results.rows.item(i).image;
    		var date = results.rows.item(i).msgdate;
                
			listData += "<div class='timeline-item'>";
			listData += "<div class='timeline-icon'><i class='fa'><img src='images/ui/contact.png' width='18px' style='display: inline-block'/></i></div>";
			listData += "<div class='timeline-text'>";
			listData += "<h3 class='title'>"+title+"</h3>";
			listData += "<em class='subtitle'>"+date+"/em>";
			if(image !== ""){
				listData += "<img src='"+image+"' alt='img' class='responsive-image'>";
			}
			listData += "<p>"+body+"</p>";
			listData += "</div>";
			listData += "</div>";
			
		}
		$("#list_messages").html(listData);
	}
}

function error_message_list(){ 
	console.log("Error: Push message list from DB");
}

//list news in database
function list_news(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM news ORDER BY msgdate DESC LIMIT ?", [10], 
	 		success_news_list, 
	 		error_news_list
	 	);
	 });	
}

function success_news_list(tx, results){
	var len = results.rows.length, listData = "";
    if(len !== 0){
    	for (var i=0; i<len; i++){
    		var title = results.rows.item(i).title;
    		var body = results.rows.item(i).body;
    		var date = results.rows.item(i).msgdate;
    		
    		if(i == 0){
    			listData += "<div class='big-notification yellow-notification'>";
    		}else{
    			listData += "<div class='big-notification grey-notification'>";
    		}
    		
                listData += "<h4 class='uppercase' style='color:#000000'>"+title+" | "+date+"</h4>";
                    listData += "<p>";
                        listData += body;
                    listData += "</p>";
            listData += "</div>";
		}
		$("#list_news").html(listData);
	}
}

function error_news_list(){ 
	console.log("Error: Listing news articles");
}



//save news message to database
function save_news(title, message, msgdate){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO news (title, body, msgdate) VALUES (?, ?, ?)", [title, message, msgdate], 
	 		success_news_save, 
	 		error_news_save
	 	);
	 });	
}

function success_news_save(){ 
	console.log("News message has been saved to DB");
}

function error_news_save(){ 
	console.log("Error: Saving news message to DB");
}

//update push message to database
function update_message(title, message, msgdate, ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"UPDATE messages SET title = ?, body = ?, msgdate = ? WHERE ID = ?", [title, message, msgdate, ID], 
	 		success_message_update, 
	 		error_message_update
	 	);
	 });	
}

function success_message_update(){ 
	console.log("Push message updated to DB");
}

function error_message_update(){ 
	console.log("Error: Updating news message in database");
}

//update news message to database
function update_news(title, message, msgdate, ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"UPDATE news SET title = ?, body = ?, msgdate = ? WHERE ID = ?", [title, message, msgdate, ID], 
	 		success_news_update, 
	 		error_news_update
	 	);
	 });	
}

function success_news_update(){ 
	console.log("News message updated to DB");
}

function error_news_update(){ 
	console.log("Error: Updating news message in database");
}


//delete push message to database
function delete_message(ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"DELETE FROM messages WHERE ID = ?)", [ID], 
	 		success_message_delete, 
	 		error_message_delete
	 	);
	 });	
}

function success_message_delete(){ 
	console.log("Push message has been deleted in DB");
}

function error_message_delete(){ 
	dbSetup();
	console.log("Error: Push message delete from DB");
}

//delete news message to database
function delete_news(ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"DELETE FROM news WHERE ID = ?)", [ID], 
	 		success_news_delete, 
	 		error_news_delete
	 	);
	 });	
}

function success_news_delete(){ 
	console.log("Push message has been deleted in DB");
}

function error_news_delete(){ 
	console.log("Error: Deleting news message from DB");
}