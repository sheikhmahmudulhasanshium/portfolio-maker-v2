// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions, // Import SwaggerCustomOptions
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // --- Enable CORS if needed (often required for frontend interaction) ---
  app.enableCors({
    // origin: 'http://your-frontend-domain.com', // Be specific in production
    origin: true, // Allows any origin for development, adjust as needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // --------------------------------------------------------------------

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // --- Swagger Document Configuration ---
  const config = new DocumentBuilder()
    .setTitle('👨‍🎨 Portfolio Maker') // Updated title example
    .setDescription('API Documentation for the Portfolio Backend')
    .setVersion('2.0') // Updated version example
    // Add other options like Bearer Auth if you use authentication
    // .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // --- Define Custom Swagger UI Options ---
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Portfolio Maker V.2', // Sets the browser tab title
    customfavIcon: '/favicon.ico', // Path to your favicon in the 'public' folder
    // Ensure 'favicon.ico' exists in your project's 'public' directory
    customCss: `
      /* --------- General Custom Styles --------- */
      .swagger-ui .topbar {
        background-color: #2b3b4a; /* Darker blue top bar */
        border-bottom: 2px solid #ff6f61; /* Example accent color */
      }
      .swagger-ui .topbar .link img {
         /* Replace default swagger logo with custom icon */
         content: url('/android-chrome-192x192.png'); /* Ensure this exists in 'public' */
         max-height: 40px; /* Adjust size */
         margin: 5px 15px; /* Add some margin */
         width: auto; /* Maintain aspect ratio */
      }
      .swagger-ui .topbar .download-url-wrapper {
        display: none; /* Optionally hide the JSON definition link */
      }
      .swagger-ui .info .title {
        color: #ff6f61; /* Match accent color for title */
        font-family: 'Leckerli One', cursive; /* Try using the font from about.txt */
        font-size: 28px; /* Slightly larger title */
      }
      .swagger-ui .info .title small {
        background-color: #555; /* Darker background for version */
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        vertical-align: middle;
        margin-left: 8px;
      }
      .swagger-ui .scheme-container {
         background-color: #f0f0f0; /* Lighter background for scheme/auth */
         box-shadow: none;
         border-bottom: 1px solid #ddd;
         padding: 10px 20px;
      }

      /* --- Operation Block Styling --- */
      .swagger-ui .opblock-tag.no-desc {
        background-color: #3a4c5c; /* Background for operation tags */
        border-color: #4a5c6c;
      }
      .swagger-ui .opblock-tag a.nostyle span {
        color: #ffffff; /* Text color for operation tags */
        font-weight: bold;
      }
      .swagger-ui .opblock.opblock-get {
        border-color: #61affe; /* Color for GET operations */
        background: rgba(97,175,254,.05); /* Lighter background */
      }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #61affe; }

      .swagger-ui .opblock.opblock-post {
        border-color: #49cc90; /* Color for POST operations */
        background: rgba(73,204,144,.05); /* Lighter background */
      }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #49cc90; }

      .swagger-ui .opblock.opblock-put {
        border-color: #fca130; /* Color for PUT operations */
        background: rgba(252,161,48,.05); /* Lighter background */
      }
       .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #fca130; }

      .swagger-ui .opblock.opblock-delete {
        border-color: #f93e3e; /* Color for DELETE operations */
        background: rgba(249,62,62,.05); /* Lighter background */
      }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #f93e3e; }

      /* --- HIDE THE "POWERED BY SMARTBEAR" LINK --- */
      .swagger-ui .info > a[href*="smartbear.com"] {
        display: none !important; /* Target the link specifically */
      }
      /* --------------------------------------------- */

      /* --- Load Custom Font --- */
      /* Ensure the font is available or remove if not needed */
      @import url('https://fonts.googleapis.com/css2?family=Leckerli+One&display=swap');

    `,
    // --- Optional: Further Swagger UI behaviour configuration ---
    swaggerOptions: {
      docExpansion: 'list', // 'none', 'list', 'full' - Controls default expansion
      filter: true, // Enable filtering by tag or operation ID
      showExtensions: true,
      showCommonExtensions: true,
      displayRequestDuration: true,
      tryItOutEnabled: true, // Enable "Try it out" functionality
      syntaxHighlight: { activate: true, theme: 'monokai' }, // e.g., monokai,arta
    },
  };
  // ---------------------------------

  // --- Setup Swagger UI ---
  SwaggerModule.setup(
    'api', // The path to serve Swagger UI
    app, // Your NestJS application instance
    document, // The generated OpenAPI document
    customOptions, // Your custom UI options
  );
  // -------------------------------------------------------

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger UI available at: ${await app.getUrl()}/api`);
}

// Handle potential errors during bootstrap
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1); // Exit with a failure code
});
