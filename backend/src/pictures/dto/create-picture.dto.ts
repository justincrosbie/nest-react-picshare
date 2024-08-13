import { IsNotEmpty, IsUrl } from 'class-validator';

export class CreatePictureDto {
  @IsNotEmpty()
  title: string;

  @IsUrl()
  url: string;
}
