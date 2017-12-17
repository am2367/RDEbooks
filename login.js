$(document).ready(function() {
  stopSessions();
});
//starts the session for the passed user
function setSession(user) {
  var request = new XMLHttpRequest();
  request.open("POST", "sessions.php", true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function() {
    if ((this.readyState == 4) && (this.status == 200)) {
      handleSessionResponse(this.responseText);
    }
  }
  request.send("request=set" + "&user=" + user);
}
//stops the session for the current user
function stopSessions() {
  var request = new XMLHttpRequest();
  request.open("POST", "sessions.php", true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function() {

    if ((this.readyState == 4) && (this.status == 200)) {


    }
  }
  request.send("request=stop");
}
//handles the session reply
function handleSessionResponse(response) {
  if (response == true) {
    window.location.href = 'library.html';
  } else {
    alert("Could not start session. Please login again.");
  }
}

function submitLogin() {
  var uname = document.getElementById("inputName").value;
  var pword = document.getElementById("inputPassword").value;
  sendLoginRequest(uname, pword);
  return 0;
}

function HandleLoginResponse(response) {
  if (response == "1") {
    setSession(document.getElementById("inputName").value);
  } else
    alert("incorrect username or password");
}

function sendLoginRequest(username, password) {
  var request = new XMLHttpRequest();
  request.open("POST", "requestHandler.php", true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function() {

    if ((this.readyState == 4) && (this.status == 200)) {
      HandleLoginResponse(this.responseText);
    }
  }
  request.send("type=login&uname=" + username + "&pword=" + password);
}

function registerPage() {
  window.location.href = 'register.html';
}
