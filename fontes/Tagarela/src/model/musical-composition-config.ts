export class MusicalCompositionConfig {
  
   // General Config
    private _baseFileSystem: string;           //Caminho relativo raiz da composição 
    private _relativePath: string;           //Caminho relativo raiz da composição 
    private _minTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _maxTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _stepTempo: number;              //Passo a passo utilizado na composição
    private _defaultTempo: number;            //Tempo padrão aplicado no inicio da composição
    private _numerator: number;
    private _denominator: number;
    private _timeDivisionMetric: number;
    private _keySignature: number;
    private _keySignaturesAllowed: number[];
    private _baseKeySignaturesAllowed: number[]; 
    private _mode: number;
    private _showCompositionData: boolean;

    //Step config
    private _stepsConfig: MusicalCompositionStepConfig[];

    //Line config
    private _linesConfig: MusicalCompositionLineConfig[];

    constructor(){
        this.stepsConfig = [];
        this.linesConfig = [];
    }

    get baseFileSystem(): string {
        return this._baseFileSystem;
    }
    
    set baseFileSystem(baseFileSystem: string) {
        this._baseFileSystem = baseFileSystem;
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath: string) {
        this._relativePath = relativePath;
    }
    
    get minTempo(): number {
        return this._minTempo;
    }
    
    set minTempo(minTempo: number) {
        minTempo = +minTempo;
        this._minTempo = minTempo;
    }
    
    get maxTempo(): number {
        return this._maxTempo;
    }
    
    set maxTempo(maxTempo: number) {
        maxTempo = +maxTempo;
        this._maxTempo = maxTempo;
    }
    
    get stepTempo(): number {
        return this._stepTempo;
    }
    
    set stepTempo(stepTempo: number) {
        stepTempo = +stepTempo;
        this._stepTempo = stepTempo;
    }
    
    get defaultTempo(): number {
        return this._defaultTempo;
    }
    
    set defaultTempo(defaultTempo: number) {
        defaultTempo = +defaultTempo;
        this._defaultTempo = defaultTempo;
    }

    get stepsConfig(): MusicalCompositionStepConfig[] {
        return this._stepsConfig;
    }
    
    set stepsConfig(stepsConfig: MusicalCompositionStepConfig[]) {
        this._stepsConfig = stepsConfig;
    }
    
    get linesConfig(): MusicalCompositionLineConfig[] {
        return this._linesConfig;
    }
    
    set linesConfig(linesConfig: MusicalCompositionLineConfig[]) {
        this._linesConfig = linesConfig;
    }

    get numerator(): number {
        return this._numerator;
    }
    
    set numerator(numerator: number) {
        numerator = +numerator;
        this._numerator = numerator;
    }
    
    get denominator(): number {
        return this._denominator;
    }
    
    set denominator(denominator: number) {
        denominator = +denominator;
        this._denominator = denominator;
    }
    
    get timeDivisionMetric(): number {
        return this._timeDivisionMetric;
    }
    
    set timeDivisionMetric(timeDivisionMetric: number) {
        timeDivisionMetric = +timeDivisionMetric;
        this._timeDivisionMetric = timeDivisionMetric;
    }
    
    get keySignature(): number {
        return this._keySignature;
    }
    
    set keySignature(keySignature: number) {
        keySignature = +keySignature;
        this._keySignature = keySignature;
    }
    
    get keySignaturesAllowed(): number[] {
        return this._keySignaturesAllowed;
    }
    
    set keySignaturesAllowed(keySignaturesAllowed: number[]) {
        this._keySignaturesAllowed = keySignaturesAllowed;
    }

    get baseKeySignaturesAllowed(): number[] {
        return this._baseKeySignaturesAllowed;
    }
    
    set baseKeySignaturesAllowed(baseKeySignaturesAllowed: number[]) {
        this._baseKeySignaturesAllowed = baseKeySignaturesAllowed;
    }
    
    get showCompositionData(): boolean {
        return this._showCompositionData;
    }
    
    set showCompositionData(showCompositionData: boolean) {
        this._showCompositionData = showCompositionData;
    }

    get mode(): number {
        return this._mode;
    }

    set mode(mode: number) {
        mode = +mode;
        this._mode = mode;
    }

}

