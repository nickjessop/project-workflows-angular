import { Component, Input } from '@angular/core';
import { BlockConfig, Comment } from '@stepflow/interfaces';
import { CommentsService } from '../../services/comments/comments.service';

@Component({
  selector: 'comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.scss']
})
export class CommentsContainerComponent {

  private _blocks: BlockConfig[] = [];
  @Input() set blocks(blocks: BlockConfig[]) {
    this._blocks = blocks;
    this.refreshComments();
  };
  get blocks(): BlockConfig[] {
    return this._blocks;
  }

  isLoading = false;
  threadedComments: { [blockId: string]: Comment[]} = {};

  constructor(private commentsService: CommentsService) { }

  refreshComments(): void {
    const blockIds = this.blocks.filter(block => !!block.id).map(block => block.id!);
    this.getComments(blockIds);
  }

  private async getComments(blockIds: string[]): Promise<void> {
    this.isLoading = true;
    const comments = await this.commentsService.listComments(blockIds).then(comments => {
      // Clear the old comments.
      this.threadedComments = {};
      // Add the new comments.
      for (const comment of comments) {
        if (!comment.blockId) { continue; }
        if (!this.threadedComments[comment.blockId]) {
          this.threadedComments[comment.blockId] = [];
        }
        this.threadedComments[comment.blockId].push(comment);
      }
    }).finally(() => this.isLoading = false );
  }

  async onAdd(comment: Comment): Promise<void> {
    const result = await this.commentsService.addComment(comment);
    if (result) {
      this.refreshComments();
    } else {
      // Error handle here for a failed add. CommentsService will log to the console so no need to do it here too.
    }
  }

  async onUpdate(comment: Comment): Promise<void> {
    await this.commentsService.putComment(comment);
    // this.refreshComments();
  }

  async onDelete(comment: Comment): Promise<void> {
    await this.commentsService.deleteComment(comment);
    this.refreshComments();
  }
}
