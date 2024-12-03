import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonInput,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
} from '@ionic/angular/standalone';
import { ModelsService } from 'src/app/services/models/models.service';
interface Customization {
  name: string;
  img_url: string;
  base_price: number;
}
@Component({
  selector: 'app-change-model',
  templateUrl: './change-model.component.html',
  styleUrls: ['./change-model.component.scss'],
  imports: [
    IonButton,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonInput,
    CommonModule,
    FormsModule,
  ],
  standalone: true,
})
export class ChangeModelComponent implements OnInit {
  api = inject(ModelsService);
  @Input() category: any;
  @Input() model: any;

  name: string = '';
  cost: number = 0;

  newCustomization: Customization = {
    name: '',
    img_url: 'link',
    base_price: 0,
  };

  constructor() {}

  async addNew() {
    if (this.category === 'customizations') {
      this.test();
    } else {
      this.addToModel();
    }
    let x = await this.api.updateModel(this.category, this.model);
  }

  addToModel() {
    console.log(this.model);
    let x = this.getKeyPairValues(this.model[this.category]);
    x.push({ key: this.name, value: this.cost });
    this.model[this.category] = this.restoreJsonFormat(x);
    console.log(this.model);
  }

  test() {
    let x = this.addItems(this.model.customizations, this.newCustomization);
    this.model.customizations = x;
    console.log(x);
  }
  addItems<T>(array: T[], newItems: T | T[]): T[] {
    if (Array.isArray(newItems)) {
      return [...array, ...newItems]; // Добавление массива элементов
    } else {
      return [...array, newItems]; // Добавление одного элемента
    }
  }

  getKeyPairValues(input: any) {
    return Object.entries(input).map(([key, value]) => ({ key, value }));
  }

  convertToKeyValue(data: any[], keyField: string) {
    return data.reduce((acc, item) => {
      const { [keyField]: key, ...rest } = item;
      acc[key] = rest;
      return acc;
    }, {});
  }

  restoreJsonFormat(input: { key: string; value: any }[]) {
    return input.reduce((acc: Record<string, any>, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  ngOnInit() {}
}
