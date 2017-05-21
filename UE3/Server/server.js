/*jslint node: true */
/*jslint esversion: 6*/
/*jslint eqeqeq: true */

var express = require('express');
var app = express();
var fs = require("fs");
var expressWs = require('express-ws')(app);
var http = require('http');

var simulation = require('./simulation.js');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var uuid = require('uuid');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var description = JSON.parse(fs.readFileSync('./resources/description.json'));
var control_units = JSON.parse(fs.readFileSync('./resources/control_units.json'));
var device;
var user;
var failedLog = 0;
var jsonDate = new Date().toJSON();

var wss = expressWs.getWss('/');

//TODO Implementieren Sie hier Ihre REST-Schnittstelle
/* Ermöglichen Sie wie in der Angabe beschrieben folgende Funktionen:
 *  Abrufen aller Geräte als Liste
 *  Hinzufügen eines neuen Gerätes
 *  Löschen eines vorhandenen Gerätes
 *  Bearbeiten eines vorhandenen Gerätes (Verändern des Gerätezustandes und Anpassen des Anzeigenamens)
 *  Log-in und Log-out des Benutzers
 *  Ändern des Passworts
 *  Abrufen des Serverstatus (Startdatum, fehlgeschlagene Log-ins).
 *
 *  BITTE BEACHTEN!
 *      Verwenden Sie dabei passende Bezeichnungen für die einzelnen Funktionen.
 *      Achten Sie bei Ihrer Implementierung auch darauf, dass der Zugriff nur nach einem erfolgreichem Log-In erlaubt sein soll.
 *      Vergessen Sie auch nicht, dass jeder Client mit aktiver Verbindung über alle Aktionen via Websocket zu informieren ist.
 *      Bei der Anlage neuer Geräte wird eine neue ID benötigt. Verwenden Sie dafür eine uuid (https://www.npmjs.com/package/uuid, Bibliothek ist bereits eingebunden).
 */

app.ws('/', function (ws, req) {
    ws.on('connection', function connection(ws, req) {
    });
});

app.get('/allDevices', function (req, res) {
    var token = req.headers.token;
    if(token && checkAuthorization(token)) {
        res.json(device);
    } else {
        res.status(401);
    }
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if(user.username === username && user.password === password) {
        res.json(createToken(user));
    } else {
        failedLog++;
        console.log(failedLog);
        res.send(200);
    }

});

app.post("/options", function (req,res) {

    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var repeatedPassword = req.body.repeatPassword;
    var token = req.headers.token;
    console.log(req.body);
    if(checkAuthorization(token)) {
        console.log(req.body);
        if (user.password === oldPassword && newPassword === repeatedPassword) {
            fs.writeFile('resources/login.config', "username: " + user.username + "\n" + "password: " + newPassword);
            user.password = newPassword;
            res.send({error: false});
        }
        else {
            res.send({error: true});
        }
    } else {
        res.status(401);
    }
    console.log(user);
});

app.get("/getServerstatus", function (req, res) {
    var token = req.headers.token;
    if(checkAuthorization(token)) {
        res.send(JSON.stringify({failed_logins: failedLog, jsonDate: jsonDate}));
        res.end();
    } else {
        res.status(401);
    }
});

app.get('/logout', function (req, res) {
    res.send('Abgemeldet');
});

app.post('/addDevice', function (req, res) {
    var new_device = req.body;
    var token = req.headers.token;
    if(checkAuthorization(token)) {
        createNewDevice(new_device);
        res.send(device);
    } else {
        res.status(401);
    }
});

app.delete('/deleteDevice/:id', function (req, res) {
    var token = req.headers.token;
    if(checkAuthorization(token)) {
        device.devices = device.devices.filter(function(item) {
            return item.id !== req.params.id;
        });
        res.send(device);
    } else {
        res.status(401);
    }
});

app.post("/updateCurrent", function (req, res) {
    "use strict";
    var token = req.headers.token;
    if(checkAuthorization(token)) {
        var dev = device.devices.filter(function(item) { return req.body.id === item.id });
        var cu = dev[0]['control_units'].filter(function(item) { return item.type === req.body.type});
        simulation.updatedDeviceValue(dev[0], cu[0], Number(req.body.val));
    } else {
        res.status(401);
    }
});

