// src/social-handles/entities/social-handle.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SocialHandleDocument = SocialHandle & Document;

@Schema({ timestamps: true }) // Automatically add createdAt and updatedAt fields
export class SocialHandle {
  // _id is automatically added by Mongoose

  @ApiProperty({
    description: 'Unique identifier for the social handle',
    example: '605c72ef5f1b2c001f7b0f0b',
  })
  _id: string; // Define for Swagger documentation if needed

  @ApiProperty({
    description: 'Name of the social platform (e.g., linkedin, github, gmail)',
    example: 'linkedin',
  })
  @Prop({ required: true, trim: true, index: true }) // Index for faster lookups/sorting by name
  name: string;

  @ApiProperty({
    description: 'Link or handle for the social platform',
    example: 'https://linkedin.com/in/developercontact',
  })
  @Prop({ required: true, trim: true })
  link: string;

  @ApiProperty({
    description: 'Whether to hide this social handle from public view',
    example: false,
    default: false,
  })
  @Prop({ default: false }) // Mongoose handles the default value
  hide: boolean;

  @ApiProperty({
    description: 'Display order position',
    example: 1,
    minimum: 1,
  })
  @Prop({ required: true, min: 1, index: true }) // Index for sorting by position
  position: number;

  @ApiProperty({ description: 'Timestamp of creation' })
  createdAt: Date; // Added by timestamps: true

  @ApiProperty({ description: 'Timestamp of last update' })
  updatedAt: Date; // Added by timestamps: true
}

export const SocialHandleSchema = SchemaFactory.createForClass(SocialHandle);

// Optional: Define a compound index if needed
// SocialHandleSchema.index({ name: 1, position: 1 }, { unique: true });
