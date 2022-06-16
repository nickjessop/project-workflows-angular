import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsContainerComponent } from './comments-container/comments-container.component';
import { CommentViewComponent } from './comment-view/comment-view.component';
import { CommentEditComponent } from './comment-edit/comment-edit.component';
import { CommentThreadComponent } from './comment-thread/comment-thread.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommentsContainerComponent,
    CommentViewComponent,
    CommentEditComponent,
    CommentThreadComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommentsContainerComponent
  ]
})
export class CommentsModule { }
