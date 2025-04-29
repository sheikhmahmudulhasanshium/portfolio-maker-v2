import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop()
  subtitle: string;

  @Prop()
  description: string;

  @Prop([String])
  technologies: string[];

  @Prop()
  repoUrl: string;

  @Prop()
  liveUrl: string;

  @Prop([String])
  previewImageUrls: string[];

  @Prop()
  iconUrl: string;

  @Prop()
  featured: boolean;

  @Prop([String])
  keywords?: string[];

  @Prop({ type: Object })
  timeline: {
    start_date: string;
    end_date: string;
  };

  @Prop()
  isUpcoming: boolean;

  @Prop({ enum: ['start', 'ongoing', 'done', 'canceled', 'upcoming'] })
  status: 'start' | 'ongoing' | 'done' | 'canceled' | 'upcoming';
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
