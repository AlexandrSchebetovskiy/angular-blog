import { Component, OnInit } from '@angular/core';
import {PostService} from "../../shared/services/post.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable, Subscription, switchMap} from "rxjs";
import {Post} from "../../shared/interfaces";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {
  private pSub: Subscription;
  post$: Observable<Post>
  constructor(private postService: PostService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      })
    )
  }

}
