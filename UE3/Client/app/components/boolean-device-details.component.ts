import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../model/device";
import {ControlUnit} from "../model/controlUnit";
import {DeviceService} from "../services/device.service";

declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'boolean-details',
    templateUrl: '../views/boolean-device-details.component.html'
})
export class BooleanDeviceDetailsComponent implements OnInit {
    @Input()
    device: Device;

    @Input()
    controlUnit: ControlUnit;

    new_value: boolean;
    log_message: string = null;

    constructor(private deviceService: DeviceService) {
    }

    ngOnInit(): void {
        this.new_value = this.controlUnit.current == 1;
    }

    //TODO Überarbeiten Sie diese Klasse. Lesen Sie die Daten für das Diagramm aus dem SessionStorage aus und passen Sie die onSubmit Funktion an.

    /**
     * Liest den neuen Wert des Steuerungselements aus und leitet diesen an die REST-Schnittstelle weiter
     */
    onSubmit(): void {
        //TODO Lesen Sie die eingebenen Daten aus und verarbeiten Sie diese über die REST-Schnittstelle

        let changeDevice = {
            id: this.device.id,
            val: this.new_value,
            timestamp: new Date(),
            type: "boolean"
        };

        for(var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var item = JSON.parse(localStorage.getItem(key));
        }

        $.ajax({
            url: 'http://localhost:8081/updateCurrent',
            type: 'post',
            headers: {'token': item.token },
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify(changeDevice)
        });

        this.doughnutChartData[this.new_value ? 1 : 0]++;
        this.doughnutChartData = Object.assign({}, this.doughnutChartData);

        if (this.log_message != null) {
            this.log_message += "\n";
        } else {
            this.log_message = "";
        }
        this.log_message += new Date().toLocaleString() + ": " + (this.controlUnit.current == 1 ? "An" : "Aus") + " -> " + (this.new_value ? "An" : "Aus");

        this.controlUnit.log = this.log_message;
        this.controlUnit.current = this.new_value ? 1 : 0;
    }

    public doughnutChartData: number[] = [0, 0];
    public doughnutChartLabels: string[] = ['Aus', 'An'];
    public doughnutChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
    };
    public doughnutChartLegend: boolean = true;
    public doughnutChartType: string = 'doughnut';

}
