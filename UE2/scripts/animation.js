/*
  TODO
 Implementieren Sie die folgenden Funktionen um die SVG-Grafiken der Geräte anzuzeigen und verändern.

 Hinweise zur Implementierung:
 - Verwenden Sie das SVG-Plugin für jQuery, welches bereits für Sie eingebunden ist (Referenz: http://keith-wood.name/svg.html)
 - Sie dürfen das Bild bei jedem Funktionenaufruf neu laden und Ihre Veränderungen vornehmen;
 Tipp: Durch Überschreiben der OnLoad Funktion von svg.load() können Sie die Grafik noch bevor diese zum ersten Mal angezeigt wird verändern
 - In allen bereit gestellten SVG-Grafiken sind alle für Sie relevanten Stellen mit Labels markiert.
 - Da Ihre Grafiken nur beim Laden der Übersichtsseite neu gezeichnet werden müssen, bietet es ich an die draw_image Funktionen nach dem vollständigen Laden dieser Seite auszuführen.
 Rufen Sie dazu mit draw_image(id, src, min, max, current, values) die zugrunde liegende und hier definierte Funktione auf.
 */


function drawThermometer(id, src, min, max, current, values) {
  /* TODO
   Passen Sie die Höhe des Temperaturstandes entsprechend dem aktuellen Wert an.
   Beachten Sie weiters, dass auch die Beschriftung des Thermometers (max, min Temperatur) angepasst werden soll.
   */
    var img = $("#image_" + id);
    img.svg({
        loadURL: '/images/thermometer.svg',
        onLoad: function (svg) {
            var root = $(svg.root());
            root.attr('id', id).addClass('device-image').attr('width', img.css('width')).attr('height', img.css('height'));
            $('#text3819-3', root).text(max);
            $('#text3819', root).text(min)
            $('#title3855', root).text(current);
        }
    });
}


function drawBulb(id, src, min, max, current, values) {
    var img = $("#image_" + id);
    img.svg({
        loadURL: '/images/bulb.svg',
        onLoad: function (svg) {
            var root = $(svg.root());
            root.attr('id', id).addClass('device-image').attr('width', img.css('width')).attr('height', img.css('height'));
            if (current == 1 || current == true) {
                root.attr('fill', '#ffa500');
            } else {
                root.attr('fill', 'black');
            }
        }
    });
}

function drawCam(id, src, min, max, current, values) {
    var img = $("#image_" + id);
    img.svg({
        loadURL: '/images/webcam.svg',
        onLoad: function (svg) {
            var root = svg.root();
            $(root).attr('id', id).addClass('device-image').attr('width', img.css('width')).attr('height', img.css('height'));
            var circ = $('#circle8', root);
            var cloned = circ.clone();
            if (current == 1 || current == true) {
                cloned.css('fill', '#42a5f5');
            } else {
                cloned.css('fill', 'black');
            }
            circ.replaceWith(cloned);

        }
    });
}

function drawShutter(id, src, min, max, current, values) {
  // TODO
    var img = $("#image_" + id);
    img.svg({
        loadURL: '/images/roller_shutter.svg',
        onLoad: function (svg) {
            var root = svg.root();
            $(root).attr('id', id).addClass('device-image').attr('width', img.css('width')).attr('height', img.css('height'));
            if (current == 0) {
                $('#path4559-2', root).hide();
                $('#path4559-2-6', root).hide();
                $('#path4559-2-5', root).hide();
            } else if (current == 1) {
                $('#path4559-2', root).show();
                $('#path4559-2-6', root).hide();
                $('#path4559-2-5', root).hide();
            } else if (current == 2) {
                $('#path4559-2', root).show();
                $('#path4559-2-6', root).show();
                $('#path4559-2-5', root).show();
            }

        }
    });
}