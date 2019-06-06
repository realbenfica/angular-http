import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
    error = new Subject<string>();

    constructor(private http: HttpClient) {}

    createAndStorePost(postData: Post) {
        this.http
            .post<{ name: string }>(
                'https://ng-complete-guide-ead0c.firebaseio.com/posts.json',
                postData,
                {
                    observe: 'response'
                }
            )
            .subscribe(
                test => {
                    console.log(test);
                },
                error => {
                    this.error.next(error.message);
                }
            );
    }

    fetchPosts() {
        return this.http
            .get<{ [key: string]: Post }>(
                'https://ng-complete-guide-ead0c.firebaseio.com/posts.json',
                {
                    headers: new HttpHeaders({'Tralala': 'no way'}),
                    params: new HttpParams().set('print', 'pretty'),
                }
            )

            .pipe(
                map(responseData => {
                    const postsArray: Post[] = [];

                    for (const key in responseData) {
                        if (responseData.hasOwnProperty(key)) {
                            postsArray.push({ ...responseData[key], id: key });
                        }
                    }
                    return postsArray;
                }),
                catchError(errorRes => {
                    return throwError(errorRes);
                })
            );
    }

    deletePosts() {
        return this.http.delete(
            'https://ng-complete-guide-ead0c.firebaseio.com/posts.json',
            {
                observe: 'events',
                responseType: 'json'
            }
        ).pipe(tap(event => {
            console.log(event);
        }));
    }
}
