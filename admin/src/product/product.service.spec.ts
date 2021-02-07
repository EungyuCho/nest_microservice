import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
describe('ProductService', () => {
  let service: ProductService;
  let productRepository: MockRepository<Product>;
  const dummyData = {
    title: 'dummy',
    image: 'already exist!',
  };
  const productId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProduct', () => {
    const createProductArgs = {
      title: 'test1',
      image: 'testImage',
    };
    it('should be create new product', async () => {
      productRepository.findOne.mockResolvedValue(undefined);
      productRepository.create.mockReturnValue(createProductArgs);
      productRepository.save.mockResolvedValue(createProductArgs);
      const result = await service.createProduct(createProductArgs);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        title: createProductArgs.title,
      });

      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith(createProductArgs);

      expect(productRepository.create).toHaveBeenCalledTimes(1);
      expect(productRepository.create).toHaveBeenCalledWith(createProductArgs);

      expect(result).toEqual({ ok: true });
    });

    it('should fail if product exist', async () => {
      productRepository.findOne.mockResolvedValue(dummyData);

      const result = await service.createProduct(createProductArgs);

      expect(result).toEqual({
        ok: false,
        error: 'There is same product with title already',
      });
    });

    it('should fail on exception', async () => {
      productRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createProduct(createProductArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Could not create Product',
      });
    });
  });

  describe('allProducts', () => {
    it('should return all product', async () => {
      const allProducts = [
        {
          title: 'test1',
          image: 'testImage',
        },
      ];
      productRepository.find.mockResolvedValue(allProducts);
      const result = await service.allProducts();

      expect(productRepository.find).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        ok: true,
        products: allProducts,
      });
    });

    it('should fail on exception', async () => {
      productRepository.find.mockRejectedValue(new Error());
      const result = await service.allProducts();
      expect(result).toEqual({
        ok: false,
        error: 'Could not load Products',
      });
    });
  });

  describe('getProduct', () => {
    it('should fail if product not found', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      const result = await service.getProduct(productId);
      expect(result).toEqual({
        ok: false,
        error: 'Product not found',
      });
    });

    it('should be return product', async () => {
      productRepository.findOne.mockResolvedValue(dummyData);

      const result = await service.getProduct(productId);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.findOne).toHaveBeenCalledWith({ id: productId });
      expect(result).toEqual({
        ok: true,
        product: dummyData,
      });
    });

    it('should fail on exception', async () => {
      productRepository.findOne.mockRejectedValue(new Error());
      const result = await service.getProduct(productId);
      expect(result).toEqual({
        ok: false,
        error: 'Could not load Product',
      });
    });
  });

  describe('putProduct', () => {
    const prevArgs = {
      title: 'title',
      image: 'image',
    };
    const putArgs = {
      title: 'new title',
      image: 'new Image',
    };

    it('should fail if product not found', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      const result = await service.putProduct(productId, putArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Product not found',
      });
    });

    it('should be update', async () => {
      productRepository.findOne.mockResolvedValue(prevArgs);
      productRepository.save.mockResolvedValue(putArgs);

      const result = await service.putProduct(productId, putArgs);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.findOne).toHaveBeenCalledWith({ id: productId });

      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith(putArgs);

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      productRepository.findOne.mockRejectedValue(new Error());
      const result = await service.putProduct(productId, putArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Could not load Product',
      });
    });
  });
  describe('patchProduct', () => {
    const prevArgs = {
      title: 'title',
      image: 'image',
    };
    const patchImageArgs = {
      image: 'new Image',
    };

    const patchTitleArgs = {
      title: 'new title',
    };

    it('should fail if product not found', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      const result = await service.patchProduct(productId, patchImageArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Product not found',
      });
    });

    it('should be update with image', async () => {
      productRepository.findOne.mockResolvedValue(prevArgs);
      productRepository.save.mockResolvedValue({
        title: prevArgs.title,
        image: patchImageArgs.image,
      });

      const result = await service.patchProduct(productId, patchImageArgs);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.findOne).toHaveBeenCalledWith({ id: productId });

      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith({
        title: prevArgs.title,
        image: patchImageArgs.image,
      });

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should be update with title', async () => {
      productRepository.findOne.mockResolvedValue(prevArgs);
      productRepository.save.mockResolvedValue({
        title: prevArgs.title,
        image: patchImageArgs.image,
      });

      const result = await service.patchProduct(productId, patchTitleArgs);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.findOne).toHaveBeenCalledWith({ id: productId });

      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(productRepository.save).toHaveBeenCalledWith({
        image: prevArgs.image,
        title: patchTitleArgs.title,
      });

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      productRepository.findOne.mockRejectedValue(new Error());
      const result = await service.patchProduct(productId, patchImageArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Could not load Product',
      });
    });
  });
  describe('deleteProduct', () => {
    it('should fail if product not found', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      const result = await service.deleteProduct(productId);
      expect(result).toEqual({
        ok: false,
        error: 'Product not found',
      });
    });

    it('should be delete', async () => {
      productRepository.findOne.mockResolvedValue(dummyData);

      const result = await service.deleteProduct(productId);

      expect(productRepository.findOne).toHaveBeenCalledTimes(1);
      expect(productRepository.findOne).toHaveBeenCalledWith({ id: productId });

      expect(productRepository.delete).toHaveBeenCalledTimes(1);
      expect(productRepository.delete).toHaveBeenCalledWith(dummyData);

      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      productRepository.findOne.mockRejectedValue(new Error());
      const result = await service.deleteProduct(productId);
      expect(result).toEqual({
        ok: false,
        error: 'Could not delete Product',
      });
    });
  });
});
