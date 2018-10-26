export class Midi {

    //constants
    public static KEY_SIGNATURES_ARRAY: number[] = [-7,-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6,7];
    public static KEY_SIGNATURE_CONVERSION_ARRAY: number[] = [11, 6, 1, 8, 3, 10, 5, 0, 7, 2, 9, 4, 11, 6, 1]
    public static MIDI_CHANNELS_ARRAY: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
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

    public static MIN_KEY_SIGNATURE_TONE_NUMBER: number = -7;
    public static MAX_KEY_SIGNATURE_TONE_NUMBER: number = 7;

    public static MIN_KEY_SIGNATURE_MODE_NUMBER: number = 0;
    public static MAX_KEY_SIGNATURE_MODE_NUMBER: number = 1;

    public static MIN_NOTE_NUMBER: number = 0;
    public static MAX_NOTE_NUMBER: number = 127;

    public static MIN_TEMPO_NUMBER: number = 1;
    public static MAX_TEMPO_NUMBER: number = 16777215;
    
    public static MIN_VELOCITY_NUMBER: number = 0;
    public static MAX_VELOCITY_NUMBER: number = 127;

    public static OCTAVE_SEMI_TOM_QUANTITY: number = 12;

    public static MIN_TIME_DIVISION_METRIC_VALUE: number = 1;
    public static MAX_TIME_DIVISION_METRIC_VALUE: number = 32767;

    public static MIN_DELTA_TIME_VALUE: number = 0;
    public static MAX_DELTA_TIME_VALUE: number = 268435455;

    public static MIN_GENERIC_BYTE_VALUE: number = 0;
    public static MAX_GENERIC_BYTE_VALUE: number = 255;

    public static MIN_NUMBER_OF_TRACKS: number = 0;
    public static MAX_NUMBER_OF_TRACKS: number = 255;

    private _midiType: MidiType;
    private _numberOfTracks: number;
    private _timeDivision: MidiTimeDivision;
    private _midiTracks: MidiTrack[];

    get midiType(): MidiType {
        return this._midiType;
    }

    set midiType(midiType: MidiType) {
        if (!midiType && midiType != 0) {
            throw new Error(`O tipo midi não pode ser nulo.`);
        }
        if (midiType != MidiType.TYPE_0 && midiType != MidiType.TYPE_1 && midiType != MidiType.TYPE_2) 
            throw new Error(`O tipo midi ${midiType} não é suportado.`);
        this._midiType = midiType;
    }

    get numberOfTracks(): number {
        return this._numberOfTracks;
    }

    set numberOfTracks(numberOfTracks: number) {
        if (!numberOfTracks && numberOfTracks != 0) 
            throw new Error(`A quantidade de tracks não pode ser nula.`);
        
        if (numberOfTracks < Midi.MIN_NUMBER_OF_TRACKS) 
            throw new Error(`A quantidade de tracks não pode menor que ${Midi.MIN_NUMBER_OF_TRACKS}.`);
        
        if (numberOfTracks > Midi.MAX_NUMBER_OF_TRACKS)
            throw new Error(`A quantidade de tracks não pode maior que ${Midi.MAX_NUMBER_OF_TRACKS}.`);

        
        this._numberOfTracks = numberOfTracks;
    }

    get timeDivision(): MidiTimeDivision {
        return this._timeDivision;
    }

    set timeDivision(timeDivision: MidiTimeDivision) {
        if (!timeDivision)
            throw new Error(`O time division não pode ser nulo.`);
        this._timeDivision = timeDivision;
    }

    get midiTracks(): MidiTrack[] {
        return this._midiTracks;
    }

    set midiTracks(midiTracks: MidiTrack[]) {
        if (!midiTracks)
            throw new Error(`As tracks não podem ser nulas.`);
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
                    let newEvent: MidiEvent = midiEvent.cloneEvent();
                    newEvent.sumDeltaTime(deltaTimeToSum);
                    deltaTimeToSum = 0;   
                    this.midiTracks[i].midiEvents.push(newEvent.cloneEvent())
                } else {
                    deltaTimeToSum += midiEvent.deltaTime;
                }
            }
        }
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

    public getTimeDivisionMetric(): number {
        if (this.timeDivision.timeDivisionType != MidiTimeDivisionType.METRICAL_TYPE) 
            return null;
        let timeDivisionMetrical: MidiTimeDivisionMetrical = this.timeDivision as MidiTimeDivisionMetrical;
        return timeDivisionMetrical.metric;
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

    public getDeltaTimeSum(trackIndex: number): number {
        let deltaTime: number = 0;
        for(let event of this.midiTracks[0].midiEvents) {
            deltaTime += event.deltaTime;
        }
        return deltaTime;
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
        if (!timeDivisionType && timeDivisionType != 0) {
            throw new Error(`O tipo de time division não pode ser nulo.`);
        }
        if (timeDivisionType != MidiTimeDivisionType.TIME_CODE_BASED && timeDivisionType != MidiTimeDivisionType.METRICAL_TYPE) 
            throw new Error(`O tipo de time division ${timeDivisionType} não é suportado.`);

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
        if (!metric && metric != 0) 
            throw new Error(`A metrica não pode ser nula.`);
        
        if (metric < Midi.MIN_TIME_DIVISION_METRIC_VALUE) 
            throw new Error(`A metrica não pode menor que ${Midi.MIN_TIME_DIVISION_METRIC_VALUE}.`);
        
        if (metric > Midi.MAX_TIME_DIVISION_METRIC_VALUE)
            throw new Error(`A metrica não pode maior que ${Midi.MAX_TIME_DIVISION_METRIC_VALUE}.`);

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
        if (!midiEvents) 
            throw new Error(`Os eventos Midi não podem ser nulos.`);

        this._midiEvents = midiEvents;
    }

    public addMidiEvent(midiEvent: MidiEvent){
        if (!midiEvent) 
            throw new Error(`O evento Midi não pode ser nulo.`);

        this.midiEvents.push(midiEvent);
    }

    public addStartEventToTrack(event){
        if (!event) 
            throw new Error(`O evento Midi não pode ser nulo.`);
            
        this.midiEvents.unshift(event);
    }

    public applyNoteTranspose(newKeySignature: number) {

        if (!newKeySignature && newKeySignature != 0) 
            throw new Error('A assinatura de clave não deve ser nula.')
        
        if (newKeySignature < Midi.MIN_KEY_SIGNATURE_TONE_NUMBER) 
            throw new Error(`A assinatura de clave deve ser maior ou igual a ${Midi.MIN_KEY_SIGNATURE_TONE_NUMBER}.`)

        if (newKeySignature > Midi.MAX_KEY_SIGNATURE_TONE_NUMBER) 
            throw new Error(`A assinatura de clave deve ser menor ou igual a ${Midi.MAX_KEY_SIGNATURE_TONE_NUMBER}.`)

        let keySignatureEvents: KeySignatureMidiEvent[] = <KeySignatureMidiEvent[]> this.getEventsByType(MidiEventDataType.KEY_SIGNATURE); 

        if (keySignatureEvents.length <= 0) 
            throw new Error(`Não foi identificado o evento de assinatura de clave.`)

        if (keySignatureEvents.length > 1) 
            throw new Error(`Mais de uma armadura de clave não é suportada.`)

        let actualKeySignature: number = keySignatureEvents[0].tone;

        let conversionFactor = Midi.KEY_SIGNATURE_CONVERSION_ARRAY[newKeySignature + 7]
                             - Midi.KEY_SIGNATURE_CONVERSION_ARRAY[actualKeySignature + 7];

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

    get midiEventType(): MidiEventType {
        return this._midiEventType;
    }

    set midiEventType(midiEventType: MidiEventType) {
        if (!midiEventType && midiEventType != 0) 
            throw new Error(`O tipo de evento não pode ser nulo.`);

        if (midiEventType != MidiEventType.META_EVENT  && midiEventType != MidiEventType.SYSEX_EVENT
            && midiEventType != MidiEventType.MIDI_EVENT) 
            throw new Error(`O tipo de evento ${midiEventType} não é suportado.`);

        this._midiEventType = midiEventType;
    }

    get deltaTime(): number{
        return this._deltaTime;
    }
    
    set deltaTime(deltaTime: number) {
        if (!deltaTime && deltaTime != 0) 
            throw new Error(`O delta time não pode ser nulo.`);
        
        if (deltaTime < Midi.MIN_DELTA_TIME_VALUE) 
            throw new Error(`O delta time não pode menor que ${Midi.MIN_DELTA_TIME_VALUE}.`);
        
        if (deltaTime > Midi.MAX_DELTA_TIME_VALUE)
            throw new Error(`O delta time não pode maior que ${Midi.MAX_DELTA_TIME_VALUE}.`);

        this._deltaTime = deltaTime;
    }

    public sumDeltaTime(deltaTimeToSum: number){
        if (!deltaTimeToSum && deltaTimeToSum != 0) 
            throw new Error(`O delta time não pode ser nulo.`);
        this.deltaTime += deltaTimeToSum;
    }

    public abstract isOfType(dataType: MidiEventDataType): boolean; 
    
    public abstract cloneEvent(): MidiEvent;

}

export abstract class ChannelMidiEvent extends MidiEvent {

    private _channel: string;

    constructor(deltaTime: number, channel: string) {
        super(MidiEventType.MIDI_EVENT, deltaTime);
        this.channel = channel;
    }

    public get channel(): string {
        return this._channel;
    }
    
    public set channel(channel: string) {
        if (!channel)
            throw new Error(`O canal midi não pode ser nulo.`);

        if (Midi.MIDI_CHANNELS_ARRAY.indexOf(channel) < 0)
            throw new Error(`O canal midi ${channel} não é suportado.`);
        
        this._channel = channel;
    }
    
    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.CHANNEL
    } 
}

