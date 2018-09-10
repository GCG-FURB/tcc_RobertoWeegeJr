import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SumFiles } from './sum-files';

@NgModule({
  declarations: [
    SumFiles,
  ],
  imports: [
    IonicPageModule.forChild(SumFiles),
  ],
})
export class VisualPageModule {}
