import { ConvertionUtil } from "./hexa";

export class Midi {

    private _midiType: MidiType;
    private _numberOfTracks: number;
    private _timeDivision: string;
    private _midiTracks: MidiTrack[];

    get midiType(): MidiType {
        return this._midiType;
    }

    set midiType(midiType: MidiType) {
        this._midiType = midiType;
    }

    get numberOfTracks(): number {
        return this._numberOfTracks;
    }

    set numberOfTracks(numberOfTracks: number) {
        this._numberOfTracks = numberOfTracks;
    }

    get timeDivision(): string {
        return this._timeDivision;
    }

    set timeDivision(timeDivision: string) {
        this._timeDivision = timeDivision;
    }

    get midiTracks(): MidiTrack[] {
        return this._midiTracks;
    }

    set midiTracks(midiTracks: MidiTrack[]) {
        this._midiTracks = midiTracks;
    }

    public cloneMidi(): Midi{
        let midi = new Midi();
        midi.midiType = this.midiType;
        midi.numberOfTracks = this.numberOfTracks;
        midi.timeDivision = this.timeDivision;
        midi.midiTracks = []; 
        
        for (let midiTrack of this.midiTracks) {
            let newMidiTrack:MidiTrack = new MidiTrack()
            newMidiTrack.midiEvents = Object.assign([], midiTrack.midiEvents);
            midi.midiTracks.push(newMidiTrack);
        }
        return midi;
    }

    public concatenateMidi(midiToConcatenate: Midi) {
        if (this.midiType != midiToConcatenate.midiType) {
            throw Error('Erro');
        }
        if (this.numberOfTracks != midiToConcatenate.numberOfTracks) {
            throw Error('Erro');
        }        
        if (this.timeDivision != midiToConcatenate.timeDivision) {
            throw Error('Erro');
        }        
        for (let i = 0; i < this.midiTracks.length; i++) {
            this.concatenateMidiTrack(i, midiToConcatenate.midiTracks[i]);
        }
    }

    private concatenateMidiTrack(trackIndex: number, trackToConcatenate: MidiTrack) {
        this.midiTracks[trackIndex].midiEvents.pop();
        trackToConcatenate.applyNoteTranspose(this.midiTracks[trackIndex].getDecimalKeySignature());
        for (let midiEvent of trackToConcatenate.midiEvents) {
            this.midiTracks[trackIndex].midiEvents.push(midiEvent)
        }
    }

    public generateMidiType1(midis: Midi[]) {
        this.midiType = MidiType.TYPE_1;
        this.midiTracks = [];
        this.timeDivision = midis[0].timeDivision;
        this.numberOfTracks = 0;

        for (let midi of midis) {
            //validar
            this.midiTracks.push(midi.midiTracks[0]);
            this.numberOfTracks++;
        }
    }
    
    public setupMidiFromFile(binaryString: string) {
        if (binaryString.substr(0, 4) != 'MThd') {
            throw Error('Midi file must start with "MThd" header indication');
        }
        
        let fileMidiType: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(8, 2));
        if (fileMidiType > 0 || fileMidiType < 0) {
            throw Error('Midi file type must be 0');
        }
        this.midiType = fileMidiType;

