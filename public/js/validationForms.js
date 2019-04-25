const validateRecaptcha = () => {
    if (grecaptcha.getResponse() == "" || grecaptcha.getResponse() == undefined || grecaptcha.getResponse() === null) {
        $(".message").remove();
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">Please select Captcha!</p>').show();
        return false; //dont send form to the server when it is false;
    } else {
        return true;
    }
};


const validateSignUpForm = () => {
    const userName = $('#name').val();
    const serialPi = $('#serialPi').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const confirmPassword = $('#re_pass').val();

    var nameValidate = true;
    var emailValidate = true;
    var passwordStrengthValidate = true;
    var passwordConfirmValidate = true;
    var serialPiValidate = true;

    $(".message").remove(); //this required to clear error messages so new errors will show up

    if (userName.length === 0) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">Name can not be empty</p>').show();
        nameValidate = false;

    }

    if (serialPi.length === 0) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">Serial # of PI can not be empty</p>').show();
        serialPiValidate = false;
    }

    if (email.length === 0) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">Email can not be empty</p>').show();
        emailValidate = false;
    }

    if (checkPassword(password, userName, email) === false) {
        passwordStrengthValidate = false;
    } else {
        if ((password !== confirmPassword)) {
            $('#errorMessage').addClass("user-message user-message--error");
            $('#errorMessage').append('<p class="message">Passwords do not match!</p>').show();
            passwordConfirmValidate = false;
        }
    }

    if (nameValidate && serialPiValidate && emailValidate && passwordStrengthValidate && passwordConfirmValidate && validateRecaptcha() === true) {
        return true;
    }
    return false;
};

const validateUpdatePassword = () =>{
    const oldPassword = $('#oldPassword').val();
    const newPassword = $('#newPassword').val();
    const confirmPassword = $('#re_pass').val();

    $(".message").remove(); //this required to clear error messages so new errors will show up

    if(oldPassword.length === 0){
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">Old Password Can Not Be Empty</p>').show();
        return false;
    }

    if (checkPassword(newPassword, "", "") === false) {
     return false;
    }  

    if ((newPassword !== confirmPassword)) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">New Passwords do not match!</p>').show();
        return false;
    }
    return true;
}

const validateResetPassword = () => {
    const newPassword = $('#password').val();
    const confirmPassword = $('#re_pass').val();

    $(".message").remove(); //this required to clear error messages so new errors will show up

    if (checkPassword(newPassword, "", "") === false) {
     return false;
    }  

    if ((newPassword !== confirmPassword)) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">New Passwords do not match!</p>').show();
        return false;
    }
    return true;
}


/*The below function will display error to the user, so they know what kind of password to put in order to make
it strong. The valid password will be considered if it has 1 one of each:
1) 1 lowercase alphabetical character
2) 1 uppercase alphabetical character
3) 1 numeric character
4) 1 special character
5) The username is not be part of password
6) The email can not be part of password
7) 8 charachter long or more.
*/
const checkPassword = (password, username, email) => {

    var LowerCaseRegex = new RegExp("^(?=.*[a-z])");
    var UpperCaseRegex = new RegExp("^(?=.*[A-Z])");
    var NumbersRegex = new RegExp("^(?=.*[0-9])");
    var CharachterRegex = new RegExp("^(?=.*[!@#\$%\^&\*])");
    var LengthRegex = new RegExp("^(?=.{8,})");

    if (!(LengthRegex.test(password))) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The password must be eight characters or longer </p>').show();
        return false;
    }

    //It will return -1 if the username will contain password or 0 if they are equall
    if (username.lastIndexOf(password) !== -1 && username.lastIndexOf(password) !== 0) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The username can not be part of password.</p>').show();
        return false;
    }

    if (email.lastIndexOf(password) !== -1 && email.lastIndexOf(password) !== 0) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The email can not be part of password.</p>').show();
        return false;
    }

    if (!(LowerCaseRegex.test(password))) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The password must contain at least 1 lowercase alphabetical character</p>').show();
        return false;
    }

    if (!(UpperCaseRegex.test(password))) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The password must contain at least 1 uppercase alphabetical character</p>').show();
        return false;
    }

    if (!(NumbersRegex.test(password))) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The password must contain at least 1 numeric character.</p>').show();
        return false;
    }

    if (!(CharachterRegex.test(password))) {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">The password must contain at least one special character.</p>').show();
        return false;
    }
    return true;
}