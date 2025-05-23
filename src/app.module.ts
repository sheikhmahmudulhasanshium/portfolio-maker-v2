// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static'; // Import ServeStaticModule
import { join } from 'path'; // Import join from path
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectsModule } from './projects/projects.module';
import { ServicesModule } from './services/services.module';
import { InterestsModule } from './interests/interests.module';
import { SocialHandlesModule } from './social-handles/social-handles.module';
import { EducationModule } from './education/education.module';
import { ClerkAuthModule } from './clerk-auth/clerk-auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configure static file serving from the 'public' directory
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/', // Serve files from the root URL (e.g., /favicon.ico)
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    ProjectsModule,

    ServicesModule,

    InterestsModule,

    SocialHandlesModule,

    EducationModule,

    ClerkAuthModule,

    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
