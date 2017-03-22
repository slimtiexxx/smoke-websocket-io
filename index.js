var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


// arrays
users = [];
connections = [];



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index')
});

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.get('/easteregg', function(request, response) {
    var result = '';
    var times = process.env.TIMES || 5;
    for (i=0; i < times; i++)
        result += i + ' ';
    response.send(result);
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


console.log('Server running ');


io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);
    updateUsernames();

    // Disconnect
    socket.on('disconnect', function (data) {

        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets left connected', connections.length);
    });


    // Send Data
    socket.on('send message', function (data) {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    });



    socket.on('sending', function (data) {
        io.socket.emit('getid', {prop: data, user: socket.username})
    });


    // New User
    socket.on('new user', function (data, callback) {
        callback(true);
        socket.username = data;
        users.push({username: socket.username, status: 'waiting'});
        updateUsernames();
    });

    // Update Usernames
    function updateUsernames() {
        io.sockets.emit('get users', users)
    }

    socket.on('valuechange', function (data) {

        var user = users.find(function(item){
            return item.username == socket.username;
        });

        console.log(data);

        user.status = data;


        io.emit('XXX', users);
    });

    socket.on('moveLift', function (data) {
        console.log(data);
        io.emit('liftmove', data)
    })
});