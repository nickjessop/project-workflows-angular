import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { createComponentMetadataTemplate, Url } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-url',
    templateUrl: './url.component.html',
    styleUrls: ['./url.component.scss'],
})
export class UrlComponent extends BaseFieldComponent implements OnInit {
    @Input() group!: FormGroup;

    public urlData = createComponentMetadataTemplate('url') as Url;

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit(): void {
        this.urlData = this.field.metadata as Url;
    }

    public onAddNewUrlPress() {
        this.urlData.data.value.push({ href: '' });
    }
    public onRemoveUrlPress(index: number) {
        this.urlData.data.value.splice(index, 1);
    }
}
