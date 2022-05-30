import { Injectable } from '@angular/core';
import { v4 as uuid } from 'uuid'; 

import { Comment } from '@stepflow/interfaces'
import { AuthenticationService } from '../authentication/authentication.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly COMMENTS_COLLECTION = 'comments';

  constructor(
    private firebaseService: FirebaseService,
    private authenticationService: AuthenticationService
  ) { }

  // API Methods

  public async listComments(blockIds: string[]): Promise<Comment[]> {
    console.log(`listComments called with blockIds: ${JSON.stringify(blockIds)}`)
    return this.firebaseService
      .getDbInstance()!
      .collection(this.COMMENTS_COLLECTION)
      .where('blockId', 'in', blockIds)
      .where('deleted', '==', false)
      .get()
      .then(
        querySnapshot => {
          const comments: Comment[] = []
          querySnapshot.forEach(doc => {
            comments.push(doc.data() as Comment)
          })
          console.log(`listComments found ${comments.length} comments.`);
          return comments
        },
        error => {
          console.error(`Error occurred while listing comments for blockIds: ${JSON.stringify(blockIds)}`)
          return []
        }
      )
  }

  public async getComment(id: string): Promise<Comment | null> {
    return this.firebaseService
      .getDbInstance()!
      .collection(this.COMMENTS_COLLECTION)
      .doc(id)
      .get()
      .then(
        doc => {
          if (doc.exists) {
            return doc.data() as Comment
          } else {
            console.error(`Could not get comment with id: ${id}`)
            return null
          }
        },
        error => {
          console.error(`Error occurred while getting comment with id: ${id}`)
          return null
        }
      )
  }

  public async addComment(comment: Comment): Promise<boolean> {
    
    const authorId: string | undefined = this.authenticationService.getCurrentUser()?.uid
    if (!authorId) {
      console.error(`Could not add comment: no current user id available.`);
      return Promise.resolve(false)
    }

    const rightNow: number = Date.now();
    const additionalFields: Partial<Comment> = {
      commentId: uuid(),
      createdAt: rightNow,
      updatedAt: rightNow,
      authorId,
      deleted: false
    }
    const commentToSave: Comment = { ...comment, ...additionalFields } as Comment

    return this.firebaseService
      .getDbInstance()!
      .collection(this.COMMENTS_COLLECTION)
      .add(commentToSave)
      .then(
          documentRef => {
              console.log('addComment returned the documentRef:', documentRef);
              return true;
          },
          error => {
              console.error(`Error occurred while creating a new comment: ${error}`);
              return false;
          }
      );
  }

  private async putComment(comment: Comment): Promise<Comment | null> {
    return this.firebaseService
      .getDbInstance()!
      .collection(this.COMMENTS_COLLECTION)
      .doc(comment.commentId)
      .set(comment)
      .then(
        () => {
          return comment
        },
        error => {
          console.error(`Error occurred while updating comment: ${error}`)
          return null
        }
      )
  }

  // Other public Methods
  
  public async updateCommentBody(comment: Comment, newBody: string): Promise<Comment | null> {
    comment.body = newBody
    comment.updatedAt = Date.now()
    return this.putComment(comment)
  }

  public async setResolvedStatusOfComment(comment: Comment, resolve: boolean): Promise<boolean> {
    comment.resolved = resolve
    comment.updatedAt = Date.now()
    return this.putComment(comment).then(
      () => {
        return true
      },
      error => {
        console.error(`Error occurred while setting resolved status of comment: ${error}`)
        return false
      }
    )
  }

  public async deleteComment(comment: Comment): Promise<boolean> {
    comment.deleted = true
    comment.updatedAt = Date.now()
    return this.putComment(comment).then(
      () => {
        return true
      },
      error => {
        console.error(`Error occurred while deleting comment: ${error}`)
        return false
      }
    )
  }
}
