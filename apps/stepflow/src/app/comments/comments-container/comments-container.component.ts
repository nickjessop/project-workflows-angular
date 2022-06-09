import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BlockConfig, Comment, CommentDetail, User } from '@stepflow/interfaces';
import { CommentsService } from '../../services/comments/comments.service';
import { UserService } from '../../services/user/user.service';

enum commentFilters {
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

  filterOptions = commentFilters;
  filterSelect = new FormControl('All')

  isLoading = false;
  comments: Comment[] = [];
  threadedComments: { [blockId: string]: CommentDetail[]} = {};
  users: { [key: string]: User } = {};

  // Logic to determine whether a comment is editable or deletable. Add custom logic here if needed.
  isEditable = (comment: Comment, currentUserId: string): boolean => comment.authorId?.toString() === currentUserId;
  isDeletable = (comment: Comment, currentUserId: string): boolean => comment.authorId?.toString() === currentUserId;

  constructor(
    private commentsService: CommentsService,
    private userService: UserService,
  ) { }

  async refreshComments(): Promise<void> {
    const blockIds = this.blocks.filter(block => !!block.id).map(block => block.id!);
    await this.getComments(blockIds);
    await this.getUsers();
    this.threadComments();
  }

  private async getComments(blockIds: string[]): Promise<void> {
    this.isLoading = true;
    const comments = await this.commentsService.listComments(blockIds).then(comments => {
      this.comments = comments;
    }).finally(() => this.isLoading = false );
  }

  private async getUsers(): Promise<void> {
    const userIds = this.comments.map((comment: Comment) => comment.authorId!);
    if (!userIds || userIds.length == 0) { this.users = {}; return; }
    const users = await this.userService.getUsers(userIds);
    this.users = users;
  }

  threadComments(): void {
    this.threadedComments = {};
    
    const currentFilter = this.filterSelect.value;
    const currentUserId = this.userService.currentUser.uid;
    const constructDisplayName = (user: User) => user.displayName || user.email || 'Unknown';
    for (const comment of this.comments) {
      if (currentFilter === commentFilters.RESOLVED && !comment.resolved) { continue; }
      else if (currentFilter === commentFilters.UNRESOLVED && comment.resolved) { continue; }
      if (!comment.blockId || !comment.authorId) { continue; }
      if (!this.threadedComments[comment.blockId]) {
        this.threadedComments[comment.blockId] = [];
      }

      const author = this.users[comment.authorId];
      const commentDetail: CommentDetail = {
        comment: comment,
        isEditable: this.isEditable(comment, currentUserId),
        isDeletable: this.isDeletable(comment, currentUserId),
        authorDisplayName: author ? constructDisplayName(this.users[comment.authorId]) : 'Unknown',
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
    // this.refreshComments();
  }

  async onDelete(comment: Comment): Promise<void> {
    await this.commentsService.deleteComment(comment);
    this.refreshComments();
  }
}
