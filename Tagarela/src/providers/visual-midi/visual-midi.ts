import { Injectable } from '@angular/core';

@Injectable()
export class VisualMidiProvider {

    constructor() {}

    public getIonIconToMidiNumber(midiNumber: number): string {
        switch (midiNumber) {
            case 0:
                return 'instrument-piano';
            case 11:
                return 'instrument-vibraphone';
            case 13:
                return 'instrument-xylophone';
            case 21:
                return 'instrument-accordion';
            case 24:
                return 'instrument-acoustic-guitar';
            case 26:
                return 'instrument-electric-guitar';
            case 33:
                return 'instrument-bass-guitar';
            case 41:
                return 'instrument-violin';
            case 46:
                return 'instrument-harp';
            case 56:
                return 'instrument-trumpet';
            case 57:
                return 'instrument-trombone';
            case 58:
                return 'instrument-tuba';
            case 65:
                return 'instrument-saxophone';
            case 73:
                return 'instrument-flute';
            case 105:
                return 'instrument-banjo';
            case -1:
                return 'instrument-snare-drum';
        }
        alert(midiNumber)
        return ''
    }

    public getInstrumentNameToMidiNumber(midiNumber: number): string {
        switch (midiNumber) {
           case 0:
                return 'Piano';
            case 11:
                return 'Vibrafone';
            case 13:
                return 'Xylofone';
            case 21:
                return 'Acordeon';
            case 24:
                return 'Violão';
            case 26:
                return 'Guitarra';
            case 33:
                return 'Contrabaixo elétrico';
            case 41:
                return 'Violino';
            case 46:
                return 'Harpa';
            case 56:
                return 'Trompete';
            case 57:
                return 'Trombone';
            case 58:
                return 'Tuba';
            case 65:
                return 'Saxofone';
            case 73:
                return 'Flauta';
            case 105:
                return 'Banjo';
            case -1:
                return 'Bateria';
        }
        alert(midiNumber)
        return 'Desconhecido'
    }

    public getInstrumentNameToMayorKeySignatureNumber(keySignatureNumber: number): string {
        switch (keySignatureNumber) {
            case -7:
                return 'Dób Maior';
            case -6:
                return 'Solb Maior';
            case -5:
                return 'Réb Maior';
            case -4:
                return 'Láb Maior';
            case -3:
                return 'Mib Maior';
            case -2:
                return 'Sib Maior';
            case -1:
                return 'Fá Maior';
            case 0:
                return 'Dó Maior';
            case 1:
                return 'Sol Maior';
            case 2:
                return 'Ré Maior';
            case 3:
                return 'Lá Maior';
            case 4:
                return 'Mi Maior';
            case 5:
                return 'Si Maior';
            case 6:
                return 'Fá# Maior';
            case 7:
                return 'Dó# Maior';
        }
        return ''
    }

    public getIonIconToMayorKeySignatureNumber(keySignatureNumber: number): string {
        return 'key_signature_' + keySignatureNumber;
    }

    public getSpectrumPaleteByInstrumentType(instrumentType: string){

        switch(instrumentType){
            case 'instrument_type_keys':
                return ['#F44336', '#D32F2F', '#B71C1C'];
            case 'instrument_type_strings':
                return ['#4CAF50', '#388E3C', '#1B5E20'];
            case 'instrument_type_brass':
                return ['#2196F3', '#1976D2', '#0D47A1'];
            case 'instrument_type_woods':
                return ['#FFEB3B', '#FBC02D', '#F57F17'];
            case 'instrument_type_percussion':
                return ['#FFC107', '#FFA000', '#FF6F00'];
        }
        return ['#000000', '#888888', '#FFFFFF'];
    }

    public getInstrumentType(midiNumber: number): string {
        switch (midiNumber) {
            case 0:
            case 21:
                return 'instrument_type_keys';
            case 24:
            case 26:
            case 33:
            case 41:
            case 46:
            case 105:
				return 'instrument_type_strings';
	        case 56:
            case 57:
            case 58:		
				return 'instrument_type_brass';
			case 65:
            case 73:			
				return 'instrument_type_woods';
			case 11:
            case 13:
			case -1:
				return 'instrument_type_percussion';

        }
        return 'none'
    }


}
