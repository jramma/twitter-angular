# PEC3 - UOC

Aplicación web desarrollada con Angular. A continuación, se detallan las instrucciones para configurar y ejecutar el proyecto:

## Requisitos Previos

- Node.js y npm instalados en su sistema.
- Angular CLI versión 12.2.5 o superior.

## Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/jramma/twitter-angular.git
   cd twitter-angular
   ```

2. **Instalar las dependencias:**

   ```bash
   npm install
   ```

## Servidor de Desarrollo

Para iniciar el servidor de desarrollo, ejecute:

```bash
ng serve
```

Luego, abra su navegador y navegue a `http://localhost:4200/`. La aplicación se recargará automáticamente si realiza cambios en los archivos fuente.

## Generación de Componentes

Para generar un nuevo componente, utilice el siguiente comando:

```bash
ng generate component nombre-del-componente
```

También puede generar directivas, tuberías, servicios, clases, guardias, interfaces, enumeraciones o módulos utilizando el mismo comando con las opciones correspondientes.

## Construcción del Proyecto

Para construir el proyecto, ejecute:

```bash
ng build
```

Los artefactos de construcción se almacenarán en el directorio `dist/`. Para una construcción de producción, añada la bandera `--prod`.

## Ayuda Adicional

Para obtener más ayuda sobre Angular CLI, utilice `ng help` o consulte la [documentación oficial de Angular CLI](https://angular.io/cli).

---

_Nota:_ Este proyecto fue generado con Angular CLI versión 12.2.5.
