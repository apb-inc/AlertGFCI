var roommateAlertInfo = [
    {
        name:"Connor",
        number:"555-555-5555",
        email:"email@gmail.com"
    },
    {
        name:"Connor",
        number:"555-555-5555",
        email:"email@gmail.com"
    }
];

var connorAlertInfo = [
    {
        name:"Connor",
        number:"555-555-5555",
        email:"email@gmail.com"
    }
];

module.exports = [
    {
        name:"Hol-Ka-Float",
        server:"Holka 1",
        ip:"http://127.0.0.1:80",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Sonos",
        server:"Holka 1",
        ip:"http://127.0.0.1:5005",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Twilio",
        server:"Holka 1",
        ip:"http://127.0.0.1:8080",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Hue Motion Bathroom",
        server:"Holka 1",
        ip:"http://127.0.0.1:8081",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Hue Dash",
        server:"Holka 1",
        ip:"http://127.0.0.1:8081",
        alertInfo:connorAlertInfo
    },
    {
        name:"Hue Motion Living Room",
        server:"Holka 3",
        ip:"http://127.0.0.1:8081",
        alertInfo:connorAlertInfo
    }
];
