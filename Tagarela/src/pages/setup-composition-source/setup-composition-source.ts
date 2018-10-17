import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { CompositionPage } from '../composition/composition';
import { VisualMidiUtil } from '../../util/visual-midi';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { MusicalCompositionConfig, MusicalCompositionLineConfig } from '../../model/musical-composition-config';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage {

    private _configControl: MusicalCompositionConfigControl;
    private _sourceControl: MusicalCompositionSourceControl;

    private _visualMidi: VisualMidiUtil;
    
    private _configSegment: string;

    private generalForm: FormGroup;
    private lineForms: FormGroup[];
    private stepForms: FormGroup[];
    private optionForms: FormGroup[][][];
    
    constructor(public navCtrl: NavController, 
                public navParams: NavParams,
                public loadingController: LoadingController,
                private file: File,
                public formBuilder: FormBuilder) {}

    get configControl(): MusicalCompositionConfigControl {
        return this._configControl;
    }
    
    set configControl(configControl:MusicalCompositionConfigControl) {
        this._configControl = configControl;
    }
    
    get sourceControl(): MusicalCompositionSourceControl {
        return this._sourceControl;
    }
    
    set sourceControl(sourceControl:MusicalCompositionSourceControl) {
        this._sourceControl = sourceControl;
    }
    
    get visualMidi(): VisualMidiUtil {
        return this._visualMidi;
    }
    
    set visualMidi(visualMidi:VisualMidiUtil) {
        this._visualMidi = visualMidi;
    }
         
    get configSegment(): string {
        return this._configSegment;
    }
    
    set configSegment(configSegment:string) {
        this._configSegment = configSegment;
    }
    
    
    ngOnInit(){
        this.visualMidi = new VisualMidiUtil();
        this.configSegment = 'general';
        let configControl = this.navParams.get('configControl');
        this.loadForms(configControl);
        this.configControl = configControl
        this.sourceControl = this.navParams.get('sourceControl')
    }

    ionViewDidLoad() {}

    private loadForms(configControl: MusicalCompositionConfigControl){

        let generalForm: FormGroup = this.formBuilder.group({
            minTempo:     [configControl.config.minTempo,     Validators.compose([Validators.required, this.minTempoMidiFV, this.maxTempoMidiFV, this.minTempoFV(configControl.config)])],
            maxTempo:     [configControl.config.maxTempo,     Validators.compose([Validators.required, this.minTempoMidiFV, this.maxTempoMidiFV, this.maxTempoFV(configControl.config)])],
            stepTempo:    [configControl.config.stepTempo,    Validators.compose([Validators.required, this.stepTempoFV(configControl.config)])],
            defaultTempo: [configControl.config.defaultTempo, Validators.compose([Validators.required, this.defaultTempoFV(configControl.config)])],
        });

        let lineForms: FormGroup[] = [];

        for (let lineConfig of configControl.config.linesConfig) {
            lineForms.push(this.formBuilder.group({
                minVolume:     [lineConfig.minVolume    , Validators.compose([Validators.required, this.minVolumeMidiFV, this.maxVolumeMidiFV, this.minVolumeFV(lineConfig)])],
                maxVolume:     [lineConfig.maxVolume    , Validators.compose([Validators.required, this.minVolumeMidiFV, this.maxVolumeMidiFV, this.maxVolumeFV(lineConfig)])],
                stepVolume:    [lineConfig.stepVolume   , Validators.compose([Validators.required, this.stepVolumeFV(lineConfig)])],
                defaultVolume: [lineConfig.defaultVolume, Validators.compose([Validators.required, this.defaultVolumeFV(lineConfig)])],
            }));
        }

        let stepForms: FormGroup[] = [];

        for (let stepConfig of configControl.config.stepsConfig) {
            stepForms.push(this.formBuilder.group({
                quantityOfQuarterNote:     [stepConfig.quantityOfQuarterNote, Validators.compose([Validators.required, this.minQuantityOfQuarterNoteMidiFV, this.maxQuantityOfQuarterNoteMidiFV])],
            }));
        }


        let optionForms: FormGroup[][][] = [];

        for (let i = 0; i < configControl.config.stepsConfig.length; i++) {
            for (let j = 0; j < configControl.config.stepsConfig[i].groupsConfig.length; j++) {
                for (let k = 0; k < configControl.config.stepsConfig[i].groupsConfig[j].optionsConfig.length; k++) {
                    
                    if (optionForms.length -1 < i)
                        optionForms.push([]);
                    
                    if (optionForms[i].length -1 < j) {
                        optionForms[i].push([]);
                    }
                         
                    optionForms[i][j].push(this.formBuilder.group({
                        musicalInstrumentsAllowed: [configControl.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed, Validators.compose([Validators.required])],
                        defaultMusicalInstrument:  [configControl.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument,  Validators.compose([Validators.required])]
                    }));

                }
            }
        }

        this.generalForm = generalForm;
        this.lineForms = lineForms;
        this.stepForms = stepForms;
        this.optionForms = optionForms;
        
    }

    updateGeneralFormControl() {
        this.generalForm.controls.minTempo.updateValueAndValidity(); 
        this.generalForm.controls.maxTempo.updateValueAndValidity(); 
        this.generalForm.controls.stepTempo.updateValueAndValidity();
        this.generalForm.controls.defaultTempo.updateValueAndValidity();
    }

    updateAllLineFormControl() {
        for (let i = 0; i < this.lineForms.length; i++) {
            this.updateLineFormControl(i);
        }
    }
 
    updateLineFormControl(lineIndex: number) {
        this.lineForms[lineIndex].controls.minVolume.updateValueAndValidity(); 
        this.lineForms[lineIndex].controls.maxVolume.updateValueAndValidity(); 
        this.lineForms[lineIndex].controls.stepVolume.updateValueAndValidity();
        this.lineForms[lineIndex].controls.defaultVolume.updateValueAndValidity();
    }

    updateAlloptionFormControl() {
        for (let i = 0; i < this.optionForms.length; i++) {
            for (let j = 0; j < this.optionForms[i].length; j++) {
                for (let k = 0; k < this.optionForms[i][j].length; k++) {
                    this.updateoptionFormControl(i, j ,k);
                }
            }
        }
    }

    updateoptionFormControl(iIndex: number, jIndex: number, kIndex: number) {
        this.optionForms[iIndex][jIndex][kIndex].controls.musicalInstrumentsAllowed.updateValueAndValidity(); 
        this.optionForms[iIndex][jIndex][kIndex].controls.defaultMusicalInstrument.updateValueAndValidity(); 
    }

    private async saveConfigAndStartComposition() {    
        await this.configControl.persistConfig();
        this.navCtrl.setRoot(CompositionPage, {
            compositionConfig: this.configControl.config,
            compositionSource: this.sourceControl.source
        }); 
    }
    
    private minTempoMidiFV(control: FormControl): any {
        if (+control.value <= 0) {
            return {
                "min_tempo_midi": true
            };
        }
        return null;
    }

    private maxTempoMidiFV(control: FormControl): any {
        if (+control.value > 500) {
            return {
                "max_tempo_midi": true
            };
        }
        return null;
    }

    private minTempoFV(config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            if (+control.value > config.maxTempo) {
                return {
                    "min_tempo": true
                };
            }
            return null;
        }
    }

    private maxTempoFV(config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            if (+control.value < config.minTempo) {
                return {
                    "max_tempo": true
                };
            }
            return null;
        }
    }

    private stepTempoFV(config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            if (config.maxTempo >= config.minTempo && +control.value > config.maxTempo - config.minTempo) {
                return {
                    "step_tempo": true
                };
            }
            return null;
        }
    }

    private defaultTempoFV(config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            if (config.maxTempo >= config.minTempo && (+control.value > config.maxTempo || +control.value < config.minTempo)) {
                return {
                    "default_tempo": true
                };
            }
            return null;
        }
        
    }

    private minVolumeMidiFV(control: FormControl): any {
        if (+control.value <= 0) {
            return {
                "min_volume_midi": true
            };
        }
        return null;
    }

    private maxVolumeMidiFV(control: FormControl): any {
        if (+control.value > 500) {
            return {
                "max_volume_midi": true
            };
        }
        return null;
    }

    private minVolumeFV(config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            if (+control.value > config.maxVolume) {
                return {
                    "min_volume": true
                };
            }
            return null;
        }
    }

    private maxVolumeFV(config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            if (+control.value < config.minVolume) {
                return {
                    "max_volume": true
                };
            }
            return null;
        }
    }

    private stepVolumeFV(config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            if (config.maxVolume >= config.minVolume && +control.value > config.maxVolume - config.minVolume) {
                return {
                    "step_volume": true
                };
            }
            return null;
        }
    }

    private defaultVolumeFV(config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            if (config.maxVolume >= config.minVolume && (+control.value > config.maxVolume || +control.value < config.minVolume)) {
                return {
                    "default_volume": true
                };
            }
            return null;
        }
    }
    
    private minQuantityOfQuarterNoteMidiFV(control: FormControl): any {
        if (+control.value <= 0) {
            return {
                "min_quantity_of_quarter_note": true
            };
        }
        return null;
    }

    private maxQuantityOfQuarterNoteMidiFV(control: FormControl): any {
        if (+control.value > 500) {
            return {
                "max_quantity_of_quarter_note": true
            };
        }
        return null;
    }    


}