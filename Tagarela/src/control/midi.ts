import { Midi, MidiTrack, MidiEvent, MidiType, MidiTimeDivisionType, MidiTimeDivisionMetrical, NoteOffMidiEvent, NoteOnMidiEvent, TempoMidiEvent, TimeSignatureMidiEvent, KeySignatureMidiEvent, EndOfTrackMidiEvent, MidiEventDataType, MusicalInstrumentMidiEvent, ChannelMidiEvent, NoteMidiEvent } from "../model/midi";
import { ConvertionUtil } from "../util/hexa";
import { MidiSpectrumLine, MidiSpectrum, MidiSpectrumNote } from "../model/midi-spectrum";

export class MidiControl {

    public ajustMidiSize(midi: Midi, trackIndex: number, targetDeltaTimeSize) {
        let midiDeltaTimeSum: number = midi.getDeltaTimeSum(trackIndex);
        if (midiDeltaTimeSum < targetDeltaTimeSize) {
            midi.midiTracks[trackIndex].midiEvents[midi.midiTracks[trackIndex].midiEvents.length - 1].sumDeltaTime(targetDeltaTimeSize - midiDeltaTimeSum);            
        }
    }

    public ajustMidiTimeDivision(midi: Midi, maxTimeDivicionMetric: number){
        let midiTimeDivision: MidiTimeDivisionMetrical = <MidiTimeDivisionMetrical> midi.timeDivision;
        let conversionFactor: number = (maxTimeDivicionMetric + 0.0) / midiTimeDivision.metric;

        if (conversionFactor != 1) {
            midiTimeDivision.metric = maxTimeDivicionMetric;
            midi.timeDivision = midiTimeDivision;

            for (let track of midi.midiTracks) {
                for (let event of track.midiEvents) {
                    event.deltaTime = event.deltaTime * conversionFactor
                }
            }
        }
    }

