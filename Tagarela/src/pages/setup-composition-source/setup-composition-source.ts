import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController } from 'ionic-angular';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { CompositionPage } from '../composition/composition';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { MusicalCompositionConfig, MusicalCompositionLineConfig } from '../../model/musical-composition-config';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';
import { GenericComponent } from '../../control/generic-component';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { Midi } from '../../model/midi';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage extends GenericComponent {

    private _configControl: MusicalCompositionConfigControl;
    private _sourceControl: MusicalCompositionSourceControl;

    private _configSegment: string;

    private _generalForm: FormGroup;
    private _lineForms: FormGroup[];
    private _stepForms: FormGroup[];
    private _optionForms: FormGroup[][][];

    constructor(private navCtrl: NavController, 
                private navParams: NavParams,
                private formBuilder: FormBuilder,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private visualMidiProvider: VisualMidiProvider) {
    
        super(loadingCtrl,
              alertCtrl,
              popoverCtrl);
    }

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
         
    get configSegment(): string {
        return this._configSegment;
    }
    
    set configSegment(configSegment:string) {
        this._configSegment = configSegment;
    }

    get generalForm(): FormGroup {
        return this._generalForm;
    }
    
    set generalForm(generalForm:FormGroup) {
        this._generalForm = generalForm;
    }
    
    get lineForms(): FormGroup[] {
        return this._lineForms;
    }
    
    set lineForms(lineForms:FormGroup[]) {
        this._lineForms = lineForms;
    }
    
    get stepForms(): FormGroup[] {
        return this._stepForms;
    }
    
    set stepForms(stepForms:FormGroup[]) {
        this._stepForms = stepForms;
    }
    
    get optionForms(): FormGroup[][][] {
        return this._optionForms;
    }
    
    set optionForms(optionForms:FormGroup[][][]) {
        this._optionForms = optionForms;
    }
    
    private ngOnInit(){
        try {
            this.configSegment = 'general';
            let configControl = this.navParams.get('configControl');
            this.loadForms(configControl);
            this.configControl = configControl
            this.sourceControl = this.navParams.get('sourceControl');
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private loadForms(configControl: MusicalCompositionConfigControl){

        let generalForm: FormGroup = this.formBuilder.group({
            minTempo:     [configControl.config.minTempo,     Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.minTempoMidiFV(this.errorHandler.bind(this)), this.maxTempoMidiFV(this.errorHandler.bind(this)), this.minTempoFV(this.errorHandler.bind(this), configControl.config)])],
            maxTempo:     [configControl.config.maxTempo,     Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.minTempoMidiFV(this.errorHandler.bind(this)), this.maxTempoMidiFV(this.errorHandler.bind(this)), this.maxTempoFV(this.errorHandler.bind(this), configControl.config)])],
            stepTempo:    [configControl.config.stepTempo,    Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.stepTempoFV(this.errorHandler.bind(this), configControl.config)])],
            defaultTempo: [configControl.config.defaultTempo, Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.defaultTempoFV(this.errorHandler.bind(this), configControl.config)])],
        });

        let lineForms: FormGroup[] = [];

        for (let lineConfig of configControl.config.linesConfig) {
            lineForms.push(this.formBuilder.group({
                minVolume:     [lineConfig.minVolume    , Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.minVolumeMidiFV(this.errorHandler.bind(this)), this.maxVolumeMidiFV(this.errorHandler.bind(this)), this.minVolumeFV(this.errorHandler.bind(this), lineConfig)])],
                maxVolume:     [lineConfig.maxVolume    , Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.minVolumeMidiFV(this.errorHandler.bind(this)), this.maxVolumeMidiFV(this.errorHandler.bind(this)), this.maxVolumeFV(this.errorHandler.bind(this), lineConfig)])],
                stepVolume:    [lineConfig.stepVolume   , Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.stepVolumeFV(this.errorHandler.bind(this), lineConfig)])],
                defaultVolume: [lineConfig.defaultVolume, Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.defaultVolumeFV(this.errorHandler.bind(this), lineConfig)])],
            }));
        }

        let stepForms: FormGroup[] = [];

        for (let stepConfig of configControl.config.stepsConfig) {
            stepForms.push(this.formBuilder.group({
                quantityOfQuarterNote:     [stepConfig.quantityOfQuarterNote, Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.minQuantityOfQuarterNoteMidiFV(this.errorHandler.bind(this)), this.maxQuantityOfQuarterNoteMidiFV(this.errorHandler.bind(this))])],
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
                        musicalInstrumentsAllowed: [configControl.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].musicalInstrumentsAllowed, Validators.compose([this.required(this.errorHandler.bind(this))])],
                        defaultMusicalInstrument:  [configControl.config.stepsConfig[i].groupsConfig[j].optionsConfig[k].defaultMusicalInstrument,  Validators.compose([this.required(this.errorHandler.bind(this))])]
                    }));

                }
            }
        }

        this.generalForm = generalForm;
        this.lineForms = lineForms;
        this.stepForms = stepForms;
        this.optionForms = optionForms;
        
    }

    private async saveConfigAndStartComposition() {    
        try {
            this.createLoading('Iniciando Composição');
            await this.configControl.persistConfig();
            let compositionControl: MusicalCompositionControl = await new MusicalCompositionControl(this.configControl.config, this.sourceControl.source);
            this.dismissLoading();
            this.navCtrl.setRoot(CompositionPage, {
                compositionControl: compositionControl
            }); 
        } catch (e) {
            this.errorHandler(e);
        }
    }

    //page values
    private getLowerAllowedTempo():number {return Midi.LOWER_ALLOWED_TEMPO}
	private getHighestAllowedTempo():number {return Midi.HIGHEST_ALLOWED_TEMPO} 
	private getLowerAllowedVolume():number {return Midi.LOWER_ALLOWED_VOLUME}
	private getHighestAllowedVolume():number {return Midi.HIGHEST_ALLOWED_VOLUME}
	private getLowerQuantityOfQuarterNote():number {return Midi.LOWER_QUANTITY_OF_QUARTER_NOTE}
	private getHighestQuantityOfQuarterNote():number {return Midi.HIGHEST_QUANTITY_OF_QUARTER_NOTE}

    //page refresh
    private updateGeneralFormControl() {
        try {
            this.generalForm.controls.minTempo.updateValueAndValidity(); 
            this.generalForm.controls.maxTempo.updateValueAndValidity(); 
            this.generalForm.controls.stepTempo.updateValueAndValidity();
            this.generalForm.controls.defaultTempo.updateValueAndValidity();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private updateAllLineFormControl() {
        try {
            for (let i = 0; i < this.lineForms.length; i++) {
                this.updateLineFormControl(i);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }
 
    private updateLineFormControl(lineIndex: number) {
        try {
            this.lineForms[lineIndex].controls.minVolume.updateValueAndValidity(); 
            this.lineForms[lineIndex].controls.maxVolume.updateValueAndValidity(); 
            this.lineForms[lineIndex].controls.stepVolume.updateValueAndValidity();
            this.lineForms[lineIndex].controls.defaultVolume.updateValueAndValidity();
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private updateAlloptionFormControl() {
        try {        
            for (let i = 0; i < this.optionForms.length; i++) {
                for (let j = 0; j < this.optionForms[i].length; j++) {
                    for (let k = 0; k < this.optionForms[i][j].length; k++) {
                        this.updateoptionFormControl(i, j ,k);
                    }
                }
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private lineFormsIsValid(): boolean {
        try {
            for (let i = 0; i < this.lineForms.length; i++) {
                if (!this.lineForms[i].valid) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            this.errorHandler(e);
        }
    }
    
    private stepFormsIsValid(): boolean {
        try {
            for (let i = 0; i < this.stepForms.length; i++) {
                if (!this.stepForms[i].valid) {
                    return false;
                }
            }
            return true;
        } catch (e) {
            this.errorHandler(e);
        }
    }
    
    private optionFormsIsValid(): boolean {
        try {
            for (let i = 0; i < this.optionForms.length; i++) {
                for (let j = 0; j < this.optionForms[i].length; j++) {
                    for (let k = 0; k < this.optionForms[i][j].length; k++) {
                        if (!this.optionForms[i][j][k].valid) {
                            return false;
                        }
                    }
                }
            }
            return true;
        } catch (e) {
            this.errorHandler(e);
        }
    }

    private updateoptionFormControl(iIndex: number, jIndex: number, kIndex: number) {
        try {
            this.optionForms[iIndex][jIndex][kIndex].controls.musicalInstrumentsAllowed.updateValueAndValidity(); 
            this.optionForms[iIndex][jIndex][kIndex].controls.defaultMusicalInstrument.updateValueAndValidity(); 
        } catch (e) {
            this.errorHandler(e);
        }
    }

    //validators
    private required(errorHandlerFunction: Function): ValidatorFn {
        return (control: FormControl) => {
            try {
               return Validators.required(control);
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private integerNumberValidationVF(errorHandlerFunction: Function): ValidatorFn {
        return (control: FormControl) => {
            try {
                if (control.value) {
                    if (isNaN(control.value)) {
                        return {
                            "not_number": true
                        };
                    } else if (+control.value % 1 != 0) {
                        return {
                            "not_integer": true
                        };
                    }
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private minTempoMidiFV(errorHandlerFunction: Function): ValidatorFn {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value < this.getLowerAllowedTempo()) {
                    return {
                        "min_tempo_midi": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private maxTempoMidiFV(errorHandlerFunction: Function): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value > this.getHighestAllowedTempo()) {
                    return {
                        "max_tempo_midi": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private minTempoFV(errorHandlerFunction: Function, config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value > config.maxTempo) {
                    return {
                        "min_tempo": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private maxTempoFV(errorHandlerFunction: Function, config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value < config.minTempo) {
                    return {
                        "max_tempo": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private stepTempoFV(errorHandlerFunction: Function, config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && config.maxTempo >= config.minTempo && +control.value > config.maxTempo - config.minTempo) {
                    return {
                        "step_tempo": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private defaultTempoFV(errorHandlerFunction: Function, config: MusicalCompositionConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && config.maxTempo >= config.minTempo && (+control.value > config.maxTempo || +control.value < config.minTempo)) {
                    return {
                        "default_tempo": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
        
    }

    private minVolumeMidiFV(errorHandlerFunction: Function): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value < this.getLowerAllowedVolume()) {
                    return {
                        "min_volume_midi": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private maxVolumeMidiFV(errorHandlerFunction: Function): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value > this.getHighestAllowedVolume()) {
                    return {
                        "max_volume_midi": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private minVolumeFV(errorHandlerFunction: Function, config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value > config.maxVolume) {
                    return {
                        "min_volume": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private maxVolumeFV(errorHandlerFunction: Function, config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            try {
                    if (!isNaN(control.value) && +control.value < config.minVolume) {
                    return {
                        "max_volume": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private stepVolumeFV(errorHandlerFunction: Function, config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && config.maxVolume >= config.minVolume && +control.value > config.maxVolume - config.minVolume) {
                    return {
                        "step_volume": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private defaultVolumeFV(errorHandlerFunction: Function, config: MusicalCompositionLineConfig): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && config.maxVolume >= config.minVolume && (+control.value > config.maxVolume || +control.value < config.minVolume)) {
                    return {
                        "default_volume": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }
    
    private minQuantityOfQuarterNoteMidiFV(errorHandlerFunction: Function): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value < this.getLowerQuantityOfQuarterNote()) {
                    return {
                        "min_quantity_of_quarter_note": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }

    private maxQuantityOfQuarterNoteMidiFV(errorHandlerFunction: Function): any {
        return (control: FormControl) => {
            try {
                if (!isNaN(control.value) && +control.value > this.getHighestQuantityOfQuarterNote()) {
                    return {
                        "max_quantity_of_quarter_note": true
                    };
                }
                return null;
            } catch (e) {
                errorHandlerFunction(e);
                return {
                    "validation_error": true
                };
            }
        }
    }    

}