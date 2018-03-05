import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { FileUploadComponent } from './file-upload.component';
import { ByteFormat, ByteToKilo, ByteToMega } from './file-upload.pipes';

const myDirectives = [
    FileUploadComponent,
    ByteFormat, ByteToKilo, ByteToMega
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        myDirectives
    ],
    exports: [
        myDirectives
    ]
})
export class FileUploadModule { }