var http      = require('http');
var express   = require('express');
//var gpio      = require('pi-gpio');
var rpio = require('rpio');

var app       = express();

// input port objects for our example
var inputs = [
    { pin: '7', gpio: '4', value: null },
    { pin: '15', gpio: '22', value: null },
    { pin: '31', gpio: '6', value: null },
    { pin: '37', gpio: '26', value: null },
];

// -----------------------------------------------------------------------
// open GPIO ports

for (var i in inputs) {
    console.log('opening GPIO port ' + inputs[i].gpio + ' on pin ' + inputs[i].pin + ' as output');
    rpio.open(inputs[i].pin, rpio.OUTPUT, rpio.LOW); // , rpio.INPUT, rpio.POLL_LOW);
} // if

// ------------------------------------------------------------------------
// read and store the GPIO inputs twice a second
/**
setInterval( function () {
    var value = rpio.read(inputs[0].pin);
    console.log('read pin ' + inputs[0].pin + ' value = ' + value);
    inputs[0].value = value.toString();

    var value = rpio.read(inputs[1].pin);
    console.log('read pin ' + inputs[1].pin + ' value = ' + value);
    inputs[1].value = value.toString();
}, 500); // setInterval
**/

/**
var l = 0;
setInterval( function () {
    console.log('Loop  #' + l++);

    for (var i in inputs) {
        rpio.write(inputs[i].pin, rpio.HIGH);
        rpio.sleep(1);
        rpio.write(inputs[i].pin, rpio.LOW);
    }
}, 5000); // setInterval
**/

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored
// in the home directory
app.use(express.static(__dirname));

// Express route for incoming requests for a single input

app.get('/button/:id/press', function (req, res) {
    console.log('received API request BUTTON_PRESS: ' + req.params.id);

    for (var i in inputs){
        if ((req.params.id === inputs[i].gpio)) {
            rpio.write(inputs[i].pin, rpio.HIGH);
            rpio.msleep(200);
            rpio.write(inputs[i].pin, rpio.LOW);

            // send to client an inputs object as a JSON string
            res.send('Button pressed: ' + inputs[i]);
            return;
        }
    } // for

    console.log('invalid input port');
    res.status(403).send('dont recognise that input port number ' + req.params.id);
}); // apt.get()

app.get('/inputs/:id', function (req, res) {
    var i;

    console.log('received API request for port number ' + req.params.id);

    for (i in inputs){
        if ((req.params.id === inputs[i].gpio)) {
            // send to client an inputs object as a JSON string
            res.send(inputs[i]);
            return;
        }
    } // for

    console.log('invalid input port');
    res.status(403).send('dont recognise that input port number ' + req.params.id);
}); // apt.get()

// Express route for incoming requests for a list of all inputs
app.get('/inputs', function (req, res) {
    // send array of inputs objects as a JSON string
    console.log('all inputs');
    res.status(200).send(inputs);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
    res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
    if (req.xhr) {
        res.status(500).send('Oops, Something went wrong!');
    } else {
        next(err);
    }
}); // apt.use()

process.on('SIGINT', function() {
    var i;

    console.log("\nGracefully shutting down from SIGINT (Ctrl+C)");

    console.log("closing GPIO...");
    for (i in inputs) {
        rpio.close(inputs[i].pin);
    }
    process.exit();
});

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('App Server is listening on port 3000');
