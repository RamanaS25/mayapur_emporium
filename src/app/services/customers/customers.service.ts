import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
import { save } from 'ionicons/icons';

interface Measurement {
  general: Array<{
    length_of_item: number;
    shoulder_width: number;
    shoulder_to_waist: number;
    bodies_length: number;
    upper_back_width: number;
    chest_width: number;
    upper_chest: number;
    chest_bust: number;
    under_bust: number;
    bust_point: number;
    waist: number;
    hips: number;
    sleeve_length: number;
    armhole: number;
    bicep: number;
    elbow: number;
    wrist: number;
    sleeve_open: number;
    neck_drop_front: number;
    neck_drop_back: number;
  }>;
  pants: Array<{
    total_length: number;
    waist: number;
    hips: number;
    thigh: number;
    inseam: number;
    seat_round: number;
    pant_bottom_open: number;
  }>;
  skirt: Array<{
    length_front: number;
    length_back: number;
    waist: number;
    hips: number;
  }>;
}
@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  api = inject(SupabaseService);
  supabase = this.api.getClient();
  constructor() {}
  async getCustomers() {
    try {
      const { data, error } = await this.supabase
        .from('tailor_users')
        .select('*');

      if (error) {
        throw error;
      }

      return data.map((item: any) => ({
        ...item,
        measurements: this.formatMeasurements(item.measurements),
      }));
    } catch (error) {
      throw error;
    }
  }

  // Format measurements
  formatMeasurements(measurements: Measurement) {
    if (!measurements) return {};

    return {
      general:
        measurements.general?.map((item) =>
          Object.entries(item).map(([key, value]) => ({ key, value }))
        )[0] || [],
      pants:
        measurements.pants?.map((item) =>
          Object.entries(item).map(([key, value]) => ({ key, value }))
        )[0] || [],
      skirt:
        measurements.skirt?.map((item) =>
          Object.entries(item).map(([key, value]) => ({ key, value }))
        )[0] || [],
    };
  }

  async saveCustomer(customer: any) {
    const customerData = {
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      gender: customer.gender,
      notes: customer.notes,
      measurements: customer.measurements,
    };
    try {
      const { data, error } = await this.supabase
        .from('tailor_users')
        .insert(customerData)
        .select('*');

      if (error) {
        console.log(error);
        return { success: false, error };
      } else {
        return { success: true, data };
      }
    } catch (e) {
      console.log(e);
      return { success: false, error: e };
    }
  }
}
