import {Component, OnInit, Input} from "@angular/core";
import {DeviceService} from "../../services/device.service";
import {Device} from "../../model/device";

@Component({
    selector: 'line-comp',
    templateUrl: '../app/views/charts/linechart.html'
})

export class LineChartComponent implements OnInit {

    @Input() device: Device;
    public control_units: any;
    currentVal: any = 0;

    ngOnInit(): void {
        this.control_units = this.device['control_units'].find(ct => ct.type == 2);
        this.currentVal = this.control_units['current'];
        this.addValue(this.control_units['current']);
    }

    public lineChartData:Array<any> = [
        {data: [], label: 'Verlauf'}
    ];

    public lineChartLabels:Array<any> = [];

    public detaillog:Array<any> = [

    ];

    public lineChartOptions:any = {
        responsive: true,
        maintainAspectRatio: false
    };

    public lineChartColors:Array<any> = [
        {
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];

    public lineChartLegend:boolean = true;

    public lineChartType:string = 'line';

    addValue(val: number): void {
        let oldVal = this.currentVal;
        this.lineChartData[0]['data'].push(val);
        let dat = new Date().toLocaleString();
        this.lineChartLabels.push(dat);
        this.currentVal = val;
        this.detaillog.push(dat + " " + oldVal + " -> " + val + "\n");


        /** workaround to refresh */
        this.lineChartData = this.lineChartData.slice();
        this.detaillog = this.detaillog.slice();

        /** update device **/
        this.control_units['current'] = val;

    }

    submit(val: number): void {
        this.addValue(val['new-value']);
    }

}