import { Region } from './region.model';

export interface Province {
	id: string;
	name: string;
	region?: Region;
}
