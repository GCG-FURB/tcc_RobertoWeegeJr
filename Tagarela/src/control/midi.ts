import { Midi, MidiTrack, MidiEvent, MidiType, MidiTimeDivisionType, MidiTimeDivisionMetrical, NoteOffMidiEvent, NoteOnMidiEvent, TempoMidiEvent, TimeSignatureMidiEvent, KeySignatureMidiEvent, EndOfTrackMidiEvent, MidiEventDataType, MusicalInstrumentMidiEvent, ChannelMidiEvent, NoteMidiEvent } from "../model/midi";
import { NumberConversionUtil } from "../util/number-conversion";
import { MidiSpectrumLine, MidiSpectrum, MidiSpectrumNote } from "../model/midi-spectrum";

export class MidiControl {

    public ajustMidiSize(midi: Midi, trackIndex: number, targetDeltaTimeSize: number) {
        if (!midi) 
            throw new Error('Midi não pode ser nulo.')
        
        if (!trackIndex && trackIndex != 0) 
            throw new Error('O indice de track não pode ser nulo.')

        if (!targetDeltaTimeSize && targetDeltaTimeSize != 0) 
            throw new Error('O tamanho alvo de track não pode ser nulo.')

        if (!midi.midiTracks[trackIndex]) 
            throw new Error(`O midi não possui track de indice ${trackIndex}.`)

        let midiDeltaTimeSum: number = midi.getDeltaTimeSum(trackIndex);
        if (midiDeltaTimeSum < targetDeltaTimeSize) {
            midi.midiTracks[trackIndex].midiEvents[midi.midiTracks[trackIndex].midiEvents.length - 1].sumDeltaTime(targetDeltaTimeSize - midiDeltaTimeSum);            
        }
    }

    public ajustMidiTimeDivision(midi: Midi, timeDivisionMetric: number){
        
        if (!midi) 
            throw new Error('Midi não pode ser nulo.')

        if (!timeDivisionMetric && timeDivisionMetric != 0) 
            throw new Error('A metrica de time division não pode ser nula.')

        let midiTimeDivision: MidiTimeDivisionMetrical = <MidiTimeDivisionMetrical> midi.timeDivision;
        let conversionFactor: number = (timeDivisionMetric + 0.0) / midiTimeDivision.metric;

        if (conversionFactor != 1) {
            midiTimeDivision.metric = timeDivisionMetric;
            midi.timeDivision = midiTimeDivision;

            for (let track of midi.midiTracks) {
                for (let event of track.midiEvents) {
                    event.deltaTime = event.deltaTime * conversionFactor
                }
            }
        }

    }

    public generateMidiSpectrum(midi: Midi): MidiSpectrum {
        if(!midi) 
            throw new Error('Midi não pode ser nulo.')

        let actualKeySignatureValue: number[] = midi.getKeySignatureValues();
        if (actualKeySignatureValue.length != 1)
            throw new Error('Deve haver um, e somente um, evento de assinatuura de clave.');

        let conversionFactor = Midi.KEY_SIGNATURE_CONVERSION_ARRAY[0+7]
                             - Midi.KEY_SIGNATURE_CONVERSION_ARRAY[actualKeySignatureValue[0] + 7];

        let spectrum: MidiSpectrum = new MidiSpectrum();

        let midiTotalDeltaTime: number = 0;
        let midiMinNote: number = 128;
        let midiMaxNote: number = 0;

        let spectrumLineMap: Map<number, MidiSpectrumLine> = new Map();
        let spectrumNoteList: number[] = [];
        let spectrumDeltaTimeList: number[] = [];

        let note: number;
        let spectrumLine: MidiSpectrumLine;
        let spectrumNote: MidiSpectrumNote;

        let noteOn: NoteOnMidiEvent;
        let noteOFF: NoteOffMidiEvent;
        
        let noteIndex: number;

        for (let midiEvent of midi.midiTracks[0].midiEvents) {
            midiTotalDeltaTime += midiEvent.deltaTime; 
            if (midiEvent.isOfType(MidiEventDataType.NOTE_ON)) {
                noteOn = <NoteOnMidiEvent> midiEvent;
                note = noteOn.note + conversionFactor;
                while (note < Midi.MIN_NOTE_NUMBER) {
                    note += Midi.OCTAVE_SEMI_TOM_QUANTITY;
                }
                while (note > Midi.MAX_NOTE_NUMBER) {
                    note -= Midi.OCTAVE_SEMI_TOM_QUANTITY;
                }
                if (note < midiMinNote) {
                    midiMinNote = note;
                }
                if (note > midiMaxNote) {
                    midiMaxNote = note;
                }
                spectrumNoteList.push(note);
                spectrumDeltaTimeList.push(midiTotalDeltaTime);

            } else {
                if (midiEvent.isOfType(MidiEventDataType.NOTE_OFF)) {
                    noteOFF = <NoteOffMidiEvent> midiEvent;
                    note = noteOFF.note + conversionFactor;
                    while (note < Midi.MIN_NOTE_NUMBER) {
                        note += Midi.OCTAVE_SEMI_TOM_QUANTITY;
                    }
                    while (note > Midi.MAX_NOTE_NUMBER) {
                        note -= Midi.OCTAVE_SEMI_TOM_QUANTITY;
                    }
                    if (!spectrumLineMap.has(note)){
                        spectrumLine = new MidiSpectrumLine();
                        spectrumLine.noteValue = note;
                        spectrumLineMap.set(note, spectrumLine);
                    }
                    noteIndex = spectrumNoteList.lastIndexOf(note);
                    if (noteIndex >= 0) {
                        spectrumNote = new MidiSpectrumNote();
                        spectrumNote.deltaTimeStart = spectrumDeltaTimeList[noteIndex];
                        spectrumNote.deltaTimeEnd = midiTotalDeltaTime;
                        spectrumLineMap.get(note).notes.push(spectrumNote);
                        spectrumNoteList.splice(noteIndex, 1);
                        spectrumDeltaTimeList.splice(noteIndex, 1);
                    }
                }
            }
        }

        for (let i = 0; spectrumNoteList.length; i++) {
            note = spectrumNoteList[i];
            if (!spectrumLineMap.has(note)){
                spectrumLine = new MidiSpectrumLine();
                spectrumLine.noteValue = note;
                spectrumLineMap.set(note, spectrumLine);
            }
            spectrumNote = new MidiSpectrumNote();
            spectrumNote.deltaTimeStart = spectrumDeltaTimeList[i];
            spectrumNote.deltaTimeEnd = midiTotalDeltaTime;
            spectrumLineMap.get(note).notes.push(spectrumNote);
        }

        spectrum.minNote = midiMinNote;
        spectrum.maxNote = midiMaxNote;
        spectrum.deltaTime = midiTotalDeltaTime;

        for (let i = midiMinNote; i <= midiMaxNote; i++) {
            if (spectrumLineMap.has(i)) {
                spectrum.lines.push(spectrumLineMap.get(i));
            } else {
                spectrumLine = new MidiSpectrumLine();
                spectrumLine.noteValue = i;
                spectrum.lines.push(spectrumLine);
            }
        }
        return spectrum;
    }

