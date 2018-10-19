import { Midi, MidiTrack, MidiEvent, MidiConstants, MidiEventType, MidiEventDataType } from "../model/midi";
import { ConvertionUtil } from "../util/hexa";

export class MidiControl {

    public setupMidiFromFile(binaryString: string, midiToCompare: Midi): Midi {
        
        if (!binaryString || binaryString.length <= 0)
            throw Error(`A primeira parte do caminho não pode ser nulo ou vazio.`);

        let midi: Midi = new Midi();
        
        if (binaryString.length < 14) 
            throw Error(`O arquivo midi deve possuir no mínimo 14 bytes.`);

        if (binaryString.substr(0, 4) != MidiConstants.HEADER_START_INDICATION) 
            throw Error(`O arquivo midi deve começar com a indicação ${MidiConstants.HEADER_START_INDICATION}.`);

        if (ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(4, 4)) != 6) 
            throw Error(`A indicação de tamanho definido para o cabeçalho deve ser 6.`);
        
        let midiType: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(8, 2));
        if (midiType != 0 && midiType != 1) 
            throw Error(`O tipo de Midi ${midiType} não é suportado. Somente é suportado os tipos 0 e 1.`);
        midi.midiType = midiType;

        let numberOfTracks: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(10, 2));
        if (numberOfTracks < 1) 
            throw Error(`A quantidade de tracks deve ser maior que 0.`);
        midi.numberOfTracks = numberOfTracks;
       
        let timeDividionType: number = ConvertionUtil.getFistBit(ConvertionUtil.convertBinaryStringToHexString(binaryString.substr(12, 2))); 
        if (timeDividionType != 0) 
            throw Error(`O tipo de Time Division ${timeDividionType} não é suportado. Somente é suportado o tipo 0.`);

        let timeDividion: string = ConvertionUtil.convertBinaryStringToHexString(binaryString.substr(12, 2));
        midi.timeDivision = timeDividion;

        midi.midiTracks = [];

        let actualByte: number = 14;
        for (let i = 0; i < numberOfTracks; i++) {

            if (binaryString.length < actualByte + 8)
                throw Error(`O arquivo midi não possui a descrição correta de track. Track: ${i}`);

            if (binaryString.substr(actualByte, 4) != MidiConstants.TRACK_START_INDICATION) 
                throw Error(`O track deve começar com a indicação ${MidiConstants.TRACK_START_INDICATION}. Track: ${i}`);
            
            actualByte += 4;
            let taskLength: number = ConvertionUtil.convertBinaryStringToNumber(binaryString.substr(actualByte, 4))
        
            actualByte += 4;
            let finishLength: number = actualByte + taskLength;

            let timeSignatureEvent: MidiEvent = null;
            let midiKeySignatureEvent: MidiEvent = null;
            let endOfTrackEvent: MidiEvent = null;

            let midiTrack: MidiTrack = new MidiTrack();
            let deltaTime: number = 0;

            while (actualByte < finishLength) {
                //deltaTime
                let deltaTimeStart: number = actualByte;
                let deltaTimeLength: number = 1;

                while (!ConvertionUtil.isLastDeltaTimeByte(binaryString.charAt(deltaTimeStart + deltaTimeLength - 1))) {
                    deltaTimeLength++;
                    if (deltaTimeLength > 4) 
                        throw Error(`Delta time não pode ocupar mais de 4 bytes. Track: ${i} - Byte ${actualByte}`);
                }

                //calcula delta time
                deltaTime += ConvertionUtil.calculateDeltaTime(binaryString.substr(deltaTimeStart, deltaTimeLength));
                actualByte += deltaTimeLength;

                //create event or sum delta time
                let midiEvent: MidiEvent;
                try {
                    midiEvent = this.getMidiEventData(deltaTime, binaryString.substr(actualByte));
                } catch (e) {
                    throw Error(`Ocorreu um erro ao obter o evento Midi {. ${(e && e.message ? e.message : 'null' )}} Track: ${i} - Byte ${actualByte}`);
                }

                actualByte += midiEvent.getDataLength();

                //validate types
                if (midiEvent.isOfType(MidiEventDataType.TIME_SIGNATURE)) {
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

    public getMidiEventData(deltaTime: number, midiData: string): MidiEvent {
        let firstEventByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 1)); 
        switch (firstEventByte.charAt(0)) {
            case '8':
                return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                    ,deltaTime
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,true);
            case '9':
                return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                    ,deltaTime
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,true);
            case 'a':
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,false);    
            case 'b':
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,false); 
            case 'c':
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2))
                                    ,false); 
            case 'd':
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2))
                                    ,false); 
            case 'e':
                return new MidiEvent(''
                                    ,0
                                    ,MidiEventType.MIDI_EVENT
                                    ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 3))
                                    ,false); 
            case 'f':
                if (firstEventByte == 'f0' || firstEventByte == 'f7') {
                    return new MidiEvent(''
                                        ,0
                                        ,MidiEventType.SYSEX_EVENT
                                        ,ConvertionUtil.convertBinaryStringToHexString(midiData.substr(0, 2 + ConvertionUtil.convertBinaryStringToNumber(midiData.charAt(1))))
                                        ,false);

                }
                if (firstEventByte == 'ff') {
                    let eventTypeByte: string = ConvertionUtil.convertBinaryStringToHexString(midiData.charAt(1)); 
                    return new MidiEvent(ConvertionUtil.getDeltaTimeStringFromNumber(deltaTime)
                                        ,deltaTime
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

        midiHeaderString = 'MThd' + ConvertionUtil.convertHexStringToBinararyString('00000006'       
        + midiType + trackQuantity + midi.timeDivision);

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