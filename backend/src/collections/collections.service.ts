import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { Repository } from 'typeorm';
import { ImagesService } from 'src/images/images.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionsRepo: Repository<Collection>,
    private readonly imagesService: ImagesService,
  ) {}

  createCollection(ownerId: string, name: string): Promise<Collection> {
    const collection = this.collectionsRepo.create({ ownerId, name });
    return this.collectionsRepo.save(collection);
  }

  findUserCollections(ownerId: string): Promise<Collection[]> {
    return this.collectionsRepo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOwnedCollection(
    ownerId: string,
    collectionId: string,
  ): Promise<Collection> {
    const collection = await this.collectionsRepo.findOne({
      where: { id: collectionId },
      relations: { images: true },
    });

    if (!collection)
      throw new NotFoundException(`Collection ${collectionId} not found`);

    if (collection.ownerId !== ownerId)
      throw new ForbiddenException('You do not own this collection');

    return collection;
  }

  async addImage(
    ownerId: string,
    collectionId: string,
    imageId: string,
  ): Promise<Collection> {
    const collection = await this.findOwnedCollection(ownerId, collectionId);
    const image = await this.imagesService.findById(imageId);

    const alreadySaved = collection.images.some((img) => img.id === imageId);
    if (!alreadySaved) {
      collection.images.push(image);
      await this.collectionsRepo.save(collection);
    }

    return collection;
  }

  async removeImage(
    ownerId: string,
    collectionId: string,
    imageId: string,
  ): Promise<Collection> {
    const collection = await this.findOwnedCollection(ownerId, collectionId);
    collection.images = collection.images.filter((img) => img.id !== imageId);
    await this.collectionsRepo.save(collection);
    return collection;
  }
}
