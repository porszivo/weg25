import {Component, OnInit} from "@angular/core";
@Component({
    selector: 'device-details',
    templateUrl: '../app/views/options.html'
})
export class OptionsComponent implements OnInit {

    ngOnInit(): void {

    }

    save(newPassword: string, oldPassword: string, repeatPassword: string, isValid: boolean) {
        console.log(newPassword + " " + repeatPassword + " " + oldPassword + " " + isValid);
    }
}
