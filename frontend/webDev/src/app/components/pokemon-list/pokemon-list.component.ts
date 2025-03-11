import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], 
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent {
  private http = inject(HttpClient);
  pokemons: any[] = [];
  filteredPokemons: any[] = [];
  displayedPokemons: any[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  pageSize: number = 5;

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

        Promise.all(
          this.pokemons.map(pokemon => this.http.get<any>(pokemon.url).toPromise())
        ).then(detailsArray => {
          this.pokemons.forEach((pokemon, index) => {
            pokemon.image = detailsArray[index].sprites.front_default;
            pokemon.types = detailsArray[index].types.map((t: any) => t.type.name);
          });

          this.applyFilters();
        });
      });
  }

  applyFilters() {
    this.filteredPokemons = this.pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.currentPage = 1;
    this.updateDisplayedPokemons();
  }

  updateDisplayedPokemons() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayedPokemons = this.filteredPokemons.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage * this.pageSize < this.filteredPokemons.length) {
      this.currentPage++;
      this.updateDisplayedPokemons();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedPokemons();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPokemons.length / this.pageSize);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateDisplayedPokemons();
  }
}