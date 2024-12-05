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
  IonButton, IonToast, IonListHeader, IonImg, IonAvatar } from '@ionic/angular/standalone';
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
  imports: [IonAvatar, IonImg, IonListHeader, IonToast, 
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

  toast = {
    isOpen: false,
    message: '',
    color: 'success',
    duration: 3000,
  };
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

  showToast(message: string, color: string) {
    this.toast.isOpen = true;
    this.toast.message = message;
    this.toast.color = color;
  }

  async _models() {
    let x = await this.api.getModels();
    this.models = x;
    console.log('models', this.models);
    this.selectedModel = x[0];
    this.newModel = this.selectedModel;
    // console.log(this.selectedModel);
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
   let fabrics = this.selectedModel?.fabrics;
    let x = fabrics?.map((item: { key: any; value: any }) => {
      return item.key;
    });
    let filter_fabric = this.allFabrics?.filter(
      (item: any) => !x.includes(item.name)
    );
    return filter_fabric;
  }

 async addFabric(name: string, cost: number) {
    let fabrics = this.selectedModel.fabrics;
    fabrics.push({ key: name, value: cost });
  
   let x = this.restoreJsonFormat(fabrics);

    let updateModal = { ...this.selectedModel, fabrics: x };

    let res = await this.api.updateModel('fabrics', updateModal);
    if (res.success) {
      this.isModalOpen = false;
      this.showToast('Fabric added successfully', 'success');
    } else {
      this.showToast('Error adding fabric', 'danger');
    }

  } 

  itemAdded(x: any) {
    if (x.success) {
      this.isModalOpen = false;
      this.showToast('Fabric added successfully', 'success');
    } else {
      this.showToast('Error adding fabric', 'danger');
    }
  }


  async saveChanges(category: string) {
    
    let x = this.restoreJsonFormat(this.selectedModel[category]);
    let updateModal = { ...this.selectedModel, [category]: x };

    let y = await this.api.updateModel(category, updateModal);
    if(y.success){
      this.showToast('Changes saved successfully', 'success');
    }else{
      this.showToast('Error saving changes', 'danger');
    }
    console.log('aa', this.selectedModel[category]);
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

  formatDisplayName(input: string): string {
    // Replace underscores with spaces and capitalize each word
    return input
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  async delete(key: string, value: any, category: string) {
    console.log(key);
    let x = this.selectedModel[category].filter(
      (item: { key: string; value: any }) => item.key !== key
    );

    let y = this.restoreJsonFormat(x);

    let updateModal = { ...this.selectedModel, [category]: y };


    let res = await this.deleteFromDB(category, updateModal);
    if (res) {
      this.selectedModel[category] = x
      this.showToast('Item deleted successfully', 'success');
    } else {
      this.showToast('Error deleting item', 'danger');
    }

  }

  async deleteFromDB(category: string, input: any): Promise<boolean> {
    let x = await this.api.updateModel(category, input);

    if (x.success) {
     
      return true;
    } else {
      return false;
    }
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


  ngOnInit() {}
}
