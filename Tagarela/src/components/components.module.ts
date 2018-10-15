import { NgModule } from '@angular/core';
import { CompositionControlComponent } from './composition-control/composition-control';
import { ChoiceComponent } from './choice/choice';
import { VolumeComponent } from './volume/volume';
import { SlidePopoverComponent } from './slide-popover/slide-popover';
@NgModule({
	declarations: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent,
    SlidePopoverComponent],
	imports: [],
	exports: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent,
    SlidePopoverComponent]
})
export class ComponentsModule {}
