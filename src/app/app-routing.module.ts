import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { canActivate } from './_helpers/auth.guard';
import { HomeComponent } from './home/home.component';
import { PostPageComponent } from './post-page/post-page.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [

  { path: '', component: LayoutComponent, canActivate: [canActivate],children:[
    { path: '', component: HomeComponent  },
    { path: 'profile', component:ProfileComponent},
    { path: 'post/:id', component:PostPageComponent},
    { path: 'history', component:TransactionHistoryComponent},
  ]
  },
  { path: 'register', component: RegisterComponent},
  { path: 'login', component:LoginComponent},
 
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
