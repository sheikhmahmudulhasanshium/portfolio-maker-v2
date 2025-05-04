// src/clerk-auth/clerk-auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/entities/user.entity';

interface SyncClerkUserData {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class ClerkAuthService {
  private readonly logger = new Logger(ClerkAuthService.name);

  constructor(private readonly usersService: UsersService) {}

  async syncUserWithClerkData(
    clerkUserData: SyncClerkUserData,
  ): Promise<UserDocument> {
    const { userId, email, firstName, lastName } = clerkUserData;

    this.logger.log(
      `Attempting to find or create user for Clerk ID: ${userId}`,
    );

    const user = await this.usersService.findOrCreateByClerkId({
      clerkId: userId,
      email,
      firstName,
      lastName,
    });

    // --- Apply the fix here on Line 37 ---
    this.logger.log(
      `User sync successful for Clerk ID: ${userId}. DB User ID: ${user.clerkId.toString()}`, // Added .toString()
    );
    // --- Fix applied ---

    return user;
  }
}
