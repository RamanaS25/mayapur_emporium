import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModelsService } from 'src/app/services/models/models.service';
import {
  IonContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonCardSubtitle,
  IonChip,
  IonInput,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForward,
  maleOutline,
  femaleOutline,
  personCircleOutline,
} from 'ionicons/icons';
//interfaces
interface Model {
  id: number;
  created_at: Date;
  name: string;
  gender: string;
  fabric: {};
  customizations: [{}];
  fabrics_usage: {};
  base_price: [{}];
  model_pictures: {};
}
@Component({
  selector: 'app-models',
  templateUrl: './models.page.html',
  styleUrls: ['./models.page.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonChip,
    IonCardSubtitle,
    IonIcon,
    IonLabel,
    IonItem,
    IonList,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonButtons,
    IonContent,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonMenuButton,
  ],
})
export class ModelsPage implements OnInit {
  api = inject(ModelsService);
  models: Model[] | null = null;
  selectedModel: any | null = null;

  constructor() {
    addIcons({ femaleOutline, personCircleOutline, arrowForward, maleOutline });
    this._models();
  }

  async _models() {
    let x = await this.api.getModels();
    this.models = x;
    this.selectedModel = x[0];
    console.log(this.models);
  }

  get allModels() {
    return this.models;
  }
  getKeyPairValues(input: any) {
    return Object.entries(input).map(([key, value]) => ({ key, value }));
  }

  ngOnInit() {}
}
