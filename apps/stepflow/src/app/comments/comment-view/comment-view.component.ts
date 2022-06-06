import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '@stepflow/interfaces';
import { CommentsService } from '../../services/comments/comments.service';

@Component({
  selector: 'comment-view',
  templateUrl: './comment-view.component.html',
  styleUrls: ['./comment-view.component.scss']
})
export class CommentViewComponent implements OnInit {

  @Input() comment!: Comment;

  @Output() onCommentEdit = new EventEmitter<Comment>();
  @Output() onCommentResolve = new EventEmitter<Comment>();
  @Output() onCommentDelete = new EventEmitter<Comment>();

  constructor() {}

  ngOnInit(): void {

  }

  editPressed(): void {
    this.onCommentEdit.emit(this.comment);
  }

  deletePressed(): void {
    this.onCommentDelete.emit(this.comment);
  }

  toggleResolvedPressed(): void {
    this.comment.resolved = !this.comment.resolved;
    this.onCommentResolve.emit(this.comment);
  }
}
