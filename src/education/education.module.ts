import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { Education, EducationSchema } from './entities/education.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Education.name, schema: EducationSchema },
    ]), // Register the schema
  ],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
