import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCol,
  IonRow,
  IonGrid,
  IonItem,
  IonCard,
  IonLabel,
  IonCardHeader,
  IonSearchbar,
  IonCardContent,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonIcon,
  IonAvatar,
  IonChip,
  IonList,
  IonNote,
  IonModal,
  IonText,
  IonItemGroup,
  IonItemDivider,
  IonDatetime,
  IonCardTitle,
  IonCardSubtitle,
  IonAccordion,
  IonAccordionGroup,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonFooter,
  IonInput,
  IonTextarea,
  IonToast,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  addCircleOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  bagCheckOutline,
  resizeOutline,
  timeOutline,
  cashOutline,
  personCircleOutline,
  close,
  arrowForwardOutline,
  shirtOutline,
  checkmarkCircle,
  checkmarkDoneCircle,
  flag,
  documentTextOutline,
  colorPaletteOutline,
  constructOutline,
  closeOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { CustomersService } from 'src/app/services/customers/customers.service';

addIcons({ personOutline });

// Interfaces

interface CustomerMeasurements {
  chest: number | null;
  shoulders: number | null;
  armLength: number | null;
  bicep: number | null;
  neck: number | null;
  wrist: number | null;
  upperBack: number | null;
  lowerBack: number | null;
  waist: number | null;
  hips: number | null;
  inseam: number | null;
  thigh: number | null;
  knee: number | null;
  calf: number | null;
  ankle: number | null;
  totalLength: number | null;
  shoulderToWaist: number | null;
  waistToAnkle: number | null;
}

interface Tailor {
  id: number;
  name: string;
  specialization: string[];
  activeOrders: number;
  completedOrders: number;
  rating: number;
}

interface OrderItem {
  id: number;
  clothingItem: {
    id: number;
    name: string;
    description: string;
    price: number;
  };
  fabric: {
    id: number;
    name: string;
    pricePerMeter: number;
  };
  customizations: {
    neckline?: string;
    sleeve?: string;
    length?: number;
    notes?: string;
  };
  totalPrice: number;
  status: 'pending' | 'in-progress' | 'ready' | 'delivered';
  orderDate: Date;
  deliveryDate?: Date;
  tailor: Tailor;
  createdDate: Date;
  dueDate: Date;
}

type MeasurementCategory = keyof Measurements;

interface MeasurementItem {
  key: string;
  value: number;
}

interface Measurements {
  general: Array<MeasurementItem>;
  pants: Array<MeasurementItem>;
  skirt: Array<MeasurementItem>;
}

