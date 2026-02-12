import type { ICanReadId, ICanReadSlug } from "@caffeine/domain";
import { generateUUID } from "@caffeine/entity/helpers";
import type { IEntity } from "@caffeine/entity/types";
import { ResourceNotFoundException } from "@caffeine/errors/application";
import { describe, expect, it } from "vitest";
import { FindEntityByTypeUseCase } from "./find-entity-by-type.use-case";
import { makeEntityFactory } from "@caffeine/entity/factories";

interface TestEntity extends IEntity {
	id: string;
	slug: string;
	name: string;
}

class InMemoryTestRepository
	implements ICanReadId<TestEntity>, ICanReadSlug<TestEntity>
{
	public items: TestEntity[] = [];

	public async findById(id: string): Promise<TestEntity | null> {
		return this.items.find((item) => item.id === id) || null;
	}

	public async findBySlug(slug: string): Promise<TestEntity | null> {
		return this.items.find((item) => item.slug === slug) || null;
	}
}

describe("FindEntityByTypeUseCase", () => {
	it("should find an entity by its ID (UUID)", async () => {
		const repository = new InMemoryTestRepository();
		const useCase = new FindEntityByTypeUseCase(repository);

		const entity: TestEntity = {
			...makeEntityFactory(),
			slug: "test-entity",
			name: "Test Entity",
		};

		repository.items.push(entity);

		const result = await useCase.run(entity.id, "Test Source");

		expect(result).toEqual(entity);
	});

	it("should find an entity by its SLUG", async () => {
		const repository = new InMemoryTestRepository();
		const useCase = new FindEntityByTypeUseCase(repository);

		const slug = "unique-slug-example";
		const entity: TestEntity = {
			...makeEntityFactory(),
			slug,
			name: "Test Entity with Slug",
		};

		repository.items.push(entity);

		const result = await useCase.run(slug, "Test Source");

		expect(result).toEqual(entity);
	});

	it("should throw ResourceNotFoundException when entity is not found by ID", async () => {
		const repository = new InMemoryTestRepository();
		const useCase = new FindEntityByTypeUseCase(repository);

		const id = generateUUID();
		// Repository is empty

		await expect(useCase.run(id, "Test Source")).rejects.toThrow(
			ResourceNotFoundException,
		);
	});

	it("should throw ResourceNotFoundException when entity is not found by SLUG", async () => {
		const repository = new InMemoryTestRepository();
		const useCase = new FindEntityByTypeUseCase(repository);

		const slug = "non-existent-slug";
		// Repository is empty

		await expect(useCase.run(slug, "Test Source")).rejects.toThrow(
			ResourceNotFoundException,
		);
	});
});
