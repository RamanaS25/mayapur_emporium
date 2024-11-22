import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonChip,
  IonButtons,
  IonToast,
  IonMenuButton, IonCol, IonRow, IonGrid } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowForward, maleOutline, femaleOutline } from 'ionicons/icons';
import { OrderComponent } from "../../components/order/order.component";

type Step = 'gender' | 'details' | 'measurements' | 'order';

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

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  measurements: CustomerMeasurements;
}

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.page.html',
  styleUrls: ['./new-customer.page.scss'],
  standalone: true,
  imports: [IonGrid, IonRow, IonCol, 
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonChip,
    IonButtons,
    IonToast,
    IonMenuButton,
    OrderComponent
]
})
export class NewCustomerPage {
  currentStep: Step = 'gender';
  


  customerData: CustomerData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    measurements: {
      chest: null,
      shoulders: null,
      armLength: null,
      bicep: null,
      neck: null,
      wrist: null,
      upperBack: null,
      lowerBack: null,
      
      waist: null,
      hips: null,
      inseam: null,
      thigh: null,
      knee: null,
      calf: null,
      ankle: null,
      
      totalLength: null,
      shoulderToWaist: null,
      waistToAnkle: null
    }
  };

  toast = {
    isToastOpen: false,
    message: '',
    color: 'success'
  };

  constructor() {
    addIcons({ arrowForward, maleOutline, femaleOutline });
  }

  selectStep(step: Step) {
    // Only allow moving to details if gender is selected
    if (step === 'details' && !this.customerData.gender) {
      this.showToast('Please select gender first', 'warning');
      return;
    }
    
    // Only allow moving to measurements if details are filled
    if (step === 'measurements' && 
        (!this.customerData.firstName || 
         !this.customerData.lastName || 
         !this.customerData.email || 
         !this.customerData.phone)) {
      this.showToast('Please fill all details first', 'warning');
      return;
    }

    this.currentStep = step;
  }

  selectGender(gender: 'male' | 'female') {
    this.customerData.gender = gender;
    this.selectStep('order');
  }

  onSubmit() {
    switch (this.currentStep) {
      case 'details':
        if (this.validateDetails()) {
          this.selectStep('measurements');
        }
        break;
      
      case 'measurements':
        if (this.validateMeasurements()) {
          this.submitCustomerData();
        }
        break;
    }
  }

  private validateDetails(): boolean {
    if (!this.customerData.firstName || 
        !this.customerData.lastName || 
        !this.customerData.email || 
        !this.customerData.phone) {
      this.showToast('Please fill all fields', 'warning');
      return false;
    }
    return true;
  }

  private validateMeasurements(): boolean {
    if (this.customerData.measurements.chest === null || 
        this.customerData.measurements.waist === null || 
        this.customerData.measurements.hips === null) {
      this.showToast('Please fill all measurements', 'warning');
      return false;
    }
    return true;
  }

  private submitCustomerData() {
    // Here you would typically send the data to your backend
    console.log('Submitting customer data:', this.customerData);
    this.showToast('Customer data saved successfully!', 'success');
    // You might want to navigate to another page or reset the form here
  }

  private showToast(message: string, color: 'success' | 'warning' | 'danger') {
    this.toast = {
      isToastOpen: true,
      message,
      color
    };
  }

  move_to_details(event: boolean) {
    if (event) {
      this.selectStep('details');
    }
  }
}
