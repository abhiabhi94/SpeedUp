var count = 1;
if (chrome.storage){
	chrome.storage.local.get('choice', function(response){
    	if (typeof response.choice == 'undefined')
    		getActiveTabUrl();
		chrome.storage.local.get('text', function(data){
	        $('#text').html(data.text);
		    if (typeof response.choice == 'undefined' || response.choice == "save") {
				chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
					if (request.greeting === 'login'){
					    if (request.data.status === 100)
				    		$('#response').html('Please log in to bookmark this');
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
	    $('#image').attr('src', url);
    else 
    	document.write("Too many characters selected ! Please select less than 2048 characters.");
}


function addLinkToDB(link){
	console.log('adding to DB!');
	tag = getTags();
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
			$('#response').css('color', 'green');
			$('#response').html(data);
		}
	});
}

function createHTML(text){
	var $div1 = $('<div>', {id:'tags'});
	var $div2 = $('<div>', {id:'inputTags', class:'tags'});
	$div1.append($div2);
	createTagElement($div2, count);
	var $div3 = $('<div>', {id:'save'});
	$div1.append($div3);
	var $save = $('<button>', {id:'saveButton', html:'Save'});
	$div3.append($save);
	$('#link').append($div1);
	$('#inputTags').on('click', '.plus', function(){
		if (count < 5){
			$('#add' +  count).toggle(false);
			count++;
			createTagElement($div2, count);
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


function createTagElement ($div) {
	console.log('teds');
	var $input = $('<input>',{type:'text',
								placeholder:'Tags to save with this link, ' + (5-count) + ' tags more',
								id:'tag' + count,
								style:'width:200;'});
	$div.append($input);
	if (count !=5)
		createPlusButton($div, count);
}
function createPlusButton ($div) {
	console.log('gjh');
	var $plus = $('<img>', {id:'add' + count,
							alt:'Add another tag',
							class:'plus',
							src:'../images/plus.gif',
							style:'inline-block;position:fixed;',
							height:20,
							width:20});
	$div.append($plus);
}
function getTags () {
	x = 1;
	var tag = new Array();
	do{
		tag.push($('#tag' + x).val());
		x++;
	}
	while(x<=count);
	tag = JSON.stringify(tag);
	console.log(tag);
	return tag;
}