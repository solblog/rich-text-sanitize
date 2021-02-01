import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import {QuillInitializeService} from './services/quillInitialize.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    QuillModule.forRoot()
  ],
  providers: [QuillInitializeService],
  bootstrap: [AppComponent]
})
export class AppModule { }



