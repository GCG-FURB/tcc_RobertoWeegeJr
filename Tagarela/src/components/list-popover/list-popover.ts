import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { GenericComponent } from '../../control/generic-component';

@Component({
  selector: 'list-popover',
  templateUrl: 'list-popover.html'
})
export class ListPopoverComponent extends GenericComponent {

    private title: string;
    private list: string[];
    private callback: Function;
    private iconFunction: Function;
    private nameFunction: Function;

    constructor(private navCtrl: NavController, 
                private navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController) {

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl);

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

    private goBack(value: string){
        try { 
            this.callback(value);
            this.navCtrl.pop();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private defaultNameFunction(element: string){
        try { 
            return element;
        } catch (e) {
            this.errorHandler(e);
        }
    }

    public errorHandler(e) {
        super.errorHandler(e);
        this.navCtrl.pop();
    }

}
