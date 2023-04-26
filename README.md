# LocalJarFinder

Es un proyecto que ayuda a encontrar las librerías de java que se especifican en los archivos ant (build.xml) de las aplicaciones que contiene muchos proyectos, las librerías son extraídas de un directorio local y las ubica en el directorio del de la aplicación principal en la carpeta `lib`, muy útil cuando se usa jdeveloper y se quiere trabajar con otro ide como vscode, intellij idea o eclipse.

Estructura original:
- App
  - Proyecto1
    - build.xml -> dependencias .jar
  - Proyecto2
    - build.xml -> dependencias .jar
  - Proyecto3
    - build.xml -> dependencias .jar

<br>

Estructura despues de usar `LocalJarFinder`:
- App
  - lib -> directorio con todas las dependencias descritas en los archivos build.xml 
  - Proyecto1
    - build.xml -> dependencias .jar
  - Proyecto2
    - build.xml -> dependencias .jar
  - Proyecto3
    - build.xml -> dependencias .jar

<br>

## Modo de uso:
```bash
localJarFinder --ruta /ruta/de/la/aplicacion
```
