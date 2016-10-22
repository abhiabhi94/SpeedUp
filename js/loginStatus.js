user = "";
$('#response').html('Logging in...');
console.log('efdfkdsfjf');
$.ajax({
	url: 'http://139.59.32.96/loginStatus.php',
	type: 'GET',
	// dataType: 'JSON',
	data: {
		query:"loginStatus"
	},
	error: function(errorThrown) {
	    console.log(errorThrown.statusText);
	    document.write("Couldn't connect to the server!!!");
	},
	success:function(data){
	    if (data != "")
		    data = JSON.parse(data);
		// console.log(data);
	    chrome.runtime.sendMessage({greeting: "login", data:data});
	    // var responseData = data;
	    if (data.status == 200){
		    // console.log(data.status);
		    // $('#welcome').html(data.name);
		    user = data.name;
	    }
	    else
	    	$('#response').html('Please login to bookmark this');
	},
	complete:function(){
		$('#response').html('');
		$('#response').css('color', 'black');

	}
});