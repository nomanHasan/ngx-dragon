import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hx-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {


  plugin = "table"

  constructor() { }

  ngOnInit() {
  }
}
