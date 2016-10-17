userLog = chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
		// console.log(request.greeting ==='login');
	if (request.greeting === 'login'){
		    // console.log(request.data.status == 200);
	    if (request.data.status == 200 )
	    	return true;
    	return false;
	}
	return true;
});

if (chrome.storage){
	chrome.storage.local.get('choice', function(response){
		chrome.storage.local.get('text', function(data){
			// console.log(typeof response.choice)
		    if (typeof response.choice == 'undefined' || response.choice == "save") {
				chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
					if (request.greeting === 'login'){
						// console.log(info);
						// console.log (userLog);
					    if (request.data.status === 100)
			    		document.getElementById('response').innerHTML = 'Please log in to save this';
				    	else{
				    		createHTML(data.text);
				    		// getTags();
				    		// addLinkToDB(data.text);
						}
			    	}
				});
		    }
		    else{
				console.log(data.text);
				if (response.choice == 'share'){
			        showQR(data.text);
				    chrome.storage.local.remove('choice');
				}
		    }
	        document.getElementById('text').innerHTML = data.text;
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
		if (request.greeting === 'login'){
						// console.log(info);
						// console.log (userLog);
		    if (request.data.status === 100){
				console.log('adding to DB!');
				tag1 = $('#tag1').val();
				$.ajax({
					url:'http://139.59.32.96/addLink.php',
					type:'POST',
					data:{
						link:link,
						tag1: tag1
					},
					error:function(){
						console.log('error');
						alert('error');
					},
					success:function(data){
						console.log(data);
						// alert('Link saved successfully!');
						resp = document.createElement('p');
						resp.style = 'color:green';
						resp.innerHTML = 'Link added successfully';
						logOutButton = document.getElementById('logOutButton');
						logOutButton.appendChild(resp);
						// alert(data);
					}
				})
				// }
			}
		}
	});
}

function loginStatus(){
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
		// console.log(request.greeting ==='login');
		if (request.greeting === 'login'){
		    // console.log(request.data.status == 200);
		    if (request.data.status == 200 )
		    	return true;
		    return false;
		}
	});
}
	// return true;

function createHTML(text){
	var div1 = document.createElement('div');
	div1.style = "width:300";
	div1.id = 'tags';
	var div2 = document.createElement('div');
	div2.id = 'inputTags';
	div2.style = 'all:inherit';
	div1.appendChild(div2);
	input = document.createElement('input');
	input.type = 'text';
	input.placeholder = 'Tags to save with this link, max 5 tags';
	input.id = 'tag1';
	input.name = 'tagnames';
	input.style = "float: left;width: 300";
	div2.appendChild(input);
	var div3 = document.createElement('div');
	div3.id = 'save';
	div3.style = 'float:left';
	div1.appendChild(div3);
	save = document.createElement('button');
	// save.class = 'button';
	save.id = 'saveButton';
	save.innerHTML = 'Save';
	// save.width = 100;
	// save.onSubmit = addLinkToDB(text);
	div3.appendChild(save);
	body = document.getElementById('body');
	var link = document.getElementById('link');
	var buttons = document.getElementById('buttons');
	link.insertBefore(div1, buttons);
	$('#saveButton').click(function(){
		addLinkToDB(text);
	})
}