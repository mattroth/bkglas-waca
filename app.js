var http      = require('http');
var express   = require('express');
//var gpio      = require('pi-gpio');
var rpio = require('rpio');

var app       = express();

// input port objects for our example
var inputs = [
    { pin: '16', gpio: '23', value: null },
    { pin: '22', gpio: '25', value: null },
    { pin: '11', gpio: '17', value: null },
    { pin: '15', gpio: '22', value: null },
];

// -----------------------------------------------------------------------
// open GPIO ports
var i;
for (i in inputs) {
    console.log('opening GPIO port ' + inputs[i].gpio + ' on pin ' + inputs[i].pin + ' as input');
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

var l = 0;
setInterval( function () {
    console.log('Loop  #' + l++);

    /* On for 2 second */
    rpio.write(inputs[0].pin, rpio.HIGH);
    rpio.write(inputs[1].pin, rpio.LOW);
    rpio.write(inputs[2].pin, rpio.HIGH);
    rpio.write(inputs[3].pin, rpio.LOW);
    rpio.sleep(2);

    /* Off for 1 second (1000ms) */
    rpio.write(inputs[0].pin, rpio.LOW);
    rpio.write(inputs[1].pin, rpio.HIGH);
    rpio.write(inputs[2].pin, rpio.LOW);
    rpio.write(inputs[3].pin, rpio.HIGH);
    rpio.sleep(1);
}, 3000); // setInterval

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored
// in the home directory
app.use(express.static(__dirname));

// Express route for incoming requests for a single input
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
