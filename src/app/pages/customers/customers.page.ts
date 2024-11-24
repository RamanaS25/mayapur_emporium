import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonRow, IonGrid, IonItem, IonCard, IonLabel, IonCardHeader, IonSearchbar, IonCardContent, IonButtons, IonMenuButton, IonButton, IonIcon, IonAvatar, IonChip, IonList, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, addCircleOutline, mailOutline, callOutline, calendarOutline, bagCheckOutline, resizeOutline, timeOutline, cashOutline, personCircleOutline } from 'ionicons/icons';

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
  imports: [IonNote, IonList, IonChip, IonAvatar, IonIcon, IonButton, IonButtons, IonMenuButton, IonCardContent, IonCardHeader, IonSearchbar, IonLabel, IonCard, IonItem, IonContent, IonHeader, IonTitle, IonToolbar,  CommonModule, FormsModule, IonGrid, IonRow, IonCol]
})
export class CustomersPage{
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
        waistToAnkle: 41
      },
      orders: [
        {
          id: 101,
          clothingItem: {
            id: 1,
            name: 'Custom Suit',
            description: 'Three-piece wedding suit',
            price: 1200
          },
          fabric: {
            id: 1,
            name: 'Premium Wool',
            pricePerMeter: 80
          },
          customizations: {
            neckline: 'Notch Lapel',
            sleeve: 'Full Sleeve',
            length: 30,
            notes: 'Extra padding in shoulders'
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
            rating: 4.5
          },
          createdDate: new Date('2024-01-15'),
          dueDate: new Date('2024-02-01')
        }
      ],
      lastVisit: new Date('2024-02-01'),
      totalOrders: 1,
      totalSpent: 1500,
      notes: 'Prefers classic fits'
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
        waistToAnkle: 38
      },
      orders: [
        {
          id: 102,
          clothingItem: {
            id: 5,
            name: 'Evening Gown',
            description: 'Floor-length formal dress',
            price: 800
          },
          fabric: {
            id: 3,
            name: 'Silk Chiffon',
            pricePerMeter: 60
          },
          customizations: {
            neckline: 'V-Neck',
            sleeve: 'Sleeveless',
            length: 58,
            notes: 'Add sequin details on bodice'
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
            rating: 4.2
          },
          createdDate: new Date('2024-02-10'),
          dueDate: new Date('2024-02-20')
        }
      ],
      lastVisit: new Date('2024-02-10'),
      totalOrders: 1,
      totalSpent: 1200,
      notes: 'Allergic to synthetic materials'
    }
  ];

 searchTerm = signal('');
  currentView: 'all' | 'active' = 'all';
  selectedCustomer: Customer | null = null;

  router = inject(Router);
  navCtrl = inject(NavController);

  filteredCustomers = computed(() => {
    return this.customers.filter(customer => customer.firstName.toLowerCase().includes(this.searchTerm().toLowerCase()));
  });
  constructor() {
      addIcons({addCircleOutline,mailOutline,callOutline,personOutline,calendarOutline,bagCheckOutline,resizeOutline,timeOutline,cashOutline,personCircleOutline}); }

  setSearchTerm(event: any) {
    this.searchTerm.set(event.target.value);
  }

  getStatusColor(status: string): string {
    const colors = {
      'pending': 'warning',
      'in-progress': 'primary',
      'ready': 'success',
      'delivered': 'medium'
    } as Record<string, string>;
    return colors[status] || 'medium';
  }

  formatLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }
}
