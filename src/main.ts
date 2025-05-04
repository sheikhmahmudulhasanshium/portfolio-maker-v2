// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { clerkMiddleware } from '@clerk/express'; // <-- Import clerkMiddleware

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(clerkMiddleware());

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('👨‍🎨 Portfolio Maker')
    .addBearerAuth() // <-- Add this

    .setDescription('API Documentation for the Portfolio Backend')
    .setVersion('2.0')

    .build();

  const document = SwaggerModule.createDocument(app, config);

  // --- Define Custom Swagger UI Options ---
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'Portfolio Maker V.2',
    customfavIcon: '/favicon.ico', // Served by ServeStaticModule from 'public' folder

    // --- Load core Swagger UI assets from CDN ---
    // It's good practice to pin to a specific version for stability
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    // customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css', // Alternative CDN
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
      // 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',       // Alternative CDN
      // 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js', // Alternative CDN
    ],
    // ---------------------------------------------

    // Your custom inline CSS overrides (will be applied AFTER the main CSS loads)
    customCss: `
      /* Ensure the font is available or remove if not needed */
      @import url('https://fonts.googleapis.com/css2?family=Leckerli+One&display=swap');

      /* --------- General Custom Styles --------- */
      .swagger-ui .topbar {
        background-color: #2b3b4a; /* Darker blue top bar */
        border-bottom: 2px solid #ff6f61; /* Example accent color */
      }
      .swagger-ui .topbar .link img {
         /* Replace default swagger logo with custom icon */
         /* Make sure 'android-chrome-192x192.png' is in your 'public' folder */
         content: url('/android-chrome-192x192.png');
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
      .swagger-ui .opblock.opblock-get { border-color: #61affe; background: rgba(97,175,254,.05); }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #61affe; }
      .swagger-ui .opblock.opblock-post { border-color: #49cc90; background: rgba(73,204,144,.05); }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #49cc90; }
      .swagger-ui .opblock.opblock-put { border-color: #fca130; background: rgba(252,161,48,.05); }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { background: #fca130; }
      .swagger-ui .opblock.opblock-delete { border-color: #f93e3e; background: rgba(249,62,62,.05); }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #f93e3e; }

      /* --- HIDE THE "POWERED BY SMARTBEAR" LINK --- */
      .swagger-ui .info > a[href*="smartbear.com"] { display: none !important; }
    `,
    // Optional Swagger UI behaviour configuration
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      displayRequestDuration: true,
      tryItOutEnabled: true,
      syntaxHighlight: { activate: true, theme: 'monokai' },
    },
  };
  // ---------------------------------

  SwaggerModule.setup(
    'api', // The path to serve Swagger UI HTML page
    app,
    document,
    customOptions, // Use the updated options with CDN links
  );

  const port = configService.get<number>('PORT') ?? 3000; // Vercel ignores this, uses its own port handling

  // For Vercel, app.listen() isn't strictly necessary for the serverless function
  // but it's good practice for local development and doesn't hurt on Vercel.
  await app.listen(port);
  console.log(`Application is running locally on: http://localhost:${port}`); // Adjusted log for clarity
  console.log(`Swagger UI available locally at: http://localhost:${port}/api`);
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
  process.exit(1);
});
