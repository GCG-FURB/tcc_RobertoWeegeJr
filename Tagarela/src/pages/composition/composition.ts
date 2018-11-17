import { Component } from '@angular/core';
import { NavParams, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { GenericComponent } from '../../control/generic-component';
import { Device } from '@ionic-native/device';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage extends GenericComponent{

    private _compositionControl: MusicalCompositionControl;

    constructor(private navParams: NavParams, 
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

    get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }
    
    set compositionControl(compositionControl: MusicalCompositionControl) {
        this._compositionControl = compositionControl;
    }

    private ngOnInit(): void{
        try {
            this.compositionControl = this.navParams.get('compositionControl');
        } catch (e) {
            this.errorHandler(e);
        }
    }

}