export abstract class NoteMidiEvent extends ChannelMidiEvent {

    private _note: number;
    private _velocity: number;

    private _octaveTranspose: number;

    private _originalVelocity: number;

    constructor(deltaTime: number, channel: string, note: number, velocity: number) {
        super(deltaTime, channel);
        this.note = note;
        this.velocity = velocity;
        this.originalVelocity = velocity;
    }

    get note(): number {
        return this._note;
    }
    
    set note(note: number) {
        if (!note && note != 0) 
            throw new Error(`A nota não pode ser nulo.`);
        
        if (note < Midi.MIN_NOTE_NUMBER) 
            throw new Error(`A nota não pode menor que ${Midi.MIN_NOTE_NUMBER}.`);
        
        if (note > Midi.MAX_NOTE_NUMBER)
            throw new Error(`A nota não pode maior que ${Midi.MAX_NOTE_NUMBER}.`);

        this._note = note;
    }
    
    get velocity(): number {
        return this._velocity;
    }
    
    set velocity(velocity: number) {

        if (!velocity && velocity != 0) 
            throw new Error(`A velocidade (volume) não pode ser nulo.`);
        
        if (velocity < Midi.MIN_VELOCITY_NUMBER) 
            throw new Error(`A velocidade (volume) não pode menor que ${Midi.MIN_VELOCITY_NUMBER}.`);
        
        if (velocity > Midi.MAX_VELOCITY_NUMBER)
            throw new Error(`A velocidade (volume) não pode maior que ${Midi.MAX_VELOCITY_NUMBER}.`);

        this._velocity = velocity;
    }

