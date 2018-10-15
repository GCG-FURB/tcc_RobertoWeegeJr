import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'slide-popover',
  templateUrl: 'slide-popover.html'
})
export class SlidePopoverComponent {

    private callback: Function;
    private color: string;
    private description: string;
    private value: number;
    private minRangeValue: number;
    private maxRangeValue: number;
    private stepRangeValue: number;
    private snapsRange: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams) {}

    ionViewDidLoad() {
        this.callback = this.navParams.get("callback");
        this.color = this.navParams.get("color");
        this.description = this.navParams.get("description");
        this.value = this.navParams.get("value");
        this.minRangeValue = this.navParams.get("minRangeValue");
        this.maxRangeValue = this.navParams.get("maxRangeValue");
        this.stepRangeValue = this.navParams.get("stepRangeValue");
        this.snapsRange = this.navParams.get("snapsRange");
    }

    private goBack(){
        this.callback(this.value);
        this.navCtrl.pop();
    }

}
