import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ComponentMode, createFieldConfig, FieldConfig } from 'src/app/models/interfaces/core-component';
import { ProjectService } from 'src/app/services/project/project.service';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent extends BaseFieldComponent implements OnInit {
    @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    @Input() componentMode: ComponentMode = 'view';
    @Input() index = 0;

    files: any[] | undefined;

    cols: any[] | undefined;

    log(val: any) {
        console.log(val);
    }

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.cols = [
            { field: 'filename', header: 'Name', size: '55' },
            { field: 'filetype', header: 'Type', size: '15' },
            { field: 'filesize', header: 'Size', size: '15' },
            { field: 'fileurl', header: 'Download', size: '15' },
        ];
        this.files = [
            { filename: 'Testfile.pdf', filetype: 'PDF', filesize: '1 MB', fileurl: '/path/to/file.pdf' },
            { filename: 'Testfile.pdf', filetype: 'PDF', filesize: '1 MB', fileurl: '/path/to/file.pdf' },
            { filename: 'Testfile.pdf', filetype: 'PDF', filesize: '1 MB', fileurl: '/path/to/file.pdf' },
            { filename: 'Testfile.pdf', filetype: 'PDF', filesize: '1 MB', fileurl: '/path/to/file.pdf' },
            { filename: 'Testfile.pdf', filetype: 'PDF', filesize: '1 MB', fileurl: '/path/to/file.pdf' },
        ];
    }
}
