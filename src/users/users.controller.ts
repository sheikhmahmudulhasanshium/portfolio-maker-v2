// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards, // Import UseGuards
  Req, // Import Req
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ClerkAuthGuard,
  AuthenticatedRequest,
} from '../clerk-auth/guards/clerk-auth.guard'; // Import Guard and Request Interface
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger'; // Swagger
import { User } from './entities/user.entity';

@ApiTags('Users') // Group in Swagger
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Note: This endpoint might be redundant if user creation only happens via Clerk sync
  @Post()
  @ApiOperation({ summary: 'Create a new user (manual)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth() // Assuming admin/internal use requiring auth
  @UseGuards(ClerkAuthGuard) // Secure this if needed
  create(@Body() createUserDto: CreateUserDto) {
    // Consider if manual creation should be allowed or if it conflicts with Clerk sync
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.', type: [User] })
  @ApiBearerAuth() // Secure if needed
  @UseGuards(ClerkAuthGuard) // Secure this endpoint
  findAll() {
    return this.usersService.findAll();
  }

  // Endpoint to get the currently authenticated user's DB record
  @Get('me')
  @UseGuards(ClerkAuthGuard) // Apply guard to get req.user
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the profile of the currently authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Authenticated user profile.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 404,
    description: 'User not found in DB (sync might be needed).',
  })
  async getMe(@Req() req: AuthenticatedRequest) {
    // Use AuthenticatedRequest type
    const { userId } = req.user; // Get Clerk userId from the guard
    const user = await this.usersService.findOneByClerkId(userId);
    if (!user) {
      // This case might happen if the user exists in Clerk but hasn't been synced yet
      throw new NotFoundException(
        `User with Clerk ID ${userId} not found in the database. Try syncing.`,
      );
    }
    return user; // Return the user document from your database
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific user by database ID' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User found.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth() // Secure if needed
  @UseGuards(ClerkAuthGuard) // Secure this endpoint
  findOne(@Param('id') id: string) {
    // ID is typically a string from MongoDB ObjectId
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by database ID' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth() // Secure if needed
  @UseGuards(ClerkAuthGuard) // Secure this endpoint
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // ID is string
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by database ID' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth() // Secure if needed
  @UseGuards(ClerkAuthGuard) // Secure this endpoint
  remove(@Param('id') id: string) {
    // ID is string
    return this.usersService.remove(id);
  }
}
