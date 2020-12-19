

function validate_login(){
    // console.log("Check inputs");
    var loginpassword = document.getElementById("password");
    var loginusername = document.getElementById("username");

    const usernameValue = loginusername.value.trim();    
    const loginpasswordValue = loginpassword.value.trim(); 

    var loginInputError =false;

    if(usernameValue ==="")
    {
        loginInputError =true;
        setErrorFor(loginusername, "Username cannot be blank");
    }  else {
        loginInputError =false;
        setSuccessFor(loginusername);
    }

    if(loginpasswordValue ==="")
    {
        loginInputError =true;
        setErrorFor(loginpassword, "Password cannot be blank");
    } 
    else{
        loginInputError =false;
        setSuccessFor(loginpassword);
    }

    // if(loginInputError===false){
    //     alert("LOGIN PAGE - Validation Success");
    // }
    return loginInputError;
}

function setErrorFor(input, message){
    // console.log(input);
    const formControl = input.parentElement; //form_control
    const ptag = formControl.querySelector("p");
    //add error msg in p tag
    ptag.innerText = message;
    //add error class
    formControl.className = "form_control error";

    return;
}

function setSuccessFor(input){
    const formControl = input.parentElement;
    //add success class
    formControl.className="form_control success";
    
    return;
}

function clearAlerts(){
    $('p.text-danger').hide();
    $('p.text-success').hide();
}