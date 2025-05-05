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
  // Kept guarded as it's a POST operation potentially for admin/internal use
  @Post()
  @ApiOperation({ summary: 'Create a new user (manual)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    // Consider if manual creation should be allowed or if it conflicts with Clerk sync
    return this.usersService.create(createUserDto);
  }

  // --- REMOVED AUTH GUARD ---
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.', type: [User] })
  // Removed @ApiBearerAuth()
  // Removed @UseGuards(ClerkAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  // Endpoint to get the currently authenticated user's DB record
  // --- KEPT AUTH GUARD --- (Requires req.user)
  @Get('me')
  @UseGuards(ClerkAuthGuard)
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
    const { userId } = req.user;
    const user = await this.usersService.findOneByClerkId(userId);
    if (!user) {
      throw new NotFoundException(
        `User with Clerk ID ${userId} not found in the database. Try syncing.`,
      );
    }
    return user;
  }

  // --- REMOVED AUTH GUARD ---
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific user by database ID' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User found.', type: User })
  @ApiResponse({ status: 404, description: 'User not found.' })
  // Removed @ApiBearerAuth()
  // Removed @UseGuards(ClerkAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Kept guarded as it modifies data
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
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // Kept guarded as it deletes data
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by database ID' })
  @ApiParam({ name: 'id', description: 'MongoDB User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBearerAuth()
  @UseGuards(ClerkAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
