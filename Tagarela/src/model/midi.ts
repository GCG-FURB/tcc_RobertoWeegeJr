import { ConvertionUtil } from "../util/hexa";
import { MidiSpectrum, MidiSpectrumLine, MidiSpectrumNote } from "./midi-spectrum";

export class Midi {

    //constants
    public static MIDI_HEADER_LENGTH: number = 14;
    //
    public static HEADER_START_VALUE: string = 'MThd';

    public static MIDI_HEADER_LENGTH_VALUE: number = 6;
    public static MIDI_HEADER_LENGTH_VALUE_LENGTH: number = 4;

    public static MIDI_TYPE_VALUE_LENGTH: number = 2;
    public static MIDI_TRACK_QUANTITY_VALUE_LENGTH: number = 2;
    public static MIDI_TIME_DIVISION_VALUE_LENGTH: number = 2;

    public static MIDI_TRACK_DESC_LENGTH: number = 8;

    public static TRACK_START_VALUE: string = "MTrk";
    public static MIDI_TRACK_LENGTH_VALUE_LENGTH: number = 4;
    public static MIDI_DELTA_TIME_MAX_LENGTH: number = 4;

    //validations 
    public static LOWER_ALLOWED_TEMPO: number = 1;
    public static HIGHEST_ALLOWED_TEMPO: number = 500;

    public static LOWER_ALLOWED_VOLUME: number = 0;
    public static HIGHEST_ALLOWED_VOLUME: number = 200;

    public static LOWER_QUANTITY_OF_QUARTER_NOTE: number = 1;
    public static HIGHEST_QUANTITY_OF_QUARTER_NOTE: number = 4000;

    private _midiType: MidiType;
    private _numberOfTracks: number;
    private _timeDivision: MidiTimeDivision;
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

    get timeDivision(): MidiTimeDivision {
        return this._timeDivision;
    }

