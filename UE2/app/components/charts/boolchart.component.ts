import {OnInit, Input, Component} from "@angular/core";
import {Device} from "../../model/device";
@Component({
    selector: 'bool-comp',
    templateUrl: '../app/views/charts/boolchart.html'
})

export class BoolChartComponent implements OnInit {

    @Input() device: Device;

    control_units: any;
    currentVal: boolean;
    lastTimestamp: number;

    public doughnutChartLabels:string[] = ['Aus', 'Ein'];
    public doughnutChartData:number[] = [0, 0];
    public doughnutChartType:string = 'doughnut';
    public detaillog:string[] = [];

    ngOnInit(): void {
        this.control_units = this.device['control_units'].find(ct => ct.type == 0);
        this.lastTimestamp = Date.now();
        this.currentVal = (1==this.control_units['current']);
        this.addValue(this.control_units['current']);
    }

    private addValue(val: any) {

        this.currentVal = (1==val);

        let diff = Date.now() - this.lastTimestamp;
        let pos = this.currentVal ? 0 : 1;
        let oldVal = this.doughnutChartLabels[this.doughnutChartLabels.length - 1 - val];

        this.doughnutChartData[pos] = this.doughnutChartData[pos] + (1 + diff)/60000;
        let dat = new Date().toLocaleString();

        this.doughnutChartData = this.doughnutChartData.slice();
        this.detaillog.push(dat + " " + oldVal + " -> " + this.doughnutChartLabels[val] + "\n");
        this.detaillog = this.detaillog.slice();

        /** update device **/
        this.control_units['current'] = val;

    }

    submit(val: any): void {
        console.log(this.currentVal + " -> " + val['new-value']);
        if(val['new-value'] && val['new-value'] != this.currentVal) this.addValue(1);
        else if(!val['new-value'] && val['new-value'] != this.currentVal) this.addValue(0);
    }

}