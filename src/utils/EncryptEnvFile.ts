let CryptoJSUtil = require("crypto-js");
let fs = require("fs");
let path = require("path");

const SALT = process.env.SALT || "defaultSalt";
const currentDir = __dirname;

//Go one level above (back to 'src')
const srcDir = path.resolve(currentDir,"..");

//Change to 'config folder
const configDir = path.resolve(srcDir, "config");
const envFilePath = `${configDir}\\.env`;
if(process.env.NODE_ENV){
    const envFilePath = `${configDir}\\.env.${process.env.NODE_ENV}`;
}

console.log(envFilePath);

export function encryptEnvFile(){
    // Read the .env file
    const envFileContent = fs.readFileSync(envFilePath,"utf8");
    const envLines = envFileContent.split("\n");

    //Encrypt values and update the array
    const encryptedLines = envLines.map((line: { split: (arg0: string) => [any, any]; }) =>{
        const [key,value] = line.split("=");

        if(value){
            const encryptedValue = CryptoJSUtil.AES.encrypt(value, SALT).toString();
            return `${key}=${encryptedValue}`;
        }
        return line;
    });

    const updatedEnvContent = encryptedLines.join("\n");
    fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");

    console.log("Encryption complete. Updated .env file");
}

export function decryptionFile(){
    //Read the .env file
    const envFileContent = fs.readFileSync(envFilePath, "utf8");
    const envLines = envFileContent.split("\n");

    //Encrpt values and update the array
    const decryptedLines = envLines.map((line: { split: (arg0: string) => [any, any]; }) =>{
        const[key,value] = line.split("=");

        if(value){
            const decryptedValue = CryptoJSUtil.AES.decrypt(value, SALT).toString(

                CryptoJSUtil.enc.Utf8
            );
            return `${key}=${decryptedValue}`;
        }
        return line;
    });

    //Join the lines and write back to the .env file
    const updatedEnvContent = decryptedLines.join("\n");
    fs.writeFileSync(envFilePath, updatedEnvContent, "utf8");
    console.log("Decryption comlete. Updated .env file");

}