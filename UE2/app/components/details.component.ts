import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import 'rxjs/add/operator/switchMap';
import {DeviceService} from "../services/device.service";
import {Device} from "../model/device";
@Component({
    selector: 'device-details',
    templateUrl: '../app/views/details.html'
})
export class DetailsComponent implements OnInit {

    device: Device;

    constructor(private router : ActivatedRoute, private deviceService: DeviceService) {
        console.log(this.router.params);
    }

    ngOnInit(): void {
        this.router.params
            .switchMap((params: Params) => this.heroService.getDevice(params['_value']['id']))
            .subscribe(device => this.device = device);
    }

}
