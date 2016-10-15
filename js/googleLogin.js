chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
  if (request.greeting == "login"){
    // console.log(request.data);
    if (request.data.status == 200 ){
      userLoggedIn(request.data);
    }
    else{
      userNotLoggedIn();
    }
  }
});

function userNotLoggedIn(){
  $('#welcome').html('Welcome');
  $(document).ready(function(){
    CSS('login', 'visible');
    CSS('signup', 'visible');
    CSS('logout', 'hidden');
    $("#login").click(function(){
      CSS('loginform', 'visible');
      // document.getElementById('loginform').setAttribute('width', 0);
      // document.getElementById('loginform').setAttribute('height', 0);
      document.getElementById('loginform').contentWindow.document.getElementById('cancel').addEventListener('click',
          function(){ 
        CSS('loginform', 'hidden');
      });
      activateSubmitButton();
    })
    activateSignUpButton();
})
}

function CSS(id, value){
  document.getElementById(id).style['visibility'] = value;
}

function activateSubmitButton(){
  document.getElementById('loginform').contentWindow.document.getElementById('submit').addEventListener('click',
   function(){        
    var data = new FormData();
    data.append('email', document.getElementById('loginform').contentWindow.document.getElementById('email').value);
    data.append('password', document.getElementById('loginform').contentWindow.document.getElementById('password').value);
    login(data);
  })
  
}

function login (data){
  var xhr = new XMLHttpRequest();
  method = 'POST';
  url = 'http://139.59.32.96/login.php';
  xhr.open(method, url, true);
  xhr.onreadystatechange = function(){
    if (xhr.readyState == 4){
      resp = JSON.parse(xhr.responseText);
      var status = resp.status;
      // console.log(status);
      // document.getElementById('loginform').contentWindow.document.getElementById('error').innerHTML = '';
      if (resp.status == 200){
        document.getElementById('welcome').innerHTML = "Welcome " + resp.name;
        // Hide Buttons and iframe
        CSS('loginform', 'hidden');
        CSS('login', 'hidden');
        CSS('signup', 'hidden');
        // // document.getElementById('loginform').setAttribute('width', 0);
        // // document.getElementById('loginform').setAttribute('height', 0);
        activateLogOutButton();
      }
      else{
        // console.log(data);
        document.getElementById('loginform').contentWindow.document.getElementById('email').value = data.get('email');
        document.getElementById('loginform').contentWindow.document.getElementById('password').value = data.get('password');
        document.getElementById('loginform').contentWindow.document.getElementById('error').innerHTML = resp.response;
        activateSubmitButton();
      }
    }
  }
  xhr.send(data);
}

function userLoggedIn(data){
  $('#welcome').html('Welcome '  + data.name);
  // console.log(data.name);
  activateLogOutButton();
}
function activateSignUpButton(){
 var signUp = document.getElementById('signup');
 signUp.addEventListener('click', function(){
  chrome.tabs.create({url:"http://139.59.32.96/signup.html"})
  // console.log("Sign Me Up")
});
}

function activateLogOutButton(){
  CSS('logout', 'visible');
  $('#logout').click(function(){
    $.ajax({
      url:'http://139.59.32.96/logout.php',
      type:'GET',
      data:{
        query:"logout"
      },
      error:function(){
        console.log('error');
      },
      success:function(data){
        // console.log(data);
        if (data == "success")
        {
          // console.log('Logged out!!!');
          userNotLoggedIn();
        }
      }
    })
  })
}