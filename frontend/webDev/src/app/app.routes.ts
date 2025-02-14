import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { SignInComponent } from './sign-in/sign-in.component';

export const routes: Routes = [  // Ensure 'export' is added here
  { path: '', component: LandingPageComponent }, // Default route
  { path: 'sign-in', component: SignInComponent },
];