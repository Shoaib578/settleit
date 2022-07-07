export function emailValidation(data) {
    if (data === "" || data === null || data === undefined) {
      return { status: false, message: "*Please enter your email id/username." };
    } else {
      return { status: true, message: "" };
    }
  }
  

  export function currencyValidation(data) {
    if (data === "" || data === null || data === undefined) {
      return { status: false, message: "*Please enter your currency" };
    } else {
      return { status: true, message: "" };
    }
  }
  


  export function passwordValidation(data) {
    if (data === "" || data === null || data === undefined) {
      return { status: false, message: "*Please provide a valid password." };
    } else {
      return { status: true, message: "" };
    }
  }
  
  // Username validation handler
  export function checkUserName(username) {
    var usernameRegex = /^[a-zA-Z0-9\.\d\-\_]{2,30}$/;
    if (username == "" || username == undefined || username == null) {
      return { status: false, message: "*Please enter username." };
    } else if (!usernameRegex.test(username)) {
      return {
        status: false,
        message: "*Please use english letters, digits, underscore, dash or dot.",
      };
    } else if (username.length < 5) {
      return {
        status: false,
        message: "*Username can't be shorter than 5 characters.",
      };
    } else if (username.length > 30) {
      return {
        status: false,
        message: "*Username can't be longer than 30 symbols.",
      };
    } else {
      return { status: true, message: "" };
    }
  }
  
  // Email validation handler
  export function validateEmail(text) {
    //var emailRegex = /(?=^.{8,100}$)([a-zA-Z\d*])+(\.?)([a-zA-Z\d*])*@{1}([a-zA-z\d*])+(\.){1}([a-zA-Z\d*]){2,}/
    // /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z.]{2,4}$/;
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let email = text.trim();
    if (email == "" || email == undefined || email == null) {
      return { status: false, message: "*Please enter email." };
    } else if (!emailRegex.test(email)) {
      return { status: false, message: "*Please enter valid email." };
    } else {
      return { status: true, message: "" };
    }
  }
  
  // First name validation.
  export function validateFirstName(text) {
    var firstNameRegex = /^[a-zA-Z\s]+$/;
    let firstName = text.trim();
    if (firstName == "" || firstName == undefined || firstName == null) {
      return {
        status: false,
        message:"*Please enter first name.",
      };
    } else if (!firstNameRegex.test(firstName)) {
      return { status: false, message: "*Should consist only of letters." };
    } else {
      return { status: true, message: "" };
    }
  }
  
  // Last name validation on ID Verification screen.
  export function validateLastName(text) {
    var lastnameRegex = /^[a-zA-Z\s]+$/;
    let lastName = text.trim();
    if (lastName == "" || lastName == undefined || lastName == null) {
      return { status: false, message: "*Please enter last name." };
    } else if (!lastnameRegex.test(lastName)) {
      return { status: false, message: "*Should consist only of letters." };
    } else {
      return { status: true, message: "" };
    }
  }
  
  // Password validation handler
  export function validatePassword(text) {
    var passwordRegex = /^(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/;
  
    // /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?& ]{8,13}$/
  
    // /^(?=.*\d)(?=.*[a-zA-Z!@#$^+=])/
    let password = text;
    console.log(password);
    if (password == "" || password == undefined || password == null) {
      return { status: false, message: "*Please enter password." };
    }
    // else if (password.length < 8) {
    //   return { status: false, message: "Too short." };
    // }
    // else if (!passwordRegex.test(password)) {
    //   return {
    //     status: false,
    //     message:
    //       "*Password must be 8-13 characters long, must have 1 lowercase, 1 uppercase, 1 number & a special character eg. !@#$%^&.",
    //   };
    // } 
    else {
      return { status: true, message: "" };
    }
  }
  
  // DOB validation on ID Verification screen.
  export function validateDOB(dob) {
    if (dob == "" || dob == undefined || dob == null) {
      return { status: false, message: "*Please enter date of birth." };
    } else {
      return { status: true, message: "" };
    }
  }
  
  // Phone no validation
  export function validatePhoneNo(phoneNo) {
    // var phonenoRegex = /^\d{14}$/
    if (phoneNo == "" || phoneNo == undefined || phoneNo == null) {
      return { status: false, message: "*Please enter mobile number." };
    } else if (phoneNo.length < 10) {
      return { status: false, message: "*Please enter valid mobile number." };
    }
    // else if (phoneNo.length != 14) {
    //   return { status: false, message: "*Please enter valid mobile number." };
    // }
    else {
      return { status: true, message: "" };
    }
  }
  export function validatePostCode(text) {
    // var postCodeRegex = /^(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[ ]).{8,}$/
    //var postCodeRegex = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i
    var postCodeRegex = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
    if (text != null) {
      var postCode = text.trim();
    }
    if (postCode == "" || postCode == undefined || postCode == null) {
      return { status: false, message: "*Please enter post code" };
    } else if (!postCodeRegex.test(postCode)) {
      return { status: false, message: "*Please enter valid post code." };
    } else {
      return { status: true, message: "" };
    }
  }
  
  export function numWithComma(a) {
    if (a !== '' && a !== undefined && a !== null){
      return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
  }