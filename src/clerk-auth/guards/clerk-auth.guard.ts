// src/clerk-auth/guards/clerk-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { getAuth, AuthObject } from '@clerk/express';

// Define an interface for the augmented Request object
// Keep this interface definition consistent
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    sessionId: string | null;
    orgId: string | null; // Expects string or null
    email?: string; // Expects string or undefined
    firstName?: string; // Expects string or undefined
    lastName?: string; // Expects string or undefined
    profileImageUrl?: string; // <-- Add this
  };
  auth: AuthObject;
}

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const auth = getAuth(request);

    if (!auth || !auth.userId) {
      this.logger.warn(
        'Authentication failed: No userId found in Clerk auth object.',
      );
      throw new UnauthorizedException('User is not authenticated');
    }

    // --- Corrections Start ---

    // Explicitly handle potential unknown types from sessionClaims
    // You might add more robust type checking if needed (e.g., typeof claim === 'string')
    const email = auth.sessionClaims?.email as string | undefined;
    const firstName = auth.sessionClaims?.firstName as string | undefined;
    const lastName = auth.sessionClaims?.lastName as string | undefined;

    // Handle orgId potentially being undefined, convert to null if so
    const orgId = auth.orgId ?? null;
    const profileImageUrl = auth.sessionClaims?.profileImageUrl as
      | string
      | undefined;
    request.auth = auth;
    request.user = {
      userId: auth.userId,
      sessionId: auth.sessionId,
      orgId: orgId, // Use the converted value
      email: email, // Use the casted value
      firstName: firstName, // Use the casted value
      lastName: lastName, // Use the casted value
      profileImageUrl: profileImageUrl, // <-- Add this line
    };

    // --- Corrections End ---

    this.logger.log(`User ${auth.userId} authenticated successfully.`);
    return true;
  }
}
