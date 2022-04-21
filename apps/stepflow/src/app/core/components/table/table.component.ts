import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, Table, TableColumn } from '@stepflow/interfaces';
// import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
import { MenuItem } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('table');
    @Input() resizable?: boolean;
    @Input() componentMode?: ComponentMode;

    @ViewChild('table') table!: any;
    selectedData: { rowIndex: number; colIndex: number } = { rowIndex: 0, colIndex: 0 };

    @ViewChild('fieldContainer') fieldcontainer!: any;
    public menuItems: MenuItem[] = [
        {
            label: 'Insert',
            icon: 'pi pi-fw pi-plus',
            items: [
                {
                    label: 'Insert row above',
                    command: () => {
                        this.addRow(this.selectedData.rowIndex);
                    },
                },
                {
                    label: 'Insert row below',
                    command: () => {
                        this.addRow(this.selectedData.rowIndex + 1);
                    },
                },
                {
                    label: 'Insert column right',
                    command: () => {
                        this.addCol(this.selectedData.colIndex + 1);
                    },
                },
                {
                    label: 'Insert column left',
                    command: () => {
                        this.addCol(this.selectedData.colIndex);
                    },
                },
            ],
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-minus',
            items: [
                {
                    label: 'Delete row',
                    command: () => {
                        this.removeTableRow(this.selectedData.rowIndex);
                    },
                },
                {
                    label: 'Delete column',
                    command: () => {
                        this.removeTableColumn(this.selectedData.colIndex);
                    },
                },
            ],
        },
    ];
    public tableValues?: TableColumn;

    constructor(private projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    public height?: number;
    public settings?: ComponentSettings;
    // public readonly AngularResizeElementDirection = AngularResizeElementDirection;
    public data = {
        width: 200,
        height: 300,
    };
    public items: MenuItem[] = [
        {
            label: 'Delete Block',
            icon: 'pi pi-times',
            command: () => {
                this.onDeleteBlock();
            },
        },
    ];

    public onDeleteBlock() {
        const index = this.index ? this.index : 0;
        this.projectService.deleteProjectBlock(index);
    }

    public dragStarted() {
        this.projectService.setBlockDrag(true);
    }

    public dragFinished() {
        this.projectService.setBlockDrag(false);
    }

    ngOnInit() {
        this.tableValues = (this.field.metadata as Table).data.value;
    }

    public removeTableRow(removeAtIndex?: number) {
        const column = this.tableValues?.row;

        if (!column) {
            return;
        }

        column.splice(removeAtIndex || column.length - 1, 1);
        if (!column || column.length === 0) {
            delete this.tableValues?.row;
        }
        this.projectService.syncProject();
    }

    public removeTableColumn(removeAtIndex?: number) {
        const column = this.tableValues?.row;

        if (!column) {
            return;
        }

        column.forEach(col => {
            if (col.item) {
                if (removeAtIndex == 0) {
                    col.item.shift();
                } else {
                    col.item.splice(removeAtIndex || col.item.length - 1 || 0, 1);
                }
            }
        });

        if (!column[0].item || column[0].item.length === 0) {
            delete this.tableValues?.row;
        }
        this.projectService.syncProject();
    }

    public addCol(addAtIndex?: number) {
        const column = this.tableValues?.row;

        if (!column) {
            const newElement = this.createRowElements(1);
            if (this.tableValues) {
                this.tableValues.row = [{ item: newElement }];
            }

            return;
        }

        column.forEach(column => {
            if (column.item) {
                const newElement = this.createRowElements(1);
                if (addAtIndex == 0) {
                    column.item.unshift(newElement[0]);
                } else {
                    column.item.splice(addAtIndex || column.item.length || 0, 0, newElement[0]);
                }
            }
        });

        this.projectService.syncProject();
    }

    public addRow(addAtIndex?: number) {
        const columns = this.tableValues?.row;

        if (!columns) {
            const newElement = this.createRowElements(1);
            if (this.tableValues) {
                this.tableValues.row = [{ item: newElement }];
            }

            return;
        }

        const newRow = this.createRowElements(columns?.[0].item?.length || 1);
        columns.splice(addAtIndex || columns.length || 0, 0, { item: newRow });

        this.projectService.syncProject();
    }

    private createRowElements(amount: number) {
        let column: { text: string; isHeader?: boolean }[] = [];

        for (let i = 0; i < amount; i++) {
            column.push({ text: '' });
        }
        return column;
    }

    public columnsResized(event: Event & { delta: number; element: { clientWidth: number; id: number } }) {
        const newWidth = String(event.element.clientWidth);
        const colIndex = Number(event.element.id);

        const totalRows = this.tableValues?.row?.length || 0;

        for (var i = 0; i < totalRows; i++) {
            if (this.tableValues?.row?.[i].item?.[colIndex]) {
                this.tableValues.row[i].item[colIndex].width = newWidth;
            }
        }

        console.log(this.tableValues);

        this.projectService.syncProject();
    }

    public saveTableData() {
        this.projectService.syncProject();
    }
}
