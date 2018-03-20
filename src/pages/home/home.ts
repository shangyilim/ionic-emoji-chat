import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NavController,Content } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild('content') content: Content;
  text: string;

  items: Observable<any[]>;
  constructor(public navCtrl: NavController, private afDb: AngularFireDatabase) {

    this.items = this.afDb.list('chat').valueChanges()
      .map((d: Array<any>) => {
        return d.map(i => { i.showOriginal = i.emoji === i.text; return i });
      });

      this.items.subscribe(()=>{
         this.content.scrollToBottom();
      });
  }


  ngOnInit() {
    this.content.scrollToBottom();
  }


  sendMessage(text) {
    const value = {
      date: (new Date()).getTime(),
      text: text,
      emoji: '',
      showOriginal: true
    };

    this.afDb.database.ref('chat').push(value).then(v => this.text = '');
  }


}
