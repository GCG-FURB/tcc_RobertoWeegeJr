export class NumberConversionUtil {

    //binary string
    public convertBinaryStringToInteger(binaryString: string): number {
        let hexString: string = this.convertBinaryStringToHexString(binaryString);
        return this.convertHexStringToInteger(hexString);
    }

    public convertBinaryStringToHexString(binaryString: string): string {
        if (!binaryString || binaryString.length <= 0)
            throw new Error(`A string binaria não pode ser nula ou vazia.`);
            
        let hexString: string = '';
        for (let i = 0; i < binaryString.length; i++) {
            hexString += this.convertIntegerToHexString(binaryString.charCodeAt(i), 1);
        }
        return hexString;
    }

    public convertBinaryStringToBinaryArray(binaryString: string){
        if (!binaryString || binaryString.length <= 0)
            throw new Error(`A string binaria não pode ser nula ou vazia.`);

        let binaryArray: string = ''; 
        for (let i = 0; i < binaryString.length; i++) {
            binaryArray += this.completeOrRemoveChars(
                           this.convertIntegerToBinaryArray(binaryString.charCodeAt(i))
                           );
        }
        return binaryArray;
    }

    //hexa string
    public convertHexStringToInteger(hexString: string): number {
        if (!hexString || hexString.length <= 0)
            throw new Error(`A string de hexadecimal não pode ser nula ou vazia.`);
        return parseInt(hexString, 16);
    }

    public convertHexStringToBinaryString(hexString: string): string{
        if (!hexString || hexString.length <= 0)
            throw new Error(`A string de hexadecimal não pode ser nula ou vazia.`);
        
        let bytes = new Uint8Array(hexString.length/2);
        for (let i = 0; i < hexString.length/2; i++){
            bytes[i] = this.convertHexStringToInteger(hexString.substr(i * 2, 2));
        }
        return String.fromCharCode.apply(String, bytes);
    }

    public getHexaStringFirstBit(hexString: string): number {        
        let binArray: string = this.convertIntegerToBinaryArray(hexString.charCodeAt(0));
        return (binArray.length >= 8 ? +binArray[0] : 0);
    }

    //convert decimal
    public convertIntegerToBinararyString(integer: number, numberOfBytes: number) {
        let hexNum: string = this.convertIntegerToHexString(integer, numberOfBytes);
        return this.convertHexStringToBinaryString(hexNum);
    }

    public convertIntegerToHexString(integer: number, numberOfBytes?: number): string {
        if (!integer && integer != 0)
            throw new Error(`O número não pode ser nulo.`);

        let hexNum: string = integer.toString(16);
        if (numberOfBytes) {
            for (let i = hexNum.length; i < numberOfBytes * 2; i++) {
                hexNum = '0' + hexNum;
            }
        }
        return hexNum;
    }

    public convertIntegerToBinaryArray(integer: number): string {
        if (!integer && integer != 0)
            throw new Error(`O número não pode ser nulo.`);
        return integer.toString(2);
    }

    //binary array
    public convertBinaryArrayToHexString(binaryArray: string): string {
        if (!binaryArray || binaryArray.length <= 0)
            throw new Error(`A string de binário não pode ser nula ou vazia.`);
        
        let hexDeltaTime: string = parseInt(binaryArray, 2).toString(16);
        return (hexDeltaTime.length % 2 == 1 ? '0' : '') + hexDeltaTime;
    }

    //aux
    public completeOrRemoveChars(chars: string, maxChars: number = 8): string {
        if (!chars || chars.length <= 0)
            throw new Error(`A string de ajuste não pode ser nula ou vazia.`);
        
        if (maxChars < 0)
            throw new Error(`A quantidade máxima de caracteres deve ser maior que zero.`);

        if (chars.length >= maxChars) {
            return chars.substr(chars.length - maxChars, maxChars);
        }
        let newBinaryString: string = chars;
        for (let i = chars.length; i < maxChars; i++) {
            newBinaryString = '0' + newBinaryString;
        }
        return newBinaryString;
    } 
    
}