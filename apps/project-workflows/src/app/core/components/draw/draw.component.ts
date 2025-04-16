import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BlockConfig, ComponentMode, Draw, DrawHistory } from '@project-workflows/interfaces';
import { MessageService } from 'primeng/api';
import { ProjectService } from '../../../services/project/project.service';
import { CoreComponentService } from '../../core-component.service';
//TODO: stop drawing if mouse/touch goes off canvas
//TODO: handle resizing block
//TODO: limit stroke history to ~10
//TODO: investigate if we can compress stroke data
@Component({
    selector: 'app-draw',
    templateUrl: './draw.component.html',
    styleUrls: ['./draw.component.scss'],
})
export class DrawComponent implements AfterViewInit {
    @Input() group!: FormGroup;
    @Input() index = 0;
    @Input() field: BlockConfig = this.coreComponentService.createBlockConfig('draw');
    @Input() resizable = true;
    @ViewChild('blockCanvas') blockCanvas!: ElementRef<HTMLCanvasElement>;

    public drawData = this.coreComponentService.createComponentMetadataTemplate('draw') as Draw;
    public componentMode: ComponentMode = 'view';
    public context!: CanvasRenderingContext2D | null;
    public canvas: ElementRef['nativeElement'];
    public lineWidth = 0;
    public isMousedown = false;
    public points: DrawHistory = [];
    public strokeHistory: DrawHistory = [];

    public requestIdleCallback =
        window.requestIdleCallback ||
        function(fn: (...args: any[]) => void) {
            setTimeout(fn, 1);
        };

    constructor(
        public projectService: ProjectService,
        private messageService: MessageService,
        private coreComponentService: CoreComponentService
    ) {}

    ngOnInit() {}

    ngAfterViewInit(): void {
        this.drawData = this.field.metadata as Draw;

        // this.strokeHistory = this.drawData.data.value;
        console.log(this.strokeHistory);
        this.canvas = this.blockCanvas.nativeElement;
        this.context = this.canvas.getContext('2d'); // trying to add ! didn't fix having to add ! below
        if (!(this.context = this.canvas.getContext('2d'))) {
            throw new Error(`2d context not supported or canvas already initialized`);
        }
        this.canvas.width = this.blockCanvas.nativeElement.clientWidth;
        this.canvas.height = this.blockCanvas.nativeElement.clientHeight;
    }

    public setComponentMode($event: ComponentMode) {
        this.componentMode = $event;
    }

    /**
     * This function takes in an array of points and draws them onto the canvas.
     * @param {array} stroke array of points to draw on the canvas
     * @return {void}
     */
    public drawOnCanvas(stroke: string | any[]) {
        if (this.componentMode === 'edit') {
            console.log('drawing');
            this.context!.strokeStyle = 'black';
            this.context!.lineCap = 'round';
            this.context!.lineJoin = 'round';
            const l = stroke.length - 1;
            if (stroke.length >= 3) {
                const xc = (stroke[l].x + stroke[l - 1].x) / 2;
                const yc = (stroke[l].y + stroke[l - 1].y) / 2;
                this.context!.lineWidth = stroke[l - 1].lineWidth;
                this.context!.quadraticCurveTo(stroke[l - 1].x, stroke[l - 1].y, xc, yc);
                this.context!.stroke();
                this.context!.beginPath();
                this.context!.moveTo(xc, yc);
            } else {
                const point = stroke[l];
                this.context!.lineWidth = point.lineWidth;
                this.context!.strokeStyle = point.color;
                this.context!.beginPath();
                this.context!.moveTo(point.x, point.y);
                this.context!.stroke();
            }
        }
    }

    /**
     * Remove the previous stroke from history and repaint the entire canvas based on history
     * @return {void}
     */
    public undoDraw() {
        this.strokeHistory.pop();
        this.context!.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.strokeHistory.map(stroke => {
            if (this.strokeHistory.length === 0) return;
            this.context!.beginPath();
            console.log(stroke);
            let strokePath: DrawHistory[] = [];
            const { x, y, lineWidth } = stroke;

            // strokePath.push({ x, y, lineWidth }); //typescript error
            this.drawOnCanvas(strokePath);
        });
    }

    public start(e: Event) {
        console.log('start', e);
        let pressure = 0.1;
        let x, y;
        if ((e as any).touches && (e as any).touches[0] && typeof (e as any).touches[0]['force'] !== 'undefined') {
            if ((e as any).touches[0]['force'] > 0) {
                pressure = (e as any).touches[0]['force'];
            }
            x = (e as any).touches[0].offsetX;
            y = (e as any).touches[0].offsetY;
        } else {
            pressure = 1.0;
            x = (e as any).offsetX; // removed * 2 from each of these below
            y = (e as any).offsetY;
        }

        this.isMousedown = true;

        const lineWidth = Math.log(pressure + 1) * 40;
        this.context!.lineWidth = lineWidth; // pressure * 50;
        this.points.push({ x, y, lineWidth });
        this.drawOnCanvas(this.points);
    }

    public move(e: Event) {
        // console.log('move', e);
        if (!this.isMousedown) {
            return;
        }
        e.preventDefault();

        let pressure = 0.1;
        let x, y;
        if ((e as any).touches && (e as any).touches[0] && typeof (e as any).touches[0]['force'] !== 'undefined') {
            if ((e as any).touches[0]['force'] > 0) {
                pressure = (e as any).touches[0]['force'];
            }
            x = (e as any).touches[0].offsetX;
            y = (e as any).touches[0].offsetY;
        } else {
            pressure = 1.0;
            x = (e as any).offsetX;
            y = (e as any).offsetY;
        }

        // smoothen line width
        const lineWidth = Math.log(pressure + 1) * 40 * 0.2 + this.lineWidth * 0.8;
        this.points.push({ x, y, lineWidth });

        this.drawOnCanvas(this.points);
    }

    public end(e: Event) {
        console.log('end', e);
        let pressure = 0.1;
        let x, y;

        if ((e as any).touches && (e as any).touches[0] && typeof (e as any).touches[0]['force'] !== 'undefined') {
            if ((e as any).touches[0]['force'] > 0) {
                pressure = (e as any).touches[0]['force'];
            }
            x = (e as any).touches[0].offsetX;
            y = (e as any).touches[0].offsetY;
        } else {
            pressure = 1.0;
            x = (e as any).offsetX;
            y = (e as any).offsetY;
        }

        this.isMousedown = false;

        requestIdleCallback(() => {
            this.strokeHistory.push(...this.points);
            this.points = [];
        });

        this.lineWidth = 0;

        // this.drawData.data.value = this.strokeHistory;
        console.log(this.strokeHistory);
        // this.projectService.syncProject();
    }
}
