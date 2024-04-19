import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { PokemonResponse } from '../models/pokemon-response';
import { PokeAvatarComponent } from '../poke-avatar/poke-avatar.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, map, of } from 'rxjs';
import { Router } from '@angular/router';

const DEFAULT_OFFSET = 0;
const DEFAULT_POKEMONS_PER_PAGE = 100;
const DEFAULT_START_PAGE_NUMBER = 0;
const DEFAULT_POKE_API = "https://pokeapi.co/api/v2/";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, PokeAvatarComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  allPokemons: PokemonResponse[] = []
  visibleFilteredPokemons: PokemonResponse[] = [];
  pokemons: PokemonResponse[] = [];
  pokemonNames: string[] = []
  pageNumber = DEFAULT_START_PAGE_NUMBER;
  selectedName = "";
  selectedImageUrl = "";
  selectedDefaultImageUrl = "";
  searchQ = new FormControl("");
  searchq1 = new BehaviorSubject<FormControl>(this.searchQ);
  _searchQ$ = new BehaviorSubject<string>("");

  constructor(private httpClient: HttpClient, private router: Router) {
    this.searchQ.valueChanges.pipe(debounceTime(350)).subscribe((value) => {
      this._searchQ$.next(value || "");
      const isNumber = new RegExp('^[0-9]+$').test(value || "")
      console.error(isNumber)
      if (isNumber) {
        this.visibleFilteredPokemons = this.allPokemons.filter((pokemon) => pokemon.url.includes(value || ""))
      } else {
        this.visibleFilteredPokemons = this.allPokemons.filter((pokemon) => pokemon.name.toLocaleLowerCase().includes(value?.toLocaleLowerCase() || ""))

      }

    })
    // this._searchQ$.pipe(debounceTime(350), map((value) => value + "hoi")).subscribe((value) => {
    //   console.log(value)

    // });
    this.fetchFromPokemonApi(DEFAULT_OFFSET, DEFAULT_POKEMONS_PER_PAGE);
    this.fetchAllPokemons();
  }

  fetchAllPokemons() {
    const allPokemonsQuery = "pokemon?limit=100000&offset=0";
    this.httpClient.get<any>(`${DEFAULT_POKE_API}${allPokemonsQuery}`).subscribe((values) => {
      this.allPokemons = values.results.map((obj: PokemonResponse) => makePokemonResponseObject(obj.name, obj.url))
      this.visibleFilteredPokemons = this.allPokemons;
    })
  }

  onRowClick(row: PokemonResponse) {
    this.router.navigate(["/details", { url: row.url, name: row.name }])
    // this.selectedName = row.name;
    // this.httpClient.get<any>(row.url).subscribe((values) => {
    //   this.selectedImageUrl = values.sprites["front_shiny"]
    //   this.selectedDefaultImageUrl = values.sprites["front_default"];
    // });
  }

  getRandomBg(index: number) {
    const r = getRandomRgbValue(index);
    const g = getRandomRgbValue(index);
    const b = getRandomRgbValue(index);
    return `rgb(${r}, ${g}, ${b})`;
  }

  decrementPage() {
    if (this.pageNumber === DEFAULT_START_PAGE_NUMBER) {
      console.error(`Ignore value, don't decrement ${this.pageNumber}`)
      return;
    };
    this.pageNumber--;
    this.fetchFromPokemonApi(DEFAULT_OFFSET + (this.pageNumber * DEFAULT_POKEMONS_PER_PAGE), DEFAULT_POKEMONS_PER_PAGE);
  }
  incrementPage() {
    this.pageNumber++;
    this.fetchFromPokemonApi(DEFAULT_OFFSET + (this.pageNumber * DEFAULT_POKEMONS_PER_PAGE), DEFAULT_POKEMONS_PER_PAGE);
  }

  fetchFromPokemonApiNormal() {
    const endpointNoQueryParam = `${DEFAULT_POKE_API}pokemon`;
    this.httpClient.get<any>(endpointNoQueryParam).subscribe((values) => {
      this.pokemons = values.results.map((obj: PokemonResponse) => makePokemonResponseObject(obj.name, obj.url))
    });
  }
  fetchFromPokemonApi(offset: number, limit: number) {
    const endpointWithQueryParam = `${DEFAULT_POKE_API}/pokemon?offset=${offset}&limit=${limit}`;
    this.httpClient.get<any>(endpointWithQueryParam).subscribe((values) => {

      this.pokemons = values.results.map((obj: PokemonResponse) => makePokemonResponseObject(obj.name, obj.url))
    })
  }

}

function makePokemonResponseObject(name: string, url: string): PokemonResponse {
  return { name, url }
}

function getRandomRgbValue(index: number) {
  const generatedValue = Math.floor(Math.random() * DEFAULT_POKEMONS_PER_PAGE) % 255
  return generatedValue < 80 ? generatedValue + 100 : generatedValue;
}