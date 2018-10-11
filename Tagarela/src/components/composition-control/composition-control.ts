import { Component, Input } from '@angular/core';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { MusicalCompositionOption } from '../../model/musical-composition';

@Component({
  selector: 'composition-control',
  templateUrl: 'composition-control.html'
})
export class CompositionControlComponent {
    
    @Input()
    private compositionControl: MusicalCompositionControl;

    constructor(){}

    getOptionsList(): MusicalCompositionOption[] {
        if (this.compositionControl) {
            return  this.compositionControl.getOptionsToChoice();
        }
        return [];
    }

    getCompositionLinesList(){
        if (this.compositionControl 
            && this.compositionControl.composition) {
            return this.compositionControl.composition.lines;
        }
        return []
    }

    getCompositionOptionsList(lineIndex: number){
        if (this.compositionControl 
            && this.compositionControl.composition) {
            return this.compositionControl.composition.lines[lineIndex].options;
        }
        return []
    }
}
