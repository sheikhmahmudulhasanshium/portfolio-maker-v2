// src/clerk-auth/clerk-auth.controller.ts
import {
  Controller,
  Post,
  Req,
  UseGuards,
  Logger,
  Headers,
} from '@nestjs/common';
import { ClerkAuthService } from './clerk-auth.service';
import {
  ClerkAuthGuard,
  AuthenticatedRequest,
} from './guards/clerk-auth.guard';
// --- Correction: Import User and UserDocument from the correct schema path ---
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { User, UserDocument } from 'src/users/entities/user.entity';

@ApiTags('Auth (Clerk)')
@ApiBearerAuth()
@Controller('auth')
export class ClerkAuthController {
  private readonly logger = new Logger(ClerkAuthController.name);

  constructor(private readonly clerkAuthService: ClerkAuthService) {}

  @UseGuards(ClerkAuthGuard)
  @Post('sync')
  @ApiOperation({ summary: 'Synchronize Clerk user data with local database' })
  @ApiResponse({
    status: 201,
    description: 'User found or created successfully.',
    // --- Correction: Use the imported User class directly ---
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiHeader({
    name: 'x-user-first-name',
    required: false,
    description: 'Optional: User first name if not in token',
  })
  @ApiHeader({
    name: 'x-user-last-name',
    required: false,
    description: 'Optional: User last name if not in token',
  })
  async syncUser(
    @Req() req: AuthenticatedRequest,
    @Headers('x-user-first-name') headerFirstName?: string,
    @Headers('x-user-last-name') headerLastName?: string,
    // --- Correction: Ensure return type uses the correctly imported UserDocument ---
  ): Promise<UserDocument> {
    const {
      userId,
      email,
      firstName: tokenFirstName,
      lastName: tokenLastName,
      profileImageUrl, // <-- Add this line
    } = req.user;

    this.logger.log(`Sync request received for Clerk User ID: ${userId}`);

    const effectiveFirstName = tokenFirstName ?? headerFirstName;
    const effectiveLastName = tokenLastName ?? headerLastName;
    const effectiveEmail = email ?? 'missing-email@example.com';

    if (!email) {
      this.logger.warn(
        `Email missing for Clerk User ID: ${userId}. Check Clerk token claims.`,
      );
    }

    return this.clerkAuthService.syncUserWithClerkData({
      userId,
      email: effectiveEmail,
      firstName: effectiveFirstName,
      lastName: effectiveLastName,
      profileImageUrl: profileImageUrl, // <-- Add this line
    });
  }
}
