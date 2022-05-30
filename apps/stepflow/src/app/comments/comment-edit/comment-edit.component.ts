import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Comment } from '@stepflow/interfaces';

@Component({
  selector: 'comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.scss']
})
export class CommentEditComponent implements OnInit {  
  
  @Input()
  comment?: Comment;

  @Output()
  onCommentEdit = new EventEmitter<Comment>();

  @Output()
  onCancel = new EventEmitter<void>();

  formGroup: FormGroup = new FormGroup({
    body: new FormControl(this.comment?.body || '', Validators.required),
  });

  constructor() { }

  ngOnInit(): void {
  }

  onSubmitPressed(): void {
    const newCommentBody = this.formGroup.get('body')?.value || '';

    console.log(`submit pressed with body: ${newCommentBody}`);
    // TODO: Validate and throw an error if the comment body is not valid.
    const newComment: Comment = { body: newCommentBody };
    this.onCommentEdit.emit(newComment);
  }

  // onCancelPressed(): void {
  //   this.onCancel.emit();
  // }

}
