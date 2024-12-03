import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ModelsService {
  api = inject(SupabaseService);
  supabase = this.api.getClient();
  constructor() {}

  async getModels() {
    try {
      const { data, error } = await this.supabase
        .from('tailor_models')
        .select('*');
      if (error) {
        throw error;
      }

      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getFabrics() {
    try {
      const { data, error } = await this.supabase
        .from('tailor_fabrics')
        .select('*');
      if (error) {
        throw error;
      }
      console.log(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateModel(row: string, model: any) {
    console.log(row, model);
    try {
      const { data, error } = await this.supabase
        .from('tailor_models')
        .update({
          [row]: model[row],
        })
        .eq('id', model.id);
      if (error) {
        throw error;
      }
      console.log('service', row, model);
      console.log('service2', row[model]);
      return data;
    } catch (error) {
      throw error;
    }
  }
  getKeyPairValues(input: any) {
    return Object.entries(input).map(([key, value]) => ({ key, value }));
  }
}
