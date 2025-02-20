import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'home', component: LandingPageComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
];