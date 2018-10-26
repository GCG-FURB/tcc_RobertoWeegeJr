export class MusicalCompositionConfig {

    private _numerator;
    public get numerator() {
        return this._numerator;
    }
    public set numerator(value) {
        this._numerator = value;
    }
    private _denominator;
    public get denominator() {
        return this._denominator;
    }
    public set denominator(value) {
        this._denominator = value;
    }
    private _timeDivisionMetric;
    public get timeDivisionMetric() {
        return this._timeDivisionMetric;
    }
    public set timeDivisionMetric(value) {
        this._timeDivisionMetric = value;
    }
    private _mode;
    public get mode() {
        return this._mode;
    }
    public set mode(value) {
        this._mode = value;
    }
    private _keySignature;
    public get keySignature() {
        return this._keySignature;
    }
    public set keySignature(value) {
        this._keySignature = value;
    }
    private _baseKeySignaturesAllowed; 
    public get baseKeySignaturesAllowed() {
        return this._baseKeySignaturesAllowed;
    }
    public set baseKeySignaturesAllowed(value) {
        this._baseKeySignaturesAllowed = value;
    }
    private _keySignaturesAllowed;
    public get keySignaturesAllowed() {
        return this._keySignaturesAllowed;
    }
    public set keySignaturesAllowed(value) {
        this._keySignaturesAllowed = value;
    }

    private _showCompositionData: boolean;
    public get showCompositionData(): boolean {
        return this._showCompositionData;
    }
    public set showCompositionData(value: boolean) {
        this._showCompositionData = value;
    }

    // General Config
    private _baseFileSystem: string;           //Caminho relativo raiz da composição 
    private _relativePath: string;           //Caminho relativo raiz da composição 
    private _minTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _maxTempo: number;               //Tempo minimo permitido para a composição (parâmatro utilizado em xxx)
    private _stepTempo: number;              //Passo a passo utilizado na composição
    private _defaultTempo: number;            //Tempo padrão aplicado no inicio da composição

    //Step config
    private _stepsConfig: MusicalCompositionStepConfig[];             //sdfsdfsdfsdf

    //Line config
    private _linesConfig: MusicalCompositionLineConfig[];

    constructor(){
        this.stepsConfig = [];
        this.linesConfig = [];
    }

    get baseFileSystem(): string {
        return this._baseFileSystem;
    }
    
    set baseFileSystem(baseFileSystem:string) {
        this._baseFileSystem = baseFileSystem;
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        this._relativePath = relativePath;
    }
    
    get minTempo(): number {
        return this._minTempo;
    }
    
    set minTempo(minTempo:number) {
        this._minTempo = minTempo;
    }
    
    get maxTempo(): number {
        return this._maxTempo;
    }
    
    set maxTempo(maxTempo:number) {
        this._maxTempo = maxTempo;
    }
    
    get stepTempo(): number {
        return this._stepTempo;
    }
    
    set stepTempo(stepTempo:number) {
        this._stepTempo = stepTempo;
    }
    
    get defaultTempo(): number {
        return this._defaultTempo;
    }
    
    set defaultTempo(defaultTempo:number) {
        this._defaultTempo = defaultTempo;
    }

    get stepsConfig(): MusicalCompositionStepConfig[] {
        return this._stepsConfig;
    }
    
    set stepsConfig(stepsConfig:MusicalCompositionStepConfig[]) {
        this._stepsConfig = stepsConfig;
    }
    
    get linesConfig(): MusicalCompositionLineConfig[] {
        return this._linesConfig;
    }
    
    set linesConfig(linesConfig:MusicalCompositionLineConfig[]) {
        this._linesConfig = linesConfig;
    }

}

export class MusicalCompositionStepConfig {

    //Step Config
    private _relativePath: string;       //Caminho relativo raiz da composição 
    
    //Group Config
    private _groupsConfig: MusicalCompositionGroupConfig[];           // 

    private _quantityOfQuarterNote: number;

    constructor(){
        this.groupsConfig = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }
    
    get groupsConfig(): MusicalCompositionGroupConfig[] {
        return this._groupsConfig;
    }
    
    set groupsConfig(groupsConfig:MusicalCompositionGroupConfig[]) {
        this._groupsConfig = groupsConfig;
    }

    get quantityOfQuarterNote(): number {
        return this._quantityOfQuarterNote;
    }

    set quantityOfQuarterNote(quantityOfQuarterNote: number) {
        this._quantityOfQuarterNote = quantityOfQuarterNote;
    }
}

export class MusicalCompositionGroupConfig {

    //Group Config
    private _relativePath: string;
    
    //Options Config
    private _optionsConfig: MusicalCompositionOptionConfig[];
    
    constructor(){
        this.optionsConfig = [];
    }

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        this._relativePath = relativePath;
    }
    
    get optionsConfig(): MusicalCompositionOptionConfig[] {
        return this._optionsConfig;
    }
    
    set optionsConfig(optionsConfig:MusicalCompositionOptionConfig[]) {
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
    
    set fileName(fileName:string) {
        if (!fileName || fileName.length <= 0){
            throw new Error("O nome do arquivo não pode ser nulo ou vazio");
        }
        this._fileName = fileName;
    }
    
    get baseMusicalInstrumentsAllowed(): number[] {
        return this._baseMusicalInstrumentsAllowed;
    }
    
    set baseMusicalInstrumentsAllowed(baseMusicalInstrumentsAllowed:number[]) {
        this._baseMusicalInstrumentsAllowed = baseMusicalInstrumentsAllowed;
    }

    get musicalInstrumentsAllowed(): number[] {
        return this._musicalInstrumentsAllowed;
    }
    
    set musicalInstrumentsAllowed(musicalInstrumentsAllowed:number[]) {
        this._musicalInstrumentsAllowed = musicalInstrumentsAllowed;
    }
    
    get defaultMusicalInstrument(): number {
        return this._defaultMusicalInstrument;
    }
    
    set defaultMusicalInstrument(defaultMusicalInstrument:number) {
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
    
    set minVolume(minVolume:number) {
        this._minVolume = minVolume;
    }
    
    get maxVolume(): number {
        return this._maxVolume;
    }
    
    set maxVolume(maxVolume:number) {
        this._maxVolume = maxVolume;
    }
    
    get stepVolume(): number {
        return this._stepVolume;
    }
    
    set stepVolume(stepVolume:number) {
        this._stepVolume = stepVolume;
    }
    
    get defaultVolume(): number {
        return this._defaultVolume;
    }
    
    set defaultVolume(defaultVolume:number) {
        this._defaultVolume = defaultVolume;
    }

}