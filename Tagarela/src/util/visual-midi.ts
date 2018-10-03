
export class VisualMidi {
    
    public getIonIconToMidiNumber(midiNumber: number): string {
        switch (midiNumber) {
            case 1:
                return 'appname-customicon1';
            case 2:
                return 'appname-customicon2';
            case 3:
                return 'appname-customicon3';
            case 4:
                return 'appname-customicon4';
        }
        return ''
    }

    public getInstrumentNameToMidiNumber(midiNumber: number): string {
        switch (midiNumber) {
            case 1:
                return 'Trompete';
            case 2:
                return 'Violão';
            case 3:
                return 'Acordeon';
            case 4:
                return 'Saxofone';
        }
        return 'Desconhecido'
    }

}