import { NgModule } from '@angular/core';
import { CompositionControlComponent } from './composition-control/composition-control';
import { ChoiceComponent } from './choice/choice';
@NgModule({
	declarations: [CompositionControlComponent,
    ChoiceComponent],
	imports: [],
	exports: [CompositionControlComponent,
    ChoiceComponent]
})
export class ComponentsModule {}
