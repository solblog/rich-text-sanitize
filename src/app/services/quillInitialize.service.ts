import { Injectable } from '@angular/core';
import Quill from 'quill';

/* Delete if not needed */

@Injectable()
export class QuillInitializeService {

  constructor() {
    const Link = Quill.import('formats/link');
    Link.sanitize = (url) => {
      if (url.indexOf('http') <= -1) {
        url = 'https://' + url;
      }
      return url;
    };
  }

}
