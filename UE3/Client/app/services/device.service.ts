import {Device} from '../model/device';
import {Injectable} from '@angular/core';

import {DEVICES} from '../resources/mock-device';
import {DeviceParserService} from './device-parser.service';
import {Http, Response, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class DeviceService {

    deviceUrl: string = 'http://localhost:8081/';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private parserService: DeviceParserService, private http: Http) {
    }

    //TODO Sie können dieses Service benutzen, um alle REST-Funktionen für die Smart-Devices zu implementieren

    getLogout(){
        return this.http.get(this.deviceUrl + 'logout');
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



        return this.http.get('http://localhost:8081/allDevices').map((res) => {

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
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    getDevice(id: string) : Observable<Device>{
        return this.getDevices().map(devices => devices.find(device => device.id === id))
    }

    deleteDevice(id: string){
       return this.http.delete('http://localhost:8081/deleteDevice/' + id, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);

    }

}
