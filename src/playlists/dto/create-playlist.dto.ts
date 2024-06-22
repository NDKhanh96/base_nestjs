import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly songs: number[];

  @IsNumber()
  @IsNotEmpty()
  readonly user: number;
}
