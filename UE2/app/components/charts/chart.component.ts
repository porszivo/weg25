import {Component, OnInit, Input} from "@angular/core";

@Component({
    selector: 'chart-comp',
    templateUrl: '../app/views/chart.comp.html'
})

export class ChartComponent implements OnInit {

    @Input() control_units: Object[];
    date: string;
    currentVal: any = 0;

    constructor(){

    }

    ngOnInit(): void {
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

    /** TODO: Change for other types aswell
     * based on control type, cont == line, enu == doughnut, bool == doughnut with 2 colors
     * */
    public lineChartType:string = 'line';

    addValue(val: number): void {
        console.log(val);
        let oldVal = this.currentVal;
        this.lineChartData[0]['data'].push(val);
        let dat = new Date().toLocaleString();
        this.lineChartLabels.push(dat);
        this.currentVal = val;
        this.detaillog.push(dat + " " + oldVal + " -> " + val + "\n");


        /** workaround to refresh */
        this.lineChartData = this.lineChartData.slice();
        this.lineChartLabels = this.lineChartLabels.slice();
        this.detaillog = this.detaillog.slice();
        console.log(this.lineChartData);
        console.log(this.lineChartLabels);
    }

    submit(val: number): void {
        this.addValue(val['new-value']);
    }

}