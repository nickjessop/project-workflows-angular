import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
// @ts-ignore
import ColumnResizer from 'column-resizer';
import { BaseFieldComponent } from '../base-field/base-field.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TableComponent extends BaseFieldComponent implements OnInit {
    @ViewChild('tableElement', { static: true, read: ElementRef })
    tableElements?: ElementRef;

    tableSettings?: any;

    constructor() {
        super();
    }

    ngOnInit() {
        this.columnResizer();
    }

    columnResizer() {
        if (this.tableElements) {
            this.tableSettings = new ColumnResizer(this.tableElements.nativeElement, {
                minWidth: 24,
                resizeMode: 'fit',
                draggingClass: 'table__column-drag',
                // widths: [20, 20, 60],
            });
        }
    }

    addColumn() {
        if (!this.tableElements) {
            return;
        }

        const tableContents = this.tableElements.nativeElement;
        this.tableSettings.reset({ disable: true });
        let i = 0;
        const tr = tableContents.querySelectorAll('tr');
        for (i = 0; i < tr.length; i++) {
            const row = tr[i];
            const cell = i ? document.createElement('td') : document.createElement('th');
            cell.innerHTML = i ? '<span contenteditable>cell</span>' : '<span contenteditable>header</span>';
            row.appendChild(cell);
        }
        // since now we have more columns, lets share the table width proportionally
        const th = tableContents.querySelectorAll('th');
        for (i = 0; i < th.length; i++) {
            th[i].style.width = 100 / th.length + '%';
        }
        this.columnResizer();
    }

    addRow() {
        if (!this.tableElements) {
            return;
        }

        const tableContents = this.tableElements.nativeElement;
        this.tableSettings.reset({ disable: true });
        // duplicate the last row
        const tr = tableContents.querySelectorAll('tr');
        const html = tr[tr.length - 1].innerHTML;
        const row = document.createElement('tr');
        row.innerHTML = html;
        tableContents.appendChild(row);
        this.columnResizer();
    }
}