app.post("/editDevice", function(req, res) {
   "use strict";
   var id = req.body.id;
   var newname = req.body.display_name;
   var token = req.headers.token;
   if(checkAuthorization(token)) {
       var dev = device.devices.filter(function(item) { return id === item.id });
       dev[0].display_name = newname;
   } else {
       res.status(401);
   }

});

/**
 * @deprecated Don't use
 */
function changeVal(dev) {

    var changeDevice = device.devices.filter(function(item) {
        return dev.id === item.id;
    });

    var changeCT = changeDevice[0]['control_units'].filter(function(item) {
        return dev.type === item.type;
    });

    changeCT[0].current = dev.val;
}

/**
 * @deprecated Don't use
 */
app.post('/changeDeviceVal', function(req, res) {
    var token = req.headers.token;
    if(checkAuthorization(token)) {
        changeVal(req.body);
    } else {
        res.status(401);
    }
});

function checkAuthorization(token) {
    if(token) {
        var decode = jwt.verify(token, 'SECRET-MESSAGE');
        return decode.username === user.username;
    } else {
        return false;
    }
}

function createNewDevice(newDevice) {

    var des = description.model.filter(function(item) {
        return item.name === newDevice['type-input'];
    });

    var ctu = control_units.control_units.filter(function(item) {
        return item.id === newDevice['elementtype-input'];
    });

    var addDevice = [{
        "id": Date.now().toString(), // Create a random ID
        "description": des[0].description, //
        "display_name": newDevice.displayname,
        "type": newDevice['type-input'],
        "type_name": newDevice['typename'],
        "image": des[0].image,
        "image_alt": des[0].image_alt,
        "control_units": []
    }];

    addDevice[0].control_units.push(ctu[0]);

    if(addDevice[0].control_units.type === "enum") {
        var split = newDevice['discrete-values'].split(',');
        var val = [];
        for(var i = 0; i < split.length; i++) {
            val.push(split[i].trim());
        }
        addDevice[0].control_units.values = val;
    }

    if(addDevice[0].control_units.type === "continuous") {
        addDevice[0].control_units.min = newDevice['minimum-value'];
        addDevice[0].control_units.max = newDevice['maximum-value'];
    }

    device.devices.push(addDevice[0]);
}

function createToken(user) {
    return token = jwt.sign({ username: user.username }, 'SECRET-MESSAGE');
}

function readUser() {
    "use strict";
    fs.readFile('./resources/login.config','utf8',function (err,data) {
        data = data.split(['\n']);
        user = {'username': data[0].replace('username: ', '').replace('\r', ''), 'password': data[1].replace('password: ', '')}
    })

}

function readDevices() {
    "use strict";
    /*
     * Damit die Simulation korrekt funktioniert, müssen Sie diese mit nachfolgender Funktion starten
     *      simulation.simulateSmartHome(devices.devices, refreshConnected);
     * Der zweite Parameter ist dabei eine callback-Funktion, welche zum Updaten aller verbundenen Clients dienen soll.
     */
    device = JSON.parse(fs.readFileSync('./resources/devices.json'));
    //simulation.simulateSmartHome(device.devices, refreshConnected());
}

function refreshConnected() {
    "use strict";
    //TODO Übermitteln Sie jedem verbundenen Client die aktuellen Gerätedaten über das Websocket
    /*
     * Jedem Client mit aktiver Verbindung zum Websocket sollen die aktuellen Daten der Geräte übermittelt werden.
     * Dabei soll jeder Client die aktuellen Werte aller Steuerungselemente von allen Geräte erhalten.
     * Stellen Sie jedoch auch sicher, dass nur Clients die eingeloggt sind entsprechende Daten erhalten.
     *
     * Bitte beachten Sie, dass diese Funktion von der Simulation genutzt wird um periodisch die simulierten Daten an alle Clients zu übertragen.
     */
}

var server = app.listen(8081, function () {
    "use strict";
    readUser();
    readDevices();

    var host = server.address().address;
    var port = server.address().port;
    console.log("Big Smart Home Server listening at http://%s:%s", host, port);
});

