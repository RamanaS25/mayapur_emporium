import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { IonModal, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonModal, IonInput],
})
export class SwiperComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    console.log('swiper');
  }
}
