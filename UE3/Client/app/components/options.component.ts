import {Component, OnInit} from '@angular/core';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {NgForm} from '@angular/forms';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'my-options',
    templateUrl: '../views/options.html'
})
export class OptionsComponent implements OnInit {

    updateError: boolean;
    deviceUrl: string = 'http://localhost:8081/';
    headers: Headers = new Headers;
    options: RequestOptions;

    constructor(private http: Http, private authService: AuthService, private router: Router) {
        this.headers.set('Content-type', 'application/json');
        this.headers.set('token', this.authService.token);
        this.options = new RequestOptions({headers: this.headers});
    }


    ngOnInit(): void {
        this.updateError = false;
    }

    public equalsPW(form: NgForm): boolean {
        if (!form || !form.value || !form.value["repeat-password"] || !form.value["new-password"]) {
            return false;
        }
        return form.value["repeat-password"] === form.value["new-password"];
    }


    /**
     * Liest das alte Passwort, das neue Passwort und dessen Wiederholung ein und übertraegt diese an die REST-Schnittstelle
     * @param form
     */
    onSubmit(form: NgForm): void {

        if (!form) {
            return;
        }
        var data = {
            "oldPassword" : form.value["old-password"],
            "newPassword" : form.value["new-password"],
            "repeatPassword" : form.value["repeat-password"]
        };
        var body = JSON.stringify(data);
        this.http.post(this.deviceUrl + "options", body, this.options)
            .toPromise()
            .then((response) => {
                this.updateError = response.json().error;
                if(!this.updateError) {
                    form.resetForm();
                    this.router.navigate(['/overview']);
                }
            })
            .catch(error => {
                this.updateError = true;
            });

        form.resetForm();

    }

}
