// src/users/entities/user.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ type: String, description: 'MongoDB Object ID' })
  _id: MongooseSchema.Types.ObjectId;

  @ApiProperty({
    description: 'Clerk User ID (unique)',
    example: 'user_2abcd...',
  })
  @Prop({ required: true, unique: true, index: true })
  clerkId: string;

  @ApiProperty({ description: 'User Email', example: 'test@example.com' })
  @Prop({ required: true, index: true })
  email: string;

  @ApiPropertyOptional({ description: 'User First Name', example: 'John' })
  @Prop()
  firstName?: string;

  @ApiPropertyOptional({ description: 'User Last Name', example: 'Doe' })
  @Prop()
  lastName?: string;

  // --- ADD THIS ---
  @ApiPropertyOptional({
    description: 'URL of the user profile image',
    example: 'https://...',
  })
  @Prop() // Make it optional in the DB
  profileImageUrl?: string;
  // --- END ADD ---

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
