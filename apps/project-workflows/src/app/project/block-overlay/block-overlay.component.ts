import * as amplitude from '@amplitude/analytics-browser';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ComponentType } from '@project-workflows/interfaces';
import { CoreComponentService } from '../../core/core-component.service';

@Component({
    selector: 'project-block-overlay',
    templateUrl: './block-overlay.component.html',
    styleUrls: ['./block-overlay.component.scss'],
})
export class BlockPanelOverlayComponent implements OnInit {
    @Output() onSelectNewBlock = new EventEmitter<ComponentType>();

    public blockOptions: Array<any> = [];

    public displayBlockSidebar = false;

    constructor(private coreComponentService: CoreComponentService) {}

    ngOnInit(): void {
        this.blockOptions = this.coreComponentService.getBlockMetaData();
    }

    public get getPublicBlocks() {
        return this.blockOptions.filter(block => block.beta === false);
    }

    public get getBetaBlocks() {
        return this.blockOptions.filter(block => block.beta === true);
    } //TODO: Show these to certain users.

    public showAddNewBlockDialog(target?: ViewChild) {
        this.displayBlockSidebar = true;
    }

    public onAddNewBlockPress(componentType: ComponentType) {
        this.onSelectNewBlock.emit(componentType);
        this.displayBlockSidebar = false;
        amplitude.track('blocks:block-add');
    }
}
