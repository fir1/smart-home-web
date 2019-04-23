/* Note: with each POST request they should be CSRF token included, otherwise the server will throw exception error.
 */


// The below function will send POST request to the server to delete Device
const deleteDevice = (button) => {

    const deviceId = button.parentNode.querySelector("[name=deviceId]").value,
        csrf = button.parentNode.querySelector("[name=_csrf]").value;
    let currentDeviceDiv = document.getElementById(deviceId);

    $.ajaxSetup({
        "beforeSend": function (xhr) {
            xhr.setRequestHeader("Csrf-Token", csrf);
        }
    });

    $.ajax({
            "url": `/device/${ deviceId}`,
            "type": "DELETE"
        })
        .then((data) => { // the JSON data that have been sent from server will be retrieved in here
            console.log(data.message);
            currentDeviceDiv.parentNode.removeChild(currentDeviceDiv);
        });
};


// The below function will send POST request to the server to add Device
const addDevice = (button) => {

    const parent = $(button).parents(),
        deviceName = parent.children("input[name=deviceNameCheck]").val(),
        typeDevice = $("input[name='typeDevice']").val(),
        csrf = parent.children("input[name=_csrf]").val();
        $(".message").remove(); //this required to clear error messages so new errors will show up
    $.ajaxSetup({
        "beforeSend": function (xhr) {
            xhr.setRequestHeader("Csrf-Token", csrf);
        }
    });

    if (deviceName.length > 0) {
        let myKeyVals = {
            "deviceName": deviceName,
            "typeDevice": typeDevice
        };

        $.ajax({
                "url": "/add-device",
                "type": "POST",
                "data": myKeyVals
            })
            .then((data) => {
                console.log(data.message);
                // after adding device reload the page so it will be retrieved from the database
                window.location.reload();

            });
    } else {
        $('#errorMessage').addClass("user-message user-message--error");
        $('#errorMessage').append('<p class="message">Please Enter Valid Name</p>').show();
     
    }
};


// The below function will send POST request to the server to set Time to the Device
const setTime = (button) => {
    const parent = $(button).parent(),
        csrf = parent.children("input[name=_csrf]").val(),
        deviceId = parent.children("[name=deviceId]").val(),
        typeDevice = $("input[name='typeDevice']").val(),
        deviceName = parent.children("input[name=deviceName]").val(),
        startTime = parent.children("input[name=startTime]").val(),
        finishTime = parent.children("input[name=finishTime]").val();

    $.ajaxSetup({
        "beforeSend": function (xhr) {
            xhr.setRequestHeader("Csrf-Token", csrf);
        }
    });

    let clientZone = moment.tz.guess(), // will take the region of the user from browser, such as based on the time and date of PC or Mobile Phone
        startTimeConvert, finishTimeConvert, myKeyVals,
        isStartTimeValid = false,
        isFinishTimeValid = false;

    $(".message").remove(); // this required to clear error messages so new errors will show up

    // The startTime should be valid DATE format and the time difference between the current time and the time that user sets should be greater than 0 minutes in short user can't setup time in the past
    if ((moment(startTime).diff(moment(), "minutes") >= 0 && moment(startTime).isValid())) {
        let start = moment.tz(startTime, clientZone);

        startTimeConvert = start.tz("Europe/London").format(); // converting the start time from the client region to the server region which is Europe/London
        myKeyVals = {
            "deviceName": deviceName,
            "startTime": startTimeConvert,
            "finishTime": finishTimeConvert,
            "typeDevice": typeDevice
        };
        isStartTimeValid = true;
    }

    // The finishTime should be valid DATE format and the time difference between current time and the time that user sets should be greater than 0 minutes in short user can't setup time in the past
    if ((moment(finishTime).diff(moment(), "minutes") >= 0) && moment(finishTime).isValid()) {
        let finish = moment.tz(finishTime, clientZone);

        finishTimeConvert = finish.tz("Europe/London").format();
        myKeyVals = {
            "deviceName": deviceName,
            "startTime": startTimeConvert,
            "finishTime": finishTimeConvert,
            "typeDevice": typeDevice
        };
        isFinishTimeValid = true;
    }

    if (isStartTimeValid || isFinishTimeValid) {
        $.ajax({
                "url": `/set-time/${ deviceId}`,
                "type": "POST",
                "data": myKeyVals
            })
            .then((data) => {
                console.log(data.message);
            });

        $(`#errorMessage_${ deviceId}`).remove();
    } else {
        $(`#errorMessage_${ deviceId}`).addClass("user-message user-message--error");
        $(`#errorMessage_${ deviceId}`).append('<p class="message">Please Enter Valid Time</p>').show();
    }

};


