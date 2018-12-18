import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'slide-popover',
  templateUrl: 'slide-popover.html'
})
export class SlidePopoverComponent extends GenericComponent {

    private _callback: Function;
    private _color: string;
    private _description: string;
    private _value: number;
    private _minRangeValue: number;
    private _maxRangeValue: number;
    private _stepRangeValue: number;
    private _snapsRange: boolean;

    constructor(private navCtrl: NavController, 
                private navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private toastCtrl: ToastController,
                private dev: Device) {

        super(loadingCtrl,
            alertCtrl,
            popoverCtrl,
            toastCtrl,
            dev);

    }

    get callback(): Function {
        return this._callback;
    }

    set callback(callback: Function) {
        this._callback = callback;
    }

    get color(): string {
        return this._color;
    }

    set color(color: string) {
        this._color = color;
    }

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        this._value = value;
    }

    get minRangeValue(): number {
        return this._minRangeValue;
    }

    set minRangeValue(minRangeValue: number) {
        this._minRangeValue = minRangeValue;
    }

    get maxRangeValue(): number {
        return this._maxRangeValue;
    }

    set maxRangeValue(maxRangeValue: number) {
        this._maxRangeValue = maxRangeValue;
    }

    get stepRangeValue(): number {
        return this._stepRangeValue;
    }

    set stepRangeValue(stepRangeValue: number) {
        this._stepRangeValue = stepRangeValue;
    }

    get snapsRange(): boolean {
        return this._snapsRange;
    }

    set snapsRange(snapsRange: boolean) {
        this._snapsRange = snapsRange;
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

    private goBack(): void {
        try { 
            this.callback(this.value);
            this.navCtrl.pop();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    public errorHandler(e): void {
        super.errorHandler(e);
        this.navCtrl.pop();
    }

}
