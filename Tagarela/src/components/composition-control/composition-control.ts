import { Component, Input } from '@angular/core';
import { Composition } from '../../util/composition';

@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent {
    
    @Input()
    private composition: Composition;

    constructor(){}

    getCompositionStepName(): string {
        return this.composition && this.composition.actualStep && this.composition.actualStep.name ? this.composition.actualStep.name : '' 
    }

    getOptionsList(){
        if (this.composition && this.composition.actualStep 
            && this.composition.actualStep.musicalCompositionLine
            && this.composition.actualStep.musicalCompositionLine[this.composition.compositionLineIndex]
            && this.composition.actualStep.musicalCompositionLine[this.composition.compositionLineIndex].musicalCompositionOption) {
            return this.composition.actualStep.musicalCompositionLine[this.composition.compositionLineIndex].musicalCompositionOption;
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
