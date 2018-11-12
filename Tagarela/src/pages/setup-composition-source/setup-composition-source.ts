import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController, PopoverController, ToastController } from 'ionic-angular';
import { MusicalCompositionConfigControl } from '../../control/musical-composition-config';
import { MusicalCompositionSourceControl } from '../../control/musical-composition-source';
import { CompositionPage } from '../composition/composition';
import { FormControl, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { VisualMidiProvider } from '../../providers/visual-midi/visual-midi';
import { GenericComponent } from '../../control/generic-component';
import { MusicalCompositionControl } from '../../control/musical-composition';
import { Midi } from '../../model/midi';
import { FileProvider } from '../../providers/file/file';

@Component({
    selector: 'page-setup-composition-source',
    templateUrl: 'setup-composition-source.html',
})
export class SetupCompositionSourcePage extends GenericComponent {

    private _configControl: MusicalCompositionConfigControl;
    private _sourceControl: MusicalCompositionSourceControl;
    private _configSegment: string;
    private _generalForm: FormGroup;
    private _stepForms: FormGroup[];
    private _optionForms: FormGroup[][][];
    private _tempoRange: IonRangeDualKnobsModel;
    private _volumeRange: IonRangeDualKnobsModel[];
    
    constructor(private navCtrl: NavController, 
                private navParams: NavParams,
                private formBuilder: FormBuilder,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                private popoverCtrl: PopoverController,
                private visualMidiProvider: VisualMidiProvider,
                private toastCtrl: ToastController,
                private fileProvider: FileProvider) { 

        super(loadingCtrl,
              alertCtrl,
              popoverCtrl,
              toastCtrl);
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
    
    set sourceControl(sourceControl: MusicalCompositionSourceControl) {
        this._sourceControl = sourceControl;
    }
         
    get configSegment(): string {
        return this._configSegment;
    }
    
    set configSegment(configSegment: string) {
        this._configSegment = configSegment;
    }

    get generalForm(): FormGroup {
        return this._generalForm;
    }
    
    set generalForm(generalForm: FormGroup) {
        this._generalForm = generalForm;
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
    
    get tempoRange(): IonRangeDualKnobsModel {
        return this._tempoRange;
    }

    set tempoRange(tempoRange: IonRangeDualKnobsModel) {
        this._tempoRange = tempoRange;
    }

    get volumeRange(): IonRangeDualKnobsModel[] {
        return this._volumeRange;
    }
    
    set volumeRange(value: IonRangeDualKnobsModel[]) {
        this._volumeRange = value;
    }

    private ngOnInit(): void {
        try {
            this.configSegment = 'general';
            let configControl = this.navParams.get('configControl');
            this.configControl = configControl
            this.sourceControl = this.navParams.get('sourceControl');
            
            this.configureTempoValues();
            this.configureVolumeValues();

            this.loadForms(configControl);

            this.updateGeneralFormControl();
            this.updateAllLineFormControl();

        } catch (e) {
            this.errorHandler(e);
        }
    }

    private configureTempoValues(): void {

        if (!this.configControl.config.minTempo || this.configControl.config.minTempo < this.getLowerAllowedTempo()) {
            this.configControl.config.minTempo = this.getLowerAllowedTempo();
        }
        
        if (!this.configControl.config.maxTempo || this.configControl.config.maxTempo > this.getHighestAllowedTempo()) {
            this.configControl.config.maxTempo = this.getHighestAllowedTempo();
        }

        if (this.configControl.config.maxTempo < this.configControl.config.minTempo) {
            this.configControl.config.maxTempo = this.configControl.config.minTempo
        }

        if (!this.configControl.config.stepTempo && this.configControl.config.stepTempo != 0) {
            this.configControl.config.stepTempo = this.getMinStepValueTempo();
        }

        if (!this.configControl.config.defaultTempo && this.configControl.config.defaultTempo != 0) {
            this.configControl.config.defaultTempo = this.getLowerAllowedTempo();;
        }

        this.tempoRange = new IonRangeDualKnobsModel(this.configControl.config.minTempo, this.configControl.config.maxTempo);

    }

    private configureVolumeValues(): void {
        this.volumeRange = [];
        for (let line of this.configControl.config.linesConfig) {
            
            if (!line.minVolume || line.minVolume < this.getLowerAllowedVolume()) {
                line.minVolume = this.getLowerAllowedVolume();
            }
            
            if (!line.maxVolume || line.maxVolume > this.getHighestAllowedVolume()) {
                line.maxVolume = this.getHighestAllowedVolume();
            }

            if (line.maxVolume < line.minVolume) {
                line.maxVolume = line.minVolume
            }

            if (!line.stepVolume && line.stepVolume != 0) {
                line.stepVolume = this.getMinStepValueVolume(null);
            }

            if (!line.defaultVolume && line.defaultVolume != 0) {
                line.defaultVolume = this.getLowerAllowedVolume();
            }
            
            this.volumeRange.push(new IonRangeDualKnobsModel(line.minVolume, line.maxVolume));
        }
    }

    private loadForms(configControl: MusicalCompositionConfigControl): void {

        let generalForm: FormGroup = this.formBuilder.group({
            defaultKeySignature: [configControl.config.keySignature, Validators.compose([this.required(this.errorHandler.bind(this))])],
            keySignaturesAllowed: [configControl.config.keySignaturesAllowed, Validators.compose([this.required(this.errorHandler.bind(this))])]

        });

        let stepForms: FormGroup[] = [];

        for (let stepConfig of configControl.config.stepsConfig) {
            stepForms.push(this.formBuilder.group({
                quantityOfQuarterNote:     [stepConfig.quantityOfQuarterNote, Validators.compose([this.required(this.errorHandler.bind(this)), this.integerNumberValidationVF(this.errorHandler.bind(this)), this.minQuantityOfQuarterNoteMidiFV(this.errorHandler.bind(this)), this.maxQuantityOfQuarterNoteMidiFV(this.errorHandler.bind(this))])],
            }));
        }

        let optionForms: FormGroup[][][] = [];

        for (let i = 0; i < configControl.config.stepsConfig.length; i++) {
            for (let j = 0; j < configControl.config.stepsConfig[i].linesConfig.length; j++) {
                for (let k = 0; k < configControl.config.stepsConfig[i].linesConfig[j].optionsConfig.length; k++) {
                    
                    if (optionForms.length -1 < i)
                        optionForms.push([]);
                    
                    if (optionForms[i].length -1 < j) {
                        optionForms[i].push([]);
                    }
                         
                    optionForms[i][j].push(this.formBuilder.group({
                        musicalInstrumentsAllowed: [configControl.config.stepsConfig[i].linesConfig[j].optionsConfig[k].musicalInstrumentsAllowed, Validators.compose([this.required(this.errorHandler.bind(this))])],
                        defaultMusicalInstrument:  [configControl.config.stepsConfig[i].linesConfig[j].optionsConfig[k].defaultMusicalInstrument,  Validators.compose([this.required(this.errorHandler.bind(this))])]
                    }));

                }
            }
        }

        this.generalForm = generalForm;
        this.stepForms = stepForms;
        this.optionForms = optionForms;
        
    }

    private async saveConfigAndStartComposition(): Promise<void> {    
        try {
            
            this.createLoading('Iniciando Composição');
            
            this.configControl.config.minTempo = this.tempoRange.lower; 
            this.configControl.config.maxTempo = this.tempoRange.upper;
            
            for (let i = 0; i < this.volumeRange.length; i++) {
                this.configControl.config.linesConfig[i].minVolume = this.volumeRange[i].lower;
                this.configControl.config.linesConfig[i].maxVolume = this.volumeRange[i].upper;
            }

            await this.configControl.persistConfig();
            await this.fileProvider.cleanTempArea();
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
    private getLowerAllowedTempo(): number {return Midi.LOWER_ALLOWED_TEMPO}
	private getHighestAllowedTempo(): number {return Midi.HIGHEST_ALLOWED_TEMPO} 
	private getLowerAllowedVolume(): number {return Midi.LOWER_ALLOWED_VOLUME}
	private getHighestAllowedVolume(): number {return Midi.HIGHEST_ALLOWED_VOLUME}
	private getLowerQuantityOfQuarterNote(): number {return Midi.LOWER_QUANTITY_OF_QUARTER_NOTE}
	private getHighestQuantityOfQuarterNote(): number {return Midi.HIGHEST_QUANTITY_OF_QUARTER_NOTE}

    private getMinStepValueTempo(): number {
        return 1;
    }

    private getMaxStepValueTempo(): number {
        let diference: number = Math.round((this.tempoRange.upper - this.tempoRange.lower) / 2);
        return (diference >= this.getMinStepValueTempo() ? diference : this.getMinStepValueTempo())
    }

    private getMinStepValueVolume(index: number): number {
        return 1;
    }

    private getMaxStepValueVolume(index: number): number {
        let diference: number = Math.round((this.volumeRange[index].upper - this.volumeRange[index].lower) / 2);
        return (diference >= this.getMinStepValueVolume(index) ? diference : this.getMinStepValueVolume(index))
    }

    //page refresh
    private updateGeneralFormControl(): void {
        try {
            
            if (this.configControl.config.stepTempo > this.getMaxStepValueTempo()) 
                this.configControl.config.stepTempo = this.getMaxStepValueTempo()
            else if (this.configControl.config.stepTempo < this.getMinStepValueTempo()) 
                this.configControl.config.stepTempo = this.getMinStepValueTempo()
            
            if (this.configControl.config.defaultTempo > this.tempoRange.upper)
                this.configControl.config.defaultTempo = this.tempoRange.upper
            else if (this.configControl.config.defaultTempo < this.tempoRange.lower)
                this.configControl.config.defaultTempo = this.tempoRange.lower

        } catch (e) {
            this.errorHandler(e);
        }
    }

    private updateAllLineFormControl(): void {
        try {
            for (let i = 0; i < this.volumeRange.length; i++) {
                this.updateLineFormControl(i);
            }
        } catch (e) {
            this.errorHandler(e);
        }
    }
 
    private updateLineFormControl(lineIndex: number): void {
        try {

            if (this.configControl.config.linesConfig[lineIndex].stepVolume > this.getMaxStepValueVolume(lineIndex)) 
                this.configControl.config.linesConfig[lineIndex].stepVolume = this.getMaxStepValueVolume(lineIndex)
            else if (this.configControl.config.linesConfig[lineIndex].stepVolume < this.getMinStepValueVolume(lineIndex)) 
                this.configControl.config.linesConfig[lineIndex].stepVolume = this.getMinStepValueVolume(lineIndex)
            
            if (this.configControl.config.linesConfig[lineIndex].defaultVolume > this.volumeRange[lineIndex].upper)
                this.configControl.config.linesConfig[lineIndex].defaultVolume = this.volumeRange[lineIndex].upper
            else if (this.configControl.config.linesConfig[lineIndex].defaultVolume < this.volumeRange[lineIndex].lower)
                this.configControl.config.linesConfig[lineIndex].defaultVolume = this.volumeRange[lineIndex].lower

        } catch (e) {
            this.errorHandler(e);
        }
    }

    private lineFormsIsValid(): boolean {
        try {
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

    private minQuantityOfQuarterNoteMidiFV(errorHandlerFunction: Function): ValidatorFn {
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

    private maxQuantityOfQuarterNoteMidiFV(errorHandlerFunction: Function): ValidatorFn {
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

class IonRangeDualKnobsModel {
    
    private _lower: number;
    private _upper: number;

    constructor(lower: number, upper: number) {
        this.lower = lower;
        this.upper = upper;
    }

    get lower(): number {
        return this._lower;
    }

    set lower(lower: number) {
        this._lower = lower;
    }

    get upper(): number {
        return this._upper;
    }

    set upper(upper: number) {
        this._upper = upper;
    }

} 
