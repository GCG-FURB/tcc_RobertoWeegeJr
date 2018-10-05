import { Component, Input } from '@angular/core';
import { MusicalCompositionStep, Composition, MusicalCompositionOption } from '../../util/composition';

@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent {
    
    @Input()
    private compositionStep: MusicalCompositionStep;
    private composition: Composition;
    private compositionStepIndex: number;

    constructor(){
        this.compositionStepIndex = 0;
        this.composition = new Composition();
    }

    getCompositionStepName(): string {
        return this.compositionStep && this.compositionStep.name ? this.compositionStep.name : '' 
    }

    getOptionsList(){
        if (this.compositionStep 
            && this.compositionStep.musicalCompositionLine
            && this.compositionStep.musicalCompositionLine[this.compositionStepIndex]
            && this.compositionStep.musicalCompositionLine[this.compositionStepIndex].musicalCompositionOption) {
            alert(this.compositionStepIndex)
            return this.compositionStep.musicalCompositionLine[this.compositionStepIndex].musicalCompositionOption;
        }
        return []
    }

    getCompositionLinesList(){
        if (this.composition 
            && this.composition.compositionLines) {
            return this.composition.compositionLines;
        }
        return []
    }

    getCompositionOptionsList(lineIndex: number){
        if (this.composition 
            && this.composition.compositionLines) {
            return this.composition.compositionLines[lineIndex].compositionOptions;
        }
        return []
    }
}
