import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { Comment, CommentDetail } from '@project-workflows/interfaces';

@Component({
    selector: 'comment-thread-view',
    templateUrl: './comment-thread.component.html',
    styleUrls: ['./comment-thread.component.scss'],
})
export class CommentThreadComponent {
    @Input() blockId!: string;
    @Input() threadHeader!: string;
    @Input() commentDetails!: CommentDetail[];
    @Input() currentUserId: string | null = null;
    @Input() index: number = 0;

    @Output() onAdd: EventEmitter<Comment> = new EventEmitter<Comment>();
    @Output() onUpdate: EventEmitter<Comment> = new EventEmitter<Comment>();
    @Output() onDelete: EventEmitter<Comment> = new EventEmitter<Comment>();

    @ViewChild('thread') thread!: ElementRef;

    public composingNewComment: boolean = false;
    public isSingleThread: boolean = false;
    private _commentBeingEdited: CommentDetail | null = null;

    constructor() {}

    ngOnInit() {
        if (this.index === 0) this.isSingleThread = true;
    }

    set commentBeingEdited(comment: CommentDetail | null) {
        this._commentBeingEdited = comment;
        if (comment != null) this.composingNewComment = false;
    }
    get commentBeingEdited(): CommentDetail | null {
        return this._commentBeingEdited;
    }

    editPressed(commentDetail: CommentDetail): void {
        this.commentBeingEdited = commentDetail;
    }

    updateComment(comment: Comment): void {
        if (comment.commentId) {
            // Comment is an existing comment.
            this.onUpdate.emit(comment);
            this.commentBeingEdited = null;
        } else {
            // Comment is a new comment, needs a blockId.
            // If/when moving to multiple threads per block, add threadId here (maybe
            // instead of a blockId, maybe in tandem with blockId, depends on implementation).
            comment.blockId = this.blockId;
            this.onAdd.emit(comment);
        }
    }

    deleteComment(comment: Comment): void {
        this.onDelete.emit(comment);
    }

    cancelEdit(): void {
        this.commentBeingEdited = null;
        this.composingNewComment = false;
    }

    toggleComposingNewComment(): void {
        this.composingNewComment = !this.composingNewComment;
    }
}
