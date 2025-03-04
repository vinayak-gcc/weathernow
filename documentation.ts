import { Express, Request, Response } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

/**
 * @swagger
 * components:
 *   parameters:
 *     latParam:
 *       in: query
 *       name: lat
 *       required: true
 *       schema:
 *         type: number
 *       description: Latitude coordinate
 *       example: 51.5074
 *     lonParam:
 *       in: query
 *       name: lon
 *       required: true
 *       schema:
 *         type: number
 *       description: Longitude coordinate
 *       example: -0.1278
 * 
 *   schemas:
 *     CurrentWeather:
 *       type: object
 *       properties:
 *         coord:
 *           type: object
 *           properties:
 *             lon: { type: number }
 *             lat: { type: number }
 *         weather:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id: { type: number }
 *               main: { type: string, example: "Clear" }
 *               description: { type: string, example: "clear sky" }
 *               icon: { type: string, example: "01d" }
 *         main:
 *           type: object
 *           properties:
 *             temp: { type: number, description: "Temperature in Celsius", example: 22.5 }
 *             feels_like: { type: number, example: 21.8 }
 *             temp_min: { type: number, example: 20.2 }
 *             temp_max: { type: number, example: 23.4 }
 *             pressure: { type: number, description: "hPa", example: 1012 }
 *             humidity: { type: number, description: "%", example: 65 }
 *         visibility: { type: number }
 *         wind:
 *           type: object
 *           properties:
 *             speed: { type: number, description: "m/s", example: 4.1 }
 *             deg: { type: number, example: 280 }
 *         clouds:
 *           type: object
 *           properties:
 *             all: { type: number, description: "%", example: 20 }
 *         dt: { type: number, description: "Unix timestamp" }
 *         sys:
 *           type: object
 *           properties:
 *             country: { type: string, example: "GB" }
 *             sunrise: { type: number, description: "Unix timestamp" }
 *             sunset: { type: number, description: "Unix timestamp" }
 *         name: { type: string, description: "City name", example: "London" }
 * 
 *     ForecastData:
 *       type: object
 *       properties:
 *         list:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               dt: { type: number, description: "Unix timestamp" }
 *               main:
 *                 type: object
 *                 properties:
 *                   temp: { type: number, example: 22.5 }
 *                   feels_like: { type: number, example: 21.8 }
 *                   temp_min: { type: number, example: 20.2 }
 *                   temp_max: { type: number, example: 23.4 }
 *                   pressure: { type: number, example: 1012 }
 *                   humidity: { type: number, example: 65 }
 *               weather:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id: { type: number }
 *                     main: { type: string, example: "Clear" }
 *                     description: { type: string, example: "clear sky" }
 *                     icon: { type: string, example: "01d" }
 * 
 *     AirPollution:
 *       type: object
 *       properties:
 *         list:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               main:
 *                 type: object
 *                 properties:
 *                   aqi: { type: number, description: "Air Quality Index (1-5 scale)", example: 2 }
 *               components:
 *                 type: object
 *                 properties:
 *                   co: { type: number, description: "Carbon monoxide (μg/m3)", example: 230.31 }
 *                   no: { type: number, description: "Nitrogen monoxide (μg/m3)", example: 1.39 }
 *                   no2: { type: number, description: "Nitrogen dioxide (μg/m3)", example: 4.51 }
 *                   o3: { type: number, description: "Ozone (μg/m3)", example: 100.14 }
 *                   so2: { type: number, description: "Sulphur dioxide (μg/m3)", example: 2.12 }
 *                   pm2_5: { type: number, description: "Fine particles (μg/m3)", example: 8.5 }
 *                   pm10: { type: number, description: "Coarse particles (μg/m3)", example: 10.2 }
 *                   nh3: { type: number, description: "Ammonia (μg/m3)", example: 1.2 }
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         cod: { type: string, example: "404" }
 *         message: { type: string, example: "City not found" }
 * 
 * /api/weather/current:
 *   get:
 *     summary: Get Current Weather
 *     description: Retrieves current weather data for the specified location
 *     tags: [Weather]
 *     parameters:
 *       - $ref: '#/components/parameters/latParam'
 *       - $ref: '#/components/parameters/lonParam'
 *     responses:
 *       200:
 *         description: Current weather data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentWeather'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/weather/forecast:
 *   get:
 *     summary: Get Weather Forecast
 *     description: Retrieves 5-day weather forecast with 3-hour intervals
 *     tags: [Weather]
 *     parameters:
 *       - $ref: '#/components/parameters/latParam'
 *       - $ref: '#/components/parameters/lonParam'
 *     responses:
 *       200:
 *         description: Forecast weather data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForecastData'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/weather/air-pollution:
 *   get:
 *     summary: Get Air Pollution Data
 *     description: Retrieves current air pollution data for the specified location
 *     tags: [Weather]
 *     parameters:
 *       - $ref: '#/components/parameters/latParam'
 *       - $ref: '#/components/parameters/lonParam'
 *     responses:
 *       200:
 *         description: Air pollution data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AirPollution'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/weather/geocoding:
 *   get:
 *     summary: Geocoding Search
 *     description: Search for city coordinates by name
 *     tags: [Geocoding]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: City name (optionally with country code)
 *         example: "London,UK"
 *     responses:
 *       200:
 *         description: Location data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name: { type: string, example: "London" }
 *                   lat: { type: number, example: 51.5074 }
 *                   lon: { type: number, example: -0.1278 }
 *                   country: { type: string, example: "GB" }
 *       400:
 *         description: Invalid city name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /api/weather/reverse-geocoding:
 *   get:
 *     summary: Reverse Geocoding
 *     description: Get location name from coordinates
 *     tags: [Geocoding]
 *     parameters:
 *       - $ref: '#/components/parameters/latParam'
 *       - $ref: '#/components/parameters/lonParam'
 *     responses:
 *       200:
 *         description: Location data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name: { type: string, example: "London" }
 *                   country: { type: string, example: "GB" }
 *                   state: { type: string, example: "England" }
 *       400:
 *         description: Invalid coordinates
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Weather Dashboard API Documentation",
      version: "1.0.0",
      description: "API documentation for Weather Dashboard using OpenWeather API",
      contact: {
        name: "Weather Dashboard Support",
        email: "support@weatherdashboard.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Weather",
        description: "Weather data endpoints"
      },
      {
        name: "Geocoding",
        description: "Location search and conversion endpoints"
      }
    ]
  },
  apis: ['./documentation.ts'], // Point to this file
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app: Express): void => {
  // Swagger page
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  // Docs in JSON format
  app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`📚 API Documentation available at /api-docs`);
};

export default swaggerDocs;
