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
    console.log(`CommentViewComponent: comment.body=${this.comment.body}`);
  }

  editPressed(): void {
    this.onCommentEdit.emit(this.comment);
  }

  deletePressed(): void {
    this.onCommentDelete.emit(this.comment);
  }
}
