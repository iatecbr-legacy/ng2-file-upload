import { FileUploadErrorEnum } from './file-upload-error.enum';

export class FileUploadModel {
    error: FileUploadErrorEnum;
    file: File;
}