        let fileNumberOfTracks: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(10, 2));
        this.numberOfTracks = fileNumberOfTracks;

        let fileTimeDividion: string = ConvertionUtil.convertBinaryStringToHexString(binaryString.substr(12, 2));
        this.timeDivision = fileTimeDividion;

        if (binaryString.substr(14, 4) != 'MTrk') {
            throw Error('Midi file track must start with "MTrk" header indication');
        }
        this.midiTracks = [];

        let midiTrack: MidiTrack = new MidiTrack();
        this.midiTracks.push(midiTrack);
        let deltaTime: number = 0;

        for (let i = 22; i < binaryString.length;) {

            //deltaTime
            let deltaTimeStart: number = i;
            let deltaTimeLength: number = 1;

            while (!ConvertionUtil.isLastDeltaTimeByte(binaryString.charAt(deltaTimeStart + deltaTimeLength - 1))) {
                deltaTimeLength++;
                //lança exceção se passar de 4
            }

            //let teste = binaryString.substr(deltaTimeStart, deltaTimeLength);

            //calcula delta time
            deltaTime += ConvertionUtil.calculateDeltaTime(binaryString.substr(deltaTimeStart, deltaTimeLength));

            i += deltaTimeLength;

            //create event or sum delta time
            let midiEvent: MidiEvent = MidiEvent.getMidiEventData(deltaTime, binaryString.substr(i));

            //add event to track
            if (midiEvent.loadEvent){
                deltaTime = 0;
                midiTrack.addMidiEvent(midiEvent);
            } 
            
            i += midiEvent.getDataLength();

        }
    }

    public getBinaryString(): string {
        
        let midiHeaderString: string;
        let midiTracksString: string = '';
        let midiEndBinaryString: string = '';

        let midiType: string = this.midiType + '';
        while(midiType.length < 4) {
            midiType = '0' + midiType;
        }

        let trackQuantity: string = this.midiTracks.length + '';
        while(trackQuantity.length < 4) {
            trackQuantity = '0' + trackQuantity;
        }

        midiHeaderString = 'MThd' + ConvertionUtil.convertHexStringToBinararyString('00000006'       
        + midiType + trackQuantity + this.timeDivision);

        for (let midiTrack of this.midiTracks) {
            midiTracksString += 'MTrk';
            midiEndBinaryString = '';

            for (let midiEvent of midiTrack.midiEvents) {
                midiEndBinaryString += midiEvent.deltaTime + midiEvent.midiEventData;
            }
            midiEndBinaryString = ConvertionUtil.convertHexStringToBinararyString(midiEndBinaryString);
            let midiSizeBinaryString: string = ConvertionUtil.convertNumberToBinararyString(midiEndBinaryString.length, 4);
            midiTracksString += midiSizeBinaryString + midiEndBinaryString;
        }
       
        return midiHeaderString + midiTracksString;
    }

    public getMidiDescription(): string {
 
    let description: string = `Midi Type: ${this.midiType}
Number of Tracks: ${this.midiType}
Time division: ${this.timeDivision}
Midi Events:`

    for (let midiTrack of this.midiTracks) {
        for (let midiEvent of midiTrack.midiEvents) {
            description += `    DeltaTime: ${midiEvent.deltaTime} - Data: ${midiEvent.midiEventData}`;
        }
    }
    return description;
    }

    public applyNoteTranspose(newKeySignatue: number){
        for (let midiTrack of this.midiTracks) {
            midiTrack.applyNoteTranspose(newKeySignatue);
        }
    }

    public applyTempoChange(newTempo: number){
        for (let midiTrack of this.midiTracks) {
            midiTrack.applyTempoChange(newTempo);
        }
    }

    public applyInstrumentChange(instrumentNumber: number){
        for (let midiTrack of this.midiTracks) {
            midiTrack.applyInstrumentChange(instrumentNumber);
        }
    }
    public applyVolumeChange(volume: number){
        for (let midiTrack of this.midiTracks) {
            midiTrack.applyVolumeChange(volume);
        }
    }


}

export class MidiTrack {
    private _midiEvents: MidiEvent[];

    constructor() {
        this.midiEvents = [];
    }

    get midiEvents(): MidiEvent[]{
        return this._midiEvents;
    }
    
    set midiEvents(midiEvents: MidiEvent[]){
        this._midiEvents = midiEvents;
    }

    public addMidiEvent(midiEvent: MidiEvent){
        this.midiEvents.push(midiEvent);
    }

    public applyTempoChange(newTempo: number) {
        this.changeTempo(newTempo);
    }

    public applyNoteTranspose(newKeySignatue: number){
        if (!(newKeySignatue >= -7 && newKeySignatue <=7)) {
            throw Error('Wrong format')
        }
        let actualKeySignature: number = this.getDecimalKeySignature();

        if (newKeySignatue - actualKeySignature != 0) {
            let conversionFactor = MidiConstants.KEY_SIGNATURE_CONVERSION_VECTOR.indexOf(newKeySignatue)
                                 - MidiConstants.KEY_SIGNATURE_CONVERSION_VECTOR.indexOf(actualKeySignature);
            
            this.changeKeySignatue((newKeySignatue >= 0 ? newKeySignatue : newKeySignatue + 256), conversionFactor)
        }

    }
    
    public getDecimalKeySignature(): number {
        let actualKeySignature: number = ConvertionUtil.convertHexStringToNumber(this.getActualKeySignature());
        if ( !(actualKeySignature >= 0 && actualKeySignature <= 7) &&
             !(actualKeySignature >= 249 && actualKeySignature <= 255) ) {
                throw Error('Wrong format')
        }
        //Tratativa para Key Signatures negativos 
        if (actualKeySignature >= 249) {
            actualKeySignature = (256 - actualKeySignature) * -1;
        }
        return actualKeySignature;
    }



