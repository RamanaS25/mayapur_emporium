import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { register } from 'swiper/element/bundle';
import {
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonBadge,
  IonRange,
  IonTextarea, IonItem, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  bagAddOutline,
  cartOutline,
  addCircleOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { SwiperComponent } from '../swiper/swiper.component';

interface Fabric {
  key: string;
  value: number;
}

interface Customization {
  name: string;
  img_url: string;
  base_price: number;
}

interface BasePrice {
  key: string;
  value: string | number;
}

interface FabricUsage {
  key: string;
  value: number;
}

interface Model {
  id: number;
  created_at: string;
  name: string;
  fabrics: Fabric[];
  customizations: Customization[];
  gender: string;
  base_price: BasePrice[];
  fabric_usage: FabricUsage[];
  model_pictures: {
    pic_1: string;
  };
}

register();
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [IonImg, IonItem, 
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonIcon,
    IonChip,
    IonLabel,
    IonBadge,
    IonRange,
    IonTextarea,
    SwiperComponent,
  ],
})
export class OrderComponent {
  @Input() selectedGender: 'male' | 'female' = 'male';
  @Input() models: Model[] = [];
  @Output() selected_outfit = new EventEmitter<boolean>();
  is_editing = false;
  selectedItem: Model | null = null;
  selectedFabric: Fabric | null = null;
  selectedCustomization: Customization | null = null;
  _selectLength: string = 'small';
  additionalNotes = '';

  constructor() {
    addIcons({
      bagAddOutline,
      arrowBackOutline,
      cartOutline,
      addCircleOutline,
    });
  }

  setSelectedModel(model: Model) {
    this.is_editing = true;
    this.selectedItem = model;
  }

  selectLength(length: string) {
    this._selectLength = length;
  }

  selectFabric(fabric: Fabric) {
    this.selectedFabric = fabric;
  }

  selectNeckline(customization: Customization) {
    this.selectedCustomization = customization;
  }

  calculateFabricCost(): number {
    if (!this.selectedFabric || !this.selectedItem) return 0;
    
    const fabricUsage = this.selectedItem.fabric_usage.find(
      usage => usage.key === this._selectLength
    );
    
    return fabricUsage ? Math.ceil(fabricUsage.value * this.selectedFabric.value) : 0;
  }

  calculateCustomizationCost(): number {
    return this.selectedCustomization?.base_price || 0;
  }

  calculateTotalCost(): number {
    if (!this.selectedItem) return 0;
    
    const basePrice = this.selectedItem.base_price.find(
      price => price.key === this._selectLength
    );
    
    const basePriceValue = basePrice ? Number(basePrice.value) : 0;
    
    return (
      basePriceValue + 
      this.calculateFabricCost() + 
      this.calculateCustomizationCost()
    );
  }

  isCustomizationValid(): boolean {
    return !!(
      this.selectedItem &&
      this.selectedFabric &&
      this.selectedCustomization
    );
  }

  addCustomizedItemToCart() {
    if (!this.isCustomizationValid()) return;

    const customizedItem = {
      ...this.selectedItem!,
      fabric: this.selectedFabric,
      customization: this.selectedCustomization,
      length: this._selectLength,
      notes: this.additionalNotes,
      totalPrice: this.calculateTotalCost(),
    };

    // Add to cart logic here
    console.log('Adding customized item:', customizedItem);
    this.is_editing = false;
  }

  select_outfit() {
    this.selected_outfit.emit(true);
  }

  getBasePrice(): number {
    if (!this.selectedItem) return 0;
    const basePrice = this.selectedItem.base_price.find(
      price => price.key === this._selectLength
    );
    return Number(basePrice?.value) || 0;
  }

  getFabricConsumption(): number {
    if (!this.selectedItem) return 0;
    const usage = this.selectedItem.fabric_usage.find(
      usage => usage.key === this._selectLength
    );
    return usage?.value || 0;
  }

  getFabricUsageForSize(sizeKey: string): number {
    return this.selectedItem?.fabric_usage.find(u => u.key === sizeKey)?.value || 0;
  }
}
