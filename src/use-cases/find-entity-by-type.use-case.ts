import type { EntryActions } from "@/types";
import { detectEntry } from "@/utils";
import type { ICanReadId, ICanReadSlug } from "@caffeine/domain";
import type { IEntity } from "@caffeine/entity/types";
import { ResourceNotFoundException } from "@caffeine/errors/application";

export class FindEntityByTypeUseCase<
	EntityType extends IEntity,
	RepositoryType extends ICanReadId<EntityType> & ICanReadSlug<EntityType>,
> {
	public constructor(private readonly repository: RepositoryType) {}

	public async run(id: string, sourceName: string): Promise<EntityType> {
		const actions: EntryActions<Promise<EntityType | null>> = {
			UUID: () => this.repository.findById(id),
			SLUG: () => this.repository.findBySlug(id),
		};

		const targetEntity = await actions[detectEntry(id)]();

		if (!targetEntity) throw new ResourceNotFoundException(sourceName);

		return targetEntity;
	}
}
