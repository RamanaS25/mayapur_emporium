import { Component, inject, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModelsService } from 'src/app/services/models/models.service';
import { ChangeModelComponent } from 'src/app/components/change-model/change-model.component';
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
  IonChip,
  IonInput,
  IonNote,
  IonBadge,
  IonModal,
  IonCheckbox,
  IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForward,
  maleOutline,
  femaleOutline,
  personCircleOutline,
  shirtOutline,
  chevronForwardOutline,
  pricetagOutline,
  cutOutline,
  optionsOutline,
  trashOutline,
  close,
  addCircleOutline,
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

interface Fabric {
  id: number;
  created_at: Date;
  name: string;
  img: string;
  price_per_meter: number;
}
@Component({
  selector: 'app-models',
  templateUrl: './models.page.html',
  styleUrls: ['./models.page.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCheckbox,
    IonModal,
    IonBadge,
    IonNote,
    IonInput,
    IonChip,
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
    ChangeModelComponent,
  ],
})
export class ModelsPage implements OnInit {
  api = inject(ModelsService);
  models: Model[] | null = null;
  fabrics: any | null = null;
  selectedModel: any | null = null;
  isModalOpen: boolean = false;
  category: string = '';
  newModel: any;
  constructor() {
    addIcons({
      addCircleOutline,
      close,
      personCircleOutline,
      trashOutline,
      shirtOutline,
      chevronForwardOutline,
      pricetagOutline,
      cutOutline,
      optionsOutline,
      femaleOutline,
      arrowForward,
      maleOutline,
    });
    this._models();
    this._fabrics();
  }

  async _models() {
    let x = await this.api.getModels();
    this.models = x;
    this.selectedModel = x[0];
    this.newModel = this.selectedModel;
    this.ModelTokeyValue();
    console.log(this.selectedModel);
  }
  async _fabrics() {
    let x = await this.api.getFabrics();
    this.fabrics = x;
  }

  get allModels() {
    return this.models;
  }

  get allFabrics() {
    return this.fabrics;
  }

  get filterFabric() {
    let x = this.getKeyPairValues(this.selectedModel?.fabrics);
    x = x.map((item: { key: any; value: any }) => {
      return item.key;
    });
    let filter_fabric = this.allFabrics?.filter(
      (item: any) => !x.includes(item.name)
    );
    return filter_fabric;
  }

  addFabric(name: string, cost: number) {
    let x = this.getKeyPairValues(this.selectedModel.fabrics);
    console.log(x);
    x.push({ key: name, value: cost });
    this.selectedModel.fabrics = this.restoreJsonFormat(x);
    this.addNewFabric('fabrics', this.selectedModel);
    console.log(this.selectedModel);
    console.log(this.selectedModel.fabrics);
  }

  async addNewFabric(category: string, fabric: any) {
    let x = await this.api.updateModel(category, fabric);
  }
  async saveChanges(category: string) {
    let x = this.restoreJsonFormat(this.selectedModel[category]);
    this.newModel[category] = x;
    //let y = await this.api.updateModel(category, this.newModel);
    console.log('aa', this.newModel[category]);
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

  delete(key: string, value: any, category: string) {
    console.log(key);
    let x = this.getKeyPairValues(this.selectedModel[category]).filter(
      (item) => item.key !== key
    );
    this.selectedModel[category] = this.restoreJsonFormat(x);
    this.deleteFromDB(category, this.selectedModel);
  }

  async deleteFromDB(category: string, input: any) {
    let x = await this.api.updateModel(category, input);
  }

  removeItemByName(array: any[], name: string): any[] {
    return array.filter((item) => item.name !== name);
  }

  deleteCustomization(category: string, name: string) {
    this.selectedModel.customizations = this.removeItemByName(
      this.selectedModel.customizations,
      name
    );
    this.deleteFromDB(category, this.selectedModel);
    console.log(this.selectedModel.customizations);
  }

  updateValue(category: string, key: string, value: any) {
    console.log('aaa', this.selectedModel[category]);
  }
  ModelTokeyValue() {
    this.selectedModel.base_price = this.getKeyPairValues(
      this.selectedModel.base_price
    );
    this.selectedModel.fabric_usage = this.getKeyPairValues(
      this.selectedModel.fabric_usage
    );
  }

  ngOnInit() {}
}