    public concatenateMidisChannels(originalMidi: Midi, midiToConcatenate: Midi): Midi {

        if (!originalMidi)
            throw Error('O original não pode ser nulo.');

        if (!midiToConcatenate)
            throw Error('O midi para concatenar não pode ser nulo.');
            
        if (originalMidi.midiType != midiToConcatenate.midiType)
            throw Error('O tipo de midi deve ser o mesmo para realizar a concatenação.');

        if (originalMidi.numberOfTracks != midiToConcatenate.numberOfTracks)
            throw Error('A quantidade de tracks deve ser a mesma para realizar a concatenação.');

        if (originalMidi.timeDivision.timeDivisionType != MidiTimeDivisionType.METRICAL_TYPE)
            throw Error('Somente é possivel concatenar midis de time division métrico.');

        if (!originalMidi.timeDivision.compareTimeDivisionType(midiToConcatenate.timeDivision))
            throw Error('O tipo de time division deve ser o mesmo para realizar a concatenação.');

        let newMidi: Midi = originalMidi.cloneMidi(); 
        let toConcatenate: Midi = midiToConcatenate.cloneMidi();

        let newMidiTimeDivision: MidiTimeDivisionMetrical = newMidi.timeDivision as MidiTimeDivisionMetrical;
        let toConcatenateTimeDivision: MidiTimeDivisionMetrical = toConcatenate.timeDivision as MidiTimeDivisionMetrical;

        if (newMidiTimeDivision.metric > toConcatenateTimeDivision.metric) {
            this.ajustMidiTimeDivision(toConcatenate, newMidiTimeDivision.metric);
        } else if (toConcatenateTimeDivision.metric > newMidiTimeDivision.metric) {
            this.ajustMidiTimeDivision(newMidi, toConcatenateTimeDivision.metric);
        }

        for (let i = 0; i < newMidi.midiTracks.length; i++) {
            let lastTrackEvent: MidiEvent = newMidi.midiTracks[i].midiEvents.pop();
        
            if (!lastTrackEvent.isOfType(MidiEventDataType.END_OF_TRACK))
                throw new Error('O último evento da track deve ser o de finalização da track');
    
            let deltaTimeToSum: number = lastTrackEvent.deltaTime; 

            let keySignatures: number[] = newMidi.getKeySignatureValues()
            if (keySignatures.length != 1)
                throw new Error('Deve haver um, e somente um, evento de assinatuura de clave.');
            toConcatenate.midiTracks[i].applyNoteTranspose(keySignatures[0]);

            let newEvent: MidiEvent;
            
            for (let midiEvent of toConcatenate.midiTracks[i].midiEvents) {
                if (midiEvent.isOfType(MidiEventDataType.NOTE) || 
                    midiEvent.isOfType(MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT) ||
                    midiEvent.isOfType(MidiEventDataType.END_OF_TRACK)) {
                    newEvent = midiEvent.cloneEvent();
                    newEvent.sumDeltaTime(deltaTimeToSum);
                    deltaTimeToSum = 0;   
                    newMidi.midiTracks[i].midiEvents.push(newEvent.cloneEvent())
                } else {
                    deltaTimeToSum += midiEvent.deltaTime;
                }
            }
        }
        return newMidi;
    }

