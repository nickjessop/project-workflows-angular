import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Comment } from '@stepflow/interfaces';

@Component({
  selector: 'comment-thread-view',
  templateUrl: './comment-thread.component.html',
  styleUrls: ['./comment-thread.component.scss']
})
export class CommentThreadComponent implements OnInit {

  @Input() blockId!: string;
  @Input() threadHeader!: string;
  @Input() comments!: Comment[];

  @Output() onAdd: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() onUpdate: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() onResolve: EventEmitter<Comment> = new EventEmitter<Comment>();
  @Output() onDelete: EventEmitter<Comment> = new EventEmitter<Comment>();

  constructor() { }

  ngOnInit(): void {
    
  }

  editPressed(commentId: string): void {
    
  }

  editComment(comment: Comment): void {
    if (comment.commentId) {
      // Comment is an existing comment.
      this.onUpdate.emit(comment);
    } else {
      // Comment is a new comment, needs a blockId.
      // If/when moving to multiple threads per block, add threadId here (maybe 
      // instead of a blockId, maybe in tandem with blockId, depends on implementation).
      comment.blockId = this.blockId;
      this.onAdd.emit(comment);
    }
  }

  resolveComment(comment: Comment): void {
    this.onResolve.emit(comment);
  }

  deleteComment(comment: Comment): void {
    this.onDelete.emit(comment);
  }

  cancelEdit(): void {
    console.log("usually, we'd hide the new comment edit form here.")
  }
}
