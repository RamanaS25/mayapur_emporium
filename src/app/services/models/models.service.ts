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
      return data;
    } catch (error) {
      throw error;
    }
  }
}
