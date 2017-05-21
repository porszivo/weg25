import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";

@Component({
  moduleId: module.id,
  selector: 'my-sidebar',
  templateUrl: '../views/sidebar.component.html'
})
export class SidebarComponent implements OnInit{

  failed_logins: number = 0;
  server_start: Date = new Date();

  constructor(private http: Http){}

  ngOnInit(): void {
    //TODO Lesen Sie über die REST-Schnittstelle den Status des Servers aus und speichern Sie diesen in obigen Variablen
    var temp = this;
    this.http.get("http://localhost:8081/getServerstatus")
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
