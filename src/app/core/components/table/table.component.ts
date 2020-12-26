import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ProjectService } from 'src/app/services/project/project.service';
import { Table } from '../../interfaces/core-component';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent extends BaseFieldComponent implements OnInit {
    // @Input() field: FieldConfig = createFieldConfig();
    @Input() group!: FormGroup;
    // @Input() componentMode: ComponentMode = 'view';
    // @Input() index = 0;
    public menuItems: MenuItem[] = [
        {
            label: 'Add Row',
            icon: 'pi pi-plus',
            command: () => {
                this.addTableRow();
            },
        },
        {
            label: 'Add Column',
            icon: 'pi pi-plus',
            command: () => {
                this.addTableColumn();
            },
        },
        {
            label: 'Delete Last Row',
            icon: 'pi pi-times',
            command: () => {
                this.projectService.removeTableRow();
            },
        },
        {
            label: 'Delete Last Column',
            icon: 'pi pi-times',
            command: () => {
                this.projectService.removeTableColumn();
            },
        },
    ];

    public tableValues?: { row?: { item: { text: string; isHeader?: boolean }[] }[] };

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.tableValues = (this.field.metadata as Table).data.value;
    }

    public removeTableRow(addAtIndex?: number) {}

    public removeTableColumn(addAtIndex?: number) {}

    public addTableColumn(addAtIndex?: number) {
        const table = this.tableValues?.row;

        if (!table) {
            return;
        }

        table.forEach(col => {
            const isHeader = col.item[0].isHeader;
            const newElement = this.createRowElements(1, !!isHeader);
            col.item.splice(addAtIndex || col.item.length || 0, 0, newElement[0]);
        });
    }

    private addTableRow(addAtIndex?: number) {
        const table = this.tableValues?.row;

        if (!table) {
            return;
        }

        const newRow = this.createRowElements(table[0].item.length, false);
        table.splice(addAtIndex || table.length || 0, 0, { item: newRow });
    }

    private createRowElements(amount: number, isHeader: boolean) {
        let row: { text: string; isHeader?: boolean }[] = [];

        for (let i = 0; i < amount; i++) {
            row.push({ text: isHeader ? '(Empty header)' : '(Empty cell)', isHeader });
        }
        return row;
    }
}
