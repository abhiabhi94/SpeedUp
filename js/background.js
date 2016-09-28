chrome.contextMenus.create({id:"id", 
title:"Share", 
contexts: ["selection", "image", "link"],
});
try{
	function storeText(info, tab){
		if (getText(info)){
			if (getImage(info)){
				if (getLink(info)){
						// console.log("Nothing selected!");
						return
				}
			}
		}
	}
	function getLink(info){
		if (info.linkUrl){
			chrome.storage.local.set({text: info.linkUrl});
			return false;
		}
		return true;
	}
	function getImage(info){
		if (info.srcUrl){
			chrome.storage.local.set({text:info.srcUrl});
			return false;
		}
		return true;
	}
	function getText(info){
		if (info.selectionText){
			chrome.storage.local.set({text: info.selectionText});
			return false;
		}
		return true;
	}
}
catch(err){
	console.log("Error..Try again");
};
chrome.contextMenus.onClicked.addListener(storeText);
chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab){
	chrome.storage.local.set({text: changedInfo.url})
});