import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './auth.guard'; 

export const routes: Routes = [
  { path: '', component: SignInComponent }, 
  { path: 'home', component: LandingPageComponent, canActivate: [AuthGuard] }, 
];