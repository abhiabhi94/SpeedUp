chrome.contextMenus.create({
	id:"share", 
	title:"Share", 
	contexts: ["selection", "image", "link"],
});
chrome.contextMenus.create({
	id:"save",
	title:"Save Link",
	contexts: ["selection", "image", "link"],
});

try{
	function storeText(info, tab){
		chrome.storage.local.set({choice: info.menuItemId});
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
// chrome.tabs.onUpdated.addListener(function(tabId, changedInfo, tab){
// 	chrome.storage.local.set({text: changedInfo.url})
// });

// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail());
// };
//  function onFailure(error) {
//       console.log(error);
// };
// function renderButton() {
//       gapi.signin2.render('my-signin2', {
//         'scope': 'profile email',
//         'width': 240,
//         'height': 50,
//         'longtitle': true,
//         'theme': 'dark',
//         'onsuccess': onSuccess,
//         'onfailure': onFailure
//       });
// };