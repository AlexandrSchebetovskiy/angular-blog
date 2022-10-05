import {NgModule, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import {registerLocaleData} from "@angular/common";
import ruLocale from '@angular/common/locales/ru'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { PostComponent } from './shared/components/post/post.component';
import {SharedModule} from "./shared/shared.module";
import {AuthInterceptor} from "./shared/auth.interceptor";
import {AuthService} from "./admin/shared/services/auth.service";
import {QuillModule} from "ngx-quill";

registerLocaleData(ruLocale, 'ru')
const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}
@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    PostPageComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    QuillModule
  ],
  providers: [
    INTERCEPTOR_PROVIDER,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
