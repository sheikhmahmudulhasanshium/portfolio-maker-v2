// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

// Define the shape of data expected by findOrCreateByClerkId
interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

@Injectable()
export class UsersService {
  // Inject the Mongoose Model
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Implement create using the DTO
  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  // Find by MongoDB _id (string)
  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  // Find by Clerk ID
  async findOneByClerkId(clerkId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ clerkId }).exec();
  }

  // Update by MongoDB _id (string) using the DTO
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true }) // {new: true} returns the updated document
      .exec();
    if (!existingUser) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return existingUser;
  }

  // Remove by MongoDB _id (string)
  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    // Mongoose findByIdAndDelete returns the deleted document or null
    return { deleted: true, id };
  }

  // Consolidated findOrCreate method
  async findOrCreateByClerkId(userData: ClerkUserData): Promise<UserDocument> {
    let user = await this.userModel
      .findOne({ clerkId: userData.clerkId })
      .exec();
    if (!user) {
      // Use the data passed to create a new user
      user = await this.userModel.create({
        clerkId: userData.clerkId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    }
    // Optionally update existing user data if needed (e.g., email changes)
    // else {
    //   user = await this.userModel.findOneAndUpdate({ clerkId: userData.clerkId }, userData, { new: true });
    // }
    return user;
  }

  // Remove the duplicate method 'findOrCreateFromClerk'
  // async findOrCreateFromClerk(...) { ... }
}
