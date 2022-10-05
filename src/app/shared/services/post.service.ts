import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FbCreateResponse, Post} from "../interfaces";
import { Observable} from "rxjs";
import {delay, map, tap} from "rxjs/operators"
import {environment} from "../../../environments/environment";

@Injectable({providedIn: "root"})
export class PostService {

  constructor(private http: HttpClient) {}

  create(post: Post): Observable<Post> {
    return this.http.post(environment.fbDbUrl + '/posts.json', post)
      .pipe(
        map((res: FbCreateResponse) => {
          return {
            ...post,
            id: res.name,
            date: new Date(post.date)
          }
        })
      )
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(environment.fbDbUrl + '/posts.json')
      .pipe(
        map((res: {[key: string]: any}) => {
          if(!res) return []
          return Object.keys(res).map((key) => {
            return {
              ...res[key],
              id: key,
              data: new Date(res[key].date)
            }
          })
        })

      )
  }

  remove(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.fbDbUrl}/posts/${id}.json`)
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        map((post) => {
          if(!post) return null
          return {...post, id, date: new Date(post.date)}
        })
      )
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post)
  }
}
