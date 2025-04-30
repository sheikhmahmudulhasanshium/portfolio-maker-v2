// src/services/schemas/service.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Export the Document type for use in the service
export type ServiceDocument = Service & Document;

@Schema({ timestamps: true }) // Automatically add createdAt and updatedAt fields
export class Service {
  @Prop({ required: true, type: String })
  iconLink: string;

  @Prop({ required: true, type: String })
  icon: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number, index: true }) // Add index for potentially sorting by position
  position: number;

  // Mongoose automatically adds _id
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
