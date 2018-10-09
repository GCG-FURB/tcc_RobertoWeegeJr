import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SetupCompositionSourcePage } from '../setup-composition-source/setup-composition-source';

@Component({
    selector: 'page-composition-source',
    templateUrl: 'composition-source.html',
})
export class CompositionSourcePage {

    private COMPOSITION_SOURCES_RELATIVE_PATH = 'www/assets/composition-sources/'

    private _defaultCompositionSources: string[]; 
    private _chosedCompositionSource: string;

    constructor(private file: File, public navCtrl: NavController, public navParams: NavParams) {}

    get defaultCompositionSources(): string[] {
        return this._defaultCompositionSources;
    }

    set defaultCompositionSources(defaultCompositionSources: string[]) {
        this._defaultCompositionSources = defaultCompositionSources; 
    }

    get chosedCompositionSource(): string {
        return this._chosedCompositionSource;
    }

    set chosedCompositionSource(chosedCompositionSource: string) {
        this._chosedCompositionSource = chosedCompositionSource; 
        this.navCtrl.setRoot(SetupCompositionSourcePage, {
            baseFileSystem: this.file.applicationDirectory,
            relativePath: this.COMPOSITION_SOURCES_RELATIVE_PATH + chosedCompositionSource
        });
    }

    ionViewDidLoad() {
        this.defaultCompositionSources = []
        this.file.checkDir(this.file.applicationDirectory, this.COMPOSITION_SOURCES_RELATIVE_PATH)
            .then(() => {
                this.file.listDir(this.file.applicationDirectory, this.COMPOSITION_SOURCES_RELATIVE_PATH)
                    .then((listDir) => {
                        for (let dir of listDir) {
                            if (dir.isDirectory == true) {
                                this.defaultCompositionSources.push(dir.name);
                            }
                        }
                    })
                    .catch(_ => console.log('Error'))
            })

    }

}
