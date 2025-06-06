import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BlockConfig, ComponentMode, Validator } from '@project-workflows/interfaces';

@Component({
    selector: 'project-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
    @Input() fields: BlockConfig[] = [];
    public componentMode: ComponentMode = 'edit';

    @Output() dragAndDropEvent: EventEmitter<{
        previousIndex: number;
        currentIndex: number;
    }> = new EventEmitter();
    form?: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        this.form = this.createControl();
    }

    get value() {
        return this.form ? this.form.value : null;
    }

    createControl() {
        const group = this.formBuilder.group({});
        if (this.fields && this.fields.length > 0) {
            this.fields.forEach(field => {
                const control = this.formBuilder.control(field, this.bindValidations(field.metadata.validation || []));
                group.addControl(field.name, control);
            });
        }

        return group;
    }

    bindValidations(validations: Validator[]) {
        if (validations.length > 0) {
            const validList: ValidatorFn[] = [];

            validations.forEach(valid => {
                validList.push(valid.validator);
            });

            return Validators.compose(validList);
        }
        return null;
    }

    onSubmit(event: Event) {
        event.preventDefault();
        event.stopPropagation();

        if (this.form) {
            if (this.form.valid) {
                // this.submitEvent.emit(this.form.value);
            } else {
                this.validateAllFormFields(this.form);
            }
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);

            if (control) {
                control.markAsTouched({ onlySelf: true });
            }
        });
    }
    drop(event: CdkDragDrop<any>) {
        this.dragAndDropEvent.emit({
            previousIndex: event.previousIndex,
            currentIndex: event.currentIndex,
        });
    }
}
