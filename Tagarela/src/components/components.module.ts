import { NgModule } from '@angular/core';
import { CompositionControlComponent } from './composition-control/composition-control';
import { ChoiceComponent } from './choice/choice';
import { VolumeComponent } from './volume/volume';
import { SlidePopoverComponent } from './slide-popover/slide-popover';
import { ListPopoverComponent } from './list-popover/list-popover';
@NgModule({
	declarations: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent,
    SlidePopoverComponent,
    ListPopoverComponent],
	imports: [],
	exports: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent,
    SlidePopoverComponent,
    ListPopoverComponent]
})
export class ComponentsModule {}
