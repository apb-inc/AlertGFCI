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

var holkaOneName = "Holka 1";
var holkaThreeName = "Holka 3";
var holkaOneIp = "http://127.0.0.1";
var holkaThreeIp = "http://192.168.0.110";

module.exports = [
    {
        name:"Hol-Ka-Float",
        server:"Holka 1",
        ip: holkaOneIp,
        port:"80",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Sonos",
        server:"Holka 1",
        ip:holkaOneIp,
        port:"5005",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Twilio",
        server:"Holka 1",
        ip:holkaOneIp,
        port:"2605",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Hue Motion Bathroom",
        server:"Holka 1",
        ip:holkaOneIp,
        port:"8081",
        alertInfo:roommateAlertInfo
    },
    {
        name:"Hue Dash",
        server:"Holka 1",
        ip:holkaOneIp,
        port:"8081",
        alertInfo:connorAlertInfo
    },
    {
        name:"Hue Motion Living Room",
        server:"Holka 3",
        ip:holkaOneIp,
        port:"8081",
        alertInfo:connorAlertInfo
    }
];
