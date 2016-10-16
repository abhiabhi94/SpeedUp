if (chrome.storage){
	chrome.storage.local.get('choice', function(response) {
		chrome.storage.local.get('text', function(data){
			console.log(typeof response.choice)
		    if (typeof response.choice == 'undefined' || response.choice == "save") {
		    	console.log('good');
		    	
		        // document.write("Kuch krte hai ruko");
		    }
		    else{
		        document.getElementById('text').innerHTML = data.text;
				console.log(data.text);
				if (response.choice == 'share'){
			        showQR(data.text);
				    chrome.storage.local.remove('choice');
				}
		    }
		    addLinkToDB(data.text);
		    chrome.tabs.query({active: true, currentWindow: true}, function (tab){
				if (tab[0].url)
					chrome.storage.local.set({text:tab[0].url})
			});
		});
    // }
	});
};

function showQR(text){
    url ='https://chart.googleapis.com/chart?cht=qr&chl=' + encodeURIComponent(text) + '&choe=UTF-8&chs=250x250';
    if (url.length < 2048)
        document.getElementById('image').setAttribute('src', url);
    else 
    	document.write("Too many characters selected ! Please select less than 2048 characters.");
}

function addLinkToDB(link){
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
		if (request.greeting == "login"){
    // console.log(request.data);
		    if (request.data.status == 200 ){
				if (document.getElementById('logout').style['visibility'] == 'visible'){
					console.log('adding to DB!');
					$.ajax({
						url:'http://139.59.32.96/addLink.php',
						type:'POST',
						data:{
							link:link
						},
						error:function(){
							console.log('error');
							alert('error');
						},
						success:function(data){
							console.log(data);
							// alert(data);
						}
					})
				}
			}
		}
	});
}