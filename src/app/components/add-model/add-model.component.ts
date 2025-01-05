import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButtons,
  IonIcon,
  IonButton,
  IonBadge,
  IonCardHeader,
  IonCard,
  IonNote,
  IonCardContent,
  IonInput,
  IonToolbar,
  IonChip,
  IonContent,
  IonList,
  IonItem,
  IonImg,
  IonAvatar,
  IonLabel,
  IonCheckbox,
} from '@ionic/angular/standalone';
import { ModelsService } from 'src/app/services/models/models.service';

@Component({
  selector: 'app-add-model',
  templateUrl: './add-model.component.html',
  styleUrls: ['./add-model.component.scss'],
  standalone: true,
  imports: [
    IonCheckbox,
    IonLabel,
    IonAvatar,
    IonImg,
    IonItem,
    IonList,
    IonContent,
    IonChip,
    IonToolbar,
    IonIcon,
    IonButton,
    IonBadge,
    IonCardHeader,
    IonCard,
    IonNote,
    IonCardContent,
    IonInput,
    IonButtons,
    CommonModule,
    FormsModule,
  ],
})
export class AddModelComponent implements OnInit {
  api = inject(ModelsService);
  fabrics: any | null = null;
  model: any = {
    name: '',
    gender: '',
    base_price: [{ key: '', value: 0 }],
    fabric_usage: [{ key: '', value: 0 }],
    fabrics: [],
    customizations: [{ name: '', base_price: 0, img_url: '' }],
  };
  constructor() {
    this._fabrics();
  }
  addNew() {
    console.log(this.model);
  }
  async _fabrics() {
    let x = await this.api.getFabrics();
    this.fabrics = x;
  }

  addFabric(name: string, cost: number) {
    let fabrics = this.model.fabrics;
    fabrics.push({ key: name, value: cost });

    let x = this.restoreJsonFormat(fabrics);

    let updateModal = { ...this.model, fabrics: x };
    console.log(updateModal);
    //let res = await this.api.updateModel('fabrics', updateModal);
  }

  restoreJsonFormat(input: { key: string; value: any }[]) {
    return input.reduce((acc: Record<string, any>, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});
  }

  ngOnInit() {}
}
