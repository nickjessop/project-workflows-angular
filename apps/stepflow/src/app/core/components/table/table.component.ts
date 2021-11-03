import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, ComponentSettings, Table } from '@stepflow/interfaces';
import { AngularResizeElementDirection, AngularResizeElementEvent } from 'angular-resize-element';
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
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('textInput');
    @Input() resizable?: boolean;
    @Input() componentMode?: ComponentMode;

    @ViewChild('table') table!: any;
    selectedData: { rowIndex: number; colIndex: number } = { rowIndex: 0, colIndex: 0 };
    public menuItems: MenuItem[] = [
        {
            label: 'Insert',
            icon: 'pi pi-fw pi-plus',
            items: [
                {
                    label: 'Insert row above',
                    command: () => {
                        this.addTableRow(this.selectedData.rowIndex);
                    },
                },
                {
                    label: 'Insert row below',
                    command: () => {
                        this.addTableRow(this.selectedData.rowIndex + 1);
                    },
                },
                {
                    label: 'Insert column right',
                    command: () => {
                        this.addTableColumn(this.selectedData.colIndex + 1);
                    },
                },
                {
                    label: 'Insert column left',
                    command: () => {
                        this.addTableColumn(this.selectedData.colIndex);
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

    public tableValues?: {
        row?: { item?: { text: string; isHeader?: boolean }[] }[];
        column?: { item?: { size: number }[] }[];
    } = {
        row: [
            {
                item: [{ text: 'New table', isHeader: true }],
            },
        ],
        column: [
            {
                item: [{ size: 33.3 }],
            },
        ],
    };

    constructor(private projectService: ProjectService, private coreComponentService: CoreComponentService) {}

    public height?: number;
    public settings?: ComponentSettings;
    public readonly AngularResizeElementDirection = AngularResizeElementDirection;

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

    private updateHeight(height: number = 400) {
        if (!this.resizable) {
            return;
        }
        this.height = height;
        this.field.metadata.settings = { ...this.field.metadata.settings, height: height };
    }

    public onResize(evt: AngularResizeElementEvent): void {
        this.height = evt.currentHeightValue;
    }

    public onResizeEnd(evt: AngularResizeElementEvent): void {
        const height = evt.currentHeightValue;
        this.updateHeight(height);
        this.projectService.syncProject();
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
        this.projectService.syncProject();
    }

    public removeTableColumn(removeAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            return;
        }

        rows.forEach(col => {
            if (col.item) {
                if (removeAtIndex == 0) {
                    col.item.shift();
                } else {
                    col.item.splice(removeAtIndex || col.item.length - 1 || 0, 1);
                }
            }
        });

        if (!rows[0].item || rows[0].item.length === 0) {
            delete this.tableValues?.row;
        }
        this.projectService.syncProject();
    }

    public addTableColumn(addAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            const newElement = this.createRowElements(1, true);
            if (this.tableValues) {
                this.tableValues.row = [{ item: newElement }];
            }

            return;
        }

        rows.forEach(col => {
            if (col.item) {
                const isHeader = col.item[0].isHeader;
                const newElement = this.createRowElements(1, !!isHeader);
                if (addAtIndex == 0) {
                    col.item.unshift(newElement[0]);
                } else {
                    col.item.splice(addAtIndex || col.item.length || 0, 0, newElement[0]);
                }
            }
        });

        this.projectService.syncProject();
    }

    private addTableRow(addAtIndex?: number) {
        const rows = this.tableValues?.row;

        if (!rows) {
            const newElement = this.createRowElements(1, true);
            if (this.tableValues) {
                this.tableValues.row = [{ item: newElement }];
            }

            return;
        }

        const newRow = this.createRowElements(rows?.[0].item?.length || 1, false);
        rows.splice(addAtIndex || rows.length || 0, 0, { item: newRow });

        this.projectService.syncProject();
    }

    private createRowElements(amount: number, isHeader: boolean) {
        let row: { text: string; isHeader?: boolean }[] = [];

        for (let i = 0; i < amount; i++) {
            row.push({ text: isHeader ? '' : '', isHeader });
        }
        return row;
    }

    public columnsResized(event: Event) {
        console.log('columns event', event);
        this.table.getColumns();
        // const rows = this.tableValues?.row;
        // if (rows) {
        //     rows.forEach(col => {
        //         if (col.item) {
        //             console.log(col);
        //             console.log(col.item);
        //         }
        //     });
        // }
    }

    public saveTableData() {
        this.projectService.syncProject();
    }
}
