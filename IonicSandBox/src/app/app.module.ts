import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { File } from '@ionic-native/file';
import {Media /*, MediaObject*/} from '@ionic-native/media';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';
import { VisualPage } from '../pages/visual/visual';
import { SumFiles } from '../pages/sum-files/sum-files';

//import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
//import { RotateCustomeDirective } from '../directives/rotate-custom-directive';
import { AbsoluteDrag } from '../directives/absolute-drag';
import { DragPage } from '../pages/drag/drag';

/*export class CustomHammerConfig extends HammerGestureConfig {
  overrides = {
    'rotate': { enable: true } //rotate is disabled by default, so we need to enable it
  }
}*/

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    VisualPage,
    SumFiles,
    AbsoluteDrag,
    DragPage 
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    VisualPage,
    SumFiles,
    DragPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    File,
    Media, 
    //MediaObject
    FileChooser,
    FilePath /*,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig
    }*/
  ]
})

export class AppModule {}