// src/services/services.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service, ServiceSchema } from './entities/service.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }]), // Provide the schema
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
