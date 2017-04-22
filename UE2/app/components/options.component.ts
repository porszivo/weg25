import {Component, OnInit} from "@angular/core";

@Component({
    selector: 'device-details',
    templateUrl: '../app/views/options.html'
})

export class OptionsComponent {

    /* todo: */

    oldP : String = ' ';
    newP : String = ' ';
    repeatP : String = ' ';

    isTrue(){
        if (this.oldP != ' ' && this.newP != ' ' && this.repeatP != ' ' && this.newP == this.repeatP){

            return true;

        }else {

            return false;

        }
    }


}
