import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { InterestsService } from './interests.service';
import { InterestsController } from './interests.controller';
import { Interest, InterestSchema } from './entities/interest.entity'; // Import Entity and Schema

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interest.name, schema: InterestSchema },
    ]), // Add this line
  ],
  controllers: [InterestsController],
  providers: [InterestsService],
})
export class InterestsModule {}
