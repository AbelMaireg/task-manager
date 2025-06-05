import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

jest.mock('../utils/uuid-generator', () => ({
  generateUUID: jest.fn(),
}));

describe('TasksService', () => {
  let service: TasksService;
  const mockUUIDs = [
    '123e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174001',
    '123e4567-e89b-12d3-a456-426614174002',
  ];
  let uuidIndex = 0;

  beforeEach(async () => {
    uuidIndex = 0;
    jest
      .spyOn(require('../utils/uuid-generator'), 'generateUUID')
      .mockImplementation(() => mockUUIDs[uuidIndex++]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with two tasks', () => {
      const tasks = service.getAllTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks).toEqual([
        { id: mockUUIDs[0], title: 'Task 1', isCompleted: false },
        { id: mockUUIDs[1], title: 'Task 2', isCompleted: true },
      ]);
    });
  });

  describe('createTask', () => {
    it('should create a new task and return it', () => {
      const newTask = service.createTask('New Task', false);
      expect(newTask).toEqual({
        id: mockUUIDs[2], // Next UUID in sequence
        title: 'New Task',
        isCompleted: false,
      });
      expect(service.getAllTasks()).toContainEqual(newTask);
    });
  });

  describe('getAllTasks', () => {
    it('should return all tasks when no filter is provided', () => {
      const tasks = service.getAllTasks();
      expect(tasks).toHaveLength(2);
      expect(tasks).toEqual([
        { id: mockUUIDs[0], title: 'Task 1', isCompleted: false },
        { id: mockUUIDs[1], title: 'Task 2', isCompleted: true },
      ]);
    });

    it('should return only completed tasks when isCompleted is true', () => {
      const tasks = service.getAllTasks(true);
      expect(tasks).toHaveLength(1);
      expect(tasks).toEqual([
        { id: mockUUIDs[1], title: 'Task 2', isCompleted: true },
      ]);
    });

    it('should return only incompleted tasks when isCompleted is false', () => {
      const tasks = service.getAllTasks(false);
      expect(tasks).toHaveLength(1);
      expect(tasks).toEqual([
        { id: mockUUIDs[0], title: 'Task 1', isCompleted: false },
      ]);
    });
  });

  describe('getTaskByTitle', () => {
    it('should return a task with the given title', () => {
      const task = service.getTaskByTitle('Task 1');
      expect(task).toEqual({
        id: mockUUIDs[0],
        title: 'Task 1',
        isCompleted: false,
      });
    });

    it('should return undefined if no task is found', () => {
      const task = service.getTaskByTitle('Nonexistent Task');
      expect(task).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('should update an existing task and return it', () => {
      const updatedTask = service.updateTask(
        mockUUIDs[0],
        'Updated Task',
        true,
      );
      expect(updatedTask).toEqual({
        id: mockUUIDs[0],
        title: 'Updated Task',
        isCompleted: true,
      });
      expect(service.getAllTasks()).toContainEqual(updatedTask);
    });

    it('should return null if task is not found', () => {
      const result = service.updateTask('invalid-id', 'Updated Task', true);
      expect(result).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return it', () => {
      const deletedTask = service.deleteTask(mockUUIDs[0]);
      expect(deletedTask).toEqual({
        id: mockUUIDs[0],
        title: 'Task 1',
        isCompleted: false,
      });
      expect(service.getAllTasks()).not.toContainEqual(deletedTask);
      expect(service.getAllTasks()).toHaveLength(1);
    });

    it('should return null if task is not found', () => {
      const result = service.deleteTask('invalid-id');
      expect(result).toBeNull();
      expect(service.getAllTasks()).toHaveLength(2);
    });
  });
});
