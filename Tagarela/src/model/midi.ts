export class Midi {

    //constants
    public static KEY_SIGNATURES_ARRAY: number[] = [-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7];
    public static KEY_SIGNATURE_CONVERSION_VECTOR: number[] = [11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1]

    public static DRUMS_MIDI_CHANNELS: string[] = ['9']

    //validations 
    public static LOWER_ALLOWED_TEMPO: number = 1;
    public static HIGHEST_ALLOWED_TEMPO: number = 500;

    public static LOWER_ALLOWED_VOLUME: number = 0;
    public static HIGHEST_ALLOWED_VOLUME: number = 200;

    public static LOWER_QUANTITY_OF_QUARTER_NOTE: number = 1;
    public static HIGHEST_QUANTITY_OF_QUARTER_NOTE: number = 4000;

    public static MIN_MUSICAL_INSTRUMENT_NUMBER: number = 0;
    public static MAX_MUSICAL_INSTRUMENT_NUMBER: number = 127;
    public static DRUM_INSTRUMENT_NUMBER: number = -1;

    public static MIN_KEY_SIGNATURE_NUMBER: number = -7;
    public static MAX_KEY_SIGNATURE_NUMBER: number = 7;

    public static MIN_NOTE_NUMBER: number = 0;
    public static MAX_NOTE_NUMBER: number = 127;

    public static MIN_TEMPO_NUMBER: number = 1;
    public static MAX_TEMPO_NUMBER: number = 16777215;
    
    public static MIN_VOLUME_NUMBER: number = 0;
    public static MAX_VOLUME_NUMBER: number = 127;

    public static OCTAVE_SEMI_TOM_QUANTITY: number = 12;

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

    public concatenateMidi(midiToConcatenate: Midi) {

        if (this.midiType != midiToConcatenate.midiType)
            throw Error('O tipo de midi deve ser o mesmo para realizar a concatenação.');

        if (this.numberOfTracks != midiToConcatenate.numberOfTracks)
            throw Error('A quanrtidade de tracks deve ser a mesma para realizar a concatenação.');

        this.timeDivision.compareTimeDivision(midiToConcatenate.timeDivision)

        for (let i = 0; i < this.midiTracks.length; i++) {
            let lastTrackEvent: MidiEvent = this.midiTracks[i].midiEvents.pop();
        
            if (!lastTrackEvent.isOfType(MidiEventDataType.END_OF_TRACK))
                throw new Error('O último evento da track deve ser o de finalização da track');
    
            let deltaTimeToSum: number = lastTrackEvent.deltaTime; 
    
            midiToConcatenate.midiTracks[i].applyNoteTranspose(this.getKeySignatureValues()[0]);
            for (let midiEvent of midiToConcatenate.midiTracks[i].midiEvents) {
                if (midiEvent.isOfType(MidiEventDataType.NOTE) || 
                    midiEvent.isOfType(MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT) ||
                    midiEvent.isOfType(MidiEventDataType.END_OF_TRACK)) {
                    midiEvent.sumDeltaTime(deltaTimeToSum);
                    deltaTimeToSum = 0;   
                    this.midiTracks[i].midiEvents.push(midiEvent)
                } else {
                    deltaTimeToSum += midiEvent.deltaTime;
                }
            }
        }
    }
    
    public cloneMidi(): Midi{
        let midi = new Midi();
        midi.midiType = this.midiType;
        midi.numberOfTracks = this.numberOfTracks;
        midi.timeDivision = this.timeDivision;
        midi.midiTracks = []; 
        
        for (let midiTrack of this.midiTracks) {
            let newMidiTrack: MidiTrack = new MidiTrack()
            newMidiTrack.midiEvents = Object.assign([], midiTrack.midiEvents);
            midi.midiTracks.push(newMidiTrack);
        }
        return midi;
    }

    //meta data
    public getAllUsedChannels(): string[] {
        let channels: string[] = [];
        for (let track of this.midiTracks) {
            channels = channels.concat(track.getAllUsedChannels());
        }
        return channels;
    }

    public getEventsByType(dataType: MidiEventDataType): any {
        let midiEvents: MidiEvent[] = []
        for(let midTrack of this.midiTracks) {
            midiEvents = midiEvents.concat(midTrack.getEventsByType(dataType));
        }
        return midiEvents;
    }

    public getKeySignatureValues() {
        let events: KeySignatureMidiEvent[] = <KeySignatureMidiEvent[]> this.getEventsByType(MidiEventDataType.KEY_SIGNATURE);
        let keySignatures: number[] = [];
        for (let event of events) {
            keySignatures.push(event.tone);
        }
        return keySignatures;
    }

    //change functions
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

    public generateMidiType1(midis: Midi[]) {
        let newMidi: Midi = new Midi(); 
        
        newMidi.midiType = MidiType.TYPE_1;
        newMidi.midiTracks = [];
        newMidi.timeDivision = midis[0].timeDivision;
        newMidi.numberOfTracks = 0;
        
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
                newMidi.midiTracks.push(midiTrack);
                newMidi.numberOfTracks++
            }
        }

        return newMidi;
        
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

    public compareTimeDivision(timeDivisionToCompare: MidiTimeDivision): boolean {
        return this.timeDivisionType == timeDivisionToCompare.timeDivisionType
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

    private addStartEventToTrack(event){
        this.midiEvents.unshift(event);
    }

    public applyNoteTranspose(newKeySignature: number) {

        if (!newKeySignature && newKeySignature != 0) 
            throw new Error('A assinatura de clave não deve ser nula.')
        
        if (newKeySignature < Midi.MIN_KEY_SIGNATURE_NUMBER) 
            throw new Error(`A assinatura de clave deve ser maior ou igual a ${Midi.MIN_KEY_SIGNATURE_NUMBER}.`)

        if (newKeySignature > Midi.MAX_KEY_SIGNATURE_NUMBER) 
            throw new Error(`A assinatura de clave deve ser menor ou igual a ${Midi.MAX_KEY_SIGNATURE_NUMBER}.`)

        let keySignatureEvents: KeySignatureMidiEvent[] = <KeySignatureMidiEvent[]> this.getEventsByType(MidiEventDataType.KEY_SIGNATURE); 

        if (keySignatureEvents.length <= 0) 
            throw new Error(`Não foi identificado o evento de assinatura de clave.`)

        if (keySignatureEvents.length > 1) 
            throw new Error(`Mais de uma armadura de clave não é suportada.`)

        let actualKeySignature: number = keySignatureEvents[0].tone;

        let conversionFactor = Midi.KEY_SIGNATURE_CONVERSION_VECTOR[newKeySignature + 7]
                             - Midi.KEY_SIGNATURE_CONVERSION_VECTOR[actualKeySignature + 7];

        if (conversionFactor != 0) {
            let noteEvent: NoteMidiEvent;
            let keySignatureEvent: KeySignatureMidiEvent;
            for (let event of this.midiEvents) {
                if (event.isOfType(MidiEventDataType.NOTE)) {
                    noteEvent = event as NoteMidiEvent;
                    noteEvent.applyNoteTranspose(conversionFactor);
                } else if (event.isOfType(MidiEventDataType.KEY_SIGNATURE)) {
                    keySignatureEvent = <any> event as KeySignatureMidiEvent 
                    keySignatureEvent.tone = newKeySignature;
                }
            }
        }

    }

    public applyTempoChange(newTempo: number) {
        let tempoEvent: TempoMidiEvent;
        for (let event of this.midiEvents) {
            if (event.isOfType(MidiEventDataType.TEMPO)) {
                tempoEvent = event as TempoMidiEvent;
                tempoEvent.tempo = newTempo;
            }
        }
    }

    public applyInstrumentChange(instrumentNumber: number){
        
        this.removeAllEventsByType(MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT);
        
        for (let channel of this.getAllUsedChannels()) {
            if (Midi.DRUMS_MIDI_CHANNELS.indexOf(channel) < 0) {
                this.addStartEventToTrack(new MusicalInstrumentMidiEvent(0, channel, instrumentNumber));              
            }
        }
    }

    public applyVolumeChange(volumePercent: number){       
        let noteEvent: NoteMidiEvent;
        for (let event of this.midiEvents) {
            if (event.isOfType(MidiEventDataType.NOTE_ON)) {
                noteEvent = event as NoteMidiEvent;
                noteEvent.applyVolumeChange(volumePercent);
            }
        }
    }

    private removeAllEventsByType(eventType: MidiEventDataType) {
        let deltaTime: number = 0;
        for (let i = 0; i < this.midiEvents.length; i++) {
            if (this.midiEvents[i].isOfType(eventType)){
                deltaTime = this.midiEvents[i].deltaTime;
                if (this.midiEvents.length > i+1) 
                    this.midiEvents[i+1].sumDeltaTime(deltaTime);
                this.midiEvents.splice(i, 1);
            }
        }
    }

    public getAllUsedChannels():string[] {
        let chanels: string[] = [];
        let channelEvent: ChannelMidiEvent;
        for (let event of this.midiEvents) {
            if (event.isOfType(MidiEventDataType.NOTE)) {
                channelEvent = event as ChannelMidiEvent;
                if (chanels.indexOf(channelEvent.channel) < 0) {
                    chanels.push(channelEvent.channel)
                }
            }
        }        
        return chanels;
    }

    public changeMidiChannel(midiChannel: string): boolean {
        let midiChannelChanged: boolean = false;
        let channelEvent: ChannelMidiEvent;
        for (let event of this.midiEvents) {
            if (event.isOfType(MidiEventDataType.CHANNEL)) {
                channelEvent = event as ChannelMidiEvent;
                if (Midi.DRUMS_MIDI_CHANNELS.indexOf(channelEvent.channel) < 0) {
                    channelEvent.channel = midiChannel;
                    midiChannelChanged = true;
                }
            }
        }
        return midiChannelChanged;    
    }

    public getEventsByType(dataType: MidiEventDataType): any{
        let midiEvents: MidiEvent[] = []
        for(let midiEvent of this.midiEvents) {
            if (midiEvent.isOfType(dataType))
                midiEvents.push(midiEvent);
        }
        return midiEvents;
    }

}

