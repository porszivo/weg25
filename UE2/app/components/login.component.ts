import {Component} from "@angular/core";
import {Router} from "@angular/router";
@Component({
    selector: 'device-details',
    templateUrl: '../app/views/login.html'
})
export class LoginComponent {
    name: string = "World";

    constructor(private router: Router) { }

    onSubmit(): void {
        this.router.navigate(['/overview']);
    }

}
