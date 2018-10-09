
export class VisualMidi {
    
    public getIonIconToMidiNumber(midiNumber: number): string {
        switch (midiNumber) {
            case 0:
                return 'instrument-piano';
            case 21:
                return 'instrument-accordion';
            case 24:
                return 'instrument-guitar';
            case 56:
                return 'instrument-trumpet';
            case 65:
                return 'instrument-saxophone';
        }
        return ''
    }

    public getInstrumentNameToMidiNumber(midiNumber: number): string {
        switch (midiNumber) {
            case 0:
                return 'Piano';
            case 21:
                return 'Acordeon';
            case 24:
                return 'Violão';
            case 56:
                return 'Trompete';
            case 65:
                return 'Saxofone';
        }
        return 'Desconhecido'
    }

}