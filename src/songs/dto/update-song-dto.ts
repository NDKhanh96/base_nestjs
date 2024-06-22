import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import type { Artist } from 'src/artists/artist.entity';

export class UpdateSongDTO {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly artists: Artist[];

  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
