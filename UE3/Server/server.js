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
        res.send(200);
    }

});


app.post("/options", function (req,res) {

    var oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        repeatedPassword = req.body.repeatPassword;

    if(user.password === oldPassword && newPassword === repeatedPassword){
        fs.writeFile('resources/login.config', "username: " + user.username + "\n" + "password: "+ newPassword);
        readUser();
        res.send(["Passwort geändert"]);
    }
    else {
        res.send(["Altes Passwort falsch eingegeben!"])
    }

});

app.get("/failedLog", function (req, res) {
    res.write(JSON.stringify({failed_logins: failedLog, jsonDate : jsonDate}));
    res.end();
});

app.get('/logout', function (req, res) {
    res.send('Abgemeldet');
});

app.post('/addDevice', function (req, res) {
    var new_device = req.body;
    createNewDevice(new_device);
    res.send(device);
});

app.delete('/deleteDevice/:id', function (req, res) {

    device.devices = device.devices.filter(function(item) {
        return item.id !== req.params.id;
    });
    res.send(device);
});

app.post("/updateCurrent", function (req, res) {
    "use strict";
    //TODO Vervollständigen Sie diese Funktion, welche den aktuellen Wert eines Gerätes ändern soll
    /*
     * Damit die Daten korrekt in die Simulation übernommen werden können, verwenden Sie bitte die nachfolgende Funktion.
     *      simulation.updatedDeviceValue(device, control_unit, Number(new_value));
     * Diese Funktion verändert gleichzeitig auch den aktuellen Wert des Gerätes, Sie müssen diese daher nur mit den korrekten Werten aufrufen.
     */
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
        "id": Date.now(), // Create a random ID
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

    console.log(addDevice);
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
    //TODO Lesen Sie die Gerätedaten aus der devices.json Datei ein.
    /*
     * Damit die Simulation korrekt funktioniert, müssen Sie diese mit nachfolgender Funktion starten
     *      simulation.simulateSmartHome(devices.devices, refreshConnected);
     * Der zweite Parameter ist dabei eine callback-Funktion, welche zum Updaten aller verbundenen Clients dienen soll.
     */
    device = JSON.parse(fs.readFileSync('./resources/devices.json'));
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