// The below function will send POST request to the server to change state of the Device
const stateChange = (input) => {
    const parent = $(input).parents(),
        csrf = parent.children("input[name=_csrf]").val(),
        deviceId = parent.children("input[name=deviceId]").val(),
        typeDevice = $("input[name=typeDevice]").val(),
        state = $(input).parent().children("input[name=toggleButton]").prop("checked");

    let stateOfDevice;

    if (state) {
        stateOfDevice = "On";
    } else {
        stateOfDevice = "Off";
    }

    let myKeyVals = {
        "deviceId": deviceId,
        "typeDevice": typeDevice,
        "state": stateOfDevice
    };

    $.ajaxSetup({
        "beforeSend": function (xhr) {
            xhr.setRequestHeader("Csrf-Token", csrf);
        }
    });

    $.ajax({
            "url": `/state-change/${ deviceId}`,
            "type": "POST",
            "data": myKeyVals
        })
        .then((data) => {
            console.log(data.message);
        });


};

// The below function will send POST request to the server to change state of all type of Devices, such as, if user wants to turn on or off PLUGS then all plugs will be on
const stateChangeAll = (input, state) => {
    const parent = $(input).parents(),
        csrf = parent.children("input[name=_csrf]").val(),
        typeDevice = parent.children("input[name=typeDevice]").val();

    let myKeyVals = {
        "typeDevice": typeDevice,
        "state": state
    };

    $.ajaxSetup({
        "beforeSend": function (xhr) {
            xhr.setRequestHeader("Csrf-Token", csrf);
        }
    });

    $.ajax({
            "url": "/state-change-all",
            "type": "POST",
            "data": myKeyVals
        })
        .then((data) => {
            console.log(data.message);
        });
};

// The below function will send POST request to the server to change the username
const updateProfile = (input) => {
      const parent = $(input).parent(),
           csrf = parent.children("input[name=_csrf]").val(),
           username =$("input[name=username]").val();

    $(".message").remove(); // this required to clear error messages so new errors will show up

    // if(username.length===0){
    //        $("#errorMessage").addClass("user-message user-message--error");
    //         $("#errorMessage").append('<p class="message">The User Name can not be empty</p>').show();  
    //         return false; 
    // }
    // $('#user').append('Hello');
    // return true;

    let myKeyVals = {
        "username": username
    };

    if (username.length > 0) {
        $(".user-message ").remove();
        $.ajaxSetup({
            "beforeSend": function (xhr) {
                xhr.setRequestHeader("Csrf-Token", csrf);
            }
        });

        $.ajax({
                "url": "/update-profile",
                "type": "POST",
                "data": myKeyVals
            })
            .then((data) => {
                console.log(data.message);
                $("#user").text("Welcome "+ username); //change the DOM without refreshing the page
            });
    } else {
        $("#errorMessage").addClass("user-message user-message--error");
        $("#errorMessage").append('<p class="message">The User Name can not be empty</p>').show();
    }
};

// The below function will send POST request to the server to log out
const postLogOut = () => {

    const csrf = $("input[name=_csrf]").val();

    $.ajaxSetup({
        "beforeSend": function (xhr) {
            xhr.setRequestHeader("Csrf-Token", csrf);
        }
    });

    $.ajax({
            "url": "/logout",
            "type": "POST"
        })
        .then((data) => {
            let redirect = data.linkRedirect;
            window.location.replace(redirect);
        });
};