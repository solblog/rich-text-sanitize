import { Component } from '@angular/core';
import {QuillInitializeService} from './services/quillInitialize.service';
// import sanitizeHtml from 'sanitize-html'; https://github.com/postcss/postcss/issues/1509
// import { HtmlSanitizer } from './services/sanitize';
import DOMPurify from 'dompurify';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  htmlText = '<p>Testing</p>';
  hasFocus = false;
  content = 'Empty';
  contentSanetize = 'Empty';

  atValues = [
    { id: 1, value: 'Fredrik Sundqvist', link: 'https://google.com' },
    { id: 2, value: 'Patrik Sjölin' }
  ];
  hashValues = [
    { id: 3, value: 'Fredrik Sundqvist 2' },
    { id: 4, value: 'Patrik Sjölin 2' }
  ];

  // formatWhitelist = ['italic', 'underline'];

  quillConfig = {
     toolbar: {
       container: [
         ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
         ['code-block'],
         [{ header: 1 }, { header: 2 }],               // custom button values
         [{ list: 'ordered'}, { list: 'bullet' }],
         [{ script: 'sub'}, { script: 'super' }],      // superscript/subscript
         [{ indent: '-1'}, { indent: '+1' }],          // outdent/indent
         [{ direction: 'rtl' }],                         // text direction
         [{ size: ['small', false, 'large', 'huge'] }],  // custom dropdown
         [{ header: [1, 2, 3, 4, 5, 6, false] }],
         [{ font: [] }],
         [{ align: [] }],
         ['clean'],                                         // remove formatting button
         ['link', 'image']
       ],
    //   handlers: {'emoji': function() {}}
     },
    // formats: ['italic', 'underline'],
    /*
    keyboard: {
      bindings: {
        // shiftEnter: {
        //   key: 13,
        //   shiftKey: true,
        //   handler: (range, context) => {
        //     // Handle shift+enter
        //     console.log("shift+enter")
        //   }
        // },
        enter: {
          key: 13,
          handler: (range, context) => {
            console.log('enter');
            return true;
          }
        }
      }
    }
    */


  };

  // "p", "strong", "br", "em", "u", "ol", "li", "ul"

  // allow only <b> and <q> with style attributes
  // var clean = DOMPurify.sanitize(dirty, {ALLOWED_TAGS: ['b', 'q'], ALLOWED_ATTR: ['style']});


  ALLOWED = { ALLOWED_TAGS : ['p', 'strong', 'br', 'em', 'u', 'ol', 'li', 'ul'], ALLOWED_ATTR: ['style'] };

  constructor(
    private quillInitializeService: QuillInitializeService
  ) {

  }

  test = (event) => {
    // console.log(event.keyCode);
  }

  onSelectionChanged = (event) => {
    console.log('onSelectionChanged');
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      this.onBlur();
    }
  }

  onContentChanged = (event) => {

    this.content = event.html;
    this.contentSanetize = DOMPurify.sanitize(this.content, this.ALLOWED);
    this.htmlText = this.contentSanetize;

  }

  onFocus = () => {
    // this.contentSanetize = DOMPurify.sanitize(this.content, this.ALLOWED );
  }
  onBlur = () => {
    // this.htmlText = this.contentSanetize;
  }

  onEditorCreated($event) {
    console.log('On Editor created');
  }

  sanitize() {
    console.log('Doing sanetization');
  }


}
