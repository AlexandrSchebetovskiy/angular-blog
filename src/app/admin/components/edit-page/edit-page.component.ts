import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/interfaces";
import {Subscription, switchMap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {
  form: FormGroup
  post: Post
  submitted = false
  subs: Subscription[] = []

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private alert: AlertService ) { }

  ngOnInit(): void {
    const sub =  this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postService.getById(params['id'])
      })
    ).subscribe((post) => {
      this.post = post
      this.form = new FormGroup({
        title: new FormControl(post.title, Validators.required),
        text: new FormControl(post.text, Validators.required),
      })
    })
    this.subs.push(sub)
  }

  submit() {
    if (this.form.invalid) {
      return
    }
    this.submitted = true
    this.postService.update({
      ...this.post,
      date: new Date(),
      title: this.form.value.title,
      text: this.form.value.text
    }).subscribe(() => {
      this.alert.success('Пост отредактирован')
      this.submitted = false
    })
  }

  ngOnDestroy(): void {
    this.subs.map((sub) => {
      if(sub) sub.unsubscribe()
    })
  }
}
