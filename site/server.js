
var questions = [
    "What's your favorite color?",
    "Where are you from?",
    "What's the last film you watched?",
    "What does your Horizons project do?",
    "What are you studying?",
    "What's your favorite ice cream flavor?",
    "What did you do over spring break?",
    "Which class has been your favorite at GT?"
]

var lastQ = "";


var baseDict = {
    "A" : "❤",
    "B" : "😂",
    "C" : "🔥",
    "D" : "😍",
    "E" : "😊",
    "F" : "🤔",
    "G" : "✔",
    "H" : "🥰",
    "G" : "✔",
    "I" : "😭",
    "J" : "💀",
    "K" : "😏",
    "L" : "😒",
    "M" : "🤩",
    "N" : "😈",
    "O" : "👏",
    "P" : "🙏",
    "Q" : "💩",
    "R" : "👌",
    "S" : "🎉", 
    "T" : "😘",
    "U" : "☕",
    "V" : "🍕",
    "W" : "🍷",
    "X" : "🍔",
    "Y" : "🍦",
    "Z" : "🍩"
};

var otherDict = {
    "A" : "❤",
    "B" : "😂",
    "C" : "🔥",
    "D" : "😍",
    "E" : "😊",
    "F" : "🤔",
    "G" : "✔",
    "H" : "🥰",
    "G" : "✔",
    "I" : "😭",
    "J" : "💀",
    "K" : "😏",
    "L" : "😒",
    "M" : "🤩",
    "N" : "😈",
    "O" : "👏",
    "P" : "🙏",
    "Q" : "💩",
    "R" : "👌",
    "S" : "🎉", 
    "T" : "😘",
    "U" : "☕",
    "V" : "🍕",
    "W" : "🍷",
    "X" : "🍔",
    "Y" : "🍦",
    "Z" : "🍩"
};


function getEmoji(ID, keyCode){

    var char = String.fromCharCode(keyCode)

    if(ID == baseID){
        if(char in baseDict){
            return baseDict[char];
        }
        else {
            return "";
        }
    }
    else{
        if(char in otherDict){
            return otherDict[char];
        }
        else {
            return "";
        }
    }


}

function getRandomArrayElement(arr){
    //Minimum value is set to 0 because array indexes start at 0.
    var min = 0;
    //Get the maximum value my getting the size of the
    //array and subtracting by 1.
    var max = (arr.length - 1);
    //Get a random integer between the min and max value.
    var randIndex = Math.floor(Math.random() * (max - min)) + min;
    //Return random value.
    return arr[randIndex];
}

var express = require('express');
var path = require('path');
var app = express();

var server = app.listen(3000);
var io = require('socket.io').listen(server);
app.use(express.static('static'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/refactor.html');
});

var baseID = -1;

io.on('connection', function(socket){
    
    if(baseID == -1){
        baseID = socket.id;
    }

    socket.on('disconnect', function(){
        if(baseID == socket.id){
            baseID = -1;
        }
    });

    socket.on('get-emoji', function(msg, ackFn){
        
        var response = {
            emoji: getEmoji(socket.id, msg.keyCode)
        }

        ackFn(response);  
    });

    socket.on('submit', function(msg){

        console.log(msg.prompt);
        console.log(msg.emojis);

        var newQ = getRandomArrayElement(questions);
        while(newQ == lastQ){
            newQ = getRandomArrayElement(questions);
        }

        lastQ = newQ;

        var response = {
            prompt: newQ
        }

        io.emit('new-prompt', response);
    });

    socket.on('successful-add', function(msg){
        socket.broadcast.emit('new-emoji', msg);
    });

    socket.on('delete', function(){
        socket.broadcast.emit('remove-emoji');
    })
});
