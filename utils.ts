import * as fs from 'fs';
import { Libreria } from './libreria';

const LOCAL_LIBRARY_DIRECTORY = 'D:/libs';

const leerArchivo = (filePath: string): string[] => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split(/\r?\n/);
    return lines;
}

const createDirectoryIfNotExist = (directoryPath: string) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
    }
}

export const isFileExtensionInCurrentDirectory = (appPath: string, extension: string): boolean => {
    const archivos = fs.readdirSync(appPath);
    return archivos.some(archivo => archivo.endsWith(`.${extension}`));
}

export const rutaNormalizada = (ruta: string): string => {
    return ruta.replace(/\\+/g, '/').replace(/\/$/, '')
};


const copyFile = (libFile: string, libFileDest: string) => {
    if (fs.existsSync(libFileDest)) {
        console.log("Existe: ", libFile, " -> ", libFileDest);
    } else {
        fs.copyFile(libFile, libFileDest, (error) => {
            if (error) {
                console.error("Error: ", libFile, " -> ", libFileDest, error);
                return;
            }
            console.log("Copiado: ", libFile, " -> ", libFileDest);
        });
    }
}


export const extractLibraries = (filePath: string): Libreria[] => {
    const lines = leerArchivo(filePath);
    const jarLine = lines.filter((line) => line.includes('.jar') && line.includes('pathelement'));
    const jartrim = jarLine.map((line) => line.replace(/"/g, '').trim());
    const librerias = jartrim.map((line) => {
        const nombre = line.split('/').find((element) => element.includes('.jar'))?.trim() ?? '';
        const isApp = line.includes('app.dir');
        const isLib = line.includes('lib.dir');
        return { nombre, isApp, isLib };
    });
    return librerias;
}


export const findLibLoacal = (librerias: Libreria[], appPath: string) => {
    //create directory lib if not exist
    const libPath = `${appPath}/lib`;
    createDirectoryIfNotExist(libPath);

    //copy libraries to lib directory
    librerias.forEach(libreria => {
        if (libreria.isLib) {
            const libFile = `${LOCAL_LIBRARY_DIRECTORY}/${libreria.nombre}`;
            const libFileDest = `${appPath}/lib/${libreria.nombre}`;
            copyFile(libFile, libFileDest);
        }
    });
}


export const copyAppLibraries = (projectPath: string, appPath: string) => {
    console.log("Publish local app libraries:");

    const libPath = `${appPath}/lib`;
    createDirectoryIfNotExist(libPath);

    const jarfiles = findFilesWithExtension(projectPath, ['.jar', '.war']);
    jarfiles.forEach(jarfile => {
        const libFile = jarfile;
        const jarName = jarfile.split('/').find((element) => element.includes('.jar') || element.includes('.war'))?.trim() ?? '';
        const libFileDest = `${appPath}/lib/${jarName}`;
        copyFile(libFile, libFileDest);
    });
}


export const findFilesWithExtension = (directoryPath: string, extensions: string[]): string[] => {
    const results: string[] = [];

    function findInDirectory(dirPath: string) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const filePath = `${dirPath}/${file}`;
            const stats = fs.statSync(filePath);

            if (stats.isDirectory()) {
                findInDirectory(filePath);
            } else {
                for (const extension of extensions) {
                    if (file.endsWith(extension)) {
                        results.push(filePath);
                        break;
                    }
                }
            }
        }
    }

    findInDirectory(directoryPath);
    return results;
}

