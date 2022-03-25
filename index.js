//Initialize the express 'app' object
let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 9000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io');
io = new io.Server(server);
let arrayofClients = [];

//connect
io.sockets.on('connection', function(socket) {

    //Listen for this client to connect
    console.log("We have a new client: " + socket.id);
    //to keep on track of clients 
    arrayofClients.push(socket.id);
    console.log(arrayofClients);

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        //when client disconnect, remove client from array
        arrayofClients.pop(socket.id);
        console.log("A client has disconnected: " + socket.id);
    });

//listen for a message from a client
    socket.on('mousePositionData',(data)=>{
        console.log(data);
        io.sockets.emit('mouseDataFromServer', data);
    })


    //Listen for a message named 'msg' from this client
    socket.on('msg', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'msg' event");
        console.log(data);

        //Send a response to all clients, including this one
        io.sockets.emit('msg', data);

        //Send a response to all other clients, not including this one
        // socket.broadcast.emit('msg', data);

        //Send a response to just this client
        // socket.emit('msg', data);
    });

    //Listen for a message named 'randomword' from this client
    socket.on('randomword', function(data) {
        //Data can be numbers, strings, objects
        console.log("Received a 'randomword' event");
        console.log(data);

        //Send a response to all other clients, not including this one
        socket.broadcast.emit('randomword', data);

    });

        //Listen for a message named 'displayrandomword' from this client
        socket.on('displayrandomword', function(data) {
            //Data can be numbers, strings, objects
            console.log("Received a 'displayrandomword' event");
            console.log(data);
    
            //Send a response to just this client
            socket.emit('displayrandomword', data);
    
        });


            //Listen for a message named 'matchingword' 
            socket.on('matchingword', function(data) {
          
                 //Send a response to all cients 
                io.sockets.emit('matchingword', data);
        
            });


});

