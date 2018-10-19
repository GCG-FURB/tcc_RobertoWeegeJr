import { Midi } from "./midi";


export class PlayMidiSpectrums {

    spectrumLines: PlayMidiSpectrum[];

    midi: Midi;
    midiId: string;

    constructor() {
        this.spectrumLines = [];
    }

}

export class PlayMidiSpectrum {

    spectrumSVGs: string[]; 

    constructor() {
        this.spectrumSVGs = [];
    }

}
