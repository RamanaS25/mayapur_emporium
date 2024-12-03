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

  constructor() {}

  async addNew() {
    this.addToModel();
    let x = await this.api.updateModel(this.category, this.model);
  }

  addToModel() {
    console.log(this.model);
    let x = this.getKeyPairValues(this.model[this.category]);
    x.push({ key: this.name, value: this.cost });
    this.model[this.category] = this.restoreJsonFormat(x);
    console.log(this.model);
  }

  getKeyPairValues(input: any) {
    return Object.entries(input).map(([key, value]) => ({ key, value }));
  }

  restoreJsonFormat(input: { key: string; value: any }[]) {
    return input.reduce((acc: Record<string, any>, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  ngOnInit() {}
}
