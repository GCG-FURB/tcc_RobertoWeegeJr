import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';

@Component({
  selector: 'slide-popover',
  templateUrl: 'slide-popover.html'
})
export class SlidePopoverComponent extends GenericComponent {

    private callback: Function;
    private color: string;
    private description: string;
    private value: number;
    private minRangeValue: number;
    private maxRangeValue: number;
    private stepRangeValue: number;
    private snapsRange: boolean;

    constructor(private navCtrl: NavController, 
                private navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private toastCtrl: ToastController) {

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl);
    
    }

    private ngOnInit(): void {
        try { 
            this.callback = this.navParams.get("callback");
            this.color = this.navParams.get("color");
            this.description = this.navParams.get("description");
            this.value = this.navParams.get("value");
            this.minRangeValue = this.navParams.get("minRangeValue");
            this.maxRangeValue = this.navParams.get("maxRangeValue");
            this.stepRangeValue = this.navParams.get("stepRangeValue");
            this.snapsRange = this.navParams.get("snapsRange");
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private goBack(){
        try { 
            this.callback(this.value);
            this.navCtrl.pop();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    public errorHandler(e) {
        super.errorHandler(e);
        this.navCtrl.pop();
    }

}
