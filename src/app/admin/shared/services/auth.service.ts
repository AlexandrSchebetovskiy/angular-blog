import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {catchError, Observable, Subject, throwError} from "rxjs";
import {tap,delay} from "rxjs/operators"
import {environment} from "../../../../environments/environment";

@Injectable()
export class AuthService{


  error$: Subject<string> = new Subject<string>()
  get token():string {
    const expDate = new Date(localStorage.getItem('expDate'))
    if(new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fbtoken')
  }
  constructor(private http: HttpClient) {}

  login(user: User): Observable<any> {
    return this.http.post(environment.authUrl + environment.apiKey, user)
      .pipe(
        delay(500),
        tap(this.setToken),
        catchError(this.handleError.bind(this))

      )
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated():boolean {
    return !!this.token
  }

  private setToken(response: FbAuthResponse| null) {
    if(response) {
      const expDate = new Date(new Date().getTime() + +(response.expiresIn) * 1000)
      localStorage.setItem('fbtoken', response.idToken)
      localStorage.setItem('expDate', expDate.toString())
    } else {
      localStorage.clear()
    }


  }

  private handleError(error: HttpErrorResponse) {
   const {message} = error.error.error
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Пользователя с таким Email не существует')
        break
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль')
        break
      case 'INVALID_EMAIL':
        this.error$.next('Неверный email')
        break
    }

    return throwError(message)
  }
}
