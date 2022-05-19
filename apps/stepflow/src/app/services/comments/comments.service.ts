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

  public async listComments(blockId: string): Promise<Array<Comment>> {
    return this.firebaseService
      .getDbInstance()!
      .collection(this.COMMENTS_COLLECTION)
      .where('blockId', '==', blockId)
      .where('deleted', '==', false)
      .get()
      .then(
        querySnapshot => {
          const comments: Array<Comment> = []
          querySnapshot.forEach(doc => {
            comments.push(doc.data() as Comment)
          })
          return comments
        },
        error => {
          console.error(`Error occurred while listing comments for blockId: ${blockId}`)
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

  public async addComment(comment: Partial<Comment>): Promise<boolean> {
    
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
              // baseProject.id = documentRef.id;
              // documentRef.update({ id: documentRef.id });
              console.log(`addComment returned the documentRef: ${documentRef}`)
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

  public async deleteComment(comment: Comment): Promise<Comment | null> {
    comment.deleted = true
    comment.updatedAt = Date.now()
    return this.putComment(comment)
  }

}
