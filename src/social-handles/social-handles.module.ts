// src/social-handles/social-handles.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocialHandlesService } from './social-handles.service';
import { SocialHandlesController } from './social-handles.controller';
import {
  SocialHandle,
  SocialHandleSchema,
} from './entities/social-handle.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      // Provide the Mongoose model for injection
      { name: SocialHandle.name, schema: SocialHandleSchema },
    ]),
  ],
  controllers: [SocialHandlesController],
  providers: [SocialHandlesService],
  // exports: [SocialHandlesService] // Export service if needed by other modules
})
export class SocialHandlesModule {}
