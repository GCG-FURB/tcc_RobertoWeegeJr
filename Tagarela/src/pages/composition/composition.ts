import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Media } from '@ionic-native/media';
import {  Composition } from '../../util/composition';
import { MusicalCompositionControl } from '../../control/musical-composition';

@Component({
  selector: 'page-composition',
  templateUrl: 'composition.html',
})
export class CompositionPage {

    private compositionControl: MusicalCompositionControl;

    constructor(public navCtrl: NavController, public navParams: NavParams, 
                private file: File,  private filePath: FilePath, private media: Media) {
    }

    ionViewDidLoad() {
        this.compositionControl = this.navParams.get('compositionControl');
    }

}