    public changeKeySignatue(newKeySignatue: number, conversionFator: number){
        for (let event of this.midiEvents) {
            if (event.midiEventData) {
                if (event.midiEventData.length >= 1 && (event.midiEventData.substr(0, 1) == '8' || 
                                                        event.midiEventData.substr(0, 1) == '9')) {
                    if (event.midiEventData.length != 6) {
                        throw Error ('format error');
                    }
                    let noteNumber: number = ConvertionUtil.convertHexStringToNumber(event.midiEventData.substring(2, 4));
                    //validar limites, o que fazer????
                    noteNumber += conversionFator;
                    event.midiEventData = event.midiEventData.substring(0, 2) 
                                        + ConvertionUtil.convertNumberToHexString(noteNumber, 1)
                                        + event.midiEventData.substring(4);
                } else if (event.midiEventData.length >= 4 && event.midiEventData.substr(0, 4) == MidiConstants.KEY_SIGNATURE_EVENT_PREFIX) {
                    //validar tamanho
                    event.midiEventData = event.midiEventData.substring(0, 8) 
                                        + ConvertionUtil.convertNumberToHexString(newKeySignatue, 1)
                }
            }
        }
    }

    public changeTempo(newTempo: number){
        for (let event of this.midiEvents) {
            if (event.midiEventData) {
                 if (event.midiEventData.length >= 4 && event.midiEventData.substr(0, 4) == MidiConstants.TEMPO_EVENT_PREFIX) {
                    //validar tamanho
                    event.midiEventData = event.midiEventData.substring(0, 6) 
                                        + ConvertionUtil.convertNumberToHexString(newTempo, 3)
                }
            }
        }
    }

    public getEventByEventDataPrefix(eventDataPrefix: string): MidiEvent {
        for (let event of this.midiEvents) {
            if (event.midiEventData 
                && event.midiEventData.length >= eventDataPrefix.length
                && event.midiEventData.substr(0, eventDataPrefix.length) == eventDataPrefix) {
                    return event;
            }
        }
        return null;
    }

    public getActualKeySignature(): string {
        let midiEvent: MidiEvent = this.getEventByEventDataPrefix(MidiConstants.KEY_SIGNATURE_EVENT_PREFIX);
        if (!midiEvent || !midiEvent.midiEventData || midiEvent.midiEventData.length != 10) {
            throw Error('formato errado') 
        }
        return midiEvent.midiEventData.substring(8);
    }

    public applyInstrumentChange(instrumentNumber: number){
        this.removeAllInstrumentEvents();
        for (let channel of this.findAllUsedChannels()) {
            this.midiEvents.unshift(new MidiEvent('00', MidiEventType.MIDI_EVENT, 'c' + channel + 
                                                                                   ConvertionUtil.convertNumberToHexString(instrumentNumber, 1), false));
        }
    }

    public applyVolumeChange(volume: number){
        this.removeAllVolumeEvents();
        for (let event of this.midiEvents) {
        /*    this.midiEvents.unshift(new MidiEvent('00', MidiEventType.MIDI_EVENT, 'b' + channel + '07' +
                                                                                   ConvertionUtil.convertNumberToHexString(volume, 1), false));
        */
            if (event.midiEventData.length >= 1 && event.midiEventData.substr(0, 1) == '9') {
                    if (event.midiEventData.length != 6) {
                        throw Error ('format error');
                    }
                    //validar limites, o que fazer????
                    event.midiEventData = event.midiEventData.substring(0, 4) 
                                        + ConvertionUtil.convertNumberToHexString(volume, 1)
                }
        }
    }

    private removeAllInstrumentEvents() {
        for (let event of this.midiEvents) {
            if (event && event.midiEventData && event.midiEventData.length > 1 && event.midiEventData.substr(0, 1) == 'c') {
                this.midiEvents.splice(this.midiEvents.indexOf(event), 1);
            }
        }       
    }

    private removeAllVolumeEvents() {
        for (let event of this.midiEvents) {
            if (event && event.midiEventData && event.midiEventData.length > 4 && event.midiEventData.substr(0, 1) == 'b' && event.midiEventData.substr(2, 2) == '07') {
                this.midiEvents.splice(this.midiEvents.indexOf(event), 1);
            }
        }       
    }

