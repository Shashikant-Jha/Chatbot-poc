import { Component, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Http, Headers, RequestOptions, Request, Response } from '@angular/http';
import { ApiAiClient } from 'api-ai-javascript';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { PayLoad } from './app.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  ChatWindow = false;
  text = '';
  showSearchButton: boolean;
  speechData: string;
  accessToken = '1954b9dac7774f008482efce602ea5a1'; // Client Token for the API.ai chatbot
  baseUrl = 'https://api.api.ai/v1/'; // Base url for api access
  output: any;
  PayLoad: PayLoad[];
  PayLoadValue: Array<String> = [];

    constructor(private _http: Http) {
        // this.speechData = '';
    const client = new ApiAiClient({ accessToken: '1954b9dac7774f008482efce602ea5a1' });
    client.textRequest('Hello!')
      .then((response) => { console.log(response); })
      .catch((error) => { console.log(error); });
  }

   @ViewChild('chatArea') d1: ElementRef;

     showChatWindow() {
      if (!this.ChatWindow) {
         (<HTMLDivElement>document.getElementById('chat')).style.opacity = '1';
         this.ChatWindow = true;
      } else {
        this.ChatWindow = false;
       (<HTMLDivElement>document.getElementById('chat')).style.opacity = '0';
      }
    }

      onSubmit(val: any) {
      console.log(val);
      if (val) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      headers.append('Authorization', 'Bearer' + this.accessToken);
      this._http.post(this.baseUrl + 'query?v=20150910',
        JSON.stringify({ query: val, lang: 'en', sessionId: 'somerandomthing' }), { headers: headers }).map(res => res.json())
        .subscribe(
        res => {
          this.setResponse(val, res.result.fulfillment.speech, res);
        },
        err => console.log(err)
        );
      }
    }

        setResponse(val, response, messages) {
          if (messages.result.fulfillment.messages[1]) {
          console.log(messages.result.fulfillment.messages[1]);
          this.PayLoad = messages.result.fulfillment.messages[1].payload;
          console.log(this.PayLoad);
          // for (let pay in messages.result.fulfillment.messages[1].payload) {
          //   console.log(pay);
          // }
          for (let key in messages.result.fulfillment.messages[1].payload) {
            if (key) {
            let item = messages.result.fulfillment.messages[1].payload[key];
            // for (let key2 in item) {
              console.log(item);
              this.PayLoadValue.push(item);
            // }
            }
          }
          console.log(this.PayLoadValue);
           this.d1.nativeElement.insertAdjacentHTML('beforeend', `
      <div class="chat-block">
        <div class="bubble-left">` + val + `</div>
       <div class="bubble-right">` + response + `
       <div class="cards" *ngFor="let payloadValue of PayLoadValue">
       <ul>
            <li>${this.PayLoadValue}</li>
       </ul>
       </div>
       </div>
      </div>`);
          } else {
       this.d1.nativeElement.insertAdjacentHTML('beforeend', `
      <div class="chat-block">
        <div class="bubble-left">` + val + `</div>
       <div class="bubble-right">` + response + `</div>
      </div>`);
          }
      try {
              this.d1.nativeElement.scrollTop = this.d1.nativeElement.scrollHeight;
          } catch (err) { }
      this.text = '';
  }

}
