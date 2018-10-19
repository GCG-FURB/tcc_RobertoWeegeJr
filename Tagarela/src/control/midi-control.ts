import { Midi, MidiTrack, MidiEvent, MidiEventType, MidiEventDataType, MidiType, MidiTimeDivisionType, MidiTimeDivisionMetrical } from "../model/midi";
import { ConvertionUtil } from "../util/hexa";

export class MidiControl {

    public setupMidiFromFile(binaryString: string, midiToCompare: Midi): Midi {
        
        if (!binaryString || binaryString.length <= 0)
            throw Error(`A primeira parte do caminho não pode ser nulo ou vazio.`);

        let midi: Midi = new Midi();
        
        if (binaryString.length < Midi.MIDI_HEADER_LENGTH) 
            throw Error(`O arquivo midi deve possuir no mínimo 14 bytes.`);

        let actualByte: number = 0;

        if (binaryString.substr(actualByte, Midi.HEADER_START_VALUE.length) != Midi.HEADER_START_VALUE) 
            throw Error(`O arquivo midi deve começar com a indicação ${Midi.HEADER_START_VALUE}.`);

        actualByte += Midi.HEADER_START_VALUE.length;

        if (ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, Midi.MIDI_HEADER_LENGTH_VALUE_LENGTH)) != Midi.MIDI_HEADER_LENGTH_VALUE) 
            throw Error(`A indicação de tamanho definido para o cabeçalho deve ser ${Midi.MIDI_HEADER_LENGTH_VALUE_LENGTH}.`);
        
        actualByte += Midi.MIDI_HEADER_LENGTH_VALUE_LENGTH;

        let midiType: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, Midi.MIDI_TYPE_VALUE_LENGTH));
        if (midiType != MidiType.TYPE_0 && midiType != MidiType.TYPE_1) 
            throw Error(`O tipo de Midi ${midiType} não é suportado. Somente é suportado os tipos ${MidiType.TYPE_0} e ${MidiType.TYPE_1}.`);
        midi.midiType = midiType;

        actualByte += Midi.MIDI_TYPE_VALUE_LENGTH;

        let numberOfTracks: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, Midi.MIDI_TRACK_QUANTITY_VALUE_LENGTH));
        if (numberOfTracks < 1) 
            throw Error(`A quantidade de tracks deve ser maior que 0.`);
        midi.numberOfTracks = numberOfTracks;

        actualByte += Midi.MIDI_TRACK_QUANTITY_VALUE_LENGTH;
       
        let timeDividionType: number = ConvertionUtil.getFistBit(ConvertionUtil.convertBinaryStringToHexString(binaryString.substr(actualByte, Midi.MIDI_TIME_DIVISION_VALUE_LENGTH))); 
        if (timeDividionType != MidiTimeDivisionType.METRICAL_TYPE) 
            throw Error(`O tipo de Time Division ${timeDividionType} não é suportado. Somente é suportado o tipo ${MidiTimeDivisionType.METRICAL_TYPE}.`);

        let timeDividionMetric: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, Midi.MIDI_TIME_DIVISION_VALUE_LENGTH));
        let timeDivision: MidiTimeDivisionMetrical = new MidiTimeDivisionMetrical(timeDividionMetric);
        midi.timeDivision = timeDivision;

        actualByte += Midi.MIDI_TIME_DIVISION_VALUE_LENGTH;

        midi.midiTracks = [];

        for (let i = 0; i < numberOfTracks; i++) {

            if (binaryString.length < actualByte + Midi.MIDI_TRACK_DESC_LENGTH)
                throw Error(`O arquivo midi não possui a descrição correta de track. Track: ${i}`);

            if (binaryString.substr(actualByte, Midi.TRACK_START_VALUE.length) != Midi.TRACK_START_VALUE) 
                throw Error(`O track deve começar com a indicação ${Midi.TRACK_START_VALUE}. Track: ${i}`);
            
            actualByte += Midi.TRACK_START_VALUE.length;
            let taskLength: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, Midi.MIDI_TRACK_LENGTH_VALUE_LENGTH))
        
            actualByte += Midi.MIDI_TRACK_LENGTH_VALUE_LENGTH;
            let finishLength: number = actualByte + taskLength;

            let timeSignatureEvent: MidiEvent = null;
            let midiKeySignatureEvent: MidiEvent = null;
            let endOfTrackEvent: MidiEvent = null;
            let midiChannel: string;

            let midiTrack: MidiTrack = new MidiTrack();
            let deltaTime: number = 0;

            while (actualByte < finishLength) {
                //deltaTime
                let deltaTimeStart: number = actualByte;
                let deltaTimeLength: number = 1;

                while (!ConvertionUtil.isLastDeltaTimeByte(binaryString.charAt(deltaTimeStart + deltaTimeLength - 1))) {
                    deltaTimeLength++;
                    if (deltaTimeLength > Midi.MIDI_DELTA_TIME_MAX_LENGTH) 
                        throw Error(`Delta time não pode ocupar mais de 4 bytes. Track: ${i} - Byte ${actualByte}`);
                }

                //calcula delta time
                deltaTime += ConvertionUtil.calculateDeltaTime(binaryString.substr(deltaTimeStart, deltaTimeLength));
                actualByte += deltaTimeLength;

                //create event or sum delta time
                let midiEvent: MidiEvent;
                try {
                    midiEvent = this.generateMidiEventFromBinaryString(deltaTime, binaryString.substr(actualByte));
                } catch (e) {
                    throw Error(`Ocorreu um erro ao obter o evento Midi { ${(e && e.message ? e.message : 'null' )}}. Track: ${i} - Byte ${actualByte}`);
                }

                actualByte += midiEvent.getDataLength();

                //validate types
                let actualMidiChannel: string = midiEvent.getMidiHexChannelOfNoteOnOrOff();
                if (actualMidiChannel) {
                    if (midiChannel) {
                        if (midiChannel != actualMidiChannel)
                            throw Error(`Mais de um canal por track não é suportado.`);
                    } else {
                        midiChannel = actualMidiChannel;
                    }
                } else if (midiEvent.isOfType(MidiEventDataType.TIME_SIGNATURE)) {
                    if (timeSignatureEvent) {
                        if (timeSignatureEvent.midiEventData != midiEvent.midiEventData)
                            throw Error(`Mais de uma definição de assinatura de tempo não são suportadas. Track: ${i} - Byte ${actualByte}`);
                        midiEvent.loadEvent = false;
                    } else {
                        if (midiToCompare) {
                            let compareEvents: MidiEvent[] = midiToCompare.getEventByType(MidiEventDataType.TIME_SIGNATURE);
                            for (let compareEvent of compareEvents) {
                                if (compareEvent.midiEventData != midiEvent.midiEventData) 
                                    throw Error(`A definição de assinatura de tempo é diferente entre o arquivo atual e o de comparação. Track: ${i} - Byte ${actualByte}`);
                            }
                        } 
                        timeSignatureEvent = midiEvent;
                    }
                } else if (midiEvent.isOfType(MidiEventDataType.KEY_SIGNATURE)) {
                    if (midiKeySignatureEvent) {
                        if (midiKeySignatureEvent.midiEventData != midiEvent.midiEventData)
                            throw Error(`Mais de uma definição de assinatura de tonalidade não são suportadas. Track: ${i} - Byte ${actualByte}`);
                        midiEvent.loadEvent = false;
                    } else {
                        midiKeySignatureEvent = midiEvent;
                    }
                } else if (midiEvent.isOfType(MidiEventDataType.END_OF_TRACK)) {
                    if (endOfTrackEvent)
                        throw Error(`Uma track deve ter somente um evento de finalização. Track: ${i} - Byte ${actualByte}`);
                    if (actualByte < finishLength) {
                        throw Error(`O evento de finalização de track deve ser o último evento do track. Track: ${i} - Byte ${actualByte}`);
                    }
                    endOfTrackEvent = midiEvent;
                }

                //add event to track
                if (midiEvent.loadEvent){
                    deltaTime = 0;
                    midiTrack.addMidiEvent(midiEvent);
                } 
            }

            if (actualByte != finishLength) 
                throw Error(`A definiçã de tamanho de track está errada. Track: ${i}`);

            if (!timeSignatureEvent)
                throw Error(`Não foi encontrado evento de assinatura de tempo. Track: ${i}`);
            
            if (!midiKeySignatureEvent)
                throw Error(`Não foi encontrado evento de tonalidade. Track: ${i}`);

            if (!endOfTrackEvent)
                throw Error(`Não foi encontrado evento de finalização de track. Track: ${i}`);

            midi.midiTracks.push(midiTrack);
        }
        return midi;
    }

    public generateMidiEventFromBinaryString(deltaTime: number, midiData: string): MidiEvent {
        
        if ((!deltaTime && deltaTime !== 0) || deltaTime < 0) {
            throw new Error('Delta time não pode ser nulo ou menor que zero.')
        }
        if (!midiData || midiData.length < 2) {
            throw new Error('Os dados Midi devem possuir ao menos dois bytes.')
        }

        let firstEventByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 1)); 
        
        switch (firstEventByte.charAt(0)) {
            case MidiEvent.NOTE_OFF_FIRST_CHAR:
                return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                    ,deltaTime
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.NOTE_OFF_EVENT_LENGTH))
                                    ,true);
            case MidiEvent.NOTE_ON_FIRST_CHAR:
                return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                    ,deltaTime
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.NOTE_ON_EVENT_LENGTH))
                                    ,true);
            case MidiEvent.A_EVENT_FIRST_CHAR:
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.A_EVENT_EVENT_LENGTH))
                                    ,false);    
            case MidiEvent.B_EVENT_FIRST_CHAR:
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.B_EVENT_EVENT_LENGTH))
                                    ,false); 
            case MidiEvent.C_EVENT_FIRST_CHAR:
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.C_EVENT_EVENT_LENGTH))
                                    ,false); 
            case MidiEvent.D_EVENT_FIRST_CHAR:
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.D_EVENT_EVENT_LENGTH))
                                    ,false); 
            case MidiEvent.E_EVENT_FIRST_CHAR:
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, MidiEvent.E_EVENT_EVENT_LENGTH))
                                    ,false); 
            case MidiEvent.F_EVENT_FIRST_CHAR:
                if (firstEventByte == MidiEvent.SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F0 || firstEventByte == MidiEvent.SYSTEM_EXCLUSIVE_EVENTS_FIRST_BYTE_F7) {
                    return new MidiEvent(''
                                        ,0
                                        ,MidiEventType.SYSEX_EVENT
                                        ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2 + ConvertionUtil.convertBinaryStringToNumber(midiData.charAt(1))))
                                        ,false);
                }
                if (firstEventByte == MidiEvent.META_EVENT_FIRST_BYTE) {
                    let eventTypeByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.charAt(1)); 
                    return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                        ,deltaTime
                                        ,MidiEventType.META_EVENT
                                        ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3 + ConvertionUtil.convertBinaryStringToNumber(midiData.charAt(2))))
                                        ,eventTypeByte == MidiEvent.META_EVENT_TEMPO_TYPE_BYTE || 
                                         eventTypeByte == MidiEvent.META_EVENT_TIME_SIGNATURE_TYPE_BYTE || 
                                         eventTypeByte == MidiEvent.META_EVENT_KEY_SIGNATURE_TYPE_BYTE || 
                                         eventTypeByte == MidiEvent.META_EVENT_END_OF_TRACK_TYPE_BYTE);
                }
                throw Error(`O evento começando com ${firstEventByte} não está mapeado.`)
            default:
                throw Error(`O evento começando com ${firstEventByte.charAt(0)} não está mapeado.`)
        }
    }

    public getBinaryString(midi: Midi): string {
        
        let midiHeaderString: string;
        let midiTracksString: string = '';
        let midiEndBinaryString: string = '';

        let midiType: string = midi.midiType + '';
        while(midiType.length < 4) {
            midiType = '0' + midiType;
        }

        let trackQuantity: string = midi.midiTracks.length + '';
        while(trackQuantity.length < 4) {
            trackQuantity = '0' + trackQuantity;
        }

        let timedivisionObject: MidiTimeDivisionMetrical = <MidiTimeDivisionMetrical> midi.timeDivision;

        midiHeaderString = 'MThd' + ConvertionUtil.convertHexStringToBinararyString('00000006'       
        + midiType + trackQuantity + ConvertionUtil.convertNumberToHexString(timedivisionObject.metric, 2));

        for (let midiTrack of midi.midiTracks) {
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
}