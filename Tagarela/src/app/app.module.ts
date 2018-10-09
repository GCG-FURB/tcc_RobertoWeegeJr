import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { CompositionPage } from '../pages/composition/composition';
import { GeneralControlComponent } from '../components/general-control/general-control';
import { CompositionControlComponent } from '../components/composition-control/composition-control';
import { ChoiceComponent } from '../components/choice/choice';
import { VolumeComponent } from '../components/volume/volume';
import { DragComponentDirective } from '../directives/drag-component/drag-component';
import { MusicalInstrumentChoicePage } from '../pages/musical-instrument-choice/musical-instrument-choice';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Media } from '@ionic-native/media';
import { CompositionSourcePage } from '../pages/composition-source/composition-source';
import { SetupCompositionSourcePage } from '../pages/setup-composition-source/setup-composition-source';

@NgModule({
  declarations: [
    MyApp,
    CompositionSourcePage,
    SetupCompositionSourcePage,
    CompositionPage, 
    MusicalInstrumentChoicePage,
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
    CompositionPage,
    SetupCompositionSourcePage,
    MusicalInstrumentChoicePage,
    CompositionSourcePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FilePath,
    Media,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
