# Exchange Rate API

## Descripción

Esta API ha sido desarrollada utilizando [NestJS](https://nestjs.com/) con la plataforma `@nestjs/platform-express`, emplea [MySQL](https://www.mysql.com/) como base de datos y [TypeORM](https://typeorm.io/) como ORM para la gestión de las entidades y consultas.

El propósito de esta API es realizar consultas a una API externa de tasas de cambio, filtrar los valores obtenidos por tipo de moneda, y validar si ya existen registros en la base de datos para la misma fecha. En caso de no existir, los datos se almacenan, y si ya existen registros previos, se retornan los datos almacenados. Además, la API cuenta con una ejecución programada mediante un **Cron job**, que realiza la consulta de las tasas de cambio una vez al día de manera automática.

## Características

- **Conexión con API externa de tasas de cambio:** Realiza peticiones periódicas para obtener las tasas de cambio de distintas monedas.
- **Filtrado por moneda:** Permite filtrar las tasas de cambio por tipos de moneda específicos.
- **Validación de registros existentes:** Antes de guardar los datos, verifica si ya existen registros previos para una misma fecha y moneda.
- **Almacenamiento en MySQL:** Guarda las tasas de cambio si no existen en la base de datos para la fecha específica.
- **Cron Job diario:** Se ejecuta automáticamente una vez al día para actualizar las tasas de cambio.

## Tecnologías

- [NestJS](https://nestjs.com/) (con `@nestjs/platform-express`)
- [TypeORM](https://typeorm.io/)
- [MySQL](https://www.mysql.com/)
- [Nestjs] (con `@nestjs/schedule`) para la programación del **Cron job**

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/exchange-rate-api.git
cd exchange-rate-api
```

2. Instalar las dependencias:

```bash
npm install
yarn
```

3. Configurar las variables de entorno:

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=exchange_rates
API_URL=https://api.exchangeratesapi.io/latest
CRON_SCHEDULE=0 0 * * * # Configuración para ejecutar el Cron Job una vez al día a medianoche
```

4. Ejecutar las migraciones para la base de datos:

```bash
npm run typeorm migration:run
```

5. Iniciar la aplicación:

```bash
npm run start
yarn start:dev #para iniciar en desarrollo
```

## Endpoints

### Obtener tasas de cambio por moneda

```http
GET /conversion-rates
```

- **Parámetro de consulta (query):**
  - `countryCode`: El código de país`VE`
  - `currency`: El código de la moneda (ej: `USD`, `EUR`, `GBP`).
- **Respuesta exitosa (200):**

  ```json
  {
    "id": 1,
    "value": 44,
    "createdAt": "2024-09-20T06:47:25.933Z",
    "updatedAt": "2024-09-20T06:47:25.933Z"
  }
  ```

- **Error si la moneda no es válida (400):**

  ```Exception
  {
    throw new InternalServerErrorException(
      'Error al obtener las tasas de conversión.',

  }
  ```

## Cron Job

El **Cron job** está configurado para ejecutarse automáticamente una vez al día (a medianoche) y consultar la API externa para obtener las tasas de cambio. Los datos obtenidos se almacenan en la base de datos si no existen registros para la fecha actual.

## Uso manual del Cron Job

Si deseas ejecutar manualmente la tarea programada, puedes hacerlo con el siguiente comando:

```bash
npm run cron:run
```

## Contribución

Si deseas contribuir a este proyecto, sigue los siguientes pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama con tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Crea un Pull Request.

## Licencia

Este proyecto está licenciado bajo la [MIT License](LICENSE).