export abstract class MidiEvent {

    private _deltaTime: number;
    private _midiEventType: MidiEventType;

    constructor(midiEventType: MidiEventType, deltaTime: number) {
        this.midiEventType = midiEventType;
        this.deltaTime = deltaTime;
    }

    public get midiEventType(): MidiEventType {
        return this._midiEventType;
    }

    public set midiEventType(midiEventType: MidiEventType) {
        this._midiEventType = midiEventType;
    }

    get deltaTime(): number{
        return this._deltaTime;
    }
    
    set deltaTime(deltaTime: number){
        this._deltaTime = deltaTime;
    }

    public sumDeltaTime(deltaTimeToSum: number){
        this.deltaTime += deltaTimeToSum;
    }

    public abstract isOfType(dataType: MidiEventDataType): boolean; 

}

export class ChannelMidiEvent extends MidiEvent {

    private _channel: string;

    constructor(deltaTime: number, channel: string) {
        super(MidiEventType.MIDI_EVENT, deltaTime);
        this.channel = channel;
    }

    public get channel(): string {
        return this._channel;
    }
    
    public set channel(value: string) {
        this._channel = value;
    }
    
    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.CHANNEL
    } 

}

export class NoteMidiEvent extends ChannelMidiEvent {

    private _note: number;
    private _velocity: number;

