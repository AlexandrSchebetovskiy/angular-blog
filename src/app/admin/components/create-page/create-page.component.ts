import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../../shared/interfaces";
import {PostService} from "../../../shared/services/post.service";
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form: FormGroup
  constructor(
    private postService: PostService,
    private router: Router,
    private auth: AuthService,
    private alert: AlertService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null,[Validators.required]),
      text: new FormControl(null,[Validators.required]),
      author: new FormControl(null, [Validators.required]),
    })
  }

  submit() {
    if(this.form.invalid) {
      return
    }
    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date()
    }
    this.postService.create(post).subscribe({
      next: (res) => {
        this.form.reset()
        this.alert.success('Пост успешно создан')
      },
      error: (err) => {
        this.auth.logout()
        this.router.navigate(['/admin', 'login'], {
          queryParams: {
            authFailed: true
          }
        })
      }
    })

  }
}
