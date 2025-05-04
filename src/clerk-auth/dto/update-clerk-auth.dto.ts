import { PartialType } from '@nestjs/swagger';
import { CreateClerkAuthDto } from './create-clerk-auth.dto';

export class UpdateClerkAuthDto extends PartialType(CreateClerkAuthDto) {}
