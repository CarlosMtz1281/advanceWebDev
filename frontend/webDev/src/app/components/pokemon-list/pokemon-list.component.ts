import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent {
  private http = inject(HttpClient);
  pokemons: any[] = [];

  constructor() {
    this.fetchPokemons();
  }

  fetchPokemons() {
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=40')
      .subscribe(response => {
        this.pokemons = response.results.map((pokemon: any) => ({
          name: pokemon.name,
          url: pokemon.url,
          image: '', 
          types: []
        }));

        this.pokemons.forEach((pokemon, index) => {
          this.http.get<any>(pokemon.url).subscribe(details => {
            this.pokemons[index].image = details.sprites.front_default; 
            this.pokemons[index].types = details.types.map((t: any) => t.type.name); 
          });
        });
      });
  }
}