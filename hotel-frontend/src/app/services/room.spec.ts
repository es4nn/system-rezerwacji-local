import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { RoomService } from './room';

describe('RoomService', () => {
  let service: RoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(RoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
