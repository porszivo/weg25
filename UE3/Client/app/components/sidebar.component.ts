import {Component, OnInit} from "@angular/core";
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {AuthService} from "../services/auth.service";

@Component({
  moduleId: module.id,
  selector: 'my-sidebar',
  templateUrl: '../views/sidebar.component.html'
})
export class SidebarComponent implements OnInit{

  failed_logins: number = 0;
  server_start: Date = new Date();
    deviceUrl: string = 'http://localhost:8081/';
    headers: Headers = new Headers;
    options: RequestOptions;

  constructor(private http: Http, private authService: AuthService){
      this.headers.set('Content-type', 'application/json');
      this.headers.set('token', this.authService.token);
      this.options = new RequestOptions({ headers: this.headers });}

  ngOnInit(): void {
    //TODO Lesen Sie über die REST-Schnittstelle den Status des Servers aus und speichern Sie diesen in obigen Variablen
    var temp = this;
    this.http.get("http://localhost:8081/getServerstatus", this.options)
        .toPromise()
        .then(function(res){
            var ret = res.json();
            for(var key in ret){
                if (key === "failed_logins") temp.failed_logins = ret[key];
                if (key === "jsonDate") temp.server_start =  new Date(ret[key]);
      }
    })
  }
}
