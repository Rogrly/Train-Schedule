//Initalizing document ready function - to load Javascript before any other content
$(document).ready(function() {
//Linking and connecting with Firebase database with following variable
var config = {
    apiKey: "AIzaSyAqgRqn5E_9zWiqivwNTesFHN4Lxr2n8Lg",
    authDomain: "example-8bdc2.firebaseapp.com",
    databaseURL: "https://example-8bdc2.firebaseio.com",
    projectId: "example-8bdc2",
    storageBucket: "example-8bdc2.appspot.com",
    messagingSenderId: "371247459291"
  };
  firebase.initializeApp(config);
//Variable to set Firebase database with script
var database = firebase.database();
/* Setting up Clock / Time Functions */
//Reference: (https://momentjs.com/docs/)
//Declaring variable for "local time" via moment.js API
var present = moment();
    //Setting a Function to display/generate local current time clock
    //Reference:(07-firebase/01-Activities/Day-03/20-MomentJS/Solved/momentjs-activity-solved.html)
    function clock() {
        //Setting variable for present time clock fromat
        var local = moment().format("hh:mm:ss");
        //Setting variable for unix time format
        var xTime = moment().format("X");
        //Inserting variable "local" - clock display into the HTML <span> tag id "localTime"
        $("#localTime").html(local);
    };
    //Setting clock intervals to (one second)
    setInterval(clock, 1000);
    //Making a function to update the time and snapshot into database
    //Refrence: (07-firebase/01-Activities/Day-03/19-Add_Child/recent-user-with-all-users-solved.html)
    //(https://www.w3schools.com/jsref/jsref_forEach.asp)
    //https://firebase.google.com/docs/reference/js/firebase.database.Reference
    function timeUpdate() {
        database.ref().once("value", function(snapshot) {
            //Calling function to run once for each element
            snapshot.forEach(function(childSnapshot) {
                //Unix time
                present = moment().format("X");
                database.ref(childSnapshot.key).update({
                update: present,
                });
            });
        });
    }
//Grabbing the values from IDs, making variables & set on click funtions & listeners
/*Reference:(07-firebase/01-Activities/Day-03/17-TimeSheet/Solved/timesheetLogic.js)*/
$("#addButton").on("click", function(event) {
    event.preventDefault();
    var spaceTrain = $("#space-train").val().trim();
    var destination = $("#dest").val().trim();
    var depart = moment($("#next").val().trim(), "hh:mm").format("X");
    var timeX = moment().format("X");
    var frequent = $("#freq").val().trim();
//Pushing as an object JSON into the Firebase database 
    var addTrain = {
        name: spaceTrain,
        destination: destination,
        time: depart,
        timeAdd: timeX,
        frequency: frequent
        };
        //Reference: (07-firebase/01-Activities/Day-03/18-Push/02-recent-user-with-push.html)
        //Pushing addTrain content into database
        database.ref().push(addTrain);
        //Clearing form reset after space train is added
        //Reference: (https://www.formget.com/jquery-reset-form/)
        $("#train-add")[0].reset();
        //Prevents the webpage from being refreshed
        return false;
    });
    //Setting function for when a user adds a train within the input form in HTML
    //Snapshoting the added/new train into database
    //Reference:(07-firebase/01-Activities/Day-03/17-TimeSheet/Solved/timesheetLogic.js)'
    //Reference: (07-firebase/01-Activities/Day-03/21-TrainPredictions/train-example.html)
function addNewTrain(childSnapshot) {
    var addedTime;
    var Key = childSnapshot.key;
    var spaceTrain = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var depart = childSnapshot.val().time;
    var frequent = childSnapshot.val().frequency;
    //convertedTime is the unix time of depart variable
    var convertedTime = moment.unix(depart);
    //Setting variables for the time calculations using moment.js
    var timeDiff = moment().diff(moment(convertedTime, "hh:mm"), "minutes");
    var timeMath = timeDiff % parseInt(frequent);
    var timeTotal = parseInt(frequent) - timeMath;
        //Declaring an if/else statement 
        //if the TimeTotal is less than or equal to 0
        if (timeTotal >= 0) {
            //the addedtime is equal to the timeTotal in minutes and format as 00:00 
            addedTime = moment().add(timeTotal, "minutes").format("hh:mm A");
        } 
        else {
            //else - addedTime is equal to the convertedTime and format as 00:00
            addedTime = convertedTime.format('hh:mm A');
            //Creating value of timeTotal to equal the timeDiff
            timeTotal = timeDiff;
        }
        //Creating variable that will dynamically generate a new table row within HTML
        //Reference:(07-firebase/01-Activities/Day-03/17-TimeSheet/Solved/timesheetLogic.js)
        var newRow = $("<tr>");
        //Adding class with variable ""
        newRow.addClass(Key);
        //Appending-retrieving data and appending content into <td> tag within HTML 
        newRow.append($("<td>").text(spaceTrain))
            .append($("<td>").text(destination))
            .append($("<td>").text(addedTime))
            .append($("<td>").text(frequent))
            .append($("<td>").text(timeTotal))
             $("tbody").append(newRow);
    }
    //Setting a function for trainChange - sending Snapshot of the Added train values into database
    //Reference: (https://firebase.google.com/docs/reference/js/firebase.database.DataSnapshot)
    //Reference: (07-firebase/01-Activities/Day-03/21-TrainPredictions/train-example.html)
    function trainChange (childSnapshot) {
        var addedTime;
        var Key = childSnapshot.key;
        var spaceTrain = childSnapshot.val().name;
        var destination = childSnapshot.val().destination;
        var depart = childSnapshot.val().time;
        var frequent = childSnapshot.val().frequency;
        var convertedTime = moment.unix(depart);
        //Variable that takes the unix time of departure time into hours/minutes
        var timeDiff = moment().diff(moment(convertedTime, "hh:mm"), "minutes");
        //parseInt = turning strings into integer - calculating the timeDiff divided by frequency
        var timeMath = timeDiff % parseInt(frequent);
        //parseInt: frequency minus time difference
        var timeTotal = parseInt(frequent) - timeDiff;
        //Declaring an if/else statement 
        //if the TimeTotal is less than or equal to 0
        if (timeTotal >= 0) {
            //the addedtime is equal to the timeTotal in minutes and format as 00:00 
            addedTime = moment().add(timeTotal, "minutes").format("hh:mm A");
        //else - addedTime is equal to the convertedTime and format as 00:00
        } else {
            //else - addedTime is valued as convertedTime and formated as 00:00
            addedTime = convertedTime.format("hh:mm A");
            //timeTotal values as timeDiff
            timeTotal = timeDiff;
        }
        //Dynamically created rows being placed within html
        $("." + Key).empty();
        $("." + Key).append(
            $("<td>").text(spaceTrain),
            $("<td>").text(destination),
            $("<td>").text(addedTime),
            $("<td>").text(frequent),
            $("<td>").text(timeTotal),
            $("<button>")
            .attr("data-train", Key)
            .html($("<i>")));
    }
    //listener for train changed
    //Listener for Space Train that is added by user (child added)
    database.ref().on("child_added", function(childSnapshot) {
        addNewTrain(childSnapshot);
    });
    //Listener for Space Train that is changed (child changed)
    database.ref().on("child_changed", function(childSnapshot) {
        trainChange (childSnapshot);
    });
    //On click function (document)
    $(document).on("click", '.delete', function(event) {
        var Key = $(this).attr("data-train");
        database.ref(Key).remove();
        $('.' + Key).remove();
    });
});