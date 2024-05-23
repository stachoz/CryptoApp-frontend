import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PriceTrackerComponent } from './price-tracker/price-tracker.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { JwtIterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { PostPageComponent } from './post-page/post-page.component';
import { PaginationComponent } from './pagination/pagination.component';
import { DynamicCurrencyPrecisionPipe } from './_helpers/dynamic-currency-precision.pipe';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { EditTransactionFormComponent } from './edit-transaction-form/edit-transaction-form.component';
import { AlertsPanelComponent } from './alerts-panel/alerts-panel.component';
import { LayoutComponent } from './layout/layout.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PriceTrackerComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    PostComponent,
    HomeComponent,
    PostPageComponent,
    PaginationComponent,
    DynamicCurrencyPrecisionPipe,
    TransactionHistoryComponent,
    EditTransactionFormComponent,
    AlertsPanelComponent,
    LayoutComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtIterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
