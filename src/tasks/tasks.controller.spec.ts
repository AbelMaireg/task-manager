import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('../utils/uuid-generator', () => ({
  generateUUID: jest.fn(),
}));

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockUUIDs = [
    '123e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174001',
    '123e4567-e89b-12d3-a456-426614174002',
  ];
  let uuidIndex = 0;

  const mockTask = {
    id: mockUUIDs[0],
    title: 'Task 1',
    isCompleted: false,
  };

  const mockTasksService = {
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getTaskByTitle: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  };

  beforeEach(async () => {
    uuidIndex = 0;
    jest
      .spyOn(require('../utils/uuid-generator'), 'generateUUID')
      .mockImplementation(() => mockUUIDs[uuidIndex++]);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a task and return it', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        isCompleted: false,
      };
      mockTasksService.createTask.mockReturnValue(mockTask);

      const result = controller.create(createTaskDto);

      expect(service.createTask).toHaveBeenCalledWith(
        createTaskDto.title,
        createTaskDto.isCompleted,
      );
      expect(result).toEqual(mockTask);
    });
  });

  describe('findAll', () => {
    it('should return all tasks when no query parameter is provided', async () => {
      const tasks = [
        mockTask,
        { ...mockTask, id: mockUUIDs[1], title: 'Task 2', isCompleted: true },
      ];
      mockTasksService.getAllTasks.mockReturnValue(tasks);

      const result = controller.findAll();

      expect(service.getAllTasks).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(tasks);
    });

    it('should return only completed tasks when isCompleted=true', async () => {
      const tasks = [
        { ...mockTask, id: mockUUIDs[1], title: 'Task 2', isCompleted: true },
      ];
      mockTasksService.getAllTasks.mockReturnValue(tasks);

      const result = controller.findAll('true');

      expect(service.getAllTasks).toHaveBeenCalledWith(true);
      expect(result).toEqual(tasks);
    });

    it('should return only incompleted tasks when isCompleted=false', async () => {
      const tasks = [mockTask];
      mockTasksService.getAllTasks.mockReturnValue(tasks);

      const result = controller.findAll('false');

      expect(service.getAllTasks).toHaveBeenCalledWith(false);
      expect(result).toEqual(tasks);
    });
  });

  describe('findOne', () => {
    it('should return a task by title', async () => {
      mockTasksService.getTaskByTitle.mockReturnValue(mockTask);

      const result = controller.findOne('Task 1');

      expect(service.getTaskByTitle).toHaveBeenCalledWith('Task 1');
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTasksService.getTaskByTitle.mockReturnValue(undefined);

      expect(() => controller.findOne('Nonexistent Task')).toThrow(
        new NotFoundException('Task with title "Nonexistent Task" not found'),
      );
    });
  });

  describe('update', () => {
    it('should update a task and return it', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        isCompleted: true,
      };
      const updatedTask = {
        ...mockTask,
        title: 'Updated Task',
        isCompleted: true,
      };
      mockTasksService.updateTask.mockReturnValue(updatedTask);

      const result = controller.update(mockUUIDs[0], updateTaskDto);

      expect(service.updateTask).toHaveBeenCalledWith(
        mockUUIDs[0],
        updateTaskDto.title,
        updateTaskDto.isCompleted,
      );
      expect(result).toEqual(updatedTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        isCompleted: true,
      };
      mockTasksService.updateTask.mockReturnValue(null);

      expect(() => controller.update('invalid-id', updateTaskDto)).toThrow(
        new NotFoundException('Task with ID "invalid-id" not found'),
      );
    });
  });

  describe('delete', () => {
    it('should delete a task and return it', async () => {
      mockTasksService.deleteTask.mockReturnValue(mockTask);

      const result = controller.delete(mockUUIDs[0]);

      expect(service.deleteTask).toHaveBeenCalledWith(mockUUIDs[0]);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task is not found', async () => {
      mockTasksService.deleteTask.mockReturnValue(null);

      expect(() => controller.delete('invalid-id')).toThrow(
        new NotFoundException('Task with ID "invalid-id" not found'),
      );
    });
  });
});
