import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BlockConfig, Comment, CommentDetail, User } from '@stepflow/interfaces';
import { CommentsService } from '../../services/comments/comments.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';

export enum commentFilters {
  ALL = 'All',
  RESOLVED = 'Resolved',
  UNRESOLVED = 'Unresolved',
}

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

  // Declaring this here to be accessible in the template.
  filterOptions = commentFilters;
  filterSelect = new FormControl(commentFilters.ALL);

  isLoading = false;
  comments: Comment[] = [];
  threadedComments: { [blockId: string]: CommentDetail[]} = {};
  users: { [key: string]: User } = {};

  // Logic to determine whether a comment is editable or deletable. Add custom logic here if/when needed.
  // Currently, only the author can edit or delete a comment. Anyone can resolve.
  isEditable = (comment: Comment, currentUserId: string | undefined): boolean => !!currentUserId && comment.authorId?.toString() === currentUserId;
  isDeletable = (comment: Comment, currentUserId: string | undefined): boolean => !!currentUserId && comment.authorId?.toString() === currentUserId;

  constructor(
    private commentsService: CommentsService,
    private authenticationService: AuthenticationService,
  ) { }

  async refreshComments(): Promise<void> {
    this.isLoading = true;
    const blockIds = this.blocks.filter(block => !!block.id).map(block => block.id!);
    await this.getComments(blockIds);
    await this.getUsers();
    this.threadComments();
    this.isLoading = false;

    const blockCounts = await this.commentsService.getNumberOfCommentsForBlocks(blockIds);
    console.log(`Block counts: ${JSON.stringify(blockCounts)}`);
  }

  private async getComments(blockIds: string[]): Promise<void> {
    const comments = await this.commentsService.listComments(blockIds);
    this.comments = comments;
  }

  private async getUsers(): Promise<void> {
    const userIds = this.comments.map((comment: Comment) => comment.authorId!);
    if (!userIds || userIds.length == 0) { this.users = {}; return; }
    const users = await this.authenticationService.getUsers(userIds);
    this.users = users;
  }

  threadComments(): void {
    this.threadedComments = {};
    
    // Consider the current filter
    const currentFilter = this.filterSelect.value;
    // Get currently authenticated user to determine if comments are editable/deletable.
    const currentUserId = this.authenticationService.getCurrentUser()?.uid;
    // This method determines a user's display name; change this if you want to use, say, the first name only.
    const constructDisplayName = (user: User) => user.displayName || user.email || 'Unknown';

    for (const comment of this.comments) {
      // Omit comments that are not in the current filter
      if (currentFilter === commentFilters.RESOLVED && !comment.resolved) { continue; }
      else if (currentFilter === commentFilters.UNRESOLVED && comment.resolved) { continue; }
      // Omit comments that do not have block ids or author ids; these shouldn't happen, but checking here just in case
      // to dodge any NPEs
      if (!comment.blockId || !comment.authorId) { continue; }
      if (!this.threadedComments[comment.blockId]) {
        this.threadedComments[comment.blockId] = [];
      }

      // Populate the commentDetail fields.
      const author = this.users[comment.authorId];
      const commentDetail: CommentDetail = {
        comment: comment,
        isEditable: this.isEditable(comment, currentUserId),
        isDeletable: this.isDeletable(comment, currentUserId),
        authorDisplayName: author ? constructDisplayName(author) : 'Unknown',
      };

      this.threadedComments[comment.blockId].push(commentDetail);
    }
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
  }

  async onDelete(comment: Comment): Promise<void> {
    await this.commentsService.deleteComment(comment);
    this.refreshComments();
  }
}