interface User {
  id: number;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: 'male' | 'female';
  measurements: Measurements;
  notes: string;
  phone: string;
}

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  measurements: CustomerMeasurements;
  orders: OrderItem[];
  lastVisit: Date;
  totalOrders: number;
  totalSpent: number;
  notes?: string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonTextarea,
    IonInput,
    IonFooter,
    FormsModule,
    IonSegment,
    IonSelect,
    IonSelectOption,
    IonSegmentButton,
    IonAccordionGroup,
    IonAccordion,
    IonCardSubtitle,
    IonCardTitle,
    IonDatetime,
    IonItemDivider,
    IonItemGroup,
    IonText,
    IonModal,
    IonNote,
    IonList,
    IonChip,
    IonAvatar,
    IonIcon,
    IonButton,
    IonButtons,
    IonMenuButton,
    IonCardContent,
    IonCardHeader,
    IonSearchbar,
    IonLabel,
    IonCard,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,

    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class CustomersPage {
  isNewCustomerModalOpen = false;
  _customers: User[] = [];
  selectedCategory: MeasurementCategory = 'general';

  customers: Customer[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1234567890',
      gender: 'male',
      measurements: {
        chest: 40,
        shoulders: 18,
        armLength: 25,
        bicep: 14,
        neck: 16,
        wrist: 7,
        upperBack: 17,
        lowerBack: 16,
        waist: 34,
        hips: 41,
        inseam: 32,
        thigh: 22,
        knee: 15,
        calf: 14,
        ankle: 10,
        totalLength: 58,
        shoulderToWaist: 17,
        waistToAnkle: 41,
      },
      orders: [
        {
          id: 101,
          clothingItem: {
            id: 1,
            name: 'Custom Suit',
            description: 'Three-piece wedding suit',
            price: 1200,
          },
          fabric: {
            id: 1,
            name: 'Premium Wool',
            pricePerMeter: 80,
          },
          customizations: {
            neckline: 'Notch Lapel',
            sleeve: 'Full Sleeve',
            length: 30,
            notes: 'Extra padding in shoulders',
          },
          totalPrice: 1500,
          status: 'delivered',
          orderDate: new Date('2024-01-15'),
          deliveryDate: new Date('2024-02-01'),
          tailor: {
            id: 1,
            name: 'John Smith',
            specialization: ['Custom Tailoring'],
            activeOrders: 1,
            completedOrders: 10,
            rating: 4.5,
          },
          createdDate: new Date('2024-01-15'),
          dueDate: new Date('2024-02-01'),
        },
      ],
      lastVisit: new Date('2024-02-01'),
      totalOrders: 1,
      totalSpent: 1500,
      notes: 'Prefers classic fits',
    },
    {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+1987654321',
      gender: 'female',
      measurements: {
        chest: 36,
        shoulders: 15,
        armLength: 22,
        bicep: 11,
        neck: 14,
        wrist: 6,
        upperBack: 14,
        lowerBack: 13,
        waist: 28,
        hips: 38,
        inseam: 30,
        thigh: 20,
        knee: 14,
        calf: 13,
        ankle: 9,
        totalLength: 54,
        shoulderToWaist: 16,
        waistToAnkle: 38,
      },
      orders: [
        {
          id: 102,
          clothingItem: {
            id: 5,
            name: 'Evening Gown',
            description: 'Floor-length formal dress',
            price: 800,
          },
          fabric: {
            id: 3,
            name: 'Silk Chiffon',
            pricePerMeter: 60,
          },
          customizations: {
            neckline: 'V-Neck',
            sleeve: 'Sleeveless',
            length: 58,
            notes: 'Add sequin details on bodice',
          },
          totalPrice: 1200,
          status: 'in-progress',
          orderDate: new Date('2024-02-10'),
          tailor: {
            id: 2,
            name: 'Jane Doe',
            specialization: ['Custom Tailoring'],
            activeOrders: 1,
            completedOrders: 10,
            rating: 4.2,
          },
          createdDate: new Date('2024-02-10'),
          dueDate: new Date('2024-02-20'),
        },
      ],
      lastVisit: new Date('2024-02-10'),
      totalOrders: 1,
      totalSpent: 1200,
      notes: 'Allergic to synthetic materials',
    },
  ];
  measurementFields = {
    general: [
      'length of item',
      'shoulder width',
      'shoulder to waist',
      'bodies length',
      'upper back width',
      'chest width',
      'upper chest',
      'chest bust',
      'under bust',
      'bust point',
      'waist',
      'hips',
      'sleeve length',
      'armhole',
      'bicep',
      'elbow',
      'wrist',
      'sleeve open',
      'neck drop front',
      'neck drop back',
    ],
    pants: [
      'total length',
      'waist',
      'hips',
      'thigh',
      'inseam',
      'seat round',
      'pant bottom open',
    ],
    skirt: ['length front', 'length back', 'waist', 'hips'],
  };
  private initializeMeasurements(fields: string[]): MeasurementItem[] {
    return fields.map((field) => ({
      key: field,
      value: 0,
    }));
  }
  newCustomer: User = {
    id: 0,
    created_at: new Date().toISOString(),
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'male',
    notes: '',
    measurements: {
      general: this.initializeMeasurements(this.measurementFields.general),
      pants: this.initializeMeasurements(this.measurementFields.pants),
      skirt: this.initializeMeasurements(this.measurementFields.skirt),
    },
  };
  searchTerm = signal('');
  currentView: 'all' | 'active' = 'all';
  selectedCustomer: User | null = null;
  isModalOpen = false;
  selectedOrder: any = null;

  api = inject(CustomersService);
  router = inject(Router);
  navCtrl = inject(NavController);

  open_toast = false;
  message = '';
  color = 'primary';
  constructor() {
    addIcons({
      addCircleOutline,
      arrowBackOutline,
      mailOutline,
      callOutline,
      personOutline,
      calendarOutline,
      bagCheckOutline,
      resizeOutline,
      personCircleOutline,
      close,
      shirtOutline,
      colorPaletteOutline,
      timeOutline,
      closeOutline,
      cashOutline,
      arrowForwardOutline,
      constructOutline,
      checkmarkCircle,
      checkmarkDoneCircle,
      flag,
      documentTextOutline,
    });
    this.getCustomers();
  }
  getMeasurement(field: string): MeasurementItem {
    return (
      this.newCustomer.measurements[this.selectedCategory].find(
        (m) => m.key === field
      ) || { key: field, value: 0 }
    );
  }

  convertToDB(measurements: Measurements): any {
    const result = {
      general: [{}],
      pants: [{}],
      skirt: [{}],
    };

    // transfer data to json
    Object.keys(measurements).forEach((category) => {
      const measurementArray = measurements[category as keyof Measurements];

      // Создаем единый объект из массива измерений
      const measurementObject = measurementArray.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as { [key: string]: number });

      // Присваиваем объект первому элементу массива соответствующей категории
      result[category as keyof typeof result][0] = measurementObject;
    });

    return result;
  }

  async saveCustomer() {
    let x = this.convertToDB(this.newCustomer.measurements);
    console.log(x);
    this.newCustomer.measurements = x;
    let y = await this.api.saveCustomer(this.newCustomer);
    this.getCustomers();
    this.isNewCustomerModalOpen = false;
    if (y.success) {
      this.open_toast = true;
      this.message = 'Customer saved successfully';
      this.color = 'success';
    } else {
      this.open_toast = true;
      this.message = 'Error saving customer';
      this.color = 'danger';
    }
  }
  setSearchTerm(event: any) {
    this.searchTerm.set(event.target.value);
  }

  getStatusColor(status: string): string {
    const colors = {
      pending: 'warning',
      'in-progress': 'primary',
      ready: 'success',
      delivered: 'medium',
    } as Record<string, string>;
    return colors[status] || 'medium';
  }

  openOrderDetails(order: any) {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }
  async getCustomers() {
    let x = await this.api.getCustomers();
    this._customers = x;
    console.log(this._customers);
  }
  segmentChanged(event: any) {
    this.selectedCategory = event.detail.value as MeasurementCategory;
    console.log('Category changed to:', this.selectedCategory);
    console.log(
      'Current measurements:',
      this.selectedCustomer?.measurements[this.selectedCategory]
    );
  }
  isSelected(customer: User): boolean {
    return this.selectedCustomer?.id === customer.id;
  }
  isMobile(): boolean {
    return window.innerWidth <= 768;
  }
  formatLabel(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  get filterCustomers() {
    return this._customers.filter((customer) =>
      customer.first_name
        .toLowerCase()
        .includes(this.searchTerm().toLowerCase())
    );
  }
}
