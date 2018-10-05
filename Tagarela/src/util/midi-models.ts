export class MidiMusicalInstrument {
    constructor(private _midiNumber: number) {
    }

    get midiNumber(): number {
        return this._midiNumber;
    }

    set midiNumber(midiNumber: number) {
        this._midiNumber = midiNumber;
    }

}
