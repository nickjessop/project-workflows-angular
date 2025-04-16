import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';
import { PrimengModule } from '../primeng/primeng.module';
import { CommentEditComponent } from './comment-edit/comment-edit.component';
import { CommentThreadComponent } from './comment-thread/comment-thread.component';
import { CommentViewComponent } from './comment-view/comment-view.component';
import { CommentsContainerComponent } from './comments-container/comments-container.component';

@NgModule({
    declarations: [CommentsContainerComponent, CommentViewComponent, CommentEditComponent, CommentThreadComponent],
    imports: [CommonModule, ReactiveFormsModule, PrimengModule, FormsModule, AutosizeModule],
    exports: [CommentsContainerComponent],
})
export class CommentsModule {}
