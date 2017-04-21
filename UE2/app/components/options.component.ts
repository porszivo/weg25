import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'device-details',
    templateUrl: '../app/views/options.html'
})

export class OptionsComponent {

    constructor(private router: Router)

    ngAfterViewInit(){
        $(document).ready(function(){
            var password = document.getElementById("new-password-input")
                , confirm_password = document.getElementById("repeat-password-input")
                , error_mismatch = document.getElementById("password-mismatch-error")
                , error_password = document.getElementById("new-password-error");

            function validatePassword(){
                if(confirm_password.value.trim() != "") {
                    if (password.value != confirm_password.value) {
                        document.getElementById("save-changes-button").disabled = true;
                        error_mismatch.style.display = 'inline';
                    } else {
                        confirm_password.setCustomValidity('');
                        document.getElementById("save-changes-button").disabled = false;
                        error_mismatch.style.display = 'none';
                    }
                } else {
                    document.getElementById("save-changes-button").disabled = true;
                }
            }

            password.onchange = validatePassword;
            confirm_password.onkeyup = validatePassword;
        });
    }

    onSubmit() {
        this.router.navigate('/options');
    }

}
