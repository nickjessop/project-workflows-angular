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
    public menuAddItems: MenuItem[] = [
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
    ];

    public menuRemoveItems: MenuItem[] = [
        {
            label: 'Delete Last Row',
            icon: 'pi pi-times',
            command: () => {
                this.removeTableRow();
            },
        },
        {
            label: 'Delete Last Column',
            icon: 'pi pi-times',
            command: () => {
                this.removeTableColumn();
            },
        },
    ];

    public tableValues?: { row?: { item?: { text: string; isHeader?: boolean }[] }[] } = {
        row: [
            {
                item: [{ text: 'header1', isHeader: true }],
            },
        ],
    };

    constructor(public projectService: ProjectService) {
        super(projectService);
    }

    ngOnInit() {
        this.tableValues = (this.field.metadata as Table).data.value;
    }

    public removeTableRow(removeAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            return;
        }

        rows.splice(removeAtIndex || rows.length - 1, 1);
        if (!rows || rows.length === 0) {
            delete this.tableValues?.row;
        }
    }

    public removeTableColumn(removeAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            return;
        }

        rows.forEach(col => {
            if (col.item) {
                col.item.splice(removeAtIndex || col.item.length - 1 || 0, 1);
            }
        });

        if (!rows[0].item || rows[0].item.length === 0) {
            delete this.tableValues?.row;
        }
    }

    public addTableColumn(addAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            const newElement = this.createRowElements(1, true);
            this.tableValues = { row: [{ item: newElement }] };

            return;
        }

        rows.forEach(col => {
            if (col.item) {
                const isHeader = col.item[0].isHeader;
                const newElement = this.createRowElements(1, !!isHeader);
                col.item.splice(addAtIndex || col.item.length || 0, 0, newElement[0]);
            }
        });
    }

    private addTableRow(addAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            const newElement = this.createRowElements(1, true);
            this.tableValues = { row: [{ item: newElement }] };

            return;
        }

        const newRow = this.createRowElements(rows?.[0].item?.length || 1, false);
        rows.splice(addAtIndex || rows.length || 0, 0, { item: newRow });
    }

    private createRowElements(amount: number, isHeader: boolean) {
        let row: { text: string; isHeader?: boolean }[] = [];

        for (let i = 0; i < amount; i++) {
            row.push({ text: isHeader ? '(Empty header)' : '(Empty cell)', isHeader });
        }
        return row;
    }
}