    private findAllUsedChannels():string[] {
        let chanels: string[] = [];
        for (let event of this.midiEvents) {
            if (event && event.midiEventData && event.midiEventData.length > 1 && (event.midiEventData.substr(0, 1) == '8' || 
                                                        event.midiEventData.substr(0, 1) == '9')) {
                if (event.midiEventData.length != 6) {
                    throw Error ('format error');
                }
                if (chanels.indexOf(event.midiEventData.substr(1, 1)) < 0) {
                    chanels.push(event.midiEventData.substr(1, 1))
                }
            }
        }        
        return chanels;
    }
}

export class MidiEvent {
    private _deltaTime: string;
    private _midiEventType: MidiEventType;
    private _midiEventData: string;
    private _loadEvent: boolean;

    constructor(deltaTime: string, midiEventType: MidiEventType, midiEventData: string, loadEvent: boolean){
        this.deltaTime = deltaTime;
        this.midiEventType = midiEventType;
        this.midiEventData = midiEventData;
        this.loadEvent = loadEvent;
    }

    get deltaTime(): string{
        return this._deltaTime;
    }
    
    set deltaTime(deltaTime: string){
        this._deltaTime = deltaTime;
    }

    get midiEventType(): MidiEventType{
        return this._midiEventType;
    }
    
    set midiEventType(midiEventType: MidiEventType){
        this._midiEventType = midiEventType;
    }

    get midiEventData(): string{
        return this._midiEventData;
    }
    
    set midiEventData(midiEventData: string){
        this._midiEventData = midiEventData;
    }

    get loadEvent(): boolean{
        return this._loadEvent;
    }
    
    set loadEvent(loadEvent: boolean){
        this._loadEvent = loadEvent;
    }

    public getDataLength(){
        return this.midiEventData.length / 2;
    }

    public static getMidiEventData(deltaTime: number, midiData: string): MidiEvent {
        let firstEventByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 1)); 
        switch (firstEventByte.charAt(0)) {
            case '8':
                return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,true);
            case '9':
                return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,true);
            case 'a':
                return new MidiEvent(''
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,false);    
            case 'b':
                return new MidiEvent(''
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,false); 
            case 'c':
                return new MidiEvent(''
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2))
                                    ,false); 
            case 'd':
                return new MidiEvent(''
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2))
                                    ,false); 
            case 'e':
                return new MidiEvent(''
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,false); 
            case 'f':
                if (firstEventByte == 'f0' || firstEventByte == 'f7') {
                    return new MidiEvent(''
                                        ,MidiEventType.SYSEX_EVENT
                                        ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2 + ConvertionUtil.convertBinaryStringToNumber(midiData.charAt(1))))
                                        ,false);

                }
                if (firstEventByte == 'ff') {
                    let eventTypeByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.charAt(1)); 
                    return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                        ,MidiEventType.META_EVENT
                                        ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3 + ConvertionUtil.convertBinaryStringToNumber(midiData.charAt(2))))
                                        ,eventTypeByte == '51' || eventTypeByte == '58' || eventTypeByte == '59' || eventTypeByte == '2f');
                }
                throw Error('Não mapeado...')
            default:
                throw Error('Não mapeado...')
        }
       //return null;
    }
    
}

export class MidiConstants {
    public static NOTE_OFF_EVENT_PREFIX: string = "8";
    public static NOTE_ON_EVENT_PREFIX: string = "9";
    public static KEY_SIGNATURE_EVENT_PREFIX: string = "ff59";
    public static TEMPO_EVENT_PREFIX: string = "ff51";
    public static KEY_SIGNATURE_CONVERSION_VECTOR: number[] = 
                    [     0 //Dó  
                        , 7 //Dó# 
                        , 2 //Ré  
                        ,-3 //Ré# 
                        , 4 //Mi  
                        ,-1 //Fá 
                        , 6 //Fa# 
                        , 1 //Sol 
                        ,-4 //Sol#
                        , 3 //Lá  
                        ,-2 //Lá# 
                        , 5 //Si  
                    ];

}

enum MidiType {
    TYPE_0=0, TYPE_1=1, TYPE_2=2 
}

enum MidiEventType {
    MIDI_EVENT, SYSEX_EVENT, META_EVENT
}