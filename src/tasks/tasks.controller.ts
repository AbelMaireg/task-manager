import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(
      createTaskDto.title,
      createTaskDto.isCompleted,
    );
  }

  @Get()
  findAll(@Query('isCompleted') isCompleted?: string) {
    const isCompletedBool =
      isCompleted !== undefined ? isCompleted === 'true' : undefined;
    return this.tasksService.getAllTasks(isCompletedBool);
  }

  @Get(':title')
  findOne(@Param('title') title: string) {
    const task = this.tasksService.getTaskByTitle(title);
    if (!task) {
      throw new NotFoundException(`Task with title "${title}" not found`);
    }
    return task;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = this.tasksService.updateTask(
      id,
      updateTaskDto.title,
      updateTaskDto.isCompleted,
    );
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const task = this.tasksService.deleteTask(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }
}
