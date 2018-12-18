import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';

@Injectable()
export class FileProvider {

    private DEFAULT_TEMP_AREA_RELATIVE_DIR: string = 'temp/';
    private DEFAULT_DOWNLOAD_RELATIVE_DIR: string = 'Download/';
    private MIDI_FILE_EXTENSION: string = '.mid';

    private _tempAreaSystemDir: string;
    private _tempAreaRelativeDir: string;
    private _tempAreaFullDir: string;

    private _downloadSystemDir: string;
    private _downloadRelativeDir: string;
    private _downloadFullDir: string;
    
    constructor(private file: File) {
        this.tempAreaSystemDir = this.file.dataDirectory; 
        this.tempAreaRelativeDir = this.DEFAULT_TEMP_AREA_RELATIVE_DIR;
        this.tempAreaFullDir = this.concatenatePath(this.tempAreaSystemDir, this.tempAreaRelativeDir);
        this.downloadSystemDir = this.file.externalRootDirectory; 
        this.downloadRelativeDir = this.DEFAULT_DOWNLOAD_RELATIVE_DIR;
        this.downloadFullDir = this.concatenatePath(this.downloadSystemDir, this.downloadRelativeDir);
        this.verifyAndCreateDirs(this.tempAreaSystemDir, this.tempAreaRelativeDir);
        //this.verifyAndCreateDirs(this.downloadSystemDir, this.downloadRelativeDir);
    }

    get tempAreaSystemDir(): string {
        return this._tempAreaSystemDir;
    }

    set tempAreaSystemDir(tempAreaSystemDir: string) {
        this._tempAreaSystemDir = tempAreaSystemDir;
    }

    get tempAreaRelativeDir(): string {
        return this._tempAreaRelativeDir;
    }

    set tempAreaRelativeDir(tempAreaRelativeDir: string) {
        this._tempAreaRelativeDir = tempAreaRelativeDir;
    }

    get tempAreaFullDir(): string {
        return this._tempAreaFullDir;
    }

    set tempAreaFullDir(tempAreaFullDir: string) {
        this._tempAreaFullDir = tempAreaFullDir;
    }

    get downloadSystemDir(): string {
        return this._downloadSystemDir;
    }
    
    set downloadSystemDir(downloadSystemDir: string) {
        this._downloadSystemDir = downloadSystemDir;
    }
    
    get downloadRelativeDir(): string {
        return this._downloadRelativeDir;
    }
    
    set downloadRelativeDir(downloadRelativeDir: string) {
        this._downloadRelativeDir = downloadRelativeDir;
    }
    
    get downloadFullDir(): string {
        return this._downloadFullDir;
    }
    
    set downloadFullDir(downloadFullDir: string) {
        this._downloadFullDir = downloadFullDir;
    }

    public getExternalRootDirectory(): string {
        return this.file.externalRootDirectory;
    }

    public getDocumentsDirectory(): string {
        return this.file.documentsDirectory;
    }

    public getApplicationDirectory(): string {
        return this.file.applicationDirectory;
    }

    public getDataDirectory(): string {
        return this.file.dataDirectory;
    }

    public concatenatePaths(paths: string[]): string {

        if (!paths) 
            throw Error('O array de caminhos não pode ser nulo.')
        
        if (paths.length < 1) 
            throw Error('O array de caminhos deve possuir ao menos um elemento.')

        let returnPath: string;
        returnPath = paths[0]

        for (let i = 1; i < paths.length; i++) {
            returnPath = this.concatenatePath(returnPath, paths[i]);
        }

        return returnPath;
    }

    public concatenatePath(startPath: string, endPath: string): string {
        if (!startPath || startPath.length <= 0)
            throw Error('A primeira parte do caminho não pode ser nulo ou vazio');

        if (!endPath || endPath.length <= 0)
            throw Error('A primeira parte do caminho não pode ser nulo ou vazio');

        if (startPath[startPath.length -1] == '/') {
            if (endPath[0] == '/') {
                return startPath + endPath.substr(1);
            } 
            return startPath + endPath;
        }

        if (endPath[0] == '/') {
            return startPath + endPath;
        } 

        return startPath + '/' + endPath;

    }

    public removePath(relativePath: string): string {
        return relativePath.substring(0, relativePath.lastIndexOf('/'));
    }

