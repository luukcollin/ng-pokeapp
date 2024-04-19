import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-poke-avatar',
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  templateUrl: './poke-avatar.component.html',
  styleUrl: './poke-avatar.component.scss'
})
export class PokeAvatarComponent {
  name: string = "";
  imageUrl: string = "";
  imageUrlDefault: string = "";
  currentId = 0;

  constructor(private activatedRoute: ActivatedRoute, private httpClient: HttpClient) {
    const url = activatedRoute.snapshot.params["url"];
    const name = activatedRoute.snapshot.params["name"];
    this.name = name;
    if (url) {
      httpClient.get<any>(url).subscribe(values => {
        this.imageUrl = values.sprites["front_shiny"]
        this.imageUrlDefault = values.sprites["front_default"];
      });

    }

  }
}
