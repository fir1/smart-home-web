# Web Application
The web application provides a fully functional smart home web application with the server side connected to it. The web application can be run locally. However, in order to use home automation system the user needs Raspberry Pi and Sonoff Switch acting as IoT device. Please refer to the live web application https://www.smart-homes.me/ .


## Installation
Install Node.js: https://nodejs.org/en/

then:
Install dependencies from bash or command prompt:
```
npm install
```
To run the server
```
node app.js
````

Start a host on default port 5000 by visiting: http://localhost:5000
The web application is hosted in: https://www.smart-homes.me/



## Built with
- [Node.js](https://nodejs.org/en/)

## Dependencies
```
    "bcryptjs": "^2.4.3",
    "connect-flash": "^0.1.1",
    "connect-mongodb-session": "^2.1.1",
    "cron": "^1.7.0",
    "csurf": "^1.9.0",
    "ejs": "^2.5.7",
    "eonasdan-bootstrap-datetimepicker": "^4.17.47",
    "express": "^4.16.2",
    "express-session": "^1.15.6",
    "heroku-ssl-redirect": "0.0.4",
    "moment": "^2.24.0",
    "mongodb": "^3.1.13",
    "mongoose": "^5.4.16",
    "nodemailer": "^5.1.1",
    "nodemailer-sendgrid-transport": "^0.2.0",
    "recaptcha2": "^1.3.3"

```

## Authors
- Firdavs Kasymov

## License
This project is licensed under the MIT License
