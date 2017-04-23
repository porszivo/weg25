import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'device-details',
    templateUrl: '../app/views/options.html'
})

export class OptionsComponent {

    $:any;

    constructor(private router: Router){}

    ngAfterViewInit(){
        this.$(document).ready(function(){
            var password = <HTMLInputElement>document.getElementById("new-password-input")
                , confirm_password = <HTMLInputElement>document.getElementById("repeat-password-input")
                , error_mismatch = <HTMLInputElement>document.getElementById("password-mismatch-error")
                , error_password = <HTMLInputElement>document.getElementById("new-password-error")
                , button = <HTMLInputElement>document.getElementById("save-changes-button");

            function validatePassword(){
                if(confirm_password.value.trim() != "") {
                    if (password.value != confirm_password.value) {
                        button.disabled = true;
                        error_mismatch.style.display = 'inline';
                    } else {
                        button.disabled = false;
                        error_mismatch.style.display = 'none';
                    }
                } else {
                    button.disabled = true;
                }
            }

            password.onchange = validatePassword;
            confirm_password.onkeyup = validatePassword;
        });
    }

    onSubmit() {
        this.router.navigate(['/options']);
    }

}
