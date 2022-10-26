import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment, CommentDetail } from '@stepflow/interfaces';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'comment-view',
    templateUrl: './comment-view.component.html',
    styleUrls: ['./comment-view.component.scss'],
})
export class CommentViewComponent implements OnInit {
    @Input() commentDetail!: CommentDetail;

    @Output() onCommentEdit = new EventEmitter<CommentDetail>();
    @Output() onCommentResolve = new EventEmitter<Comment>();
    @Output() onCommentDelete = new EventEmitter<Comment>();

    public postedAtRelative!: string;
    public postedAtFormatted!: string;

    public commentItems: MenuItem[] = [
        {
            label: 'Edit',
            icon: 'pi pi-pencil',
            command: () => {
                this.editPressed();
            },
        },
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
                this.deletePressed();
            },
        },
    ];

    ngOnInit() {
        const currentDate = new Date().getTime();
        if (this.commentDetail.comment.createdAt) {
            const postedDate = this.commentDetail.comment.createdAt;
            this.postedAtRelative = this.relativeTimestamp(currentDate, postedDate);
            this.postedAtFormatted = this.formatDate(new Date(postedDate));
        }
    }

    editPressed(): void {
        if (!this.commentDetail.isEditable) return;
        this.onCommentEdit.emit(this.commentDetail);
    }

    deletePressed(): void {
        if (!this.commentDetail.isDeletable) return;
        this.onCommentDelete.emit(this.commentDetail.comment);
    }

    toggleResolvedPressed(): void {
        this.commentDetail.comment.resolved = !this.commentDetail.comment.resolved;
        this.onCommentResolve.emit(this.commentDetail.comment);
    }
    relativeTimestamp(current: number, previous: number) {
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        const msPerMonth = msPerDay * 30;
        const msPerYear = msPerDay * 365;

        const elapsed = current - previous;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ' seconds ago';
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ' minutes ago';
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ' hours ago';
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ' days ago';
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ' months ago';
        } else {
            return Math.round(elapsed / msPerYear) + ' years ago';
        }
    }
    formatDate(date: Date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = date.getFullYear();
        const time = date.toLocaleTimeString('en-US');

        return mm + '/' + dd + '/' + yyyy + ' at ' + time;
    }
}
