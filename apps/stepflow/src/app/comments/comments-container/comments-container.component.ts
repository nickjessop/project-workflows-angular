import { Component, Input, OnInit } from '@angular/core';
import { BlockConfig, Comment } from '@stepflow/interfaces';
import { CommentsService } from '../../services/comments/comments.service';

@Component({
  selector: 'comments-container',
  templateUrl: './comments-container.component.html',
  styleUrls: ['./comments-container.component.scss']
})
export class CommentsContainerComponent implements OnInit {

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

  ngOnInit(): void {
    console.log(`CommentsContainerComponent: blocks.length=${this.blocks.length}`);
  }

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
      console.log(`getComments returned ${comments.length} comments`);
    }).finally(() => this.isLoading = false );
  }

  async onAdd(comment: Comment): Promise<void> {
    console.log('container onAdd called');
    const result = await this.commentsService.addComment(comment);
    if (result) {
      this.refreshComments();
    } else {
      // Error handle here for a failed add. CommentsService will log to the console so no need to do it here too.
    }
  }

  onUpdate(comment: Comment): void {
    
  }

  onResolve(comment: Comment): void {

  }

  onDelete(comment: Comment): void {

  }
}
