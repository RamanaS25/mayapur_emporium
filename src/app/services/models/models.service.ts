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

      let x = data.map((item) => ({
        ...item,
        fabrics: this.getKeyPairValues(item.fabrics),
        fabric_usage: this.getKeyPairValues(item.fabric_usage),
        base_price: this.getKeyPairValues(item.base_price),
      }));

      console.log(x);
      return x;
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

  async updateModel(row: string, model: any): Promise<{ success: boolean; error: string | null; data: any | null }> {
    console.log(row, model);
    try {
      const { data, error } = await this.supabase
        .from('tailor_models')
        .update({
          [row]: model[row],
        })
        .eq('id', model.id);
      if (error) {
        return {
          success: false,
          error: error.message,
          data: null
        };
      }
      return {
        success: true,
        error: null,
        data: data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  getKeyPairValues(input: any) {
    return Object.entries(input).map(([key, value]) => ({ key, value }));
  }
}
