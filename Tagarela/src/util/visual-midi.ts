
export class VisualMidiUtil {
    
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
            case 999:
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
            case 58:
                return 'Tuba';
            case 65:
                return 'Saxofone';
            case 73:
                return 'Flauta';
            case 105:
                return 'Banjo';
            case 999:
                return 'Bateria';
        }
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

}