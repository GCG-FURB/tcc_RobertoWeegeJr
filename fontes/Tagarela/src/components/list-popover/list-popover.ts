import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'list-popover',
  templateUrl: 'list-popover.html'
})
export class ListPopoverComponent extends GenericComponent {

    private _title: string;
    private _list: string[];
    private _callback: Function;
    private _iconFunction: Function;
    private _nameFunction: Function;

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

    get title(): string {
        return this._title;
    }
    
    set title(title: string) {
        this._title = title;
    }
    
    get list(): string[] {
        return this._list;
    }
    
    set list(list: string[]) {
        this._list = list;
    }
    
    get callback(): Function {
        return this._callback;
    }
    
    set callback(callback: Function) {
        this._callback = callback;
    }
    
    get iconFunction(): Function {
        return this._iconFunction;
    }
    
    set iconFunction(iconFunction: Function) {
        this._iconFunction = iconFunction;
    }
    
    get nameFunction(): Function {
        return this._nameFunction;
    }
    
    set nameFunction(nameFunction: Function) {
        this._nameFunction = nameFunction;
    }
    
    private ngOnInit(): void {
        try { 
            this.title = this.navParams.get("title");
            this.list = this.navParams.get("list");
            this.callback = this.navParams.get("callback");
            this.iconFunction = this.navParams.get("iconFunction");
            this.nameFunction = this.navParams.get("nameFunction");
            
            if (!this.nameFunction) 
                this.nameFunction = this.defaultNameFunction;
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private goBack(value: string): void {
        try { 
            this.callback(value);
            this.navCtrl.pop();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private defaultNameFunction(element: string): string {
        try { 
            return element;
        } catch (e) {
            this.errorHandler(e);
        }
    }

    public errorHandler(e): void {
        super.errorHandler(e);
        this.navCtrl.pop();
    }

}
