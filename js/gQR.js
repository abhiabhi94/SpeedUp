var count = 1;
if (chrome.storage){
	chrome.storage.local.get('choice', function(response){
    	if (typeof response.choice == 'undefined')
    		getActiveTabUrl();
		chrome.storage.local.get('text', function(data){
	        document.getElementById('text').innerHTML = data.text;
		    if (typeof response.choice == 'undefined' || response.choice == "save") {
				chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
					if (request.greeting === 'login'){
					    if (request.data.status === 100)
				    		document.getElementById('response').innerHTML = 'Please log in to bookmark this';
				    	else{
				    		createHTML(data.text);
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
		});
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
	console.log('adding to DB!');
	x = 1;
	var tag = new Array();
	do{
		tag.push($('#tag' + x).val());
		x++;
	}
	while(x<=count);
	while(count < 5){
		tag.push('');
		count++;
	}
	tag = JSON.stringify(tag);
	console.log(tag);
	$.ajax({
		url:'http://139.59.32.96/addLink.php',
		type:'POST',
		data:{
			link:link,
			tag: tag
		},
		error:function(){
			console.log('error');
			alert('error');
		},
		success:function(data){
			console.log(data);
			// alert('Link saved successfully!');
			resp = document.getElementById('response');
			resp.style = 'color:green';
			resp.innerHTML = data;
		}
	});
}

function createHTML(text){
	var div1 = document.createElement('div');
	div1.id = 'tags';
	var div2 = document.createElement('div');
	div2.id = 'inputTags';
	div2.class = 'tags';
	div1.appendChild(div2);
	createTagElement(div2, count);
	var div3 = document.createElement('div');
	div3.id = 'save';
	div1.appendChild(div3);
	save = document.createElement('button');
	save.id = 'saveButton';
	save.innerHTML = 'Save';
	div3.appendChild(save);
	var link = document.getElementById('link');
	link.appendChild(div1);
	$('#inputTags').on('click', '.plus', function(){
		if (count < 5){
			$('#add' +  count).toggle(false);
			count++;
			createTagElement(div2, count);
			console.log(count);
		}
	})
	$('#saveButton').click(function(){
		// console.log('hdsm');
		addLinkToDB(text);
	})
}

function getActiveTabUrl () {
	chrome.tabs.query({active: true, currentWindow: true}, function (tab){
		if (tab[0].url)
			console.log('activeTab');
			chrome.storage.local.set({text:tab[0].url})
	});
	chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab){
		console.log('Updated');
		chrome.storage.local.set({text: changedInfo.url})
	});
}


function createTagElement (div) {
	console.log('teds');
	input = document.createElement('input');
	input.type = 'text';
	input.placeholder = 'Tags to save with this link, ' + (5-count) + ' tags more';
	input.id = 'tag' + count;
	// input.name = 'tagnames';
	input.style = "width: 280";
	div.appendChild(input);
	if (count !=5)
		createPlusButton(div, count);
}
function createPlusButton (div) {
	console.log('gjh');
	plus = document.createElement('img');
	plus.className = 'plus';
	plus.alt = "Add another tag";
	plus.src = '../images/plus.gif';
	plus.style = 'inline-block';
	plus.height = 20;
	plus.width = 20;
	plus.style = "position:fixed";
	plus.id = 'add' + count;
	div.appendChild(plus);
	// body...
}