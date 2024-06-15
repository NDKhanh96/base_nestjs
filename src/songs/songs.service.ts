import { Injectable, Scope } from '@nestjs/common';
import { Song } from '../types';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class SongsService {
  private readonly songs: Song[] = [];

  create(song: Song) {
    this.songs.push(song);
    return this.songs;
  }

  findAll() {
    return this.songs;
  }
}
