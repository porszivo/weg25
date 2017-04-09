import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";

@Component({
  selector: 'my-app',
  templateUrl: '../app/views/app-component.html'
})
export class AppComponent implements OnInit {

  constructor(private route:Router) {
    console.log(route.url);
  }
  ngOnInit(): void {
  }
}
