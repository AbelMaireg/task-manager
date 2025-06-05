import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  isCompleted: boolean;
}
