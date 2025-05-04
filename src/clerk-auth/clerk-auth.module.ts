// src/clerk-auth/clerk-auth.module.ts
import { Module } from '@nestjs/common';
import { ClerkAuthService } from './clerk-auth.service';
import { ClerkAuthController } from './clerk-auth.controller';
import { UsersModule } from '../users/users.module'; // Ensure UsersModule is imported
import { ClerkAuthGuard } from './guards/clerk-auth.guard';

@Module({
  imports: [UsersModule], // Import UsersModule to use UsersService
  controllers: [ClerkAuthController],
  providers: [ClerkAuthService, ClerkAuthGuard], // Provide the Guard
  exports: [ClerkAuthGuard], // Export guard if used in other modules
})
export class ClerkAuthModule {}
