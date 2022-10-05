import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/interfaces";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-dashbord-page',
  templateUrl: './dashbord-page.component.html',
  styleUrls: ['./dashbord-page.component.scss']
})
export class DashbordPageComponent implements OnInit, OnDestroy {
  posts: Post[] = []
  subs: Subscription[] = []

  message: string
  searchStr = ''
  isLoading = false

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private alert: AlertService
  ) { }

  ngOnInit(): void {

    this.isLoading = true
    const pSub =  this.postService.getAll().subscribe((res) => {
      this.posts = res
      this.isLoading = false
    })
    this.subs.push(pSub)

  }

  ngOnDestroy(): void {
    this.subs.map((sub) => {
      if (sub) sub.unsubscribe()
    })
  }

  remove($event, id: string) {
    $event.preventDefault()
    const dSub = this.postService.remove(id).subscribe((res) => {
      this.posts = this.posts.filter(p => p.id !== id)
      this.alert.danger('Пост удален!')
    })
    this.subs.push(dSub)
  }

  private removeMessage() {
    setTimeout(() => this.message = null, 4000)
  }
}
