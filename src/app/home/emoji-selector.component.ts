import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-emoji-selector',
  templateUrl: './emoji-selector.component.html',
  styleUrls: ['./emoji-selector.component.scss']
})
export class EmojiSelectorComponent implements OnInit {

  entries: string;
  selectedEntry: string;
  constructor() {}

  ngOnInit() {
  }
  onSelectionChange(entry: string) {
    this.selectedEntry = Object.assign({}, this.selectedEntry, entry);
  }

}
