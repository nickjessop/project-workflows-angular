import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Comment, CommentDetail } from '@stepflow/interfaces';

@Component({
  selector: 'comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit {  
  
  @Input() commentDetail?: CommentDetail;

  @Output() onCommentEdit = new EventEmitter<Comment>();
  @Output() onCancel = new EventEmitter<void>();

  formGroup: FormGroup = new FormGroup({
    body: new FormControl(this.commentDetail?.comment.body || '', Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
    this.formGroup.get('body')?.setValue(this.commentDetail?.comment.body || '');
  }

  onSubmitPressed(): void {
    const newCommentBody = this.formGroup.get('body')?.value || '';

    if (this.commentDetail) {
      this.commentDetail.comment.body = newCommentBody;
      this.onCommentEdit.emit(this.commentDetail.comment);
    } else {
      const newComment: Comment = { body: newCommentBody };
      this.onCommentEdit.emit(newComment);
    }
  }

  onCancelPressed(): void {
    this.onCancel.emit();
  }
}
