import { Injectable } from '@angular/core';

@Injectable()
export class VisualMidiProvider {

    public getCompassFormula(numerator: number, denominator: number) {
        return numerator + '/' + Math.pow(2, denominator)
    }

    public getMode(mode: number) {
        switch (mode) {
            case 0: return 'Maior'
            case 1: return 'Menor'
            default: return 'Desconhecido'
        }
    }

    public getKeySignatureName(keySignatureNumber: number, mode: number): string {
        switch (keySignatureNumber) {
            case -7:
                if (mode == 0)
                    return 'Dób Maior';
                else if(mode == 1)
                    return 'Láb Menor';
                else 
                    return 'Desconhecido';
            case -6:
                if (mode == 0)
                    return 'Solb Maior';
                else if(mode == 1)
                    return 'Mib Menor';
                else 
                    return 'Desconhecido';
            case -5:
                if (mode == 0)
                    return 'Réb Maior';
                else if(mode == 1)
                    return 'Sib Menor';
                else 
                    return 'Desconhecido';
            case -4:
                if (mode == 0)
                    return 'Láb Maior';
                else if(mode == 1)
                    return 'Fá Menor';
                else 
                    return 'Desconhecido';
            case -3:
                if (mode == 0)
                    return 'Mib Maior';
                else if(mode == 1)
                    return 'Dó Menor';
                else 
                    return 'Desconhecido';
            case -2:
                if (mode == 0)
                    return 'Sib Maior';
                else if(mode == 1)
                    return 'Sol Menor';
                else 
                    return 'Desconhecido';
            case -1:
                if (mode == 0)
                    return 'Fá Maior';
                else if(mode == 1)
                    return 'Ré Menor';
                else 
                    return 'Desconhecido';
            case 0:
                if (mode == 0)
                    return 'Dó Maior';
                else if(mode == 1)
                    return 'Lá Menor';
                else 
                    return 'Desconhecido';
            case 1:
                if (mode == 0)
                    return 'Sol Maior';
                else if(mode == 1)
                    return 'Mi Menor';
                else 
                    return 'Desconhecido';
            case 2:
                if (mode == 0)
                    return 'Ré Maior';
                else if(mode == 1)
                    return 'Si Menor';
                else 
                    return 'Desconhecido';
            case 3:
                if (mode == 0)
                    return 'Lá Maior';
                else if(mode == 1)
                    return 'Fá# Menor';
                else 
                    return 'Desconhecido';
            case 4:
                if (mode == 0)
                    return 'Mi Maior';
                else if(mode == 1)
                    return 'Dó# Menor';
                else 
                    return 'Desconhecido';
            case 5:
                if (mode == 0)
                    return 'Si Maior';
                else if(mode == 1)
                    return 'Sol# Menor';
                else 
                    return 'Desconhecido';
            case 6:
                if (mode == 0)
                    return 'Fá# Maior';
                else if(mode == 1)
                    return 'Ré# Menor';
                else 
                    return 'Desconhecido';
            case 7:
                if (mode == 0)
                    return 'Dó# Maior';
                else if(mode == 1)
                    return 'Lá# Menor';
                else 
                    return 'Desconhecido';
        }
        return ''
    }

    public getIonIconToKeySignatureNumber(keySignatureNumber: number): string {
        return 'key_signature_' + keySignatureNumber;
    }

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
            case 61:
                return 'instrument-horn';
            case 65:
                return 'instrument-saxophone';
            case 73:
                return 'instrument-flute';
            case 105:
                return 'instrument-banjo';
            case -1:
                return 'instrument-snare-drum';
        }
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
            case 61:
                return 'Trompa';
            case 65:
                return 'Saxofone';
            case 73:
                return 'Flauta';
            case 105:
                return 'Banjo';
            case -1:
                return 'Bateria';
        }
        return 'Desconhecido'
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
            case 61:		
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

}
