import { Test, TestingModule } from '@nestjs/testing';
import { TraitTypeService } from '../service/trait-type.service';

describe('TraitTypeService', () => {
  let service: TraitTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraitTypeService],
    }).compile();

    service = module.get<TraitTypeService>(TraitTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
