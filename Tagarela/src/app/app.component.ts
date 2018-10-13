import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChoiceCompositionSourcePage } from '../pages/choice-composition-source/choice-composition-source';

@Component({
  templateUrl: 'app.html'
})
export class Tagarela {
  //rootPage:any = HomePage;
  //rootPage:any = CompositionPage;
  rootPage:any = ChoiceCompositionSourcePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

