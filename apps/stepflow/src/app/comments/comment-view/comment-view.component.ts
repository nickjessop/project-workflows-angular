import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment, CommentDetail } from '@stepflow/interfaces';

@Component({
  selector: 'comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.scss']
})
export class CommentViewComponent {

  @Input() commentDetail!: CommentDetail;

  @Output() onCommentEdit = new EventEmitter<CommentDetail>();
  @Output() onCommentResolve = new EventEmitter<Comment>();
  @Output() onCommentDelete = new EventEmitter<Comment>();

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
}
