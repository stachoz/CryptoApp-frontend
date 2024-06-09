import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { PostPageComponent } from './post-page/post-page.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { HomeComponent } from './home/home.component';
import { canActivate, canActivateForAdmin } from './_helpers/auth.guard';
import { AdminPageComponent } from './admin-page/admin-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [canActivate]},
  { path: 'admin', component:AdminPageComponent, canActivate: [canActivateForAdmin]},
  { path: 'profile', component:ProfileComponent, canActivate: [canActivate]},
  { path: 'post/:id', component:PostPageComponent, canActivate: [canActivate]},
  { path: 'history', component:TransactionHistoryComponent, canActivate:[canActivate]},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component:LoginComponent},
 
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
