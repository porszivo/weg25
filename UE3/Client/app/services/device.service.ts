import {Device} from '../model/device';
import {Injectable} from '@angular/core';

import {DEVICES} from '../resources/mock-device';
import {DeviceParserService} from './device-parser.service';
import {Http, Response, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {AuthService} from "./auth.service";


@Injectable()
export class DeviceService {

    deviceUrl: string = 'http://localhost:8081/';
    headers: Headers = new Headers;
    options: RequestOptions;

    constructor(private parserService: DeviceParserService, private http: Http, private authService: AuthService) {
        this.headers.set('Content-type', 'application/json');
        this.headers.set('token', this.authService.token);
        this.options = new RequestOptions({ headers: this.headers });
    }

    getLogout(){
        this.authService.token = null;
        localStorage.removeItem('currentUser');
    }

    getLogin(){
        return this.http.get('http://localhost:8081/login');
    }

    getDevices(): Observable<Device[]> {
        /*
         * Verwenden Sie das DeviceParserService um die via REST ausgelesenen Geräte umzuwandeln.
         * Das Service ist dabei bereits vollständig implementiert und kann wie unten demonstriert eingesetzt werden.
        */

        return this.http.get('http://localhost:8081/allDevices', this.options).map((res) => {

            var devices = this.extractData(res);
            for (let i = 0; i < devices.length; i++) {
                devices[i] = this.parserService.parseDevice(devices[i]);
            }
            return devices;

        }).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body.devices || { };
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

    getDevice(id: string) : Observable<Device>{
        return this.getDevices().map(devices => devices.find(device => device.id === id))
    }

    deleteDevice(id: string){
       return this.http.delete('http://localhost:8081/deleteDevice/' + id, this.options)
            .toPromise()
            .then(() => null)
            .catch(this.handleError);

    }

    createDevice(value: any): Observable<Device> {
        return this.http.post(this.deviceUrl + 'addDevice', value, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    editDevice(device: Device) {
        return this.http.post(this.deviceUrl + 'editDevice', device, this.options)
            .map(this.extractData)
            .catch(this.handleError);
    }


}
