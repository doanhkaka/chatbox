$( document ).ready(function() {
		var socket = io();
		var fullName = getCookie('fullName');
		var dataSync = false;

		$("#fullName").val(fullName);

		socket.emit('loadMessage', {});

		$("#message").keypress(function(e) {
			if(e.keyCode == 13) {
				sendMessage();
			}
		});
		$("#fullName").keypress(function(e) {
			if(e.keyCode == 13) {
				sendMessage();
			}
		});
		$("#btnSend").click(function(){
			sendMessage();
		});

		function sendMessage() {
			var n = $.trim($("#fullName").val());
			var m = $.trim($("#message").val());
			if(validateMessage(n, m)) {
				setCookie('fullName', n);
				socket.emit('sendMessage', {m, n});
				$("#message").val('');
			}
		}
		function validateMessage(fullName, message) {
			var isOK = true;
			if('' == fullName) {
				$("#fullName").addClass('empty-data');
				isOK = false;
			}
			if('' == message) {
				$("#message").addClass('empty-data');
				isOK = false;
			}
			if(isOK) {
				$("#fullName").removeClass('empty-data');
				$("#message").removeClass('empty-data');
			}

			return isOK;
		}
		function setCookie(cname, cvalue, exdays) {
		    var d = new Date();
		    d.setTime(d.getTime() + (exdays*24*60*60*1000));
		    var expires = "expires="+ d.toUTCString();
		    document.cookie = cname + "=" + cvalue + "; " + expires;
		}
		function getCookie(cname) {
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i = 0; i <ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length,c.length);
		        }
		    }
		    return "";
		}

		socket.on('sendMessage', function(data) {
			$("#list_message").append("<li><b>["+data.n+"]</b>: "+data.m+"</li>");
		});
		socket.on('loadMessage', function(data) {
			if(data.length == 0 || dataSync) {
				return false;
			}
			dataSync = true;
			$.each(data, function(idx, data){
				$("#list_message").append("<li><b>["+data.n+"]</b>: "+data.m+"</li>");
			});
		});
	});