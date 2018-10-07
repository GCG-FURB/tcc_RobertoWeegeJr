export class ConvertionUtil {

    public static convertBinaryStringToNumber(binaryString: string): number {
        let hexString: string = ConvertionUtil.convertBinaryStringToHexString(binaryString);
        return parseInt(hexString, 16);
    }

    public static convertBinaryStringToHexString(binaryString: string): string {
        let hexString: string = '';
        let tempHexString: string;
        for (let i = 0; i < binaryString.length; i++) {
            tempHexString = binaryString.charCodeAt(i).toString(16);
            if (tempHexString.length < 2) {
                tempHexString = '0' + tempHexString;
            }
            hexString += tempHexString;
        }
        return hexString;
    }

    public static isLastDeltaTimeByte(binaryString: string): boolean {
        let binString: string = binaryString.charCodeAt(0).toString(2);
        return !(binString.length == 8 && binString.charAt(0) == '1');
    }

    public static calculateDeltaTime(binaryString: string) : number {
        let binaryDeltaTime: string = '';
        for (let str of binaryString) {
            let aaa = str.charCodeAt(0);
            let bbb = str.charCodeAt(0).toString(2);
            binaryDeltaTime += this.completeBits(str.charCodeAt(0).toString(2), 7);
        }
        return parseInt(binaryDeltaTime, 2);
    }

    public static getDeltaTimeStringFromNumber(deltaTime: number){
        let tempDeltaTimeBinary: string = deltaTime.toString(2);
        let deltaTimeBinary: string = '';
        let lastByte = false;

        while (tempDeltaTimeBinary.length >= 7) {
            deltaTimeBinary = (lastByte ? '1' : '0') + tempDeltaTimeBinary.substr(tempDeltaTimeBinary.length - 7, 7) + deltaTimeBinary;
            if (!lastByte) {
                lastByte = true;
            } 
            tempDeltaTimeBinary = tempDeltaTimeBinary.substr(0, tempDeltaTimeBinary.length - 7);
        }

        if (tempDeltaTimeBinary.length > 0) {
            for (let i = tempDeltaTimeBinary.length; i < 7; i++) {
                tempDeltaTimeBinary = '0' + tempDeltaTimeBinary;
            }
            deltaTimeBinary = (lastByte ? '1' : '0') + tempDeltaTimeBinary.substr(tempDeltaTimeBinary.length - 7, 7) + deltaTimeBinary;
            if (!lastByte) {
                lastByte = true;
            } 
        }

        let hexDeltaTime: string = parseInt(deltaTimeBinary, 2).toString(16);
        return (hexDeltaTime.length % 2 == 1 ? '0' : '') + hexDeltaTime;
    }

    private static completeBits(binaryString: string, maxBits: number = 8): string {
        if (binaryString.length >= maxBits) {
            return binaryString.substr(binaryString.length - maxBits, maxBits);
        }
        let newBinaryString: string = binaryString;
        for (let i = binaryString.length; i < maxBits; i++) {
            newBinaryString = '0' + newBinaryString;
        }
        return newBinaryString;
    } 

    public static convertHexStringToNumber(hexString: string): number {
        return parseInt(hexString, 16);
    }


    public static convertHexStringToBinararyString(hexString: string): string{
        let bytes = new Uint8Array(hexString.length/2);
        for (let i = 0; i < hexString.length/2; i++){
            bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
        }
        return String.fromCharCode.apply(String, bytes);
    }

    public static convertNumberToBinararyString(num: number, numberOfBytes: number) {
        let hexNum = num.toString(16);
        for (let i = hexNum.length; i < numberOfBytes * 2; i++) {
            hexNum = '0' + hexNum;
        }
        return this.convertHexStringToBinararyString(hexNum);
    }


}