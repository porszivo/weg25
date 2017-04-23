import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

import {DeviceService} from "../services/device.service";
import {Device} from "../model/device";

@Component({
    selector: 'device-details',
    templateUrl: '../app/views/overview.html'
})
export class OverviewComponent implements OnInit {

    devices: Device[];
    focusDevice: Device;

    constructor(private router: Router, private deviceService: DeviceService) {}

    getDevices(): void {
        this.deviceService.getDevices().then(devices => {
                this.devices = devices;
            }
        );
    }

    ngOnInit(): void {
        this.getDevices();
    }

    goToDetail(device: Device): void {
        this.router.navigate(['/detail', device.id]);
    }

    editDevice(device: Device): void {
        this.focusDevice = device;
    }

    isFocusDevice(device: Device): boolean {
        return this.focusDevice==device;
    }

    uneditDevice(): void {
        this.focusDevice = null;
    }

    /**
     * only links when device is not in edit mode
     * @param device
     */
    linkToDetails(device: Device): void {
        if(this.focusDevice == null) {
            this.router.navigate(['/detail', device.id]);
        }
    }

    drawSVG(device: Device): void {
        /** id, src, min, max, current, values **/
        for(var i = 0; i < device.control_units.length; i++) {
            device.draw_image(device.id,null,device.control_units[i]['min'],device.control_units[i]['max'],device.control_units[i]['current'],device.control_units[i]['values']);
        }
    }

}
