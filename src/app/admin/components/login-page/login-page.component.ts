import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../shared/interfaces";
import {AuthService} from "../../shared/services/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  submitted = false
  form: FormGroup
  message: string;
  constructor(public auth: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params:Params) => {
      if(params['loginAgain']) {
        this.message = 'Пожалуста авторизируйетсь!'
      } else if(params['authFailed']) {
        this.message = 'Сессия истекла, автроризуйтесь повторно!'
      }

    })
  }

  submit() {
    if(this.form.invalid) {
      return
    }
    this.submitted = true
    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: true
    }

    this.auth.login(user).subscribe({
      next: () => {
        this.form.reset()
        this.router.navigate(['/admin', 'dashboard'])
        this.submitted = false
      },
      error: (error) => {
        this.submitted = false
        this.form.reset()

      }
    })
  }
}