    get octaveTranspose(): number {
        return this._octaveTranspose;
    }

    set octaveTranspose(octaveTranspose: number) {
        if (!octaveTranspose && octaveTranspose != 0) 
            throw new Error(`A velocidade (volume) não pode ser nulo.`);
        this._octaveTranspose = octaveTranspose;
    }

    get originalVelocity(): number {
        return this._originalVelocity;
    }

    set originalVelocity(originalVelocity: number) {

        if (!originalVelocity && originalVelocity != 0) 
            throw new Error(`A velocidade (volume) não pode ser nulo.`);
        
        if (originalVelocity < Midi.MIN_VELOCITY_NUMBER) 
            throw new Error(`A velocidade (volume) não pode menor que ${Midi.MIN_VELOCITY_NUMBER}.`);
        
        if (originalVelocity > Midi.MAX_VELOCITY_NUMBER)
            throw new Error(`A velocidade (volume) não pode maior que ${Midi.MAX_VELOCITY_NUMBER}.`);

        this._originalVelocity = originalVelocity;
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

        if (newVolume < Midi.MIN_VELOCITY_NUMBER) {
            newVolume = Midi.MIN_VELOCITY_NUMBER;
        } else if (newVolume > Midi.MAX_VELOCITY_NUMBER) {
            newVolume = Midi.MAX_VELOCITY_NUMBER;
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

    public cloneEvent(): MidiEvent {
        return new NoteOffMidiEvent(this.deltaTime, this.channel, this.note, this.velocity);
    }


}

export class NoteOnMidiEvent extends NoteMidiEvent {

    constructor(deltaTime: number, channel: string, note: number, velocity: number) {
        super(deltaTime, channel, note, velocity);
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return super.isOfType(dataType) || dataType == MidiEventDataType.NOTE_ON;
    } 

    public cloneEvent(): MidiEvent {
        return new NoteOnMidiEvent(this.deltaTime, this.channel, this.note, this.velocity);
    }

}

export class TempoMidiEvent extends MidiEvent {

    private _tempo: number;

    constructor(deltaTime: number, tempo: number) {
        super(MidiEventType.META_EVENT, deltaTime);
        this.tempo = tempo;
    }

    get tempo(): number {
        return this._tempo;
    }

    set tempo(tempo: number) {
        if (!tempo && tempo != 0) 
            throw new Error(`O tempo não pode ser nulo.`);
        
        if (tempo < Midi.MIN_TEMPO_NUMBER) 
            throw new Error(`O tempo não pode menor que ${Midi.MIN_TEMPO_NUMBER}.`);
        
        if (tempo > Midi.MAX_TEMPO_NUMBER)
            throw new Error(`O tempo não pode maior que ${Midi.MAX_TEMPO_NUMBER}.`);
        
        this._tempo = tempo;
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.TEMPO;
    } 

    public cloneEvent(): MidiEvent {
        return new TempoMidiEvent(this.deltaTime, this.tempo);
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

    get numerator(): number {
        return this._numerator;
    }

    set numerator(numerator: number) {
        if (!numerator && numerator != 0) 
            throw new Error(`O numerador não pode ser nulo.`);
        
        if (numerator < Midi.MIN_GENERIC_BYTE_VALUE) 
            throw new Error(`O numerador não pode menor que ${Midi.MIN_GENERIC_BYTE_VALUE}.`);
        
        if (numerator > Midi.MAX_GENERIC_BYTE_VALUE)
            throw new Error(`O numerador não pode maior que ${Midi.MAX_GENERIC_BYTE_VALUE}.`);
        
        this._numerator = numerator;
    }

    get denominator(): number {
        return this._denominator;
    }

    set denominator(denominator: number) {
        if (!denominator && denominator != 0) 
            throw new Error(`O denominador não pode ser nulo.`);
        
        if (denominator < Midi.MIN_GENERIC_BYTE_VALUE) 
            throw new Error(`O denominador não pode menor que ${Midi.MIN_GENERIC_BYTE_VALUE}.`);
        
        if (denominator > Midi.MAX_GENERIC_BYTE_VALUE)
            throw new Error(`O denominador não pode maior que ${Midi.MAX_GENERIC_BYTE_VALUE}.`);
        
        this._denominator = denominator;
    }

    get midiClocks(): number {
        return this._midiClocks;
    }

    set midiClocks(midiClocks: number) {
        if (!midiClocks && midiClocks != 0) 
            throw new Error(`O midi clocks não pode ser nulo.`);
        
        if (midiClocks < Midi.MIN_GENERIC_BYTE_VALUE) 
            throw new Error(`O midi clocks não pode menor que ${Midi.MIN_GENERIC_BYTE_VALUE}.`);
        
        if (midiClocks > Midi.MAX_GENERIC_BYTE_VALUE)
            throw new Error(`O midi clocks não pode maior que ${Midi.MAX_GENERIC_BYTE_VALUE}.`);
        
        this._midiClocks = midiClocks;
    }

    get notes32in4note(): number {
        return this._notes32in4note;
    }

    set notes32in4note(notes32in4note: number) {
        if (!notes32in4note && notes32in4note != 0) 
            throw new Error(`O notes32in4note não pode ser nulo.`);
        
        if (notes32in4note < Midi.MIN_GENERIC_BYTE_VALUE) 
            throw new Error(`O notes32in4note não pode menor que ${Midi.MIN_GENERIC_BYTE_VALUE}.`);
        
        if (notes32in4note > Midi.MAX_GENERIC_BYTE_VALUE)
            throw new Error(`O notes32in4note não pode maior que ${Midi.MAX_GENERIC_BYTE_VALUE}.`);
        
        this._notes32in4note = notes32in4note;
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

    public cloneEvent(): MidiEvent {
        return new TimeSignatureMidiEvent(this.deltaTime, this.numerator, this.denominator, this.midiClocks, this.notes32in4note);
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
    
    public set tone(tone: number) {
        if (!tone && tone != 0) 
            throw new Error(`O tom não pode ser nulo.`);
        
        if (tone < Midi.MIN_KEY_SIGNATURE_TONE_NUMBER) 
            throw new Error(`O tom não pode menor que ${Midi.MIN_KEY_SIGNATURE_TONE_NUMBER}.`);
        
        if (tone > Midi.MAX_KEY_SIGNATURE_TONE_NUMBER)
            throw new Error(`O tom não pode maior que ${Midi.MAX_KEY_SIGNATURE_TONE_NUMBER}.`);
        
        this._tone = tone;
    }  
    
    public get mode(): number {
        return this._mode;
    }
    
    public set mode(mode: number) {
        if (!mode && mode != 0) 
            throw new Error(`O modo não pode ser nulo.`);
        
        if (mode < Midi.MIN_KEY_SIGNATURE_MODE_NUMBER) 
            throw new Error(`O modo não pode menor que ${Midi.MIN_KEY_SIGNATURE_MODE_NUMBER}.`);
        
        if (mode > Midi.MAX_KEY_SIGNATURE_MODE_NUMBER)
            throw new Error(`O modo não pode maior que ${Midi.MAX_KEY_SIGNATURE_MODE_NUMBER}.`);
        
        this._mode = mode;
    }
    
    public compareTo(keyEventToCompare: KeySignatureMidiEvent) {
        return this.tone == keyEventToCompare.tone
            && this.mode == keyEventToCompare.mode
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.KEY_SIGNATURE;
    } 

    public cloneEvent(): MidiEvent {
        return new KeySignatureMidiEvent(this.deltaTime, this.tone, this.mode);
    }

}

export class EndOfTrackMidiEvent extends MidiEvent {

    constructor(deltaTime: number) {
        super(MidiEventType.META_EVENT, deltaTime);
    }

    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.END_OF_TRACK;
    } 

    public cloneEvent(): MidiEvent {
        return new EndOfTrackMidiEvent(this.deltaTime);
    }
}

export class MusicalInstrumentMidiEvent extends ChannelMidiEvent {
    
    private _musicalInstrument: number;

    constructor(deltaTime: number, channel: string, musicalInstrument: number) {
        super(deltaTime, channel);
        this.musicalInstrument = musicalInstrument;
    }

    get musicalInstrument(): number {
        return this._musicalInstrument;
    }

    set musicalInstrument(musicalInstrument: number) {
        if (!musicalInstrument && musicalInstrument !== 0) 
            throw new Error(`O instrumento musical padrão não pode ser nulo.`);

        if (musicalInstrument < Midi.MIN_MUSICAL_INSTRUMENT_NUMBER && musicalInstrument != Midi.DRUM_INSTRUMENT_NUMBER) 
            throw new Error(`O instrumento musical não pode menor que ${Midi.MIN_MUSICAL_INSTRUMENT_NUMBER}.`);
        
        if (musicalInstrument > Midi.MAX_MUSICAL_INSTRUMENT_NUMBER && musicalInstrument != Midi.DRUM_INSTRUMENT_NUMBER)
            throw new Error(`O instrumento musical não pode maior que ${Midi.MAX_MUSICAL_INSTRUMENT_NUMBER}.`);
        this._musicalInstrument = musicalInstrument;
    }
    
    public isOfType(dataType: MidiEventDataType): boolean {
        return dataType == MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT
    } 

    public cloneEvent(): MidiEvent {
        return new MusicalInstrumentMidiEvent(this.deltaTime, this.channel, this.musicalInstrument);
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


