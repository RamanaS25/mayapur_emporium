import { TestBed } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';

describe('SuparbaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
