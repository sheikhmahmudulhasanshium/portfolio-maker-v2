// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Import Swagger decorators
import { Document, Schema as MongooseSchema } from 'mongoose'; // Import Schema for ObjectId type hint

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Add timestamps (createdAt, updatedAt)
export class User {
  // Use MongooseSchema.Types.ObjectId for Swagger type hint if needed, but Mongoose handles it
  @ApiProperty({ type: String, description: 'MongoDB Object ID' })
  _id: MongooseSchema.Types.ObjectId; // Added for Swagger documentation

  @ApiProperty({
    description: 'Clerk User ID (unique)',
    example: 'user_2abcd...',
  })
  @Prop({ required: true, unique: true, index: true }) // Add index for faster lookups
  clerkId: string;

  @ApiProperty({ description: 'User Email', example: 'test@example.com' })
  @Prop({ required: true, index: true }) // Index email too if you query by it often
  email: string;

  @ApiPropertyOptional({ description: 'User First Name', example: 'John' })
  @Prop()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User Last Name', example: 'Doe' })
  @Prop()
  lastName?: string;

  // Timestamps added by schema option
  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
