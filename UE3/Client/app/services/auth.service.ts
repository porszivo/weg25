import { Injectable } from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

    public token: string;

    constructor(private http: Http) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token      = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {
        let body = JSON.stringify({username: username, password: password});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.post('http://localhost:8081/login', body, options)
            .map((response: Response) => {
                let token = response.json && response.json().token;
                if(token) {
                    this.token = token;
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token}));
                    return true;
                }
                return false;
            });
    }

    private extractData(res: Response) {
        return res.json();
    }

    private handleError (error: Response | any) {

    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('currentUser');
    }

}