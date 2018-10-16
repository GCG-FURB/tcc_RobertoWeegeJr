import { NgModule } from '@angular/core';
import { CompositionControlComponent } from './composition-control/composition-control';
import { ChoiceComponent } from './choice/choice';
import { VolumeComponent } from './volume/volume';
import { SlidePopoverComponent } from './slide-popover/slide-popover';
import { ListPopoverComponent } from './list-popover/list-popover';
import { PlayMidiComponent } from './play-midi/play-midi';
@NgModule({
	declarations: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent,
    SlidePopoverComponent,
    ListPopoverComponent,
    PlayMidiComponent,
    PlayMidiComponent],
	imports: [],
	exports: [CompositionControlComponent,
    ChoiceComponent,
    VolumeComponent,
    SlidePopoverComponent,
    ListPopoverComponent,
    PlayMidiComponent,
    PlayMidiComponent]
})
export class ComponentsModule {}
