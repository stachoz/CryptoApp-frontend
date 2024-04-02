import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { PriceTrackerComponent } from './price-tracker/price-tracker.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { canActivate } from './_helpers/auth.guard';

const routes: Routes = [
  { path: '', component: PriceTrackerComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component:LoginComponent},
  { path: 'profile', component:ProfileComponent, canActivate: [canActivate]},
 
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
