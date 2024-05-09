import { FileSystemStoredFile, HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';

export class RequestFileDto {
  @IsFile()
  @MaxFileSize(200 * 1024)
  @HasMimeType(['image/webp'])
  avatar: FileSystemStoredFile;
}
