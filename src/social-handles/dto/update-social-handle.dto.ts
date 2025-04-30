// src/social-handles/dto/update-social-handle.dto.ts
import { PartialType } from '@nestjs/swagger'; // Use PartialType from @nestjs/swagger for optional properties
import { CreateSocialHandleDto } from './create-social-handle.dto';

// PartialType makes all properties of CreateSocialHandleDto optional
// and inherits validation and swagger decorators.
export class UpdateSocialHandleDto extends PartialType(CreateSocialHandleDto) {}
