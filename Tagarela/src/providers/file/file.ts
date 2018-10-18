import { Injectable } from '@angular/core';
import { File, IWriteOptions } from '@ionic-native/file';

@Injectable()
export class FileProvider {

    public tempAreaDir: string;

    constructor(public file: File) {
        this.tempAreaDir = this.file.dataDirectory + 'temp/';
        this.verifyAndCreateDirs(this.file.dataDirectory, 'temp/');
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

    public async readFileAsBinaryString(path: string, file: string): Promise<string> {
        return await this.file.readAsBinaryString(path, file);
    }

    public async writeBinaryStringToTempArea(uId: string, binaryString: string) {
        let options: IWriteOptions = { replace: true };

        let len = binaryString.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
    
        await this.file.writeFile(this.tempAreaDir , uId + '.mid', bytes.buffer, options)
    }

    public async getFileContentIfExists(systemPath: string, relativePath: string, fileName: string): Promise<any> {
        if (await this.verifyFile(systemPath, relativePath, fileName)) {
            return await this.file.readAsText(this.concatenatePath(systemPath, relativePath), fileName);
        } else {
            return null;
        }
    }

    public async writeFile(systemPath: string, relativePath: string, fileName: string, fileContent: string): Promise<any> {
        await this.verifyAndCreateDirs(systemPath, relativePath);
        let options: IWriteOptions = { replace: true };
        await this.file.writeFile(this.concatenatePath(systemPath, relativePath) , fileName, fileContent, options);
    }

    public async verifyFile(systemPath: string, relativePath: string, fileName: string) {
        try {
            return await this.file.checkFile(systemPath, this.concatenatePath(relativePath, fileName));
        } catch (e) {
            if (e && e.code && e.code == 1 && e.message && e.message == 'NOT_FOUND_ERR') {
                return false;
            } else {
                throw e;
            }
        }
    }

    public async verifyAndCreateDirs(systemPath: string, relativePath: string){
        try { 
            await this.file.checkDir(systemPath, relativePath);
        } catch (e) {
            try { 
                await this.file.createDir(systemPath, relativePath, false);
            } catch (e) {
                if (e && e.code && e.code == 12 && e.message && e.message == 'PATH_EXISTS_ERR') {
                    await this.verifyAndCreateDirs(systemPath, this.removePath(relativePath))
                    try {
                        await this.file.createDir(systemPath, relativePath, false);
                    } catch (e) {
                        throw e;
                    }
                } else {
                    throw e;
                }
            }
        }
    }

    public removePath(relativePath: string): string {
        return relativePath.substring(0, relativePath.lastIndexOf('/'));
    }

    public async verifyDir(systemPath: string, relativePath: string) {
        try { 
            return await this.file.checkDir(systemPath, relativePath);
        } catch (e) {
            return false;
        }
    }

    public async removeFile(systemPath: string, relativePath: string, fileName: string) {
        await this.file.removeFile(this.concatenatePath(systemPath, relativePath), fileName);
    }
}
