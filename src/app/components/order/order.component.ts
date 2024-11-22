import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonRange
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bagAddOutline, cartOutline, addCircleOutline, arrowBackOutline } from 'ionicons/icons';

interface ClothingItem {
  id: number;
  name: string;
  description: string;
  price: number;
  availableSizes: string[];
  imageUrl?: string;
}

interface Fabric {
  id: number;
  name: string;
  imageUrl: string;
  pricePerMeter: number;
  color: string;
}

interface StyleOption {
  id: number;
  name: string;
  imageUrl: string;
  priceModifier: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  standalone: true,
  imports: [
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
  ]
})
export class OrderComponent {
  @Input() selectedGender: 'male' | 'female' = 'male';
  @Output() selected_outfit = new EventEmitter<boolean>();
  is_editing = false;
  selectedItem: ClothingItem | null = null;
  selectedFabric: Fabric | null = null;
  selectedNeckline: StyleOption | null = null;
  selectedSleeve: StyleOption | null = null;
  selectedLength = 40; // Default length
  additionalNotes = '';

  clothingItems = {
    male: [
      {
        id: 1,
        name: 'Kurta',
        description: 'Traditional long tunic',
        price: 2500,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/kurta.jpg'
      },
      {
        id: 2,
        name: 'Dhoti',
        description: 'Traditional lower garment',
        price: 1500,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/dhoti.jpg'
      },
      {
        id: 3,
        name: 'Sherwani',
        description: 'Formal ethnic coat',
        price: 5000,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/sherwani.jpg'
      },
      {
        id: 4,
        name: 'Pajama',
        description: 'Loose fitted pants',
        price: 1200,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/pajama.jpg'
      }
    ],
    female: [
      {
        id: 5,
        name: 'Saree',
        description: 'Traditional draped garment',
        price: 3500,
        availableSizes: ['Standard'],
        imageUrl: 'assets/images/saree.jpg'
      },
      {
        id: 6,
        name: 'Salwar Kameez',
        description: 'Traditional suit set',
        price: 2800,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/salwar.jpg'
      },
      {
        id: 7,
        name: 'Lehenga',
        description: 'Traditional skirt with blouse',
        price: 6000,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/lehenga.jpg'
      },
      {
        id: 8,
        name: 'Kurti',
        description: 'Short tunic top',
        price: 1800,
        availableSizes: ['S', 'M', 'L', 'XL'],
        imageUrl: 'assets/images/kurti.jpg'
      }
    ]
  };

  cartItems: { item: ClothingItem; size: string; quantity: number }[] = [];

  availableFabrics: Fabric[] = [
    {
      id: 1,
      name: 'Cotton Silk', 
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      pricePerMeter: 800,
      color: '#F5E6E8'
    },
    {
      id: 2,
      name: 'Pure Silk',
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      pricePerMeter: 1200,
      color: '#D5E4C3'
    },
    {
      id: 3,
      name: 'Georgette',
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      pricePerMeter: 600,
      color: '#B8E1FF'
    },
    // Add more fabrics as needed
  ];

  availableNecklines: StyleOption[] = [
    {
      id: 1,
      name: 'Round Neck',
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      priceModifier: 0
    },
    {
      id: 2,
      name: 'V-Neck',
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      priceModifier: 100
    },
    // Add more necklines as needed
  ];

  availableSleeves: StyleOption[] = [
    {
      id: 1,
      name: 'Short Sleeve',
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      priceModifier: 0
    },
    {
      id: 2,
      name: 'Full Sleeve',
      imageUrl: 'https://ionicframework.com/docs/img/demos/card-media.png',
      priceModifier: 200
    },
    // Add more sleeves as needed
  ];

  constructor() {
    addIcons({bagAddOutline,arrowBackOutline,cartOutline,addCircleOutline});
  }

  selectFabric(fabric: Fabric) {
    this.selectedFabric = fabric;
  }

  selectNeckline(neckline: StyleOption) {
    this.selectedNeckline = neckline;
  }

  selectSleeve(sleeve: StyleOption) {
    this.selectedSleeve = sleeve;
  }

  calculateFabricCost(): number {
    if (!this.selectedFabric) return 0;
    const metersNeeded = this.selectedLength / 39.37; // Convert inches to meters
    return Math.ceil(metersNeeded * this.selectedFabric.pricePerMeter);
  }

  calculateCustomizationCost(): number {
    let cost = 0;
    if (this.selectedNeckline) cost += this.selectedNeckline.priceModifier;
    if (this.selectedSleeve) cost += this.selectedSleeve.priceModifier;
    return cost;
  }

  calculateTotalCost(): number {
    const basePrice = this.selectedItem?.price || 0;
    return basePrice + this.calculateFabricCost() + this.calculateCustomizationCost();
  }

  isCustomizationValid(): boolean {
    return !!(
      this.selectedItem &&
      this.selectedFabric &&
      this.selectedNeckline &&
      this.selectedSleeve
    );
  }

  addCustomizedItemToCart() {
    if (!this.isCustomizationValid()) return;

    const customizedItem = {
      ...this.selectedItem!,
      fabric: this.selectedFabric,
      neckline: this.selectedNeckline,
      sleeve: this.selectedSleeve,
      length: this.selectedLength,
      notes: this.additionalNotes,
      totalPrice: this.calculateTotalCost()
    };

    // Add to cart logic here
    console.log('Adding customized item:', customizedItem);
    this.is_editing = false;
  }

  select_outfit() {
    this.selected_outfit.emit(true);
  }


}
