import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { Education, EducationDocument } from './entities/education.entity';

@Injectable()
export class EducationService {
  // Inject the Mongoose Model
  constructor(
    @InjectModel(Education.name)
    private educationModel: Model<EducationDocument>,
  ) {}

  async create(
    createEducationDto: CreateEducationDto,
  ): Promise<EducationDocument> {
    const createdEducation = new this.educationModel(createEducationDto);
    return createdEducation.save();
  }

  async findAll(): Promise<EducationDocument[]> {
    return this.educationModel.find().exec();
  }

  async findOne(id: string): Promise<EducationDocument> {
    const education = await this.educationModel.findById(id).exec();
    if (!education) {
      throw new NotFoundException(`Education record with ID "${id}" not found`);
    }
    return education;
  }

  async update(
    id: string,
    updateEducationDto: UpdateEducationDto,
  ): Promise<EducationDocument> {
    const updatedEducation = await this.educationModel
      .findByIdAndUpdate(id, updateEducationDto, { new: true }) // {new: true} returns the updated document
      .exec();

    if (!updatedEducation) {
      throw new NotFoundException(`Education record with ID "${id}" not found`);
    }
    return updatedEducation;
  }

  async remove(id: string): Promise<{ deleted: boolean; id: string }> {
    // You can also return the deleted document if needed: findByIdAndDelete(id).exec();
    const result = await this.educationModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Education record with ID "${id}" not found`);
    }
    // Return a confirmation object
    return { deleted: true, id };
  }
}
