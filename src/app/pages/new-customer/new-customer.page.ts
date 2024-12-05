import { Component, inject } from '@angular/core';
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
import { OrderCreationService } from 'src/app/services/order/order-creation.service';

type Step = 'gender' | 'details' | 'measurements' | 'order';

interface DressMeasurements {
  length_of_item: number | null;
  shoulder_width: number | null;
  shoulder_to_waist: number | null;
  bodies_length: number | null;
  upper_back_width: number | null;
  chest_width: number | null;
  upper_chest: number | null;
  chest_bust: number | null;
  under_bust: number | null;
  bust_point: number | null;
  waist: number | null;
  hips: number | null;
  sleeve_length: number | null;
  armhole: number | null;
  bicep_elbow_wrist: number | null;
  sleeve_open: number | null;
  neck_drop_front: number | null;
  neck_drop_back: number | null;
}

interface PantMeasurements {
  total_length: number | null;
  waist: number | null;
  hips: number | null;
  thigh: number | null;
  inseam: number | null;
  seat_round: number | null;
  pant_bottom_open: number | null;
}

interface SkirtMeasurements {
  length_front: number | null;
  length_back: number | null;
  waist: number | null;
  hips: number | null;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  measurements: {
    dress: DressMeasurements;
    pant: PantMeasurements;
    skirt: SkirtMeasurements;
  }
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
  modelsService = inject(OrderCreationService);


  customerData: CustomerData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    measurements: {
      dress: {
        length_of_item: null,
        shoulder_width: null,
        shoulder_to_waist: null,
        bodies_length: null,
        upper_back_width: null,
        chest_width: null,
        upper_chest: null,
        chest_bust: null,
        under_bust: null,
        bust_point: null,
        waist: null,
        hips: null,
        sleeve_length: null,
        armhole: null,
        bicep_elbow_wrist: null,
        sleeve_open: null,
        neck_drop_front: null,
        neck_drop_back: null
      },
      pant: {
        total_length: null,
        waist: null,
        hips: null,
        thigh: null,
        inseam: null,
        seat_round: null,
        pant_bottom_open: null
      },
      skirt: {
        length_front: null,
        length_back: null,
        waist: null,
        hips: null
      }
    }
  };

  toast = {
    isToastOpen: false,
    message: '',
    color: 'success'
  };

  models: any[] = [];

  constructor() {
    addIcons({ arrowForward, maleOutline, femaleOutline });
    this.getModels();
  }

  async getModels() {
    const { success, error, data } = await this.modelsService.getModels();
    if (success) {
      console.log(JSON.stringify(data, null, 2));
      this.models = data;
    }
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
    if (this.customerData.measurements.dress.length_of_item === null || 
        this.customerData.measurements.dress.waist === null || 
        this.customerData.measurements.dress.hips === null) {
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