    octaveTranspose
    originalVelocity

    constructor(deltaTime: number, channel: string, note: number, velocity: number) {
        super(deltaTime, channel);
        this.note = note;
        this.velocity = velocity;
        this.originalVelocity = velocity;
    }

    public get note(): number {
        return this._note;
    }
    
    public set note(value: number) {
        this._note = value;
    }
    
    public get velocity(): number {
        return this._velocity;
    }
    
    public set velocity(value: number) {
        this._velocity = value;
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return super.isOfType(dataType) || dataType == MidiEventDataType.NOTE
    }  

    public applyNoteTranspose(convesionFactor: number) {
        if (!convesionFactor && convesionFactor != 0) 
            throw new Error('O fator de conversão não deve ser nulo.')
        
        let octaveTranspose: number = 0;
        let note: number = this.note + (((this.octaveTranspose ? this.octaveTranspose : 0) * Midi.OCTAVE_SEMI_TOM_QUANTITY) + convesionFactor); 

        while (note < Midi.MIN_NOTE_NUMBER) {
            note += Midi.OCTAVE_SEMI_TOM_QUANTITY;
            octaveTranspose++;
        }
        while (note > Midi.MAX_NOTE_NUMBER) {
            note -= Midi.OCTAVE_SEMI_TOM_QUANTITY;
            octaveTranspose--;
        }
        this.octaveTranspose = octaveTranspose;
        this.note = note;
    }

    public applyVolumeChange(volumePercent: number) {
        
        if (!volumePercent && volumePercent != 0) 
            throw new Error('O volume não pode ser nulo.')
         
        let newVolume = Math.round(volumePercent * this.originalVelocity / 100);

        if (newVolume < Midi.MIN_VOLUME_NUMBER) {
            newVolume = Midi.MIN_VOLUME_NUMBER;
        } else if (newVolume > Midi.MAX_VOLUME_NUMBER) {
            newVolume = Midi.MAX_VOLUME_NUMBER;
        }

        this.velocity = newVolume;

    }



}

