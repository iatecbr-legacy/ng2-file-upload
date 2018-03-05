import { Component, AfterViewInit, OnDestroy, HostListener, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core';

import { FileUploadErrorEnum } from './file-upload-error.enum';
import { FileUploadModel } from './file-upload.model';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css'],
    //host: {'(dragenter)':'onDragEnter($event)', '(dragleave)':'onDragLeave($event)', '(drop)':'onDrop($event)'}
})
export class FileUploadComponent implements AfterViewInit, OnDestroy {

    private outSideListenerDragenter;
    private outSideListenerDragleave;
    private outSideLockListener;

    public inSideDrag: Boolean = false;
    public outSideDrag: Boolean = false;
    public defaults = {
        classIcon: 'fa fa-cloud-upload',
        classIconDisabled: 'fa fa-cloud',
        label: 'ARRASTE & SOLTE, OU CLIQUE',
        outSideLabel: 'SOLTE SEU ARQUIVO AQUI',
        accept: null,
        maxSize: null,
        maxFiles: 50,
        multiple: null,
        disabled: null,
        tooltip: 'Clique aqui para fazer uplaod do arquivo'
    };    
    @ViewChild('iFile') private iFile: ElementRef;

    @Input()
    set classicon(value: string) {
        this.defaults.classIcon = value;
    };
    @Input()
    set classIconDisabled(value: string) {
        this.defaults.classIconDisabled = value;
    };
    @Input()
    set label(value: string) {
        this.defaults.label = value;
    };
    @Input()
    set outSideLabel(value: string) {
        this.defaults.outSideLabel = value;
    };
    @Input()
    set accept(value: string) {
        this.defaults.accept = value;
    };
    @Input()
    set maxsize(value: number) {
        this.defaults.maxSize = value;
    };
    @Input()
    set maxfiles(value: number) {
        this.defaults.maxFiles = value;

        this.defaults.disabled = (value <= 0);
        this.defaults.multiple = (value != 1);
    };
    @Input()
    set multiple(value: any) {
        this.defaults.multiple = value;
    };
    @Input()
    set disabled(value: string) {
        this.defaults.disabled = value;
    };
    @Input()
    set tooltip(value: string) {
        this.defaults.tooltip = value;
    };

    @Output()
    readFile: EventEmitter<FileUploadModel> = new EventEmitter<FileUploadModel>();

    @HostListener('dragenter', ['$event'])
    public onDragEnter(ev: DragEvent): void {
        this.inSideDrag = true;
        ev.preventDefault();
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(ev: DragEvent): void {
        this.inSideDrag = false;
        ev.preventDefault();
    }

    @HostListener('drop', ['$event'])
    public onDrop(ev: DragEvent): void {
        this.outSideDrag = false;
        this.inSideDrag = false;
        let dataTransfer: DataTransfer = ev.dataTransfer;
        if (dataTransfer != null) {
            ev.preventDefault();
            this.processFile(dataTransfer.files);
        }
    }

    constructor(private Renderer2: Renderer2) { }

    private processFile(files: FileList): void {
        let numFiles = files.length > this.defaults.maxFiles ? this.defaults.maxFiles : files.length

        for (let i = 0; i < numFiles; i++) {
            let file = files[i];

            this.readFile.next(<FileUploadModel>{
                error: this.validate(file),
                file: file
            })
        }

        this.iFile.nativeElement.value = '';

    }

    private validate(file: File): FileUploadErrorEnum {
        if (file == null)
            return FileUploadErrorEnum.UNKNOW;

        //maxlength
        if ((+this.defaults.maxSize) > 0 && file.size > this.defaults.maxSize * 1048576)
            return FileUploadErrorEnum.MAX_SIZE;
        
        //type extension
        if (this.defaults.accept != null && this.defaults.accept.length >= 2) {
            let pre = this.defaults.accept.replace(/\./g, '').replace(/,/g, '|');
            let regex = new RegExp(`(${pre})$`, "i");
            if (!regex.test(file.name))
                return FileUploadErrorEnum.EXTENSION_NOT_ALLOW;
        }

        return null;
    }

    private lockMouseOut(ev: MouseEvent): boolean {
        let element = <Element>(ev.target || ev.srcElement);

        switch (ev.type) {
            case 'dragenter':
                if (this.outSideDrag)
                    break;

                this.outSideDrag = true;
                break;

            case 'dragleave':
                let x = ev.clientX || ev.pageX;
                let y = ev.clientY || ev.pageY;
                this.outSideDrag = !(x < 50 && y < 50);
                break;
        }

        ev.preventDefault();
        return false;
    }

    public onChange(ev: Event) {
        let element: any = (ev.srcElement || ev.target);
        ev.preventDefault();
        this.processFile(element.files);
    }

    ngAfterViewInit() {
        this.outSideListenerDragenter = this.Renderer2.listen('body', 'dragenter', ev => { this.lockMouseOut(ev); });
        this.outSideListenerDragleave = this.Renderer2.listen('body', 'dragleave', ev => { this.lockMouseOut(ev); });
    }

    ngOnDestroy() {
        //Remover listner
        this.outSideListenerDragenter();
        this.outSideListenerDragleave();
    }


}