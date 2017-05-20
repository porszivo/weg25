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
    opt: RequestOptions;

    constructor(private parserService: DeviceParserService, private http: Http, private authService: AuthService) {
        this.headers.set('Content-type', 'application/json');
    }

    getLogout(){
        this.authService.token = null;
        localStorage.removeItem('currentUser');
    }

    getLogin(){
        return this.http.get('http://localhost:8081/login');
    }

    getDevices(): Observable<Device[]> {
        //TODO Lesen Sie die Geräte über die REST-Schnittstelle aus
        /*
         * Verwenden Sie das DeviceParserService um die via REST ausgelesenen Geräte umzuwandeln.
         * Das Service ist dabei bereits vollständig implementiert und kann wie unten demonstriert eingesetzt werden.
         */
        this.headers.set('Token', this.authService.token);
        this.opt = new RequestOptions({headers: this.headers});
        return this.http.get('http://localhost:8081/allDevices', this.opt).map((res) => {

            var devices = this.extractData(res);
            for (let i = 0; i < devices.length; i++) {
                devices[i] = this.parserService.parseDevice(devices[i]);
            }
            return devices;

        }).catch(this.handleError);
    }



    private extractData(res: Response) {
        console.log("Call?" + res);
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
       return this.http.delete('http://localhost:8081/deleteDevice/' + id, new RequestOptions({headers: this.headers}))
            .toPromise()
            .then(() => null)
            .catch(this.handleError);

    }

    createDevice(value: any): Observable<Device> {

        console.log(value);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this.deviceUrl + 'addDevice', value, options)
            .map(this.extractData)
            .catch(this.handleError);
    }


}
