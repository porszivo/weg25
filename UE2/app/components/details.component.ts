import 'rxjs/add/operator/switchMap';
import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {DeviceService} from "../services/device.service";
import {Device} from "../model/device";
import {ControlUnit} from "../model/controlUnit";

@Component({
    selector: 'device-details',
    templateUrl: '../app/views/details.html'
})
export class DetailsComponent implements OnInit {

    device: Device;
    controlType: ControlUnit[];
    bool: boolean = false;
    enu: boolean = false;
    cont: boolean = false;

    constructor(
        private deviceService: DeviceService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params
            .switchMap((params: Params) => this.deviceService.getDevice(params['id']))
            .subscribe(device => this.setDevice(device));
    }

    setDevice(device: Device): void {
        this.device = device;
        this.controlType = device.control_units;
        console.log(this.controlType);
        for(var ct of this.controlType) {
            if(ct["type"]==0) this.bool = true;
            if(ct["type"]==1) this.enu = true;
            if(ct["type"]==2) this.cont = true;
            console.log(ct);
        }
    }

}
