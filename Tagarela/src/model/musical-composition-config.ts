/**/

export class MusicalCompositionConfig {

    // General Config
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

    get relativePath(): string {
        return this._relativePath;
    }
    
    set relativePath(relativePath:string) {
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }
    
    get minTempo(): number {
        return this._minTempo;
    }
    
    set minTempo(minTempo:number) {
        if (!minTempo || minTempo < 1) {
            throw new Error("O tempo mínimo não pode ser nulo ou menor que 1");
        }
        if (this.maxTempo && minTempo > this.maxTempo) {
            throw new Error("O tempo mínimo não pode ser maior que o tempo máximo");
        }
        if (this.defaultTempo && minTempo > this.defaultTempo) {
            throw new Error("O tempo mínimo não pode ser maior que o tempo padrão");
        }
        this._minTempo = minTempo;
    }
    
    get maxTempo(): number {
        return this._maxTempo;
    }
    
    set maxTempo(maxTempo:number) {
        if (!maxTempo || maxTempo < 1) {
            throw new Error("O tempo máximo não pode ser nulo ou menor que 1");
        }
        if (this.minTempo && maxTempo < this.minTempo) {
            throw new Error("O tempo máximo não pode ser menor que o tempo mínimo");
        }
        if (this.defaultTempo && maxTempo < this.defaultTempo) {
            throw new Error("O tempo máximo não pode ser menor que o tempo padrão");
        }
        this._maxTempo = maxTempo;
    }
    
    get stepTempo(): number {
        return this._stepTempo;
    }
    
    set stepTempo(stepTempo:number) {
        if (!stepTempo || stepTempo < 1) {
            throw new Error("O intervalo de escolha de tempo não pode ser nulo ou menor que 1");
        }
        this._stepTempo = stepTempo;
    }
    
    get defaultTempo(): number {
        return this._defaultTempo;
    }
    
    set defaultTempo(defaultTempo:number) {
        if (!defaultTempo || defaultTempo < 1) {
            throw new Error("O tempo padrão não pode ser nulo ou menor que 1");
        }
        if (this.minTempo && defaultTempo < this.minTempo) {
            throw new Error("O tempo padrão não pode ser menor que o tempo mínimo");
        }
        if (this.maxTempo && defaultTempo > this.maxTempo) {
            throw new Error("O tempo padrão não pode ser maior que o tempo máximo");
        }
        this._defaultTempo = defaultTempo;
    }

    get stepsConfig(): MusicalCompositionStepConfig[] {
        return this._stepsConfig;
    }
    
    set stepsConfig(stepsConfig:MusicalCompositionStepConfig[]) {
        if (!stepsConfig) {
            throw new Error("As configurações de passos não podem ser nulas");
        }
        this._stepsConfig = stepsConfig;
    }
    
    get linesConfig(): MusicalCompositionLineConfig[] {
        return this._linesConfig;
    }
    
    set linesConfig(linesConfig:MusicalCompositionLineConfig[]) {
        if (!linesConfig) {
            throw new Error("As configurações de linhas não podem ser nulas");
        }
        this._linesConfig = linesConfig;
    }

}

/*
*/
export class MusicalCompositionStepConfig {

    //Step Config
    private _relativePath: string;       //Caminho relativo raiz da composição 
    
    //Group Config
    private _groupsConfig: MusicalCompositionGroupConfig[];           // 

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
        if (!groupsConfig) {
            throw new Error("As configurações de grupos não podem ser nulas");
        }
        this._groupsConfig = groupsConfig;
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
        if (!relativePath || relativePath.length <= 0){
            throw new Error("O caminho relativo não pode ser nulo ou vazio");
        }
        this._relativePath = relativePath;
    }
    
    get optionsConfig(): MusicalCompositionOptionConfig[] {
        return this._optionsConfig;
    }
    
    set optionsConfig(optionsConfig:MusicalCompositionOptionConfig[]) {
        if (!optionsConfig) {
            throw new Error("As configurações de opções não podem ser nulas");
        }
        this._optionsConfig = optionsConfig;
    }

}

export class MusicalCompositionOptionConfig {

    //Options Config
    private _fileName: string;
    private _musicalInstrumentsAllowed: number[]
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
    
    get musicalInstrumentsAllowed(): number[] {
        return this._musicalInstrumentsAllowed;
    }
    
    set musicalInstrumentsAllowed(musicalInstrumentsAllowed:number[]) {
        if (!musicalInstrumentsAllowed) {
            throw new Error("Os instrumentos musicais permitidos não podem ser nulos");
        }
        this._musicalInstrumentsAllowed = musicalInstrumentsAllowed;
    }
    
    get defaultMusicalInstrument(): number {
        return this._defaultMusicalInstrument;
    }
    
    set defaultMusicalInstrument(defaultMusicalInstrument:number) {
        if (!defaultMusicalInstrument && defaultMusicalInstrument !== 0) {
            throw new Error("O instrumento musical padrão não pode ser nulo");
        }
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
        if ((!minVolume && minVolume !== 0) || minVolume < 0) {
            throw new Error("O volume mínimo não pode ser nulo ou menor que 0");
        }
        if (this.maxVolume && minVolume > this.maxVolume) {
            throw new Error("O volume mínimo não pode ser maior que o volume máximo");
        }
        if (this.defaultVolume && minVolume > this.defaultVolume) {
            throw new Error("O volume mínimo não pode ser maior que o volume padrão");
        }
        this._minVolume = minVolume;
    }
    
    get maxVolume(): number {
        return this._maxVolume;
    }
    
    set maxVolume(maxVolume:number) {
        if ((!maxVolume && maxVolume !== 0) || maxVolume < 0) {
            throw new Error("O volume máximo não pode ser nulo ou menor que 0");
        }
        if (this.minVolume && maxVolume < this.minVolume) {
            throw new Error("O volume máximo não pode ser menor que o volume mínimo");
        }
        if (this.defaultVolume && maxVolume < this.defaultVolume) {
            throw new Error("O volume máximo não pode ser menor que o volume padrão");
        }
        this._maxVolume = maxVolume;
    }
    
    get stepVolume(): number {
        return this._stepVolume;
    }
    
    set stepVolume(stepVolume:number) {
        if (!stepVolume || stepVolume < 1) {
            throw new Error("O intervalo de escolha de volume não pode ser nulo ou menor que 1");
        }
        this._stepVolume = stepVolume;
    }
    
    get defaultVolume(): number {
        return this._defaultVolume;
    }
    
    set defaultVolume(defaultVolume:number) {
        if ((!defaultVolume && defaultVolume !== 0) || defaultVolume < 0) {
            throw new Error("O volume padrão não pode ser nulo ou menor que 0");
        }
        if (this.minVolume && defaultVolume < this.minVolume) {
            throw new Error("O volume padrão não pode ser menor que o volume mínimo");
        }
        if (this.maxVolume && defaultVolume > this.maxVolume) {
            throw new Error("O volume padrão não pode ser maior que o volume máximo");
        }
        this._defaultVolume = defaultVolume;
    }

}