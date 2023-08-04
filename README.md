<p align="center">
  <img src="https://github.com/FacuLL/stockgame/assets/69525757/2c4b8de7-b945-482a-a3cd-26031d13d61b" width="200px" />
</p>

# Stockgame

Simulador de compra y venta de activos financieros, proyecto llevado a cabo en el 7mo año del secundario (tecnicatura).
Cabe destacar que el proyecto es un remake del juego de mercado anterior, realizado anteriormente por alumnos de la Universidad Nacional del Centro de Tandil.
Se buscan agregar nuevas funciones y evitar los errores que causaron que la aplicación se vuelva obsoleta y deje de usarse.

## Backend (./backend)

El backend anteriormente se realizó con Express en Node.js. Con el fin de organizar mejor las entidades y dividir el backend en distintos servicios, se decidió utilizar NestJS como Framework y TypeORM como ORM.
Utiliza MySQL, por lo que se debe instalar un servidor en la PC y configurar el .env.

### ¿Como hacer el deploy?

- Clonar el repo.
- Instalar dependencias "npm i".
- Iniciar "npm start".
  
## Frontend (./web-frontend)

El frontend aún no está terminado, se comenzó a hacer con AngularJS, pero se planea pasar a React y utilizar Tailwind.

## Database (./database)

Contiene los archivos con las entidades y tablas, sin embargo, ya no son necesarias puesto a que TypeORM inicializa todo. Está bueno para guiarse y entender las relaciones (Puede estar desactualizado).
