import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AuthService} from "../services/auth.service";

@Component({
    moduleId: module.id,
    selector: 'my-login',
    templateUrl: '../views/login.html'
})
export class LoginComponent {

    loginError: boolean = false;

    constructor(private router: Router, private authService: AuthService) {
    }

    onSubmit(form: NgForm): void {

        this.authService.login(form.value.username, form.value.password)
            .subscribe(result => {
                if(result) {
                    this.router.navigate(['/overview']);
                } else {
                    this.loginError = true;
                }
            });

    }
}