    public setupMidiFromFile(binaryString: string, midiToCompare: Midi): Midi[] {
        
        if (!binaryString || binaryString.length <= 0)
            throw Error(`A primeira parte do caminho não pode ser nulo ou vazio.`);

        let midi: Midi = new Midi();
        
        if (binaryString.length < MidiProtocolConstants.MIDI_HEADER_LENGTH) 
            throw Error(`O arquivo midi deve possuir no mínimo 14 bytes.`);

        let actualByte: number = 0;

        if (binaryString.substr(actualByte, MidiProtocolConstants.HEADER_START_VALUE.length) != MidiProtocolConstants.HEADER_START_VALUE) 
            throw Error(`O arquivo midi deve começar com a indicação ${MidiProtocolConstants.HEADER_START_VALUE}.`);

        actualByte += MidiProtocolConstants.HEADER_START_VALUE.length;

        if (ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, MidiProtocolConstants.MIDI_HEADER_LENGTH_VALUE_LENGTH)) != MidiProtocolConstants.MIDI_HEADER_LENGTH_VALUE) 
            throw Error(`A indicação de tamanho definido para o cabeçalho deve ser ${MidiProtocolConstants.MIDI_HEADER_LENGTH_VALUE_LENGTH}.`);
        
        actualByte += MidiProtocolConstants.MIDI_HEADER_LENGTH_VALUE_LENGTH;

        let midiType: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, MidiProtocolConstants.MIDI_TYPE_VALUE_LENGTH));
        if (midiType != MidiType.TYPE_0 && midiType != MidiType.TYPE_1) 
            throw Error(`O tipo de Midi ${midiType} não é suportado. Somente é suportado os tipos ${MidiType.TYPE_0} e ${MidiType.TYPE_1}.`);
        midi.midiType = midiType;

        actualByte += MidiProtocolConstants.MIDI_TYPE_VALUE_LENGTH;

        let numberOfTracks: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, MidiProtocolConstants.MIDI_TRACK_QUANTITY_VALUE_LENGTH));
        if (numberOfTracks < 1) 
            throw Error(`A quantidade de tracks deve ser maior que 0.`);
        midi.numberOfTracks = numberOfTracks;

        actualByte += MidiProtocolConstants.MIDI_TRACK_QUANTITY_VALUE_LENGTH;
       
        let timeDividionType: number = ConvertionUtil.getFistBit(ConvertionUtil.convertBinaryStringToHexString(binaryString.substr(actualByte, MidiProtocolConstants.MIDI_TIME_DIVISION_VALUE_LENGTH))); 
        if (timeDividionType != MidiTimeDivisionType.METRICAL_TYPE) 
            throw Error(`O tipo de Time Division ${timeDividionType} não é suportado. Somente é suportado o tipo ${MidiTimeDivisionType.METRICAL_TYPE}.`);

        let timeDividionMetric: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, MidiProtocolConstants.MIDI_TIME_DIVISION_VALUE_LENGTH));
        midi.timeDivision = new MidiTimeDivisionMetrical(timeDividionMetric);

        actualByte += MidiProtocolConstants.MIDI_TIME_DIVISION_VALUE_LENGTH;

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

            if (binaryString.length < actualByte + MidiProtocolConstants.MIDI_TRACK_DESC_LENGTH)
                throw Error(`O arquivo midi não possui a descrição correta de track. Track: ${i}`);

            if (binaryString.substr(actualByte, MidiProtocolConstants.TRACK_START_VALUE.length) != MidiProtocolConstants.TRACK_START_VALUE) 
                throw Error(`O track deve começar com a indicação ${MidiProtocolConstants.TRACK_START_VALUE}. Track: ${i}`);
            
            actualByte += MidiProtocolConstants.TRACK_START_VALUE.length;
            let taskLength: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, MidiProtocolConstants.MIDI_TRACK_LENGTH_VALUE_LENGTH))
        
            actualByte += MidiProtocolConstants.MIDI_TRACK_LENGTH_VALUE_LENGTH;
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

                while (!ConvertionUtil.isLastDeltaTimeByte(binaryString.charAt(deltaTimeStart + deltaTimeLength - 1))) {
                    deltaTimeLength++;
                    if (deltaTimeLength > MidiProtocolConstants.MIDI_DELTA_TIME_MAX_LENGTH) 
                        throw Error(`Delta time não pode ocupar mais de 4 bytes. Track: ${i} - Byte ${actualByte}`);
                }

                //calcula delta time
                deltaTime += ConvertionUtil.calculateDeltaTime(binaryString.substr(deltaTimeStart, deltaTimeLength));
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
                throw Error(`A definiçã de tamanho de track está errada. Track: ${i}`);

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

    public generateMidiEventFromBinaryString(deltaTime: number, midiData: string): MidiCreatedEventModel {
        
        if ((!deltaTime && deltaTime !== 0) || deltaTime < 0) {
            throw new Error('Delta time não pode ser nulo ou menor que zero.')
        }
        if (!midiData || midiData.length < 2) {
            throw new Error('Os dados Midi devem possuir ao menos dois bytes.')
        }

        let firstEventByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 1)); 
        
        switch (firstEventByte.charAt(0)) {
            case MidiProtocolConstants._0_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants._0_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants._1_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants._1_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants._2_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants._2_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants._3_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants._3_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants._4_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants._4_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants._5_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants._5_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants._6_EVENT_FIRST_CHAR:
                switch(firstEventByte) {
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_60:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_60_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_61:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_61_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_62:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_62_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_63:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_63_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_64:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_64_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_65:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_65_LENGTH);
                    default:
                        throw Error(`O evento começando com ${firstEventByte} não está mapeado.`)
                }
            case MidiProtocolConstants._7_EVENT_FIRST_CHAR:
                switch(firstEventByte) {
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_78:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_78_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_79:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_79_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_7A:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_7A_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_7B:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_7B_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_7C:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_7C_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_7D:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_7D_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_7E:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_7E_LENGTH);
                    case MidiProtocolConstants.CONTROLLER_EVENT_FIRST_BYTE_7F:
                        return new MidiCreatedEventModel(MidiProtocolConstants.CONTROLLER_EVENT_7F_LENGTH);
                    default:
                        throw Error(`O evento começando com ${firstEventByte} não está mapeado.`)
                }
            case MidiProtocolConstants.NOTE_OFF_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.NOTE_OFF_EVENT_LENGTH, this.createNoteOffEvent(deltaTime, midiData));
            case MidiProtocolConstants.NOTE_ON_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.NOTE_OFF_EVENT_LENGTH, this.createNoteOnEvent(deltaTime, midiData));
            case MidiProtocolConstants.A_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.A_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants.B_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.B_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants.C_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.C_EVENT_EVENT_LENGTH);            
            case MidiProtocolConstants.D_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.D_EVENT_EVENT_LENGTH);            
            case MidiProtocolConstants.E_EVENT_FIRST_CHAR:
                return new MidiCreatedEventModel(MidiProtocolConstants.E_EVENT_EVENT_LENGTH);
            case MidiProtocolConstants.F_EVENT_FIRST_CHAR:
                if (firstEventByte == MidiProtocolConstants.SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F0 || firstEventByte == MidiProtocolConstants.SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F7) {
                    return new MidiCreatedEventModel(
                        MidiProtocolConstants.SYSTEM_EXCLUSIVE_EVENT_MIN_LENGTH + 
                        ConvertionUtil.convertBinaryStringToNumber(
                            midiData.substr(
                               MidiProtocolConstants.SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_INDEX, 
                               MidiProtocolConstants.SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_LENGTH
                            )
                        )
                    );
                }
                if (firstEventByte == MidiProtocolConstants.META_EVENT_FIRST_BYTE) {
                    let eventTypeByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.charAt(1)); 
                    switch (eventTypeByte) {
                        case MidiProtocolConstants.META_EVENT_TEMPO_TYPE_BYTE:
                            return new MidiCreatedEventModel(MidiProtocolConstants.TEMPO_EVENT_LENGTH, this.createTempoEvent(deltaTime, midiData)); 
                        case MidiProtocolConstants.META_EVENT_TIME_SIGNATURE_TYPE_BYTE:
                            return new MidiCreatedEventModel(MidiProtocolConstants.TIME_SIGNATURE_EVENT_LENGTH, this.createTimeSignatureEvent(deltaTime, midiData));
                        case MidiProtocolConstants.META_EVENT_KEY_SIGNATURE_TYPE_BYTE:
                            return new MidiCreatedEventModel(MidiProtocolConstants.KEY_SIGNATURE_EVENT_LENGTH, this.createKeySignatureEvent(deltaTime, midiData));
                        case MidiProtocolConstants.META_EVENT_END_OF_TRACK_TYPE_BYTE:
                            return new MidiCreatedEventModel(MidiProtocolConstants.END_OF_TRACK_EVENT_LENGTH, this.createEndOfTrackEvent(deltaTime, midiData));
                        default:
                            return new MidiCreatedEventModel(
                                MidiProtocolConstants.META_EVENT_MIN_LENGTH + 
                                ConvertionUtil.convertBinaryStringToNumber(
                                    midiData.substr(
                                    MidiProtocolConstants.META_EVENT_LENGTH_BYTE_INDEX, 
                                    MidiProtocolConstants.META_EVENT_LENGTH_BYTE_LENGTH
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
            ConvertionUtil.convertBinaryStringToHexString(midiData.substr(MidiProtocolConstants.NOTE_OFF_CHANNEL_BYTE_INDEX, 
                                                                          MidiProtocolConstants.NOTE_OFF_CHANNEL_BYTE_LENGTH))
                                                                            .substr(MidiProtocolConstants.NOTE_OFF_CHANNEL_INDEX, 
                                                                                    MidiProtocolConstants.NOTE_OFF_CHANNEL_LENGTH);
        let note: number = 
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.NOTE_OFF_NOTE_BYTE_INDEX, 
                                                                       MidiProtocolConstants.NOTE_OFF_NOTE_BYTE_LENGTH));
        
        let velocity: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.NOTE_OFF_VELOCITY_BYTE_INDEX, 
                                                                       MidiProtocolConstants.NOTE_OFF_VELOCITY_BYTE_LENGTH));

        return new NoteOffMidiEvent(deltaTime, channel, note, velocity);
    }

    private createNoteOnEvent(deltaTime: number, midiData: string): NoteOnMidiEvent {
        let channel: string = 
            ConvertionUtil.convertBinaryStringToHexString(midiData.substr(MidiProtocolConstants.NOTE_ON_CHANNEL_BYTE_INDEX, 
                                                                          MidiProtocolConstants.NOTE_ON_CHANNEL_BYTE_LENGTH))
                                                                            .substr(MidiProtocolConstants.NOTE_ON_CHANNEL_INDEX, 
                                                                                    MidiProtocolConstants.NOTE_ON_CHANNEL_LENGTH);
        let note: number = 
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.NOTE_ON_NOTE_BYTE_INDEX, 
                                                                       MidiProtocolConstants.NOTE_ON_NOTE_BYTE_LENGTH));
        
        let velocity: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.NOTE_ON_VELOCITY_BYTE_INDEX, 
                                                                       MidiProtocolConstants.NOTE_ON_VELOCITY_BYTE_LENGTH));

        return new NoteOnMidiEvent(deltaTime, channel, note, velocity);
    }

    private createTempoEvent(deltaTime: number, midiData: string): TempoMidiEvent {
        let tempo: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.TEMPO_EVENT_TEMPO_INDEX, 
                                                                       MidiProtocolConstants.TEMPO_EVENT_TEMPO_LENGTH));
        return new TempoMidiEvent(deltaTime, tempo);
    }


    private createTimeSignatureEvent(deltaTime: number, midiData: string): TimeSignatureMidiEvent {
        let numerator: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.TIME_SIGNATURE_EVENT_NUMERATOR_INDEX, 
                                                                       MidiProtocolConstants.TIME_SIGNATURE_EVENT_NUMERATOR_LENGTH));
        let denominator: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.TIME_SIGNATURE_EVENT_DENOMINATOR_INDEX, 
                                                                       MidiProtocolConstants.TIME_SIGNATURE_EVENT_DENOMINATOR_LENGTH));
        let midiClocks: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.TIME_SIGNATURE_EVENT_MIDI_CLOCKS_INDEX, 
                                                                       MidiProtocolConstants.TIME_SIGNATURE_EVENT_MIDI_CLOCKS_LENGTH));        
        let notes32in4note: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_INDEX, 
                                                                       MidiProtocolConstants.TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_LENGTH));

        return new TimeSignatureMidiEvent(deltaTime, numerator, denominator, midiClocks, notes32in4note);    
    }
    
    private createKeySignatureEvent(deltaTime: number, midiData: string): KeySignatureMidiEvent {
        let tone: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.KEY_SIGNATURE_EVENT_TONE_INDEX, 
                                                                       MidiProtocolConstants.KEY_SIGNATURE_EVENT_TONE_LENGTH));

        if (tone >= MidiProtocolConstants.KEY_SIGNATURE_NEGATIVE_KEY_START)
            tone = (MidiProtocolConstants.KEY_SIGNATURE_NEGATIVE_KEY_CONTROL - tone) * -1;

        let mode: number =
            ConvertionUtil.convertBinaryStringToNumber(midiData.substr(MidiProtocolConstants.KEY_SIGNATURE_EVENT_MODE_INDEX, 
                                                                       MidiProtocolConstants.KEY_SIGNATURE_EVENT_MODE_LENGTH));
                                                               
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

        binaryString = MidiProtocolConstants.HEADER_START_VALUE 
                     + ConvertionUtil.convertNumberToBinararyString(MidiProtocolConstants.MIDI_HEADER_LENGTH_VALUE, MidiProtocolConstants.MIDI_HEADER_LENGTH_VALUE_LENGTH) 
                     + ConvertionUtil.convertNumberToBinararyString(midi.midiType, MidiProtocolConstants.MIDI_TYPE_VALUE_LENGTH)
                     + ConvertionUtil.convertNumberToBinararyString(midi.numberOfTracks, MidiProtocolConstants.MIDI_TYPE_VALUE_LENGTH)
                     + ConvertionUtil.convertNumberToBinararyString(timeDivision.metric, MidiProtocolConstants.MIDI_TIME_DIVISION_VALUE_LENGTH)

        for (let midiTrack of midi.midiTracks) {
            dataString = '';
            for (let midiEvent of midiTrack.midiEvents) {

                if(!midiEvent.deltaTime && midiEvent.deltaTime != 0) 
                    throw new Error('Delta Time não pode ser nulo ou vazio.')

                dataString += ConvertionUtil.getDeltaTimeStringFromNumber(midiEvent.deltaTime) + this.convertEventDataToHexaData(midiEvent);

            }
            binaryString += MidiProtocolConstants.TRACK_START_VALUE 
                         + ConvertionUtil.convertNumberToBinararyString(dataString.length/2 , MidiProtocolConstants.MIDI_TRACK_LENGTH_VALUE_LENGTH) 
                         + ConvertionUtil.convertHexStringToBinararyString(dataString);
        }
        return binaryString;
    }

    private convertEventDataToHexaData(midiEvent: MidiEvent) {
        if (midiEvent.isOfType(MidiEventDataType.NOTE_OFF)) {

            let event: NoteOffMidiEvent = <NoteOffMidiEvent> midiEvent; 
            return MidiProtocolConstants.NOTE_OFF_FIRST_CHAR 
                 + event.channel
                 + ConvertionUtil.convertNumberToHexString(event.note,     MidiProtocolConstants.NOTE_OFF_NOTE_BYTE_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.velocity, MidiProtocolConstants.NOTE_OFF_VELOCITY_BYTE_LENGTH);

        } else if (midiEvent.isOfType(MidiEventDataType.NOTE_ON)) {

            let event: NoteOnMidiEvent = <NoteOnMidiEvent> midiEvent; 
            return MidiProtocolConstants.NOTE_ON_FIRST_CHAR 
                 + event.channel
                 + ConvertionUtil.convertNumberToHexString(event.note,     MidiProtocolConstants.NOTE_OFF_NOTE_BYTE_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.velocity, MidiProtocolConstants.NOTE_OFF_VELOCITY_BYTE_LENGTH); 

        } else if (midiEvent.isOfType(MidiEventDataType.TEMPO)) {

            let event: TempoMidiEvent = <TempoMidiEvent> midiEvent; 
            return MidiProtocolConstants.META_EVENT_FIRST_BYTE
                 + MidiProtocolConstants.META_EVENT_TEMPO_TYPE_BYTE
                 + ConvertionUtil.convertNumberToHexString(MidiProtocolConstants.TEMPO_EVENT_DATA_LENGTH, MidiProtocolConstants.TEMPO_EVENT_DATA_LENGTH_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.tempo, MidiProtocolConstants.TEMPO_EVENT_TEMPO_LENGTH);

        } else if (midiEvent.isOfType(MidiEventDataType.TIME_SIGNATURE)) {

            let event: TimeSignatureMidiEvent = <TimeSignatureMidiEvent> midiEvent; 
            return MidiProtocolConstants.META_EVENT_FIRST_BYTE
                 + MidiProtocolConstants.META_EVENT_TIME_SIGNATURE_TYPE_BYTE
                 + ConvertionUtil.convertNumberToHexString(MidiProtocolConstants.TIME_SIGNATURE_EVENT_DATA_LENGTH, MidiProtocolConstants.TIME_SIGNATURE_EVENT_DATA_LENGTH_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.numerator,      MidiProtocolConstants.TIME_SIGNATURE_EVENT_NUMERATOR_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.denominator,    MidiProtocolConstants.TIME_SIGNATURE_EVENT_DENOMINATOR_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.midiClocks,     MidiProtocolConstants.TIME_SIGNATURE_EVENT_MIDI_CLOCKS_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.notes32in4note, MidiProtocolConstants.TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_LENGTH);
        } else if (midiEvent.isOfType(MidiEventDataType.KEY_SIGNATURE)) {

            let event: KeySignatureMidiEvent = <KeySignatureMidiEvent> midiEvent; 
            return MidiProtocolConstants.META_EVENT_FIRST_BYTE
                 + MidiProtocolConstants.META_EVENT_KEY_SIGNATURE_TYPE_BYTE
                 + ConvertionUtil.convertNumberToHexString(MidiProtocolConstants.KEY_SIGNATURE_EVENT_DATA_LENGTH, MidiProtocolConstants.KEY_SIGNATURE_EVENT_DATA_LENGTH_LENGTH)
                 + ConvertionUtil.convertNumberToHexString((event.tone < 0 ? MidiProtocolConstants.KEY_SIGNATURE_NEGATIVE_KEY_CONTROL + event.tone : event.tone), MidiProtocolConstants.KEY_SIGNATURE_EVENT_TONE_LENGTH)
                 + ConvertionUtil.convertNumberToHexString(event.mode, MidiProtocolConstants.KEY_SIGNATURE_EVENT_MODE_LENGTH);

        } else if (midiEvent.isOfType(MidiEventDataType.DETERMINATE_MUSICAL_INSTRUMENT)) {
            let event: MusicalInstrumentMidiEvent = <MusicalInstrumentMidiEvent> midiEvent; 
            return MidiProtocolConstants.C_EVENT_FIRST_CHAR
                 + event.channel
                 + ConvertionUtil.convertNumberToHexString(event.musicalInstrument, MidiProtocolConstants.MUSICAL_INSTRUMENT_EVENT_INSTRUMENT_BYTE_LENGTH);
            

        } else if (midiEvent.isOfType(MidiEventDataType.END_OF_TRACK)) {

            return MidiProtocolConstants.META_EVENT_FIRST_BYTE
                    + MidiProtocolConstants.META_EVENT_END_OF_TRACK_TYPE_BYTE
                    + ConvertionUtil.convertNumberToHexString(MidiProtocolConstants.END_OF_TRACK_EVENT_DATA_LENGTH, MidiProtocolConstants.END_OF_TRACK_EVENT_DATA_LENGTH_LENGTH);

        } else {
            throw new Error('O evento não é suportado.')
        }
    }

    public generateMidiSpectrum(midi: Midi): MidiSpectrum {
        
        if(!midi) 
            throw new Error('Midi não pode ser nulo.')

        let actualKeySignatureValue: number[] = midi.getKeySignatureValues();

        let conversionFactor = Midi.KEY_SIGNATURE_CONVERSION_ARRAY[0+7]
                             - Midi.KEY_SIGNATURE_CONVERSION_ARRAY[actualKeySignatureValue[0] + 7];

        let spectrum: MidiSpectrum = new MidiSpectrum();

        let midiTotalDeltaTime: number = 0;
        let midiMinNote: number = 128;
        let midiMaxNote: number = 0;

        let spectrumLineMap: Map<number, MidiSpectrumLine> = new Map();
        let spectrumNoteMap: Map<number, number> = new Map();

        let note: number;
        let spectrumLine: MidiSpectrumLine;
        let spectrumNote: MidiSpectrumNote;

        let noteOn: NoteOnMidiEvent;
        let noteOFF: NoteOffMidiEvent;

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
                spectrumNoteMap.set(note, midiTotalDeltaTime);
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
                    spectrumNote = new MidiSpectrumNote();
                    spectrumNote.deltaTimeStart = spectrumNoteMap.get(note);
                    spectrumNoteMap.delete(note);

                    spectrumNote.deltaTimeEnd = midiTotalDeltaTime;
                    spectrumLineMap.get(note).notes.push(spectrumNote);
                }
            }
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

    public generateMidiType1(midis: Midi[]) {
        let newMidi: Midi = new Midi(); 
        
        newMidi.midiType = MidiType.TYPE_1;
        newMidi.midiTracks = [];
        newMidi.timeDivision = midis[0].timeDivision;
        newMidi.numberOfTracks = 0;
        
        let midiChannelIndex: number = 0 
        let channelChanged: boolean;
        let channel: string;

        for (let midi of midis) {
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

class MidiProtocolConstants {
    
    public static MIDI_HEADER_LENGTH: number = 14;
    
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

    public static NOTE_OFF_FIRST_CHAR: string = '8'; 
    public static NOTE_OFF_EVENT_LENGTH: number = 3;
    public static NOTE_OFF_CHANNEL_BYTE_INDEX: number = 0;
    public static NOTE_OFF_CHANNEL_BYTE_LENGTH: number = 1;
    public static NOTE_OFF_CHANNEL_INDEX: number = 1;
    public static NOTE_OFF_CHANNEL_LENGTH: number = 1;
    public static NOTE_OFF_NOTE_BYTE_INDEX: number = 1;
    public static NOTE_OFF_NOTE_BYTE_LENGTH: number = 1;
    public static NOTE_OFF_VELOCITY_BYTE_INDEX: number = 2;
    public static NOTE_OFF_VELOCITY_BYTE_LENGTH: number = 1;

    public static NOTE_ON_FIRST_CHAR: string = '9';
    public static NOTE_ON_EVENT_LENGTH: number = 3;
    public static NOTE_ON_CHANNEL_BYTE_INDEX: number = 0;
    public static NOTE_ON_CHANNEL_BYTE_LENGTH: number = 1;
    public static NOTE_ON_CHANNEL_INDEX: number = 1;
    public static NOTE_ON_CHANNEL_LENGTH: number = 1;
    public static NOTE_ON_NOTE_BYTE_INDEX: number = 1;
    public static NOTE_ON_NOTE_BYTE_LENGTH: number = 1;
    public static NOTE_ON_VELOCITY_BYTE_INDEX: number = 2;
    public static NOTE_ON_VELOCITY_BYTE_LENGTH: number = 1;

    public static _0_EVENT_FIRST_CHAR: string = '0';
    public static _0_EVENT_EVENT_LENGTH: number = 2;

    public static _1_EVENT_FIRST_CHAR: string = '1';
    public static _1_EVENT_EVENT_LENGTH: number = 2;

    public static _2_EVENT_FIRST_CHAR: string = '2';
    public static _2_EVENT_EVENT_LENGTH: number = 2;

    public static _3_EVENT_FIRST_CHAR: string = '3';
    public static _3_EVENT_EVENT_LENGTH: number = 2;

    public static _4_EVENT_FIRST_CHAR: string = '4';
    public static _4_EVENT_EVENT_LENGTH: number = 2;

    public static _5_EVENT_FIRST_CHAR: string = '5';
    public static _5_EVENT_EVENT_LENGTH: number = 2;

    public static _6_EVENT_FIRST_CHAR: string = '6';
    public static CONTROLLER_EVENT_FIRST_BYTE_60: string = '60'; 
    public static CONTROLLER_EVENT_60_LENGTH: number = 1; 

    public static CONTROLLER_EVENT_FIRST_BYTE_61: string = '61';
    public static CONTROLLER_EVENT_61_LENGTH: number = 1;

    public static CONTROLLER_EVENT_FIRST_BYTE_62: string = '62';
    public static CONTROLLER_EVENT_62_LENGTH: number = 2; 

    public static CONTROLLER_EVENT_FIRST_BYTE_63: string = '63';
    public static CONTROLLER_EVENT_63_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_64: string = '64';
    public static CONTROLLER_EVENT_64_LENGTH: number = 2; 

    public static CONTROLLER_EVENT_FIRST_BYTE_65: string = '65';
    public static CONTROLLER_EVENT_65_LENGTH: number = 2;

    public static _7_EVENT_FIRST_CHAR: string = '7';
    public static CONTROLLER_EVENT_FIRST_BYTE_78: string = '78';
    public static CONTROLLER_EVENT_78_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_79: string = '79';
    public static CONTROLLER_EVENT_79_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_7A: string = '7a';
    public static CONTROLLER_EVENT_7A_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_7B: string = '7b';
    public static CONTROLLER_EVENT_7B_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_7C: string = '7c';
    public static CONTROLLER_EVENT_7C_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_7D: string = '7d';
    public static CONTROLLER_EVENT_7D_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_7E: string = '7e';
    public static CONTROLLER_EVENT_7E_LENGTH: number = 2;

    public static CONTROLLER_EVENT_FIRST_BYTE_7F: string = '7f';
    public static CONTROLLER_EVENT_7F_LENGTH: number = 2;

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
    
    public static SYSTEM_EXCLUSIVE_EVENT_MIN_LENGTH: number = 2;
    public static SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_INDEX: number = 1;
    public static SYSTEM_EXCLUSIVE_EVENT_LENGTH_BYTE_LENGTH: number = 1;

    public static SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F0: string = 'f0'; 
    public static SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F7: string = 'f7';
    
    public static META_EVENT_FIRST_BYTE: string = 'ff';
    public static META_EVENT_TEMPO_TYPE_BYTE: string = '51';
    public static META_EVENT_TIME_SIGNATURE_TYPE_BYTE: string = '58';
    public static META_EVENT_KEY_SIGNATURE_TYPE_BYTE: string = '59';
    public static META_EVENT_END_OF_TRACK_TYPE_BYTE: string = '2f';
    public static META_EVENT_END_OF_TRACK_VALUE: string = '00';

    public static META_EVENT_MIN_LENGTH: number = 3;
    public static META_EVENT_LENGTH_BYTE_INDEX: number = 2;
    public static META_EVENT_LENGTH_BYTE_LENGTH: number = 1;

    public static TEMPO_EVENT_LENGTH: number = 6;
    public static TEMPO_EVENT_DATA_LENGTH: number = 3;
    public static TEMPO_EVENT_DATA_LENGTH_LENGTH: number = 1;
    public static TEMPO_EVENT_TEMPO_INDEX: number = 3;
    public static TEMPO_EVENT_TEMPO_LENGTH: number = 3;
    
    public static TIME_SIGNATURE_EVENT_LENGTH: number = 7;
    public static TIME_SIGNATURE_EVENT_DATA_LENGTH: number = 4;
    public static TIME_SIGNATURE_EVENT_DATA_LENGTH_LENGTH: number = 1;
    public static TIME_SIGNATURE_EVENT_NUMERATOR_INDEX: number = 3;
    public static TIME_SIGNATURE_EVENT_NUMERATOR_LENGTH: number = 1;
    public static TIME_SIGNATURE_EVENT_DENOMINATOR_INDEX : number = 4;
    public static TIME_SIGNATURE_EVENT_DENOMINATOR_LENGTH: number = 1;
    public static TIME_SIGNATURE_EVENT_MIDI_CLOCKS_INDEX: number = 5; 
    public static TIME_SIGNATURE_EVENT_MIDI_CLOCKS_LENGTH: number = 1;        
    public static TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_INDEX: number = 6; 
    public static TIME_SIGNATURE_EVENT_NOTES_32_IN_4_NOTE_LENGTH: number = 1;

    public static KEY_SIGNATURE_EVENT_LENGTH: number = 5;
    public static KEY_SIGNATURE_EVENT_DATA_LENGTH: number = 2;
    public static KEY_SIGNATURE_EVENT_DATA_LENGTH_LENGTH: number = 1;
    public static KEY_SIGNATURE_EVENT_TONE_INDEX: number = 3;
    public static KEY_SIGNATURE_EVENT_TONE_LENGTH: number = 1;
    public static KEY_SIGNATURE_EVENT_MODE_INDEX: number = 4;
    public static KEY_SIGNATURE_EVENT_MODE_LENGTH: number = 1;
    public static KEY_SIGNATURE_NEGATIVE_KEY_START: number = 249;
    public static KEY_SIGNATURE_NEGATIVE_KEY_CONTROL: number = 256;

    public static MUSICAL_INSTRUMENT_EVENT_INSTRUMENT_BYTE_LENGTH: number = 1;

    public static END_OF_TRACK_EVENT_LENGTH: number = 3;
    public static END_OF_TRACK_EVENT_DATA_LENGTH: number = 0;
    public static END_OF_TRACK_EVENT_DATA_LENGTH_LENGTH: number = 1;

}