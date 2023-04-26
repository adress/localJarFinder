import yargs from 'yargs';
import {
  copyAppLibraries,
  extractLibraries,
  findFilesWithExtension,
  findLibLoacal,
  isFileExtensionInCurrentDirectory,
  rutaNormalizada
} from './utils';


const main = async (appPath: string) => {
  //validar si en el directorio actual hay un proyecto .jws
  if (!isFileExtensionInCurrentDirectory(appPath, 'jws')) {
    console.log("No se encontró un proyecto .jws en el directorio de trabajo.");
    return;
  }

  const archivos = findFilesWithExtension(appPath, ['.jpr', '.jws']);
  const app = archivos.find((archivo) => archivo.endsWith('.jws'));
  const proyectos = archivos.filter((archivo) => archivo.endsWith('.jpr'));

  proyectos.forEach(proyecto => {
    const projectPath = proyecto.split('/').slice(0, -1).join('/');
    const buildFile = projectPath.concat('/build.xml');
    console.log(">> " + buildFile);

    const librerias = extractLibraries(buildFile);
    findLibLoacal(librerias.filter((libreria) => libreria.isLib), appPath);
    copyAppLibraries(projectPath, appPath);
    console.log();
  });
};


//entrada por linea de comandos
const argv = yargs
  .option('ruta', { alias: 'r', description: 'Ruta a procesar', type: 'string', demandOption: true, })
  .help()
  .alias('help', 'h').argv;

const appPath = JSON.parse(JSON.stringify(argv)).r;
main(rutaNormalizada(appPath));
