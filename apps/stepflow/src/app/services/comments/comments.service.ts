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

  // public getComment(id: string): Promise<Comment> {

  // }

  // public listComments(blockId: string): Promise<Array<Comment>> {

  // }

  public addComment(comment: Partial<Comment>): Promise<boolean> {
    
    const authorId: string | undefined = this.authenticationService.getCurrentUser()?.uid
    if (!authorId) {
      console.error(`Could not add comment: no current user id available.`);
      return Promise.resolve(false)
    }

    const rightNow: number = this.timeStampForRightNow();
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

  // private putComment(comment: Comment): Promise<Comment> {

  // }

  // Other public Methods
  
  // public updateCommentBody(comment: Comment, newBody: string): Promise<Comment> {

  // }

  // public deleteComment(comment: Comment): Promise<Comment> {

  // }

  // Helpers

  private timeStampForRightNow(): number {
    return Date.now()
  }

}
