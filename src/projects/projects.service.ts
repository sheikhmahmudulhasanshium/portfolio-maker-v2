// projects/projects.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const created = new this.projectModel(createProjectDto);
    return await created.save();
  }

  async findAll() {
    return await this.projectModel.find().exec();
  }

  async findOne(id: string) {
    return await this.projectModel.findById(id).exec();
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    return await this.projectModel.findByIdAndUpdate(id, updateProjectDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return await this.projectModel.findByIdAndDelete(id);
  }
}
