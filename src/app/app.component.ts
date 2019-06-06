import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostsService } from './posts.service';
import { Post } from './post.model';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
    loadedPosts: Post[] = [];
    isFetching: boolean = false;
    error = null;
    private subscription: Subscription;

    constructor(private postsService: PostsService) {}

    ngOnInit() {
        this.subscription = this.postsService.error.subscribe(errorMessage => {
            this.error = errorMessage;
        })

        this.isFetching = true
        this.postsService.fetchPosts().subscribe(posts => {
            this.isFetching = false;
            this.loadedPosts = posts
        }, error => {
            this.isFetching = false;

            this.error = error.message + error.status;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onCreatePost(postData: Post) {
        this.postsService.createAndStorePost(postData);
            return this.loadedPosts.push(postData);
    }

    onFetchPosts() {
        this.isFetching = true
        this.postsService.fetchPosts().subscribe(posts => {
            this.isFetching = false;
            this.loadedPosts = posts
        }, error => {
            this.isFetching = false;
            this.error = error.message;
        });
    }

    onClearPosts() {
        this.postsService.deletePosts()
            .subscribe(() => {
                this.loadedPosts = [];
            });
    }

    onHandleError() {
        this.error = null;
    }
}
