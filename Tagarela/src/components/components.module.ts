import { NgModule } from '@angular/core';
import { CompositionControlComponent } from './composition-control/composition-control';
import { ChoiceComponent } from './choice/choice';
import { VolumeComponent } from './volume/volume';
@NgModule({
	declarations: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent],
	imports: [],
	exports: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent]
})
export class ComponentsModule {}
