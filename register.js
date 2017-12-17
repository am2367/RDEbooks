function submitCredentials() {
  var uname = document.getElementById("inputName").value;
  var pword = document.getElementById("inputPassword").value;
	if((uname == "") || (pword == "")){
		alert("One or more of the fields are not filled out.")
	}
  else if (confirmPassword() == true) {
    sendRegisterRequest(uname, pword);
    return 0;
  } else if (confirmPassword() == false) {
    alert("Passwords do not match");
    document.getElementById("form").reset();
  }
}

function HandleRegisterResponse(response) {

  if (response == "1") {
    alert("Registration Successfull!");
    window.location.href = 'login.html';
  } else {
    alert("Registration failed! Please try again.");
  }
}

function sendRegisterRequest(username, password) {
  var request = new XMLHttpRequest();
  request.open("POST", "requestHandler.php", true);
  request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  request.onreadystatechange = function() {

    if ((this.readyState == 4) && (this.status == 200)) {
      HandleRegisterResponse(this.responseText);
    }
  }
  request.send("type=register&uname=" + username + "&pword=" + password);
}

function confirmPassword() {
  var pword = document.getElementById("inputPassword").value;
  var confirmpword = document.getElementById("confirmPassword").value;
  if (pword == confirmpword)
    return true;
  else
    return false;
}
