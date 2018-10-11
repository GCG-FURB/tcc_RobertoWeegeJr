import { File, IWriteOptions } from '@ionic-native/file';

export class FileUtil {

    private _nativeFile: File;
    public static _tempAreaDir: string;

    constructor(nativeFile: File) {
        this.nativeFile = nativeFile;
        FileUtil._tempAreaDir = this.nativeFile.dataDirectory + 'temp/';
        this.nativeFile.checkDir(this.nativeFile.dataDirectory, 'temp/')
            .then(() =>{})
            .catch((err) => {
                this.nativeFile.createDir(this.nativeFile.dataDirectory, 'temp/', true)
            });
    }

    get nativeFile(): File {
        return this._nativeFile;
    }

    set nativeFile(nativeFile: File) {
        this._nativeFile = nativeFile;
    }

    public concatenatePaths(paths: string[]): string {
        let returnPath: string;
        returnPath = paths[0]
        for (let i = 1; i < paths.length; i++) {
            returnPath = this.concatenatePath(returnPath, paths[i]);
        }
        return returnPath;
    }


    public concatenatePath(startPath: string, endPath: string): string {
        if (!startPath || startPath.length <= 0) {
            throw Error('Error startPath');
        }
        if (!endPath || endPath.length <= 0) {
            throw Error('Error endPath');
        }

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

    public getListOfDirectories(devicePath: string, relativePath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {

            this.nativeFile.listDir(devicePath, relativePath)
                .then((files)=> {
                    let diretoriesList: string[] = [];
                    for (let file of files) {
                        if (file.isDirectory) {
                            diretoriesList.push(file.name);
                        }
                    }
                    resolve(diretoriesList);
                })
                .catch((e) => {
                    reject(e);
                });
        
        });
    }

    public getListOfFiles(devicePath: string, relativePath: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.nativeFile.listDir(devicePath, relativePath)
                .then((files)=> {
                    let diretoriesList: string[] = [];
                    for (let file of files) {
                        if (file.isFile) {
                            diretoriesList.push(file.name);
                        }
                    }
                    resolve(diretoriesList);
                })
                .catch((e) => {
                    reject(e);
                });
        });
    }

    public readFileAsBinaryString(path: string, file: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.nativeFile.readAsBinaryString(path, file)
                .then((binaryString)=> {
                    resolve(binaryString);
                })
                .catch((e) => {
                    reject(e);
                });
            });
    }

    public writeBinaryStringToTempArea(uId: string, binaryString: string): Promise<any> {
        return new Promise((resolve, reject) => {

            let options: IWriteOptions = { replace: true };
        
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
        
            this.nativeFile.writeFile(FileUtil._tempAreaDir , uId + '.mid', bytes.buffer, options)
                .then(() => {
                    resolve(null);
                })
                .catch((e) => {
                    reject(e);
                })
        });
    }

}