    set timeDivision(timeDivision: MidiTimeDivision) {
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

        let aa = <MidiTimeDivisionMetrical> this.timeDivision
        let bb = <MidiTimeDivisionMetrical>  midiToConcatenate.timeDivision

        if (aa.timeDivisionType != bb.timeDivisionType || 
            aa.metric != bb.metric) {
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
        
        let midiChannels: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', 'a', 'b', 'c', 'd', 'e', 'f'];
        let midiChannelIndex: number = 0 
        let channelChanged: boolean;

        for (let midi of midis) {
            for (let midiTrack of midi.midiTracks) {
                channelChanged = midiTrack.changeMidiChannel(midiChannels[midiChannelIndex]);
                if (channelChanged) {
                    midiChannelIndex++;
                    if (midiChannelIndex >= midiChannels.length){
                        midiChannelIndex = 0;
                    }
                }
                this.midiTracks.push(midiTrack);
                this.numberOfTracks++
            }
        }
        
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

    public getAllUsedChannels(): string[] {
        let channels: string[] = [];
        for (let track of this.midiTracks) {
            channels = channels.concat(track.getAllUsedChannels());
        }
        return channels;
    }

    public generateMidiSpectrum(externalMidiMinNote: number, externalMidiMaxNote: number): MidiSpectrum {
        
        let midiSpectrum: MidiSpectrum = new MidiSpectrum();

        let midiTotalDeltaTime: number = 0;
        let midiMinNote: number = +externalMidiMinNote < 0 ? 128 : +externalMidiMinNote;
        let midiMaxNote: number = +externalMidiMaxNote < 0 ? 0 : +externalMidiMaxNote;

        let spectrumLineMap: Map<number, MidiSpectrumLine> = new Map();
        let spectrumNoteMap: Map<number, number> = new Map();

        for (let midiEvent of this.midiTracks[0].midiEvents) {
            midiTotalDeltaTime += midiEvent.deltaTimeNumber; 
            
            if (midiEvent.midiEventData.length >= 1 && midiEvent.midiEventData.substr(0, 1) == '9') {
                let note: number = ConvertionUtil.convertHexStringToNumber(midiEvent.midiEventData.substr(2, 2));
                if (note < midiMinNote) {
                    midiMinNote = note;
                }
                if (note > midiMaxNote) {
                    midiMaxNote = note;
                }
                spectrumNoteMap.set(note, midiTotalDeltaTime);

            } else {

                if (midiEvent.midiEventData.length >= 1 && midiEvent.midiEventData.substr(0, 1) == '8') {
                    
                    let note: number = ConvertionUtil.convertHexStringToNumber(midiEvent.midiEventData.substr(2, 2));
                    
                    if (!spectrumLineMap.has(note)){
                        let spectrumLine: MidiSpectrumLine = new MidiSpectrumLine();
                        spectrumLine.noteValue = note;
                        spectrumLineMap.set(note, spectrumLine);
                    }

                    let spectrumNote: MidiSpectrumNote = new MidiSpectrumNote();
                    spectrumNote.x = spectrumNoteMap.get(note);
                    spectrumNote.width = midiTotalDeltaTime - spectrumNote.x;
                    spectrumLineMap.get(note).notes.push(spectrumNote);
                    
                }
            }
        }

        //tamanho em x
        midiSpectrum.width = midiTotalDeltaTime;
        //tamanho em y
        midiSpectrum.height = midiMaxNote - midiMinNote;


        for (let i = midiMinNote; i <= midiMaxNote; i++) {
            
            if (spectrumLineMap.has(i)) {
                midiSpectrum.lines.push(spectrumLineMap.get(i));
            } else {
                let spectrumLine: MidiSpectrumLine = new MidiSpectrumLine();
                spectrumLine.noteValue = i;
                midiSpectrum.lines.push(spectrumLine);
            }
            
        }

        return midiSpectrum;

    }


    public getNoteLimits(): number[] {
        let midiMinNote: number = 128;
        let midiMaxNote: number = 0;

        for (let midiEvent of this.midiTracks[0].midiEvents) {
            if (midiEvent.midiEventData.length >= 1 && midiEvent.midiEventData.substr(0, 1) == '9') {
                let note: number = ConvertionUtil.convertHexStringToNumber(midiEvent.midiEventData.substr(2, 2));
                if (note < midiMinNote) {
                    midiMinNote = note;
                }
                if (note > midiMaxNote) {
                    midiMaxNote = note;
                }
            }
        }

        return [midiMinNote, midiMaxNote]

    }

    public getEventByType(dataType: MidiEventDataType){
        let midiEvents: MidiEvent[] = []
        for(let midTrack of this.midiTracks) {
            midiEvents = midiEvents.concat(midTrack.getEventByType(dataType));
        }
        return midiEvents;
    }

}

export class MidiTimeDivision {
    
    private _timeDivisionType: MidiTimeDivisionType;
    
    constructor(timeDivisionType: MidiTimeDivisionType){
        this.timeDivisionType = timeDivisionType;
    }

    get timeDivisionType(): MidiTimeDivisionType {
        return this._timeDivisionType;
    }
    
    set timeDivisionType(timeDivisionType: MidiTimeDivisionType) {
        this._timeDivisionType = timeDivisionType;
    }

}

export class MidiTimeDivisionMetrical extends MidiTimeDivision {
    
    private _metric: number;

    constructor(metric: number) {
        super(MidiTimeDivisionType.METRICAL_TYPE);
        this.metric = metric;
    }

    get metric(): number {
        return this._metric;
    }
    
    set metric(metric: number) {
        this._metric = metric;
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
        for (let channel of this.getAllUsedChannels()) {
            if (channel != '9') {
                this.midiEvents.unshift(new MidiEvent('00', 0, MidiEventType.MIDI_EVENT, 'c' + channel + 
                                                                                    ConvertionUtil.convertNumberToHexString(instrumentNumber, 1), false));
            }
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
                let originalVolume = ConvertionUtil.convertHexStringToNumber(event.midiOriginalEventData.substring(4)); 
                let newVolume = Math.round(volume * originalVolume / 100);
                
                //validar limites, o que fazer????
                event.midiEventData = event.midiEventData.substring(0, 4) 
                                    + ConvertionUtil.convertNumberToHexString((newVolume > 127 ? 127 : newVolume), 1)
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

    public getAllUsedChannels():string[] {
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

    public changeMidiChannel(midiChannel: string): boolean {
        let midiChannelChanged: boolean = false;
        for (let event of this.midiEvents) {
            if (event && event.midiEventData && event.midiEventData.length > 1 && (event.midiEventData.substr(0, 1) == '8' || 
                                                        event.midiEventData.substr(0, 1) == '9' || event.midiEventData.substr(0, 1) == 'c')) {
            
                if (!(event.midiEventData.substr(1, 1) == '9')) {
                    event.midiEventData = event.midiEventData.substring(0, 1) 
                                        + midiChannel
                                        + event.midiEventData.substring(2);
                    midiChannelChanged = true;
                }
            }
        }
        return midiChannelChanged;    
    }

    public getEventByType(dataType: MidiEventDataType){
        let midiEvents: MidiEvent[] = []
        for(let midiEvent of this.midiEvents) {
            if (midiEvent.isOfType(dataType))
                midiEvents.push(midiEvent);
        }
        return midiEvents;
    }

}

export class MidiEvent {

    public static NOTE_OFF_FIRST_CHAR: string = '8'; 
    public static NOTE_OFF_EVENT_LENGTH: number = 3;
    public static NOTE_ON_FIRST_CHAR: string = '9';
    public static NOTE_ON_EVENT_LENGTH: number = 3;
    public static A_EVENT_FIRST_CHAR: string = 'a';
    public static A_EVENT_EVENT_LENGTH: number = 3;
    public static B_EVENT_FIRST_CHAR: string = 'b';
    public static B_EVENT_EVENT_LENGTH: number = 3;
    public static C_EVENT_FIRST_CHAR: string = 'c';
    public static C_EVENT_EVENT_LENGTH: number = 2;
    public static D_EVENT_FIRST_CHAR: string = 'd';
    public static D_EVENT_EVENT_LENGTH: number = 2;
    public static E_EVENT_FIRST_CHAR: string = 'e';
    public static E_EVENT_EVENT_LENGTH: number = 3;
    public static F_EVENT_FIRST_CHAR: string = 'f';
    public static SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F0: string = 'f0'; 
    public static SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F7: string = 'f7';
    public static META_EVENT_FIRST_BYTE: string = 'ff';
    public static META_EVENT_TEMPO_TYPE_BYTE: string = '51';
    public static META_EVENT_TIME_SIGNATURE_TYPE_BYTE: string = '58';
    public static META_EVENT_KEY_SIGNATURE_TYPE_BYTE: string = '59';
    public static META_EVENT_END_OF_TRACK_TYPE_BYTE: string = '2f';


    private _deltaTime: string;
    private _deltaTimeNumber: number;
    private _midiEventType: MidiEventType;
    private _midiEventData: string;
    private _midiOriginalEventData: string;
    private _loadEvent: boolean;

    constructor(deltaTime: string, deltaTimeNumber: number, midiEventType: MidiEventType, midiEventData: string, loadEvent: boolean){
        this.deltaTime = deltaTime;
        this.deltaTimeNumber = deltaTimeNumber;
        this.midiEventType = midiEventType;
        this.midiEventData = midiEventData;
        this._midiOriginalEventData = midiEventData;
        this.loadEvent = loadEvent;
    }

    get deltaTime(): string{
        return this._deltaTime;
    }
    
    set deltaTime(deltaTime: string){
        this._deltaTime = deltaTime;
    }

    get deltaTimeNumber(): number{
        return this._deltaTimeNumber;
    }
    
    set deltaTimeNumber(deltaTimeNumber: number){
        this._deltaTimeNumber = deltaTimeNumber;
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

    get midiOriginalEventData(): string{
        return this._midiOriginalEventData;
    }
    
    set midiOriginalEventData(midiOriginalEventData: string){
        this._midiOriginalEventData = midiOriginalEventData;
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

    public isOfType(dataType: MidiEventDataType): boolean {
        switch(dataType){
            case MidiEventDataType.TEMPO:
                return this.midiEventData.substr(0, 4) == 'ff51';
            case MidiEventDataType.TIME_SIGNATURE:
                return this.midiEventData.substr(0, 4) == 'ff58'; 
            case MidiEventDataType.KEY_SIGNATURE:
                return this.midiEventData.substr(0, 4) == 'ff59';
            case MidiEventDataType.END_OF_TRACK:
                return this.midiEventData.substr(0, 4) == 'ff2f';
            case MidiEventDataType.NOTE_ON_OR_OFF:
                let firstChar: string = this.midiEventData.substr(0, 1) 
                return firstChar == '8' || firstChar == '9'
        }
        return false;
    }

    public getMidiHexChannelOfNoteOnOrOff() {
        if (this.isOfType(MidiEventDataType.NOTE_ON_OR_OFF)) {
            return this.midiEventData.substr(1, 1);
        }
        return null; 
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

    public static DRUMS_MIDI_CHANNELS: string[] = ['9']

}

export enum MidiType {
    TYPE_0=0, TYPE_1=1, TYPE_2=2 
}

export enum MidiTimeDivisionType {
    METRICAL_TYPE=0, TIME_CODE_BASED=1
}


export enum MidiEventType {
    MIDI_EVENT, SYSEX_EVENT, META_EVENT
}

export enum MidiEventDataType {
    TEMPO, TIME_SIGNATURE, KEY_SIGNATURE, END_OF_TRACK, NOTE_ON_OR_OFF
}


