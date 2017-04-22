import {OnInit, Input, Component} from "@angular/core";
import {Device} from "../../model/device";
@Component({
    selector: 'enu-comp',
    templateUrl: '../app/views/charts/enuchart.html'
})

export class EnuChartComponent implements OnInit {
    @Input() device: Device;
    control_units: Object[];
    currentVal: any = 0;
    currentLabel: string;
    lastTimestamp: number;

    public polarAreaChartLabels:string[] = ['Aus', 'Ein', 'Standby'];
    public polarAreaChartData:number[] = [0, 0, 0];
    public polarAreaLegend:boolean = true;
    public polarAreaChartType:string = 'polarArea';

    public detaillog:string[] = [];

    ngOnInit(): void {
        this.control_units = this.device['control_units'].find(ct => ct.type == 1);
        this.currentVal = this.control_units['current'];
        this.currentLabel = this.polarAreaChartLabels[this.currentVal];
        this.lastTimestamp = Date.now();
        this.addValue(this.control_units['current']);
    }

    addValue(val: number) {

        console.log(val);
        let diff = Date.now() - this.lastTimestamp;
        let dat = new Date().toLocaleString();

        let oldVal = this.currentVal;
        this.polarAreaChartData[oldVal] = this.polarAreaChartData[oldVal] + (1 + diff)/60000;

        console.log(this.polarAreaChartData);
        this.polarAreaChartData = this.polarAreaChartData.slice();
        this.detaillog.push(dat + " " + oldVal + " -> " + this.polarAreaChartData[val] + "\n");
        this.detaillog = this.detaillog.slice();
        this.currentVal = val;
        this.currentLabel = this.polarAreaChartLabels[val];

        /** update device **/
        this.control_units['current'] = val;

    }

    submit(val: any): void {
        switch(val['new-value']) {
            case 'Ein':
                if(this.currentVal != 1) this.addValue(1);
                break;
            case 'Aus':
                if(this.currentVal != 0) this.addValue(0);
                break;
            case 'Standby':
                if(this.currentVal != 2) this.addValue(2);
                break;
        }
    }
}