    public async getListOfDirectories(devicePath: string, relativePath: string): Promise<string[]> {
        let files: any = await this.file.listDir(devicePath, relativePath);
        let diretoriesList: string[] = [];
        for (let file of files) {
            if (file.isDirectory) {
                diretoriesList.push(file.name);
            }
        }
        return diretoriesList;
    }

    public async getListOfFiles(devicePath: string, relativePath: string): Promise<string[]> {
        let files: any = await this.file.listDir(devicePath, relativePath);
        let filesList: string[] = [];
        for (let file of files) {
            if (file.isFile) {
                filesList.push(file.name);
            }
        }
        return filesList;
    }

    public async verifyFileToDownloadMidi(fileName: string): Promise<boolean> {
        return await this.verifyFile(this.downloadSystemDir, this.downloadRelativeDir, fileName + this.MIDI_FILE_EXTENSION);
    }

    public async verifyFile(systemPath: string, relativePath: string, fileName: string): Promise<boolean> {
        try {
            return await this.file.checkFile(systemPath, this.concatenatePath(relativePath, fileName));
        } catch (e) {
                return false;
        }
    }

    public async verifyDir(systemPath: string, relativePath: string): Promise<boolean> {
        try { 
            return await this.file.checkDir(systemPath, relativePath);
        } catch (e) {
            return false;
        }
    }

    public async verifyAndCreateDirs(systemPath: string, relativePath: string): Promise<void> {
        try { 
            await this.file.checkDir(systemPath, relativePath);
        } catch (e) {
            try { 
                await this.file.createDir(systemPath, relativePath, false);
            } catch (e) {
                await this.verifyAndCreateDirs(systemPath, this.removePath(relativePath))
                try {
                    await this.file.createDir(systemPath, relativePath, false);
                } catch (e) {
                    throw e;
                }
            }
        }
    }

    public async readFileAsBinaryString(path: string, file: string): Promise<string> {
        return await this.file.readAsBinaryString(path, file);
    }

    public async readFileTextContentIfExists(systemPath: string, relativePath: string, fileName: string): Promise<string> {
        if (await this.verifyFile(systemPath, relativePath, fileName)) {
            return await this.file.readAsText(this.concatenatePath(systemPath, relativePath), fileName);
        } else {
            return null;
        }
    }

    public async writeMidiBinaryStringToTempArea(uId: string, binaryString: string): Promise<void> {
        let options: IWriteOptions = { replace: true };

        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        await this.file.writeFile(this.tempAreaFullDir, uId + this.MIDI_FILE_EXTENSION, bytes.buffer, options)
    }

    public async writeBinaryStringDownloadArea(fileName: string, binaryString: string): Promise<void> {
        let options: IWriteOptions = { replace: true };
        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        await this.file.writeFile(this.concatenatePath(this.downloadSystemDir, this.downloadRelativeDir) , fileName + this.MIDI_FILE_EXTENSION, bytes.buffer, options)
    }

    public async writeFile(systemPath: string, relativePath: string, fileName: string, fileContent: string): Promise<void> {
        await this.verifyAndCreateDirs(systemPath, relativePath);
        let options: IWriteOptions = { replace: true };
        await this.file.writeFile(this.concatenatePath(systemPath, relativePath) , fileName, fileContent, options);
    }

    public async removeFile(systemPath: string, relativePath: string, fileName: string): Promise<void> {
        await this.file.removeFile(this.concatenatePath(systemPath, relativePath), fileName);
    }

    public async cleanTempArea(): Promise<void> {
        let files = await this.file.listDir(this.tempAreaSystemDir, this.tempAreaRelativeDir);
        for (let file of files) {
            if (file.isDirectory) {
                this.deleteAll(this.tempAreaSystemDir, this.concatenatePath(this.tempAreaRelativeDir, file.name))
            } else {
                await this.file.removeFile(this.concatenatePath(this.tempAreaSystemDir, this.tempAreaRelativeDir), file.name);         
            }
        }
    }

    public async deleteAll(systemDir: string, relativeDir: string): Promise<void> {
        let files = await this.file.listDir(systemDir, relativeDir);
        for (let file of files) {
            if (file.isDirectory) {
                this.deleteAll(systemDir, this.concatenatePath(relativeDir, file.name))
            } else {
                await this.removeFile(systemDir, relativeDir, file.name);         
            }
        }
        await this.file.removeDir(systemDir, relativeDir);
    }

}
