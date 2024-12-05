import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../api/supabase.service';
@Injectable({
  providedIn: 'root'
})
export class OrderCreationService {
  api = inject(SupabaseService);
  constructor() { }

    async getModels(): Promise<{ success: boolean; error: string | null; data: any[] | [] }> {
      try {
        const { data, error } = await this.api.getClient()
          .from('tailor_models')
          .select('*');
        
        if (error) {
          return {
            success: false,
            error: error.message,
            data: []
          };
        }

        console.log(JSON.stringify(data, null, 2));

        let x = data.map((item) => ({
          ...item,
          fabrics: this.getKeyPairValues(item.fabrics),
          fabric_usage: this.getKeyPairValues(item.fabric_usage),
          base_price: this.getKeyPairValues(item.base_price),
        }));

        
        
        return {
          success: true,
          error: null,
          data: x ? x : []
        };
      } catch (err: any) {
        return {
          success: false,
          error: err.message,
          data: []
        };
      }
    }

    getKeyPairValues(input: any) {
      return Object.entries(input).map(([key, value]) => ({ key, value }));
    }
}
