import { NextResponse } from 'next/server';
import swaggerJsdoc from 'swagger-jsdoc';

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
    ],
    components: {
      schemas: {
        CurrentWeather: {
          type: "object",
          properties: {
            weather: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  main: { type: "string", example: "Clear" },
                  description: { type: "string", example: "clear sky" },
                  icon: { type: "string", example: "01d" }
                }
              }
            },
            main: {
              type: "object",
              properties: {
                temp: { type: "number", example: 22.5 },
                feels_like: { type: "number", example: 21.8 },
                temp_min: { type: "number", example: 20.2 },
                temp_max: { type: "number", example: 23.4 },
                pressure: { type: "number", example: 1012 },
                humidity: { type: "number", example: 65 }
              }
            },
            wind: {
              type: "object",
              properties: {
                speed: { type: "number", example: 4.1 },
                deg: { type: "number", example: 280 }
              }
            },
            name: { type: "string", example: "London" }
          }
        }
      }
    }
  },
  apis: ['./documentation.ts'], // path to point to the root documentation.ts file
};

export async function GET() {
  const specs = swaggerJsdoc(options);
  return NextResponse.json(specs);
} 