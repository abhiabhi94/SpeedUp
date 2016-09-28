if (chrome.storage){
	chrome.storage.local.get("text", function(data) {
	    if (typeof data.text == "undefined") {
        document.write("Please select something to share!");
	    } else {
	        document.getElementById('text').innerHTML = data.text;
	        url ='https://chart.googleapis.com/chart?cht=qr&chl=' + encodeURIComponent(data.text) + '&choe=UTF-8&chs=250x250';
	        if (url.length < 2048) {
		        document.getElementById('image').setAttribute('src', url);
		        chrome.tabs.query({active: true, currentWindow: true}, function (tab){
					if (tab[0].url)
						chrome.storage.local.set({text:tab[0].url})
					})
		    }
		    else 
		    	document.write("Too many characters selected ! Please select less than 2048 characters.");
	        }
	});
};