export class NoteOffMidiEvent extends NoteMidiEvent {

    constructor(deltaTime: number, channel: string, note: number, velocity: number) {
        super(deltaTime, channel, note, velocity);
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return super.isOfType(dataType) || dataType == MidiEventDataType.NOTE_OFF
    } 

}

export class NoteOnMidiEvent extends NoteMidiEvent {

    constructor(deltaTime: number, channel: string, note: number, velocity: number) {
        super(deltaTime, channel, note, velocity);
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return super.isOfType(dataType) || dataType == MidiEventDataType.NOTE_ON;
    } 

}

export class TempoMidiEvent extends MidiEvent {

    private _tempo: number;

    constructor(deltaTime: number, tempo: number) {
        super(MidiEventType.META_EVENT, deltaTime);
        this.tempo = tempo;
    }

    public get tempo(): number {
        return this._tempo;
    }

    public set tempo(value: number) {
        this._tempo = value;
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.TEMPO;
    } 

}

export class TimeSignatureMidiEvent extends MidiEvent {

    private _numerator: number;
    private _denominator: number;
    private _midiClocks: number;
    private _notes32in4note: number;

    constructor(deltaTime: number, numerator: number, denominator: number, midiClocks: number, notes32in4note: number) {
        super(MidiEventType.META_EVENT, deltaTime);
        this.numerator = numerator;
        this.denominator = denominator;
        this.midiClocks = midiClocks;
        this.notes32in4note = notes32in4note;
    }

    public get numerator(): number {
        return this._numerator;
    }

    public set numerator(value: number) {
        this._numerator = value;
    }

    public get denominator(): number {
        return this._denominator;
    }

    public set denominator(value: number) {
        this._denominator = value;
    }

    public get midiClocks(): number {
        return this._midiClocks;
    }

    public set midiClocks(value: number) {
        this._midiClocks = value;
    }

    public get notes32in4note(): number {
        return this._notes32in4note;
    }

    public set notes32in4note(value: number) {
        this._notes32in4note = value;
    }
    
    public compareTo(timeEventToCompare: TimeSignatureMidiEvent ){
        return this.numerator == timeEventToCompare.numerator
            && this.denominator == timeEventToCompare.denominator
            && this.midiClocks == timeEventToCompare.midiClocks
            && this.notes32in4note == timeEventToCompare.notes32in4note;
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.TIME_SIGNATURE;
    } 

}

export class KeySignatureMidiEvent extends MidiEvent {
    
    private _tone: number;
    private _mode: number;

    constructor(deltaTime: number, tone: number, mode: number) {
        super(MidiEventType.META_EVENT, deltaTime);
        this.tone = tone;
        this.mode = mode;
    }

    public get tone(): number {
        return this._tone;
    }
    
    public set tone(value: number) {
        this._tone = value;
    }  
    
    public get mode(): number {
        return this._mode;
    }
    
    public set mode(value: number) {
        this._mode = value;
    }
    
    public compareTo(keyEventToCompare: KeySignatureMidiEvent) {
        return this.tone == keyEventToCompare.tone
            && this.mode == keyEventToCompare.mode
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.KEY_SIGNATURE;
    } 

}

export class EndOfTrackMidiEvent extends MidiEvent {

    constructor(deltaTime: number) {
        super(MidiEventType.META_EVENT, deltaTime);
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.END_OF_TRACK;
    } 
}

export class MusicalInstrumentMidiEvent extends MidiEvent {
    
    private _channel: string;
    private _musicalInstrument: number;

    constructor(deltaTime: number, channel: string, musicalInstrument: number) {
        super(MidiEventType.META_EVENT, deltaTime);
        this.channel = channel;
        this.musicalInstrument = musicalInstrument;
    }


    public get channel(): string {
        return this._channel;
    }
    
    public set channel(value: string) {
        this._channel = value;
    }

    public get musicalInstrument(): number {
        return this._musicalInstrument;
    }

    public set musicalInstrument(value: number) {
        this._musicalInstrument = value;
    }
    
    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT
    } 

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
    NOTE_OFF, NOTE_ON, TEMPO, TIME_SIGNATURE, KEY_SIGNATURE, END_OF_TRACK, NOTE, DETERMINATE_MUSICAL_INSTRUMENT, CHANNEL
}


