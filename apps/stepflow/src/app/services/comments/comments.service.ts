import { Injectable } from '@angular/core';
import { Comment, CommentCounts } from '@stepflow/interfaces';
import { v4 as uuid } from 'uuid';
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    private readonly COMMENTS_COLLECTION = 'comments';

    constructor(private firebaseService: FirebaseService, private authenticationService: AuthenticationService) {}

    // API Methods

    public async listComments(blockIds: string[]): Promise<Comment[]> {
        return this.firebaseService.db
            .collection(this.COMMENTS_COLLECTION)
            .where('blockId', 'in', blockIds)
            .where('deleted', '==', false)
            .get()
            .then(
                querySnapshot => {
                    const comments: Comment[] = [];
                    querySnapshot.forEach(doc => {
                        comments.push(doc.data() as Comment);
                    });
                    return comments;
                },
                error => {
                    console.error(`Error occurred while listing comments for blockIds: ${JSON.stringify(blockIds)}`);
                    return [];
                }
            );
    }

    public async getComment(id: string): Promise<Comment | null> {
        return this.firebaseService.db
            .collection(this.COMMENTS_COLLECTION)
            .doc(id)
            .get()
            .then(
                doc => {
                    if (doc.exists) {
                        return doc.data() as Comment;
                    } else {
                        console.error(`Could not get comment with id: ${id}`);
                        return null;
                    }
                },
                error => {
                    console.error(`Error occurred while getting comment with id: ${id}`);
                    return null;
                }
            );
    }

    public async addComment(comment: Comment): Promise<boolean> {
        // Get the author id
        const authorId: string | undefined = this.authenticationService.getCurrentUser()?.uid;
        if (!authorId) {
            console.error(`Could not add comment: no current user id available.`);
            return Promise.resolve(false);
        }

        // Set auto-generated fields
        const rightNow: number = Date.now();
        const commentId = uuid();
        const additionalFields: Partial<Comment> = {
            commentId,
            createdAt: rightNow,
            updatedAt: rightNow,
            authorId,
            deleted: false,
            resolved: false,
        };
        const commentToSave: Comment = {
            ...comment,
            ...additionalFields,
        } as Comment;

        return this.firebaseService.db
            .collection(this.COMMENTS_COLLECTION)
            .doc(commentId)
            .set(commentToSave)
            .then(
                documentRef => {
                    return true;
                },
                error => {
                    console.error(`Error occurred while creating a new comment: ${error}`);
                    return false;
                }
            );
    }

    public async putComment(comment: Comment): Promise<Comment | null> {
        comment.updatedAt = Date.now();
        return this.firebaseService.db
            .collection(this.COMMENTS_COLLECTION)
            .doc(comment.commentId)
            .set(comment)
            .then(
                () => {
                    return comment;
                },
                error => {
                    console.error(`Error occurred while updating comment: ${error}`);
                    return null;
                }
            );
    }

    public async deleteComment(comment: Comment): Promise<boolean> {
        comment.deleted = true;
        comment.updatedAt = Date.now();
        return this.putComment(comment).then(
            () => {
                return true;
            },
            error => {
                console.error(`Error occurred while deleting comment: ${error}`);
                return false;
            }
        );
    }

    public async getNumberOfCommentsForBlocks(blockIds: string[]): Promise<{ [key: string]: CommentCounts }> {
        return this.firebaseService.db
            .collection(this.COMMENTS_COLLECTION)
            .where('blockId', 'in', blockIds)
            .where('deleted', '==', false)
            .get()
            .then(querySnapshot => {
                let result: { [key: string]: CommentCounts } = {};
                querySnapshot.forEach(doc => {
                    // Grab the comment
                    const comment = doc.data() as Comment;
                    // Ensure there's a blockId
                    if (!comment.blockId) {
                        console.error(`Comment with id ${comment.commentId} has no blockId.`);
                        return;
                    }
                    // Ensure there's a commentCounts object for the blockId in the results
                    if (!result[comment.blockId]) {
                        const emptyCounts = {
                            all: 0,
                            resolved: 0,
                            unresolved: 0,
                        };
                        result[comment.blockId] = emptyCounts;
                    }

                    // Increment the counts
                    result[comment.blockId].all++;
                    if (comment.resolved) {
                        result[comment.blockId].resolved++;
                    } else {
                        result[comment.blockId].unresolved++;
                    }
                });
                return result;
            });
    }
}