export class MusicalCompositionStepConfig {

    //Step Config
    private _relativePath: string;       //Caminho relativo raiz da composição 
    
    //Line Config
    private _linesConfig: MusicalCompositionLinesConfig[];           // 

    private _quantityOfQuarterNote: number;

    constructor(){
        this.linesConfig = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath: string) {
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }
    
    get linesConfig(): MusicalCompositionLinesConfig[] {
        return this._linesConfig;
    }
    
    set linesConfig(linesConfig: MusicalCompositionLinesConfig[]) {
        this._linesConfig = linesConfig;
    }

    get quantityOfQuarterNote(): number {
        return this._quantityOfQuarterNote;
    }

    set quantityOfQuarterNote(quantityOfQuarterNote: number) {
        quantityOfQuarterNote =+ quantityOfQuarterNote;
        this._quantityOfQuarterNote = quantityOfQuarterNote;
    }
}

export class MusicalCompositionLinesConfig {

    //Lines Config
    private _relativePath: string;
    
    //Options Config
    private _optionsConfig: MusicalCompositionOptionConfig[];
    
    constructor(){
        this.optionsConfig = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath: string) {
        this._relativePath = relativePath;
    }
    
    get optionsConfig(): MusicalCompositionOptionConfig[] {
        return this._optionsConfig;
    }
    
    set optionsConfig(optionsConfig: MusicalCompositionOptionConfig[]) {
        this._optionsConfig = optionsConfig;
    }

}

export class MusicalCompositionOptionConfig {

    //Options Config
    private _fileName: string;
    private _baseMusicalInstrumentsAllowed: number[];
    private _musicalInstrumentsAllowed: number[];
    private _defaultMusicalInstrument: number;

    get fileName(): string {
        return this._fileName;
    }
    
    set fileName(fileName: string) {
        if (!fileName || fileName.length <= 0){
            throw new Error("O nome do arquivo não pode ser nulo ou vazio");
        }
        this._fileName = fileName;
    }
    
    get baseMusicalInstrumentsAllowed(): number[] {
        return this._baseMusicalInstrumentsAllowed;
    }
    
    set baseMusicalInstrumentsAllowed(baseMusicalInstrumentsAllowed: number[]) {
        this._baseMusicalInstrumentsAllowed = baseMusicalInstrumentsAllowed;
    }

    get musicalInstrumentsAllowed(): number[] {
        return this._musicalInstrumentsAllowed;
    }
    
    set musicalInstrumentsAllowed(musicalInstrumentsAllowed: number[]) {
        this._musicalInstrumentsAllowed = musicalInstrumentsAllowed;
    }
    
    get defaultMusicalInstrument(): number {
        return this._defaultMusicalInstrument;
    }
    
    set defaultMusicalInstrument(defaultMusicalInstrument: number) {
        defaultMusicalInstrument =+ defaultMusicalInstrument;
        this._defaultMusicalInstrument = defaultMusicalInstrument;
    }

}

export class MusicalCompositionLineConfig {

    private _name: string;
    private _minVolume: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _maxVolume: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _stepVolume: number;              //Passo a passo utilizado na composição
    private _defaultVolume: number;            //Tempo padrão aplicado no inicio da composição

    get name(): string {
        return this._name;
    }
    
    set name(name:string) {
        if (!name || name.length <= 0){
            throw new Error("O nome não pode ser nulo ou vazio");
        }
        this._name = name;
    }
    
    get minVolume(): number {
        return this._minVolume;
    }
    
    set minVolume(minVolume: number) {
        minVolume = +minVolume;
        this._minVolume = minVolume;
    }
    
    get maxVolume(): number {
        return this._maxVolume;
    }
    
    set maxVolume(maxVolume: number) {
        maxVolume = +maxVolume;
        this._maxVolume = maxVolume;
    }
    
    get stepVolume(): number {
        return this._stepVolume;
    }
    
    set stepVolume(stepVolume: number) {
        stepVolume = +stepVolume;
        this._stepVolume = stepVolume;
    }
    
    get defaultVolume(): number {
        return this._defaultVolume;
    }
    
    set defaultVolume(defaultVolume: number) {
        defaultVolume = +defaultVolume;
        this._defaultVolume = defaultVolume;
    }

}