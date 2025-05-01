import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// --- Nested Schemas ---

@Schema({ _id: false })
export class Location {
  @Prop({ required: true })
  country: string;

  @Prop()
  city?: string;

  @Prop()
  stateOrProvince?: string;
}
export const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ _id: false })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop()
  code?: string;

  @Prop()
  description?: string;

  @Prop()
  grade?: string;

  @Prop()
  credits?: number;
}
export const CourseSchema = SchemaFactory.createForClass(Course);

@Schema({ _id: false })
export class ExtraCurricular {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) description: string;
  @Prop() role?: string;
  @Prop() duration?: string;
  @Prop([String]) mediaUrls?: string[];
}
export const ExtraCurricularSchema =
  SchemaFactory.createForClass(ExtraCurricular);

@Schema({ _id: false })
export class Award {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) description: string;
  @Prop() issuer?: string;
  @Prop() year?: string;
  @Prop([String]) mediaUrls?: string[];
}
export const AwardSchema = SchemaFactory.createForClass(Award);

@Schema({ _id: false })
export class Thesis {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop() supervisor?: string;
  @Prop() institution?: string;
  @Prop() year?: string;
  @Prop() documentUrl?: string;
}
export const ThesisSchema = SchemaFactory.createForClass(Thesis);

@Schema({ _id: false })
export class Project {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) description: string;
  @Prop([String]) technologiesUsed?: string[];
  @Prop([String]) collaborators?: string[];
  @Prop() repositoryUrl?: string;
  @Prop() liveDemoUrl?: string;
  @Prop() year?: string;
}
export const ProjectSchema = SchemaFactory.createForClass(Project);

@Schema({ _id: false })
export class Publication {
  @Prop({ required: true }) title: string;
  @Prop({ required: true }) journalOrConference: string;
  @Prop({ type: [String], required: true }) authors: string[];
  @Prop({ required: true }) year: string;
  @Prop() url?: string;
  @Prop() doi?: string;
}
export const PublicationSchema = SchemaFactory.createForClass(Publication);

@Schema({ _id: false })
export class Certification {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) issuingOrganization: string;
  @Prop({ required: true }) issueDate: string; // Store as string if keeping ISO format, Date if native Date objects preferred
  @Prop() expirationDate?: string;
  @Prop() credentialId?: string;
  @Prop() credentialUrl?: string;
}
export const CertificationSchema = SchemaFactory.createForClass(Certification);

@Schema({ _id: false })
export class Activities {
  @Prop({ type: [ExtraCurricularSchema], default: undefined })
  extraCurriculars?: ExtraCurricular[];

  @Prop({ type: [AwardSchema], default: undefined })
  awards?: Award[];

  @Prop({ type: [ThesisSchema], default: undefined })
  theses?: Thesis[];

  @Prop({ type: [ProjectSchema], default: undefined })
  projects?: Project[];

  @Prop({ type: [PublicationSchema], default: undefined })
  publications?: Publication[];

  @Prop({ type: [CertificationSchema], default: undefined })
  certifications?: Certification[];
}
export const ActivitiesSchema = SchemaFactory.createForClass(Activities);

// --- Main Education Schema ---

export type EducationDocument = Education & Document;

@Schema({ timestamps: true, collection: 'education' })
export class Education {
  @Prop({ required: true })
  degree: string;

  @Prop() // Optional
  field?: string;

  @Prop() // Optional
  domain?: string;

  @Prop({ required: true })
  institute: string;

  @Prop({ required: true })
  startDate: string; // Store as string (ISO format) or Date

  @Prop({ required: true })
  result: string;

  // --- activities is now optional ---
  @Prop({ type: ActivitiesSchema, required: false, default: undefined }) // Explicitly set required: false, default: undefined ensures it doesn't default to {}
  activities?: Activities; // Added '?'

  // Optional fields
  @Prop()
  endDate?: string; // Store as string (ISO format) or Date

  @Prop()
  isCurrent?: boolean;

  @Prop()
  description?: string;

  @Prop()
  major?: string;

  @Prop()
  board?: string;

  @Prop()
  group?: string;

  @Prop({ type: LocationSchema }) // Mongoose makes embedded objects optional by default unless required:true
  location?: Location;

  @Prop({ enum: ['Online', 'On-Campus', 'Hybrid'] })
  modeOfStudy?: 'Online' | 'On-Campus' | 'Hybrid';

  @Prop({ type: [CourseSchema], default: undefined })
  courses?: Course[];

  @Prop()
  logoUrl?: string;

  @Prop()
  displayOrder?: number;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
