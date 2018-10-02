import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {CompositionPage} from '../pages/composition/composition';
import { GeneralControlComponent } from '../components/general-control/general-control';
import { CompositionControlComponent } from '../components/composition-control/composition-control';
import { ChoiceComponent } from '../components/choice/choice';
import { VolumeComponent } from '../components/volume/volume';
import { DragComponentDirective } from '../directives/drag-component/drag-component';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CompositionPage, 
    GeneralControlComponent,
    CompositionControlComponent,
    ChoiceComponent, 
    VolumeComponent,
    DragComponentDirective,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CompositionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
