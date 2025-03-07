import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=10';

  constructor(private http: HttpClient) {}

  getPokemons(): Observable<any[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.results)
    );
  }
}