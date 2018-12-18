import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChoiceCompositionSourcePage } from '../pages/choice-composition-source/choice-composition-source';

@Component({
  templateUrl: 'app.html'
})
export class Tagarela {
    
    rootPage: any = ChoiceCompositionSourcePage;
    readyPlatform: boolean = false;
    
    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
        platform.ready().then(() => {       
            //alert('aqui')
            statusBar.styleDefault();
            splashScreen.hide();
            statusBar.backgroundColorByHexString('#01579B');
            this.readyPlatform = true;
        });
    }
}