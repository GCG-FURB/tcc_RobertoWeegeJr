import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'list-popover',
  templateUrl: 'list-popover.html'
})
export class ListPopoverComponent {

    private title: string;
    private list: number[];
    private callback: Function;
    private iconFunction: Function;
    private nameFunction: Function;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
    }

    ionViewDidLoad() {
        this.title = this.navParams.get("title");
        this.list = this.navParams.get("list");
        this.callback = this.navParams.get("callback");
        this.iconFunction = this.navParams.get("iconFunction");
        this.nameFunction = this.navParams.get("nameFunction");
    }

    public goBack(value: number){
        this.callback(value);
        this.navCtrl.pop();
    }

}
