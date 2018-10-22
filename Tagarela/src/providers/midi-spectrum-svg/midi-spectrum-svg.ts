import { Injectable } from '@angular/core';
import { MidiSpectrum } from '../../model/midi-spectrum';
import { VisualMidiProvider } from '../visual-midi/visual-midi';

@Injectable()
export class MidiSpectrumSvgProvider {

  constructor (private visualMidiProvider: VisualMidiProvider) {}
  
    public getEncodedSVGSpectrum(spectrum: MidiSpectrum, musicalInstrumentMidiNumber: number, minNote?: number, maxNote?: number): string {

        let paleteColors: string[] = this.visualMidiProvider.getSpectrumPaleteByInstrumentType(this.visualMidiProvider.getInstrumentType(musicalInstrumentMidiNumber));

        let maxDiference: number = (((maxNote || maxNote == 0) && maxNote >= 0) ? maxNote : spectrum.maxNote) - spectrum.maxNote;
        let minDiference: number = spectrum.minNote - (((minNote || minNote == 0) && minNote >= 0) ? minNote : spectrum.minNote);

        maxDiference = maxDiference > 0 ? maxDiference : 0;
        minDiference = minDiference > 0 ? minDiference : 0;

        let svg: string = `<svg width="${(spectrum.width / 50.0)}cm" height="${(spectrum.lines.length + maxDiference + minDiference) / 2.0}cm" version="1.1" xmlns="http://www.w3.org/2000/svg">`;
        svg += `<rect x="0cm" y="0cm" width="${(spectrum.width / 50.0)}cm" height="${(spectrum.lines.length + maxDiference + minDiference) / 2.0}cm" fill="${paleteColors[0]}"/>`;
        for (let line of spectrum.lines) {
            for (let note of line.notes) {
                svg += `<rect x="${note.x / 50.0}cm" y="${(line.y + maxDiference)/ 2.0}cm" width="${(note.width / 50.0) - 0.01}cm" height="${0.5}cm" fill="${paleteColors[1]}"/>`;
            }
        }
        svg += `</svg>`; 

        return this.getEncodedSVG(svg);

    }

    public getEncodedSVG(svg: string) {
        return encodeURI('data:image/svg+xml;utf8,' + svg)
    }

    public concatenateSpectrums(spectrums: MidiSpectrum[][], musicalInstrumentMidiNumbers: number[][], minNotes?: number[], maxNotes?: number[]): string {

        let svg: string;

        let totalWidth = 0;
        let totalHeight = 0;

        for (let i = 0; i < spectrums.length; i++) {

            let lineWidth: number = 0;
            let maxHeight: number = 0;

            for (let j = 0; j < spectrums[i].length; j++) {
                let paleteColors: string[] = this.visualMidiProvider.getSpectrumPaleteByInstrumentType(this.visualMidiProvider.getInstrumentType(musicalInstrumentMidiNumbers[i][j]));

                let maxDiference: number = (((maxNotes[i] || maxNotes[i] == 0) && maxNotes[i] >= 0) ? maxNotes[i] : spectrums[i][j].maxNote) - spectrums[i][j].maxNote;
                let minDiference: number = spectrums[i][j].minNote - (((minNotes[i] || minNotes[i] == 0) && minNotes[i] >= 0) ? minNotes[i] : spectrums[i][j].minNote);
        
                maxDiference = maxDiference > 0 ? maxDiference : 0;
                minDiference = minDiference > 0 ? minDiference : 0;
        
                svg += `<rect x="${lineWidth / 50.0}cm" y="${totalHeight / 2.0}cm" width="${(spectrums[i][j].width + lineWidth / 50.0)}cm" height="${(spectrums[i][j].lines.length + maxDiference + minDiference) / 2.0}cm" fill="${paleteColors[0]}"/>`;
                for (let line of spectrums[i][j].lines) {
                    for (let note of line.notes) {
                        svg += `<rect x="${(note.x + lineWidth) / 50.0}cm" y="${(line.y + maxDiference)/ 2.0}cm" width="${(note.width / 50.0) - 0.01}cm" height="${0.5}cm" fill="${paleteColors[1]}"/>`;
                    }
                }
                lineWidth += spectrums[i][j].width
                maxHeight = (spectrums[i][j].lines.length + maxDiference + minDiference > maxHeight ? spectrums[i][j].lines.length + maxDiference + minDiference : maxHeight ) 
            }

            totalWidth = (lineWidth > totalWidth ? lineWidth : totalWidth)

            totalHeight += maxHeight;

        }

        return this.getEncodedSVG(`<svg width="${(totalWidth / 50.0)}cm" height="${totalHeight/ 2.0}cm" version="1.1" xmlns="http://www.w3.org/2000/svg">`
         + svg + `</svg>`);

    }


}
