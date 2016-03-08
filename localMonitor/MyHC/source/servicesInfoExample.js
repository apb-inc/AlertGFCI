var roommateEmails = "roomatess@gmail.com";
var connorEmail = "connoremail@gmail.com";
var roomateCells = ["555-555-5555","555-555-5555"];
var connorCell = "555-555-5555";
module.exports = [
    {
        name:"Hol-Ka-Float",
        server:"Holka 1",
        ip:"http://127.0.0.1:80",
        alertNumbers:roomateCells,
        alertEmails:roommateEmails
    },
    {
        name:"Sonos",
        server:"Holka 1",
        ip:"http://127.0.0.1:5005",
        alertNumbers:roomateCells,
        alertEmails:roommateEmails
    },
    {
        name:"Twilio",
        server:"Holka 1",
        ip:"http://127.0.0.1:8080",
        alertNumbers:roomateCells,
        alertEmails:roommateEmails
    },
    {
        name:"Hue Motion Bathroom",
        server:"Holka 1",
        ip:"http://127.0.0.1:8081",
        alertNumbers:roomateCells,
        alertEmails:roommateEmails
    },
    {
        name:"Hue Dash",
        server:"Holka 1",
        ip:"http://127.0.0.1:8081",
        alertNumbers:connorCell,
        alertEmails:connorEmail
    },
    {
        name:"Hue Motion Living Room",
        server:"Holka 3",
        ip:"http://127.0.0.1:8081",
        alertNumbers:connorCell,
        alertEmails:connorEmail
    }
];
