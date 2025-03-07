import { Component } from '@angular/core';
import { PokemonListComponent } from '../components/pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-dashboard',
  imports: [PokemonListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
