import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { MusicalCompositionControl } from '../../control/musical-composition';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage {

    private _compositionControl: MusicalCompositionControl;

    constructor(public navCtrl: NavController, public navParams: NavParams, public loadingController: LoadingController) {
    }

    get compositionControl(): MusicalCompositionControl {
        return this._compositionControl;
    }
    
    set compositionControl(compositionControl:MusicalCompositionControl) {
        this._compositionControl = compositionControl;
    }

    ionViewDidLoad() {
        this.setupComposition();
    }

    private async setupComposition(){
        let loading = await this.loadingController.create({content: 'Iniciando Composição'});
        loading.present();
        try {
            this.compositionControl = new MusicalCompositionControl(this.navParams.get('compositionConfig'), this.navParams.get('compositionSource'));
            loading.dismiss();
        } catch (e) {
            loading.dismiss();
            alert('aqui')
            alert(JSON.stringify(e))
        }

    }

}
