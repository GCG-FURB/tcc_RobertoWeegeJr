import { Injectable } from '@angular/core';
import { MidiSpectrum } from '../../model/midi-spectrum';
import { VisualMidiProvider } from '../visual-midi/visual-midi';
import { Midi } from '../../model/midi';

@Injectable()
export class MidiSpectrumSvgProvider {

    private DEFAULT_WIDTH_BLOCK_SIZE: number = 30;
    private DEFAULT_HEIGHT_BLOCK_SIZE: number = 30;
    private NOTE_CHANGE_AJUST_FRACTION: number = 16;

    constructor (private visualMidiProvider: VisualMidiProvider) {}
  
    public getEncodedSVGSpectrum(spectrum: MidiSpectrum, musicalInstrumentMidiNumber: number, deltaTimeMetric: number, minNote?: number, maxNote?: number): string {

        let svgWidth: number = this.DEFAULT_WIDTH_BLOCK_SIZE;
        let svgHeight: number = this.DEFAULT_HEIGHT_BLOCK_SIZE;

        let paleteColors: string[] = this.visualMidiProvider.getSpectrumPaleteByInstrumentType(this.visualMidiProvider.getInstrumentType(musicalInstrumentMidiNumber));

        maxNote = (((maxNote || maxNote == 0) && maxNote > spectrum.maxNote) ? maxNote : spectrum.maxNote) + 1;
        minNote = (((minNote || minNote == 0) && minNote < spectrum.minNote) ? minNote : spectrum.minNote) - 1;

        let deltaTimeWidthUnit = svgWidth / spectrum.deltaTime;
        let lineHeightUnit = svgHeight / (maxNote - minNote + 1) ;
        let adjustNoteChangeFactor = deltaTimeWidthUnit * (deltaTimeMetric / this.NOTE_CHANGE_AJUST_FRACTION);

        let svg: string = `<svg width="${svgWidth}cm" height="${svgHeight}cm" version="1.1" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="0cm" y="0cm" width="${svgWidth + adjustNoteChangeFactor}cm" height="${svgHeight}cm" fill="${paleteColors[0]}"/>`
        
        let deslocationFactor: number = maxNote - spectrum.maxNote;

        for (let i = 0; i < spectrum.lines.length; i++) {
            for (let j = 0; j < spectrum.lines[i].notes.length; j++) {
                svg += `<rect x="${deltaTimeWidthUnit * spectrum.lines[i].notes[j].deltaTimeStart}cm" ` 
                           + `y="${((spectrum.lines.length - 1 - i + deslocationFactor) * lineHeightUnit)}cm" `
                           + `width="${(deltaTimeWidthUnit * (spectrum.lines[i].notes[j].deltaTimeEnd - spectrum.lines[i].notes[j].deltaTimeStart - adjustNoteChangeFactor))}cm" `
                           + `height="${lineHeightUnit}cm" ` 
                           + `fill="${paleteColors[1]}"/>`;
            }
        }

        svg += `</svg>`; 
        return this.getEncodedSVG(svg);

    }

    public getEncodedSVG(svg: string) {
        return encodeURI('data:image/svg+xml;utf8,' + svg)
    }

    public concatenateSpectrums(spectrums: MidiSpectrum[][], musicalInstrumentMidiNumbers: number[][], deltaTimeMetric: number, minNotes?: number[], maxNotes?: number[]): string {

        let svgWidth: number = this.DEFAULT_WIDTH_BLOCK_SIZE * spectrums[0].length;  //x
        let svgHeight: number = this.DEFAULT_HEIGHT_BLOCK_SIZE * spectrums.length;    //y

        let maxDeltaTime: number = 0;
        for (let midiSpectrums of spectrums) {
            let deltaTimeSum: number = 0;
            for(let spectrum of midiSpectrums){
                deltaTimeSum += spectrum.deltaTime;
            }
            if (deltaTimeSum > maxDeltaTime) {
                maxDeltaTime = deltaTimeSum;
            }
        }

        let deltaTimeWidthUnit = svgWidth / maxDeltaTime;

        let adjustNoteChangeFactor = deltaTimeWidthUnit * (deltaTimeMetric / this.NOTE_CHANGE_AJUST_FRACTION);

        let svg: string = `<svg width="${svgWidth}cm" height="${svgHeight}cm" version="1.1" xmlns="http://www.w3.org/2000/svg">`;

        let widthDeslocation: number = 0;
        let heightDeslocation: number = 0;

        for (let k = 0; k < spectrums.length; k++) {

            let maxNote = (maxNotes || maxNotes[k] == 0) ? maxNotes[k] : Midi.MIN_NOTE_NUMBER;
            let minNote = (minNotes || minNotes[k] == 0) ? minNotes[k] : Midi.MAX_NOTE_NUMBER;
            
            for (let l = 0; l < spectrums[k].length; l++) {
                if (spectrums[k][l].maxNote > maxNote) {
                    maxNote = spectrums[k][l].maxNote;
                }
                if (spectrums[k][l].minNote < minNote) {
                    minNote = spectrums[k][l].minNote;
                }
            }
            maxNote++;
            minNote--;

            let lineHeightUnit = (svgHeight / spectrums.length) / (maxNote - minNote + 1) ;
            widthDeslocation = 0;

            for (let l = 0; l < spectrums[k].length; l++) {
                
                let paleteColors: string[] = this.visualMidiProvider.getSpectrumPaleteByInstrumentType(this.visualMidiProvider.getInstrumentType(musicalInstrumentMidiNumbers[k][l]));
                svg += `<rect x="${widthDeslocation}cm" y="${heightDeslocation}cm" width="${(spectrums[k][l].deltaTime * deltaTimeWidthUnit) + adjustNoteChangeFactor}cm" height="${svgHeight / spectrums.length}cm" fill="${paleteColors[0]}"/>`;

                let deslocationFactor: number = maxNote - spectrums[k][l].maxNote;
        
                for (let i = 0; i < spectrums[k][l].lines.length; i++) {
                    for (let j = 0; j < spectrums[k][l].lines[i].notes.length; j++) {
                        svg += `<rect x="${widthDeslocation + (deltaTimeWidthUnit * spectrums[k][l].lines[i].notes[j].deltaTimeStart)}cm" ` 
                                   + `y="${heightDeslocation + ((spectrums[k][l].lines.length - 1 - i + deslocationFactor) * lineHeightUnit)}cm" `
                                   + `width="${(deltaTimeWidthUnit * (spectrums[k][l].lines[i].notes[j].deltaTimeEnd - spectrums[k][l].lines[i].notes[j].deltaTimeStart - adjustNoteChangeFactor))}cm" `
                                   + `height="${lineHeightUnit}cm" ` 
                                   + `fill="${paleteColors[1]}"/>`;
                    }
                }
                widthDeslocation += (spectrums[k][l].deltaTime * deltaTimeWidthUnit)
            }
            heightDeslocation += (svgHeight / spectrums.length);
        }
        
        svg += `</svg>`; 
        return this.getEncodedSVG(svg);

    }

}
