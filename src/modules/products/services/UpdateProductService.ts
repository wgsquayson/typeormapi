import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Product from "../typeorm/entities/Product";
import { ProductRepository } from "../typeorm/repositories/ProductsRepository";

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);

    const product = await productsRepository.findOne(id);
    const searchProductName = await productsRepository.findByName(name);

    if (!product) {
      throw new AppError("Product not found", 404);
    } else if (searchProductName) {
      throw new AppError("There is already a product with this name");
    }

    const updatedProduct: Product = {
      ...product,
      name,
      price,
      quantity,
    };

    await productsRepository.save(updatedProduct);

    return updatedProduct;
  }
}

export default UpdateProductService;
