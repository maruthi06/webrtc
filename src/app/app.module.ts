import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ConnectToSocket } from '../services/connect-to-socket';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ConnectToSocket],
  bootstrap: [AppComponent]
})
export class AppModule { }