    public concatenateMidisInTracks(midis: Midi[]) {
        
        if (!midis || midis.length < 0)
            throw Error('Os midis não pode ser nulos.');
        
        let normalizedMidis: Midi[] = [];
        let maxTimeDivisionMetric: number = 0;
        let normalizedMidi: Midi;
        let timeDivision: MidiTimeDivisionMetrical;

        for (let midi of midis) {
            if (midi.timeDivision.timeDivisionType != MidiTimeDivisionType.METRICAL_TYPE)
                throw Error('Somente é possivel concatenar midis de time division métrico.');
            timeDivision = midi.timeDivision as MidiTimeDivisionMetrical;
            if (timeDivision.metric > maxTimeDivisionMetric ){
                maxTimeDivisionMetric = timeDivision.metric;
            }
            normalizedMidi = midi.cloneMidi(); 
            normalizedMidis.push(normalizedMidi);
        }

        for (let midi of normalizedMidis) {
            this.ajustMidiTimeDivision(midi, maxTimeDivisionMetric);    
        }

        let newMidi: Midi = new Midi(); 
        newMidi.midiType = MidiType.TYPE_1;
        newMidi.midiTracks = [];
        newMidi.timeDivision = normalizedMidis[0].timeDivision;
        newMidi.numberOfTracks = 0;

        let midiChannelIndex: number = 0 
        let channelChanged: boolean;
        let channel: string;

        for (let midi of normalizedMidis) {
            for (let midiTrack of midi.midiTracks) {
                channel = Midi.MIDI_CHANNELS_ARRAY[midiChannelIndex]
                while(Midi.DRUMS_MIDI_CHANNELS.indexOf(channel) > 0) {
                    midiChannelIndex++
                    if (midiChannelIndex >= Midi.MIDI_CHANNELS_ARRAY.length){
                        midiChannelIndex = 0;
                    }
                    channel = Midi.MIDI_CHANNELS_ARRAY[midiChannelIndex]
                }                
                channelChanged = midiTrack.changeMidiChannel(channel);
                if (channelChanged) {
                    midiChannelIndex++;
                    if (midiChannelIndex >= Midi.MIDI_CHANNELS_ARRAY.length){
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

export class MidiFileControl {

    private MIDI_HEADER_LENGTH: number = 14;

    private HEADER_START_VALUE: string = 'MThd';

    private MIDI_HEADER_LENGTH_VALUE: number = 6;
    private MIDI_HEADER_LENGTH_VALUE_LENGTH: number = 4;

    private MIDI_TYPE_VALUE_LENGTH: number = 2;
    private MIDI_TRACK_QUANTITY_VALUE_LENGTH: number = 2;
    private MIDI_TIME_DIVISION_VALUE_LENGTH: number = 2;

    private MIDI_TRACK_DESC_LENGTH: number = 8;

    private TRACK_START_VALUE: string = "MTrk";
    private MIDI_TRACK_LENGTH_VALUE_LENGTH: number = 4;
    private MIDI_DELTA_TIME_MAX_LENGTH: number = 4;

    private NOTE_OFF_FIRST_CHAR: string = '8'; 
    private NOTE_OFF_EVENT_LENGTH: number = 3;
    private NOTE_OFF_CHANNEL_BYTE_INDEX: number = 0;
    private NOTE_OFF_CHANNEL_BYTE_LENGTH: number = 1;
    private NOTE_OFF_CHANNEL_INDEX: number = 1;
    private NOTE_OFF_CHANNEL_LENGTH: number = 1;
    private NOTE_OFF_NOTE_BYTE_INDEX: number = 1;
    private NOTE_OFF_NOTE_BYTE_LENGTH: number = 1;
    private NOTE_OFF_VELOCITY_BYTE_INDEX: number = 2;
    private NOTE_OFF_VELOCITY_BYTE_LENGTH: number = 1;

    private NOTE_ON_FIRST_CHAR: string = '9';
    private NOTE_ON_EVENT_LENGTH: number = 3;
    private NOTE_ON_CHANNEL_BYTE_INDEX: number = 0;
    private NOTE_ON_CHANNEL_BYTE_LENGTH: number = 1;
    private NOTE_ON_CHANNEL_INDEX: number = 1;
    private NOTE_ON_CHANNEL_LENGTH: number = 1;
    private NOTE_ON_NOTE_BYTE_INDEX: number = 1;
    private NOTE_ON_NOTE_BYTE_LENGTH: number = 1;
    private NOTE_ON_VELOCITY_BYTE_INDEX: number = 2;
    private NOTE_ON_VELOCITY_BYTE_LENGTH: number = 1;

    private _0_EVENT_FIRST_CHAR: string = '0';
    private _0_EVENT_EVENT_LENGTH: number = 2;

    private _1_EVENT_FIRST_CHAR: string = '1';
    private _1_EVENT_EVENT_LENGTH: number = 2;

    private _2_EVENT_FIRST_CHAR: string = '2';
    private _2_EVENT_EVENT_LENGTH: number = 2;

    private _3_EVENT_FIRST_CHAR: string = '3';
    private _3_EVENT_EVENT_LENGTH: number = 2;

    private _4_EVENT_FIRST_CHAR: string = '4';
    private _4_EVENT_EVENT_LENGTH: number = 2;

    private _5_EVENT_FIRST_CHAR: string = '5';
    private _5_EVENT_EVENT_LENGTH: number = 2;

    private _6_EVENT_FIRST_CHAR: string = '6';
    private CONTROLLER_EVENT_FIRST_BYTE_60: string = '60'; 
    private CONTROLLER_EVENT_60_LENGTH: number = 1; 

    private CONTROLLER_EVENT_FIRST_BYTE_61: string = '61';
    private CONTROLLER_EVENT_61_LENGTH: number = 1;

    private CONTROLLER_EVENT_FIRST_BYTE_62: string = '62';
    private CONTROLLER_EVENT_62_LENGTH: number = 2; 

    private CONTROLLER_EVENT_FIRST_BYTE_63: string = '63';
    private CONTROLLER_EVENT_63_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_64: string = '64';
    private CONTROLLER_EVENT_64_LENGTH: number = 2; 

    private CONTROLLER_EVENT_FIRST_BYTE_65: string = '65';
    private CONTROLLER_EVENT_65_LENGTH: number = 2;

    private _7_EVENT_FIRST_CHAR: string = '7';
    private CONTROLLER_EVENT_FIRST_BYTE_78: string = '78';
    private CONTROLLER_EVENT_78_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_79: string = '79';
    private CONTROLLER_EVENT_79_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_7A: string = '7a';
    private CONTROLLER_EVENT_7A_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_7B: string = '7b';
    private CONTROLLER_EVENT_7B_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_7C: string = '7c';
    private CONTROLLER_EVENT_7C_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_7D: string = '7d';
    private CONTROLLER_EVENT_7D_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_7E: string = '7e';
    private CONTROLLER_EVENT_7E_LENGTH: number = 2;

    private CONTROLLER_EVENT_FIRST_BYTE_7F: string = '7f';
    private CONTROLLER_EVENT_7F_LENGTH: number = 2;

    private A_EVENT_FIRST_CHAR: string = 'a';
    private A_EVENT_EVENT_LENGTH: number = 3;

    private B_EVENT_FIRST_CHAR: string = 'b';
    private B_EVENT_EVENT_LENGTH: number = 3;

    private C_EVENT_FIRST_CHAR: string = 'c';
    private C_EVENT_EVENT_LENGTH: number = 2;

    private D_EVENT_FIRST_CHAR: string = 'd';
    private D_EVENT_EVENT_LENGTH: number = 2;

    private E_EVENT_FIRST_CHAR: string = 'e';
    private E_EVENT_EVENT_LENGTH: number = 3;

    private F_EVENT_FIRST_CHAR: string = 'f';

    private SYSTEM_EXCLUSIVE_EVENT_MIN_LENGTH: number = 2;
    private SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_INDEX: number = 1;
    private SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_LENGTH: number = 1;

    private SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F0: string = 'f0'; 
    private SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F7: string = 'f7';

    private META_EVENT_FIRST_BYTE: string = 'ff';
    private META_EVENT_TEMPO_TYPE_BYTE: string = '51';
    private META_EVENT_TIME_SIGNATURE_TYPE_BYTE: string = '58';
    private META_EVENT_KEY_SIGNATURE_TYPE_BYTE: string = '59';
    private META_EVENT_END_OF_TRACK_TYPE_BYTE: string = '2f';
    private META_EVENT_END_OF_TRACK_VALUE: string = '00';

    private META_EVENT_MIN_LENGTH: number = 3;
    private META_EVENT_LENGTH_BYTE_INDEX: number = 2;
    private META_EVENT_LENGTH_BYTE_LENGTH: number = 1;

    private TEMPO_EVENT_LENGTH: number = 6;
    private TEMPO_EVENT_DATA_LENGTH: number = 3;
    private TEMPO_EVENT_DATA_LENGTH_LENGTH: number = 1;
    private TEMPO_EVENT_TEMPO_INDEX: number = 3;
    private TEMPO_EVENT_TEMPO_LENGTH: number = 3;

    private TIME_SIGNATURE_EVENT_LENGTH: number = 7;
    private TIME_SIGNATURE_EVENT_DATA_LENGTH: number = 4;
    private TIME_SIGNATURE_EVENT_DATA_LENGTH_LENGTH: number = 1;
    private TIME_SIGNATURE_EVENT_NUMERATOR_INDEX: number = 3;
    private TIME_SIGNATURE_EVENT_NUMERATOR_LENGTH: number = 1;
    private TIME_SIGNATURE_EVENT_DENOMINATOR_INDEX : number = 4;
    private TIME_SIGNATURE_EVENT_DENOMINATOR_LENGTH: number = 1;
    private TIME_SIGNATURE_EVENT_MIDI_CLOCKS_INDEX: number = 5; 
    private TIME_SIGNATURE_EVENT_MIDI_CLOCKS_LENGTH: number = 1;        
    private TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_INDEX: number = 6; 
    private TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_LENGTH: number = 1;

    private KEY_SIGNATURE_EVENT_LENGTH: number = 5;
    private KEY_SIGNATURE_EVENT_DATA_LENGTH: number = 2;
    private KEY_SIGNATURE_EVENT_DATA_LENGTH_LENGTH: number = 1;
    private KEY_SIGNATURE_EVENT_TONE_INDEX: number = 3;
    private KEY_SIGNATURE_EVENT_TONE_LENGTH: number = 1;
    private KEY_SIGNATURE_EVENT_MODE_INDEX: number = 4;
    private KEY_SIGNATURE_EVENT_MODE_LENGTH: number = 1;
    private KEY_SIGNATURE_NEGATIVE_KEY_START: number = 249;
    private KEY_SIGNATURE_NEGATIVE_KEY_CONTROL: number = 256;

    private MUSICAL_INSTRUMENT_EVENT_INSTRUMENT_BYTE_LENGTH: number = 1;

    private END_OF_TRACK_EVENT_LENGTH: number = 3;
    private END_OF_TRACK_EVENT_DATA_LENGTH: number = 0;
    private END_OF_TRACK_EVENT_DATA_LENGTH_LENGTH: number = 1;

    private DELTA_TIME_VALID_BITS: number = 7;

    private _numberConversion: NumberConversionUtil;

    constructor() {
        this.numberConversion = new NumberConversionUtil();
    }

    get numberConversion(): NumberConversionUtil {
        return this._numberConversion;
    }

    set numberConversion(numberConversion: NumberConversionUtil) {
        this._numberConversion = numberConversion;
    }
    
    public setupMidiFromFile(binaryString: string, midiToCompare: Midi): Midi[] {
        
        if (!binaryString || binaryString.length <= 0)
            throw Error(`A primeira parte do caminho não pode ser nulo ou vazio.`);
        
        if (binaryString.length < this.MIDI_HEADER_LENGTH) 
            throw Error(`O arquivo midi deve possuir no mínimo 14 bytes.`);

        let actualByte: number = 0;

        if (binaryString.substr(actualByte, this.HEADER_START_VALUE.length) != this.HEADER_START_VALUE) 
            throw Error(`O arquivo midi deve começar com a indicação ${this.HEADER_START_VALUE}.`);

        actualByte += this.HEADER_START_VALUE.length;

        if (this.numberConversion.convertBinaryStringToInteger(binaryString.substr(actualByte, this.MIDI_HEADER_LENGTH_VALUE_LENGTH)) != this.MIDI_HEADER_LENGTH_VALUE) 
            throw Error(`A indicação de tamanho definido para o cabeçalho deve ser ${this.MIDI_HEADER_LENGTH_VALUE_LENGTH}.`);
        
        actualByte += this.MIDI_HEADER_LENGTH_VALUE_LENGTH;

        let midi: Midi = new Midi();

        let midiType: number = this.numberConversion.convertBinaryStringToInteger(binaryString.substr(actualByte, this.MIDI_TYPE_VALUE_LENGTH));
        if (midiType != MidiType.TYPE_0 && midiType != MidiType.TYPE_1) 
            throw Error(`O tipo de Midi ${midiType} não é suportado. Somente é suportado os tipos ${MidiType.TYPE_0} e ${MidiType.TYPE_1}.`);
        midi.midiType = midiType;

        actualByte += this.MIDI_TYPE_VALUE_LENGTH;

        let numberOfTracks: number = this.numberConversion.convertBinaryStringToInteger(binaryString.substr(actualByte, this.MIDI_TRACK_QUANTITY_VALUE_LENGTH));
        if (numberOfTracks < 1) 
            throw Error(`A quantidade de tracks deve ser maior que 0.`);
        midi.numberOfTracks = numberOfTracks;

        actualByte += this.MIDI_TRACK_QUANTITY_VALUE_LENGTH;
       
        let timeDividionType: number = this.numberConversion.getHexaStringFirstBit(this.numberConversion.convertBinaryStringToHexString(binaryString.substr(actualByte, this.MIDI_TIME_DIVISION_VALUE_LENGTH))); 
        if (timeDividionType != MidiTimeDivisionType.METRICAL_TYPE) 
            throw Error(`O tipo de Time Division ${timeDividionType} não é suportado. Somente é suportado o tipo ${MidiTimeDivisionType.METRICAL_TYPE}.`);

        let timeDividionMetric: number = this.numberConversion.convertBinaryStringToInteger(binaryString.substr(actualByte, this.MIDI_TIME_DIVISION_VALUE_LENGTH));
        midi.timeDivision = new MidiTimeDivisionMetrical(timeDividionMetric);

        actualByte += this.MIDI_TIME_DIVISION_VALUE_LENGTH;

        midi.midiTracks = [];

        let midis: Midi[] = [];
        let newMidi: Midi;
        let firstTrackTimeSignatureEvent: TimeSignatureMidiEvent = null;
        let firstTrackKeySignatureEvent: KeySignatureMidiEvent = null;
        let firstTrackTempoEvent: TempoMidiEvent = null;

        for (let i = 0; i < numberOfTracks; i++) {

            newMidi = midi.cloneMidi();
            newMidi.midiType = MidiType.TYPE_0;
            newMidi.numberOfTracks = 1;

            if (binaryString.length < actualByte + this.MIDI_TRACK_DESC_LENGTH)
                throw Error(`O arquivo midi não possui a descrição correta de track. Track: ${i}`);

            if (binaryString.substr(actualByte, this.TRACK_START_VALUE.length) != this.TRACK_START_VALUE) 
                throw Error(`O track deve começar com a indicação ${this.TRACK_START_VALUE}. Track: ${i}`);
            
            actualByte += this.TRACK_START_VALUE.length;
            let taskLength: number = this.numberConversion.convertBinaryStringToInteger(binaryString.substr(actualByte, this.MIDI_TRACK_LENGTH_VALUE_LENGTH))
        
            actualByte += this.MIDI_TRACK_LENGTH_VALUE_LENGTH;
            let finishLength: number = actualByte + taskLength;

            let timeSignatureEvent: TimeSignatureMidiEvent = null;
            let keySignatureEvent: KeySignatureMidiEvent = null;
            let endOfTrackEvent: EndOfTrackMidiEvent = null;
            let tempoEvent: TempoMidiEvent = null;
            let noteEvent: NoteMidiEvent = null;
            let midiChannel: string;

            let midiTrack: MidiTrack = new MidiTrack();
            let deltaTime: number = 0;

            while (actualByte < finishLength) {
                //deltaTime
                let deltaTimeStart: number = actualByte;
                let deltaTimeLength: number = 1;

                while (!this.isLastDeltaTimeByte(binaryString.charAt(deltaTimeStart + deltaTimeLength - 1))) {
                    deltaTimeLength++;
                    if (deltaTimeLength > this.MIDI_DELTA_TIME_MAX_LENGTH) 
                        throw Error(`Delta time não pode ocupar mais de 4 bytes. Track: ${i} - Byte ${actualByte}`);
                }

                //calcula delta time
                deltaTime += this.calculateDeltaTime(binaryString.substr(deltaTimeStart, deltaTimeLength));
                actualByte += deltaTimeLength;

                //create event or sum delta time
                let midiEvent: MidiCreatedEventModel;
                try {
                    midiEvent = this.generateMidiEventFromBinaryString(deltaTime, binaryString.substr(actualByte));
                } catch (e) {
                    throw Error(`Ocorreu um erro ao obter o evento Midi { ${(e && e.message ? e.message : 'null' )}}. Track: ${i} - Byte ${actualByte}`);
                }

                actualByte += midiEvent.eventLength;

                if (midiEvent.event) {
                    if (midiEvent.event.isOfType(MidiEventDataType.CHANNEL)) {
                        let channelEvent: ChannelMidiEvent = midiEvent.event as ChannelMidiEvent;
                        if (midiChannel) {
                            if (midiChannel != channelEvent.channel)
                                throw Error(`Mais de um canal por track não é suportado.`);
                        } else {
                            midiChannel = channelEvent.channel;
                        }
                        if (midiEvent.event.isOfType(MidiEventDataType.NOTE)) {
                            noteEvent = midiEvent.event as NoteMidiEvent;
                        }
                    } else if (midiEvent.event.isOfType(MidiEventDataType.TIME_SIGNATURE)) {
                        let timeEvent: TimeSignatureMidiEvent = midiEvent.event as TimeSignatureMidiEvent;
                        if (timeSignatureEvent) {
                            if (!timeSignatureEvent.compareTo(timeEvent))
                                throw Error(`Mais de uma definição de assinatura de tempo não são suportadas. Track: ${i} - Byte ${actualByte}`);
                            midiEvent.event = null;
                        } else {
                            if (midiToCompare) {
                                let compareEvents: MidiEvent[] = midiToCompare.getEventsByType(MidiEventDataType.TIME_SIGNATURE);
                                for (let compareEvent of compareEvents) {
                                    let compareTimeEvent = compareEvent as TimeSignatureMidiEvent; 
                                    if (!compareTimeEvent.compareTo(timeEvent)) 
                                        throw Error(`A definição de assinatura de tempo é diferente entre o arquivo atual e o de comparação. Track: ${i} - Byte ${actualByte}`);
                                }
                            } 
                            timeSignatureEvent = timeEvent;
                        }
                    } else if (midiEvent.event.isOfType(MidiEventDataType.KEY_SIGNATURE)) {
                        let keyEvent: KeySignatureMidiEvent = midiEvent.event as KeySignatureMidiEvent;
                        if (keySignatureEvent) {
                            if (!keySignatureEvent.compareTo(keyEvent))
                                throw Error(`Mais de uma definição de assinatura de tonalidade não são suportadas. Track: ${i} - Byte ${actualByte}`);
                            midiEvent.event = null;
                        } else {
                            if (midiToCompare) {
                                let compareEvents: MidiEvent[] = midiToCompare.getEventsByType(MidiEventDataType.KEY_SIGNATURE);
                                for (let compareEvent of compareEvents) {
                                    let compareKeyEvent = compareEvent as KeySignatureMidiEvent; 
                                    if (compareKeyEvent.mode != keyEvent.mode) 
                                        throw Error(`A definição de modo da assinatura de tonalidade é diferente entre o arquivo atual e o de comparação. Track: ${i} - Byte ${actualByte}`);
                                }
                            } 
                            keySignatureEvent = keyEvent;
                        }
                    } else if (midiEvent.event.isOfType(MidiEventDataType.TEMPO)) {
                        if (tempoEvent) {
                            midiEvent.event = null;
                        } else {
                            tempoEvent = midiEvent.event as TempoMidiEvent;
                        }
                    } else if (midiEvent.event.isOfType(MidiEventDataType.END_OF_TRACK)) {
                        if (endOfTrackEvent)
                            throw Error(`Uma track deve ter somente um evento de finalização. Track: ${i} - Byte ${actualByte}`);
                        if (actualByte < finishLength) {
                            throw Error(`O evento de finalização de track deve ser o último evento do track. Track: ${i} - Byte ${actualByte}`);
                        }
                        endOfTrackEvent = midiEvent.event as EndOfTrackMidiEvent;
                    }
                }

                //add event to track
                if (midiEvent.event){
                    deltaTime = 0;
                    midiTrack.addMidiEvent(midiEvent.event);
                } 
            }

            if (actualByte != finishLength) 
                throw Error(`A definição de tamanho de track está errada. Track: ${i}`);

            if (!endOfTrackEvent)
                throw Error(`Não foi encontrado evento de finalização de track. Track: ${i}`);

            firstTrackTimeSignatureEvent = firstTrackTimeSignatureEvent ? firstTrackTimeSignatureEvent : timeSignatureEvent; 
            firstTrackKeySignatureEvent = firstTrackKeySignatureEvent ? firstTrackKeySignatureEvent : keySignatureEvent;
            firstTrackTempoEvent = firstTrackTempoEvent ? firstTrackTempoEvent : tempoEvent;

            if (!timeSignatureEvent) {
                if (firstTrackTimeSignatureEvent) {
                    midiTrack.addStartEventToTrack(firstTrackTimeSignatureEvent.cloneEvent());
                } else {
                    throw Error(`Não foi encontrado evento de assinatura de tempo. Track: ${i}`);
                }
            }
            
            if (!keySignatureEvent) {
                if (firstTrackKeySignatureEvent) {
                    midiTrack.addStartEventToTrack(firstTrackKeySignatureEvent.cloneEvent());
                } else {
                    throw Error(`Não foi encontrado evento de tonalidade. Track: ${i}`);
                }
            }

            if (!tempoEvent){
                if (firstTrackTempoEvent) {
                    midiTrack.addStartEventToTrack(firstTrackTempoEvent.cloneEvent());
                } else {
                    throw Error(`Não foi encontrado evento de Tempo. Track: ${i}`);
                }
            }
            newMidi.midiTracks.push(midiTrack);
            
            if (noteEvent)
                midis.push(newMidi);

        }
        return midis;
    }

    private isLastDeltaTimeByte(binaryString: string): boolean {
        return this.numberConversion.getHexaStringFirstBit(binaryString) == 0;
    }

    private calculateDeltaTime(binaryString: string) : number {
        let binaryDeltaTime: string = '';
        for (let str of binaryString) {
            binaryDeltaTime += this.numberConversion.completeOrRemoveChars(
                this.numberConversion.convertBinaryStringToBinaryArray(str), 
                this.DELTA_TIME_VALID_BITS);
        }
        return parseInt(binaryDeltaTime, 2);
    }
    
    private getDeltaTimeStringFromNumber(deltaTime: number){

        let tempDeltaTimeBinary: string = this.numberConversion.convertIntegerToBinaryArray(deltaTime);
        let deltaTimeBinary: string = '';

        let numberOfBitsToCompleteBytes: number = this.DELTA_TIME_VALID_BITS - (tempDeltaTimeBinary.length % this.DELTA_TIME_VALID_BITS)
        for (let i = 0; i < numberOfBitsToCompleteBytes; i++) {
            tempDeltaTimeBinary = '0' + tempDeltaTimeBinary;
        }
        let numberOfBytes: number = tempDeltaTimeBinary.length / this.DELTA_TIME_VALID_BITS;
        for (let i = 0; i < numberOfBytes; i++) {
            deltaTimeBinary += (i == numberOfBytes-1 ? '0' : '1') + tempDeltaTimeBinary.substr(i * this.DELTA_TIME_VALID_BITS, this.DELTA_TIME_VALID_BITS);
        }
        
        return this.numberConversion.convertBinaryArrayToHexString(deltaTimeBinary);

    }

    public generateMidiEventFromBinaryString(deltaTime: number, midiData: string): MidiCreatedEventModel {
        
        if ((!deltaTime && deltaTime !== 0) || deltaTime < 0) {
            throw new Error('Delta time não pode ser nulo ou menor que zero.')
        }
        if (!midiData || midiData.length < 2) {
            throw new Error('Os dados Midi devem possuir ao menos dois bytes.')
        }

        let firstEventByte: string = this.numberConversion.convertBinaryStringToHexString(midiData.substr(0, 1)); 
        
        switch (firstEventByte.charAt(0)) {
            case this._0_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this._0_EVENT_EVENT_LENGTH);
            case this._1_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this._1_EVENT_EVENT_LENGTH);
            case this._2_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this._2_EVENT_EVENT_LENGTH);
            case this._3_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this._3_EVENT_EVENT_LENGTH);
            case this._4_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this._4_EVENT_EVENT_LENGTH);
            case this._5_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this._5_EVENT_EVENT_LENGTH);
            case this._6_EVENT_FIRST_CHAR:
                switch(firstEventByte) {
                    case this.CONTROLLER_EVENT_FIRST_BYTE_60:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_60_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_61:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_61_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_62:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_62_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_63:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_63_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_64:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_64_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_65:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_65_LENGTH);
                    default:
                        throw Error(`O evento começando com ${firstEventByte} não está mapeado.`)
                }
            case this._7_EVENT_FIRST_CHAR:
                switch(firstEventByte) {
                    case this.CONTROLLER_EVENT_FIRST_BYTE_78:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_78_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_79:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_79_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_7A:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_7A_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_7B:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_7B_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_7C:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_7C_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_7D:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_7D_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_7E:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_7E_LENGTH);
                    case this.CONTROLLER_EVENT_FIRST_BYTE_7F:
                        return new MidiCreatedEventModel(this.CONTROLLER_EVENT_7F_LENGTH);
                    default:
                        throw Error(`O evento começando com ${firstEventByte} não está mapeado.`)
                }
            case this.NOTE_OFF_FIRST_CHAR:
                return new MidiCreatedEventModel(this.NOTE_OFF_EVENT_LENGTH, this.createNoteOffEvent(deltaTime, midiData));
            case this.NOTE_ON_FIRST_CHAR:
                return new MidiCreatedEventModel(this.NOTE_OFF_EVENT_LENGTH, this.createNoteOnEvent(deltaTime, midiData));
            case this.A_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this.A_EVENT_EVENT_LENGTH);
            case this.B_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this.B_EVENT_EVENT_LENGTH);
            case this.C_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this.C_EVENT_EVENT_LENGTH);            
            case this.D_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this.D_EVENT_EVENT_LENGTH);            
            case this.E_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(this.E_EVENT_EVENT_LENGTH);
            case this.F_EVENT_FIRST_CHAR:
                if (firstEventByte == this.SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F0 || firstEventByte == this.SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F7) {
                    return new MidiCreatedEventModel(
                        this.SYSTEM_EXCLUSIVE_EVENT_MIN_LENGTH + 
                        this.numberConversion.convertBinaryStringToInteger(
                            midiData.substr(
                               this.SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_INDEX, 
                               this.SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_LENGTH
                            )
                        )
                    );
                }
                if (firstEventByte == this.META_EVENT_FIRST_BYTE) {
                    let eventTypeByte: string = this.numberConversion.convertBinaryStringToHexString(midiData.charAt(1)); 
                    switch (eventTypeByte) {
                        case this.META_EVENT_TEMPO_TYPE_BYTE:
                            return new MidiCreatedEventModel(this.TEMPO_EVENT_LENGTH, this.createTempoEvent(deltaTime, midiData)); 
                        case this.META_EVENT_TIME_SIGNATURE_TYPE_BYTE:
                            return new MidiCreatedEventModel(this.TIME_SIGNATURE_EVENT_LENGTH, this.createTimeSignatureEvent(deltaTime, midiData));
                        case this.META_EVENT_KEY_SIGNATURE_TYPE_BYTE:
                            return new MidiCreatedEventModel(this.KEY_SIGNATURE_EVENT_LENGTH, this.createKeySignatureEvent(deltaTime, midiData));
                        case this.META_EVENT_END_OF_TRACK_TYPE_BYTE:
                            return new MidiCreatedEventModel(this.END_OF_TRACK_EVENT_LENGTH, this.createEndOfTrackEvent(deltaTime, midiData));
                        default:
                            return new MidiCreatedEventModel(
                                this.META_EVENT_MIN_LENGTH + 
                                this.numberConversion.convertBinaryStringToInteger(
                                    midiData.substr(
                                    this.META_EVENT_LENGTH_BYTE_INDEX, 
                                    this.META_EVENT_LENGTH_BYTE_LENGTH
                                    )
                                )
                            );
                    }
                }
                throw Error(`O evento começando com ${firstEventByte} não está mapeado.`)
            default:
                throw Error(`O evento começando com ${firstEventByte.charAt(0)} não está mapeado.`)
        }
    }

    private createNoteOffEvent(deltaTime: number, midiData: string): NoteOffMidiEvent {
        let channel: string = 
            this.numberConversion.convertBinaryStringToHexString(midiData.substr(this.NOTE_OFF_CHANNEL_BYTE_INDEX, 
                                                                          this.NOTE_OFF_CHANNEL_BYTE_LENGTH))
                                                                            .substr(this.NOTE_OFF_CHANNEL_INDEX, 
                                                                                    this.NOTE_OFF_CHANNEL_LENGTH);
        let note: number = 
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.NOTE_OFF_NOTE_BYTE_INDEX, 
                                                                       this.NOTE_OFF_NOTE_BYTE_LENGTH));
        
        let velocity: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.NOTE_OFF_VELOCITY_BYTE_INDEX, 
                                                                       this.NOTE_OFF_VELOCITY_BYTE_LENGTH));

        return new NoteOffMidiEvent(deltaTime, channel, note, velocity);
    }

    private createNoteOnEvent(deltaTime: number, midiData: string): NoteOnMidiEvent {
        let channel: string = 
            this.numberConversion.convertBinaryStringToHexString(midiData.substr(this.NOTE_ON_CHANNEL_BYTE_INDEX, 
                                                                          this.NOTE_ON_CHANNEL_BYTE_LENGTH))
                                                                            .substr(this.NOTE_ON_CHANNEL_INDEX, 
                                                                                    this.NOTE_ON_CHANNEL_LENGTH);
        let note: number = 
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.NOTE_ON_NOTE_BYTE_INDEX, 
                                                                       this.NOTE_ON_NOTE_BYTE_LENGTH));
        
        let velocity: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.NOTE_ON_VELOCITY_BYTE_INDEX, 
                                                                       this.NOTE_ON_VELOCITY_BYTE_LENGTH));

        return new NoteOnMidiEvent(deltaTime, channel, note, velocity);
    }

    private createTempoEvent(deltaTime: number, midiData: string): TempoMidiEvent {
        let tempo: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.TEMPO_EVENT_TEMPO_INDEX, 
                                                                       this.TEMPO_EVENT_TEMPO_LENGTH));
        return new TempoMidiEvent(deltaTime, tempo);
    }

    private createTimeSignatureEvent(deltaTime: number, midiData: string): TimeSignatureMidiEvent {
        let numerator: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.TIME_SIGNATURE_EVENT_NUMERATOR_INDEX, 
                                                                       this.TIME_SIGNATURE_EVENT_NUMERATOR_LENGTH));
        let denominator: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.TIME_SIGNATURE_EVENT_DENOMINATOR_INDEX, 
                                                                       this.TIME_SIGNATURE_EVENT_DENOMINATOR_LENGTH));
        let midiClocks: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.TIME_SIGNATURE_EVENT_MIDI_CLOCKS_INDEX, 
                                                                       this.TIME_SIGNATURE_EVENT_MIDI_CLOCKS_LENGTH));        
        let notes32in4note: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_INDEX, 
                                                                       this.TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_LENGTH));

        return new TimeSignatureMidiEvent(deltaTime, numerator, denominator, midiClocks, notes32in4note);    
    }
    
    private createKeySignatureEvent(deltaTime: number, midiData: string): KeySignatureMidiEvent {
        let tone: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.KEY_SIGNATURE_EVENT_TONE_INDEX, 
                                                                       this.KEY_SIGNATURE_EVENT_TONE_LENGTH));

        if (tone >= this.KEY_SIGNATURE_NEGATIVE_KEY_START)
            tone = (this.KEY_SIGNATURE_NEGATIVE_KEY_CONTROL - tone) * -1;

        let mode: number =
            this.numberConversion.convertBinaryStringToInteger(midiData.substr(this.KEY_SIGNATURE_EVENT_MODE_INDEX, 
                                                                       this.KEY_SIGNATURE_EVENT_MODE_LENGTH));
                                                               
        return new KeySignatureMidiEvent(deltaTime, tone, mode);    
    }

    private createEndOfTrackEvent(deltaTime: number, midiData: string): EndOfTrackMidiEvent {
        return new EndOfTrackMidiEvent(deltaTime);
    }

    public getBinaryString(midi: Midi): string {
        
        if(!midi) 
            throw new Error('Midi não pode ser nulo.')
        
        if(!midi.numberOfTracks && midi.numberOfTracks != 0) 
            throw new Error('Numero de tracks não pode ser nulo.')

        if(!midi.timeDivision) 
            throw new Error('Time division não pode ser nulo.')

        if (midi.timeDivision.timeDivisionType != MidiTimeDivisionType.METRICAL_TYPE)
            throw new Error(`Time division do tipo ${midi.timeDivision.timeDivisionType} não é suportado. Somente é suportado o tipo ${MidiTimeDivisionType.METRICAL_TYPE}.`)

        let binaryString: string;
        let dataString: string = '';

        let timeDivision: MidiTimeDivisionMetrical = <MidiTimeDivisionMetrical> midi.timeDivision;

        binaryString = this.HEADER_START_VALUE 
                     + this.numberConversion.convertIntegerToBinararyString(this.MIDI_HEADER_LENGTH_VALUE, this.MIDI_HEADER_LENGTH_VALUE_LENGTH) 
                     + this.numberConversion.convertIntegerToBinararyString(midi.midiType, this.MIDI_TYPE_VALUE_LENGTH)
                     + this.numberConversion.convertIntegerToBinararyString(midi.numberOfTracks, this.MIDI_TYPE_VALUE_LENGTH)
                     + this.numberConversion.convertIntegerToBinararyString(timeDivision.metric, this.MIDI_TIME_DIVISION_VALUE_LENGTH)

        for (let midiTrack of midi.midiTracks) {
            dataString = '';
            for (let midiEvent of midiTrack.midiEvents) {

                if(!midiEvent.deltaTime && midiEvent.deltaTime != 0) 
                    throw new Error('Delta Time não pode ser nulo ou vazio.')

                dataString += this.getDeltaTimeStringFromNumber(midiEvent.deltaTime) + this.convertEventDataToHexaData(midiEvent);

            }
            binaryString += this.TRACK_START_VALUE 
                         + this.numberConversion.convertIntegerToBinararyString(dataString.length/2 , this.MIDI_TRACK_LENGTH_VALUE_LENGTH) 
                         + this.numberConversion.convertHexStringToBinaryString(dataString);
        }
        return binaryString;
    }

    private convertEventDataToHexaData(midiEvent: MidiEvent) {
        if (midiEvent.isOfType(MidiEventDataType.NOTE_OFF)) {

            let event: NoteOffMidiEvent = <NoteOffMidiEvent> midiEvent; 
            return this.NOTE_OFF_FIRST_CHAR 
                 + event.channel
                 + this.numberConversion.convertIntegerToHexString(event.note,     this.NOTE_OFF_NOTE_BYTE_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.velocity, this.NOTE_OFF_VELOCITY_BYTE_LENGTH);

        } else if (midiEvent.isOfType(MidiEventDataType.NOTE_ON)) {

            let event: NoteOnMidiEvent = <NoteOnMidiEvent> midiEvent; 
            return this.NOTE_ON_FIRST_CHAR 
                 + event.channel
                 + this.numberConversion.convertIntegerToHexString(event.note,     this.NOTE_OFF_NOTE_BYTE_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.velocity, this.NOTE_OFF_VELOCITY_BYTE_LENGTH); 

        } else if (midiEvent.isOfType(MidiEventDataType.TEMPO)) {

            let event: TempoMidiEvent = <TempoMidiEvent> midiEvent; 
            return this.META_EVENT_FIRST_BYTE
                 + this.META_EVENT_TEMPO_TYPE_BYTE
                 + this.numberConversion.convertIntegerToHexString(this.TEMPO_EVENT_DATA_LENGTH, this.TEMPO_EVENT_DATA_LENGTH_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.tempo, this.TEMPO_EVENT_TEMPO_LENGTH);

        } else if (midiEvent.isOfType(MidiEventDataType.TIME_SIGNATURE)) {

            let event: TimeSignatureMidiEvent = <TimeSignatureMidiEvent> midiEvent; 
            return this.META_EVENT_FIRST_BYTE
                 + this.META_EVENT_TIME_SIGNATURE_TYPE_BYTE
                 + this.numberConversion.convertIntegerToHexString(this.TIME_SIGNATURE_EVENT_DATA_LENGTH, this.TIME_SIGNATURE_EVENT_DATA_LENGTH_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.numerator,      this.TIME_SIGNATURE_EVENT_NUMERATOR_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.denominator,    this.TIME_SIGNATURE_EVENT_DENOMINATOR_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.midiClocks,     this.TIME_SIGNATURE_EVENT_MIDI_CLOCKS_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.notes32in4note, this.TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_LENGTH);
        } else if (midiEvent.isOfType(MidiEventDataType.KEY_SIGNATURE)) {

            let event: KeySignatureMidiEvent = <KeySignatureMidiEvent> midiEvent; 
            return this.META_EVENT_FIRST_BYTE
                 + this.META_EVENT_KEY_SIGNATURE_TYPE_BYTE
                 + this.numberConversion.convertIntegerToHexString(this.KEY_SIGNATURE_EVENT_DATA_LENGTH, this.KEY_SIGNATURE_EVENT_DATA_LENGTH_LENGTH)
                 + this.numberConversion.convertIntegerToHexString((event.tone < 0 ? this.KEY_SIGNATURE_NEGATIVE_KEY_CONTROL + event.tone : event.tone), this.KEY_SIGNATURE_EVENT_TONE_LENGTH)
                 + this.numberConversion.convertIntegerToHexString(event.mode, this.KEY_SIGNATURE_EVENT_MODE_LENGTH);

        } else if (midiEvent.isOfType(MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT)) {
            let event: MusicalInstrumentMidiEvent = <MusicalInstrumentMidiEvent> midiEvent; 
            return this.C_EVENT_FIRST_CHAR
                 + event.channel
                 + this.numberConversion.convertIntegerToHexString(event.musicalInstrument, this.MUSICAL_INSTRUMENT_EVENT_INSTRUMENT_BYTE_LENGTH);
            

        } else if (midiEvent.isOfType(MidiEventDataType.END_OF_TRACK)) {

            return this.META_EVENT_FIRST_BYTE
                    + this.META_EVENT_END_OF_TRACK_TYPE_BYTE
                    + this.numberConversion.convertIntegerToHexString(this.END_OF_TRACK_EVENT_DATA_LENGTH, this.END_OF_TRACK_EVENT_DATA_LENGTH_LENGTH);

        } else {
            throw new Error('O evento não é suportado.')
        }
    }
}

class MidiCreatedEventModel {

    private _event: MidiEvent;
    private _eventLength: number;

    constructor(eventLength: number, event?: MidiEvent){
        this.eventLength = eventLength;
        this.event = event;
    }

    public get event(): MidiEvent {
        return this._event;
    }

    public set event(value: MidiEvent) {
        this._event = value;
    }

    public get eventLength(): number {
        return this._eventLength;
    }

    public set eventLength(value: number) {
        this._eventLength = value;
    }

}