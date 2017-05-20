import {Component, OnInit} from '@angular/core';
import {Headers, Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {NgForm} from '@angular/forms';

@Component({
    moduleId: module.id,
    selector: 'my-options',
    templateUrl: '../views/options.html'
})
export class OptionsComponent implements OnInit {

    updateError: boolean;

    constructor(private http: Http) {
    };

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

        //TODO Lesen Sie Daten aus der Form aus und übertragen Sie diese an Ihre REST-Schnittstelle
        if (!form) {
            return;
        }
        var data = {
            "oldPassword" : form.value["old-password"],
            "newPassword" : form.value["new-password"],
            "repeatPassword" : form.value["repeat-password"]
        };
        var body = JSON.stringify(data);
        var head = new Headers ({'Content-Type' : 'application/json'});
        this.http.post("http://localhost:8081/options", body, {headers: head})
            .toPromise()
            .then(function (res) {
                console.log(res.json());
            })

        form.resetForm();

    }

}
