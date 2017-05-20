import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router'
import {OptionsComponent} from "./options.component";
import {LoginComponent} from "./login.component";
import {AuthService} from "../services/auth.service";

@Component({
  moduleId: module.id,
  selector: 'my-navigation',
  templateUrl: '../views/navigation.component.html'
})
export class NavigationComponent {


  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
  };

  isOptionsShown(): boolean {
    return !this.isOptionsite() && !this.isLoginSite();
  }

  isLogoutShown(): boolean {
    return !this.isLoginSite();
  }


  isOptionsite(): boolean {
    return this.route.component === OptionsComponent;
  }


  isLoginSite(): boolean {
    return this.route.component === LoginComponent;
  }

  doLogout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

}
