import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokeAvatarComponent } from './poke-avatar/poke-avatar.component';

export const routes: Routes = [
    { component: HomeComponent, path: 'home' }, { component: PokeAvatarComponent, path: 'details' }];
