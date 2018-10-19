import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { GenericComponent } from '../../control/generic-component';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage extends GenericComponent{

    private _compositionControl: MusicalCompositionControl;

    constructor(private navCtrl: NavController, 
                private navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController) {
        
        super(loadingCtrl,
            alertCtrl,
            popoverCtrl);
            
    }

    get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }
    
    set compositionControl(compositionControl:MusicalCompositionControl) {
        this._compositionControl = compositionControl;
    }

    ngOnInit(){
        try {
            this.compositionControl = this.navParams.get('compositionControl');
        } catch (e) {
            this.errorHandler(e);
        }
    }

}
