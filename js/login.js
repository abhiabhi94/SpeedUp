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
  return true;
});

function userNotLoggedIn(){
  $('#welcome').html('Welcome User');
  $(document).ready(function(){
    $('#tags').hide();
    $('#response').html('Please login to bookmark this');
    $('#response').css('color', 'red');
    $('#login').show();
    $('#signup').show();
    $('#logout').hide();
    $('#loginform').hide();
    $("#login").click(function(){
      $('#loginform').show();
      $('#email').focus();
      $('#loginform').contents().find('#cancel').click(function(){ 
        $('#loginform').hide();
      });
      activateSubmitButton();
    });
    activateSignUpButton();
});
}

function activateSubmitButton(){
  $('#loginform').contents().find('#submit').click(function(){        
    var data = new FormData();
    data.append('email', $('#loginform').contents().find('#email').val());
    data.append('password', $('#loginform').contents().find('#password').val());
    login(data);
  });
}

function login (data){
  $('#error').html('Logging in!!!');
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
        $('#response').html('');
        // Hide Buttons and iframe
        $('#loginform').hide();
        $('#login').hide();
        $('#signup').hide();
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
  $('#loginform').hide();
  $('#login').hide();
  $('#signup').hide();
  // console.log(data.name);
  activateLogOutButton();
}
function activateSignUpButton(){
 var signUp = document.getElementById('signup');
 $('#signup').click(function(){
  chrome.tabs.create({url:"http://139.59.32.96/signup.html"})
  // console.log("Sign Me Up")
});
}

function activateLogOutButton(){
  // CSS('logout', 'visible');
  $('#logout').show();
  $('#logout').click(function(){
    $('#save').hide();
    $('#welcome').html('Logging out');
    $('#welcome').css('color', 'red');
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
      },
      complete:function(){
        $('#response').html('Logged out successfully.');
        $('#welcome').css('color', 'black');
      }
    })
  })
}