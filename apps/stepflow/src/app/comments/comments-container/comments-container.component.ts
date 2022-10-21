import { Component, Input, OnInit } from '@angular/core';
import { BlockConfig, Comment, CommentDetail, User } from '@stepflow/interfaces';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CommentsService } from '../../services/comments/comments.service';
import { StorageService } from '../../services/storage/storage.service';

export enum commentFilters {
    ALL = 'All',
    RESOLVED = 'Resolved',
    UNRESOLVED = 'Open',
}

@Component({
    selector: 'comments-container',
    templateUrl: './comments-container.component.html',
    styleUrls: ['./comments-container.component.scss'],
})
export class CommentsContainerComponent implements OnInit {
    private _blocks: BlockConfig[] = [];
    @Input() set blocks(blocks: BlockConfig[]) {
        this._blocks = blocks;
        this.commentsService.blockID$.subscribe(value => {
            this.selectedblockId = value;
            if (this.selectedblockId != undefined) {
                this._blocks = blocks.filter(block => block.id === this.selectedblockId);
                if (this._blocks[0]) {
                    this.sidebarTitle = this._blocks[0].label;
                }
            }
        });
        this.refreshComments();
    }
    get blocks(): BlockConfig[] {
        return this._blocks;
    }

    // Declaring this here to be accessible in the template.
    filterStates = commentFilters;
    // filterSelect = new FormControl(commentFilters.ALL);
    filterSelect: string = this.filterStates.UNRESOLVED;

    isLoading = false;
    comments: Comment[] = [];
    threadedComments: { [blockId: string]: CommentDetail[] } = {};
    users: { [key: string]: User } = {};
    public displayCommentSidebar: boolean = false;
    public selectedblockId: BlockConfig['id'];
    public sidebarTitle: string = 'Comments';
    public commentCount: number = 0;

    public filterOptions = [
        // { label: this.filterStates.ALL, value: this.filterStates.ALL },
        { label: this.filterStates.UNRESOLVED, value: this.filterStates.UNRESOLVED },
        { label: this.filterStates.RESOLVED, value: this.filterStates.RESOLVED },
    ];

    // Logic to determine whether a comment is editable or deletable. Add custom logic here if/when needed.
    // Currently, only the author can edit or delete a comment. Anyone can resolve.
    isEditable = (comment: Comment, currentUserId: string | undefined): boolean =>
        !!currentUserId && comment.authorId?.toString() === currentUserId;
    isDeletable = (comment: Comment, currentUserId: string | undefined): boolean =>
        !!currentUserId && comment.authorId?.toString() === currentUserId;

    constructor(
        private commentsService: CommentsService,
        private authenticationService: AuthenticationService,
        private storageService: StorageService
    ) {}

    ngOnInit() {
        this.commentsService.blockID$.subscribe(value => {
            this.selectedblockId = value;
            if (this.selectedblockId != undefined) {
                this.displayCommentSidebar = true;
            }
            this.refreshComments();
        });
    }

    async refreshComments(): Promise<void> {
        this.isLoading = true;
        let blockIds: string[];
        if (this.selectedblockId != undefined) {
            blockIds = [this.selectedblockId];
        } else {
            blockIds = this.blocks.filter(block => !!block.id).map(block => block.id!);
        }
        await this.getComments(blockIds);
        await this.getUsers();
        this.threadComments();
        this.commentCount = this.comments.length;
        this.isLoading = false;
    }

    private async getComments(blockIds: string[]): Promise<void> {
        const comments = await this.commentsService.listComments(blockIds);
        this.comments = comments;
        // check block id first and if there filter comments else fetch all
    }

    private async getUsers(): Promise<void> {
        const userIds = this.comments.map((comment: Comment) => comment.authorId!);
        if (!userIds || userIds.length == 0) {
            this.users = {};
            return;
        }
        const users = await this.authenticationService.getUsers(userIds);
        this.users = users;
    }

    threadComments(): void {
        this.threadedComments = {};
        // Consider the current filter
        const currentFilter = this.filterSelect;
        // Get currently authenticated user to determine if comments are editable/deletable.
        const currentUserId = this.authenticationService.getCurrentUser()?.uid;
        // This method determines a user's display name; change this if you want to use, say, the first name only.
        const constructDisplayName = (user: User) => user.firstName || user.email || 'Unknown';

        const constructAuthorImage = async (user: User) => {
            // if (user.photoFilePath) {
            //     const photoURL =
            //         this.storageService.getDownloadUrl(user.photoFilePath) ||
            //         '/assets/placeholder/placeholder-profile.png';
            //     console.log(photoURL, 'the photo url');
            //     return;
            // }
            if (!user.photoFilePath) return;
            const result = await this.storageService.getDownloadUrl(user.photoFilePath);
            return result;
            // .pipe(
            //     map((downloadUrl: string) => {
            //         return {
            //             downloadUrl: downloadUrl as string,
            //         };
            //     })
            // );
        };

        for (const comment of this.comments) {
            // Omit comments that are not in the current filter
            if (currentFilter === commentFilters.RESOLVED && !comment.resolved) {
                continue;
            } else if (currentFilter === commentFilters.UNRESOLVED && comment.resolved) {
                continue;
            }
            // Omit comments that do not have block ids or author ids; these shouldn't happen, but checking here just in case
            // to dodge any NPEs
            if (!comment.blockId || !comment.authorId) {
                continue;
            }
            if (!this.threadedComments[comment.blockId]) {
                this.threadedComments[comment.blockId] = [];
            }

            // Populate the commentDetail fields.
            const author = this.users[comment.authorId];
            console.log(this.users);
            console.log(author);
            const commentDetail: CommentDetail = {
                comment: comment,
                isEditable: this.isEditable(comment, currentUserId),
                isDeletable: this.isDeletable(comment, currentUserId),
                authorDisplayName: author ? constructDisplayName(author) : 'Unknown',
                authorProfileImage: '/assets/placeholder/placeholder-profile.png',
            };
            // author
            //         ? constructAuthorImage(author)
            //         :
            console.log(author ? constructAuthorImage(author) : '/', 'return profile image test');
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

    public closeSidebar() {
        this.displayCommentSidebar = false;
    }
}
