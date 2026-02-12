import type { EntryActions } from "@/types";
import { detectEntry } from "@/utils";
import type { Entity } from "@caffeine/entity";
import type {
	ICanReadId,
	ICanReadSlug,
} from "@caffeine/entity/types/repositories";
import { ResourceNotFoundException } from "@caffeine/errors/application";

export class FindEntityByTypeService<
	EntityType extends Entity,
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
