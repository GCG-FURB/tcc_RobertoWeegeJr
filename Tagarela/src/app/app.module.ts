import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Tagarela } from './app.component';
import { CompositionPage } from '../pages/composition/composition';
import { GeneralControlComponent } from '../components/general-control/general-control';
import { CompositionControlComponent } from '../components/composition-control/composition-control';
import { ChoiceComponent } from '../components/choice/choice';
import { VolumeComponent } from '../components/volume/volume';
import { DragComponentDirective } from '../directives/drag-component/drag-component';

import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Media } from '@ionic-native/media';
import { SetupCompositionSourcePage } from '../pages/setup-composition-source/setup-composition-source';
import { MusicalInstrumentChoiceComponent } from '../components/musical-instrument-choice/musical-instrument-choice';
import { ChoiceCompositionSourcePage } from '../pages/choice-composition-source/choice-composition-source';

@NgModule({
  declarations: [
    Tagarela,
    ChoiceCompositionSourcePage,
    SetupCompositionSourcePage,
    CompositionPage, 
    GeneralControlComponent,
    CompositionControlComponent,
    ChoiceComponent, 
    VolumeComponent,
    MusicalInstrumentChoiceComponent,
    DragComponentDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Tagarela)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Tagarela,
    CompositionPage,
    SetupCompositionSourcePage,
    ChoiceCompositionSourcePage,
    MusicalInstrumentChoiceComponent
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
