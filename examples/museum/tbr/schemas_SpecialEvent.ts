import { Clone, type Static, Type } from '@sinclair/typebox';
import { EventDatesSchema } from './schemas_EventDates.ts';
import { EventDescriptionSchema } from './schemas_EventDescription.ts';
import { EventIdSchema } from './schemas_EventId.ts';
import { EventLocationSchema } from './schemas_EventLocation.ts';
import { EventNameSchema } from './schemas_EventName.ts';
import { EventPriceSchema } from './schemas_EventPrice.ts';

export const SpecialEventSchema = Type.Object({
	eventId: Type.Optional(Clone(EventIdSchema)),
	name: Clone(EventNameSchema),
	location: Clone(EventLocationSchema),
	eventDescription: Clone(EventDescriptionSchema),
	dates: Clone(EventDatesSchema),
	price: Clone(EventPriceSchema),
});
export type SpecialEvent = Static<typeof SpecialEventSchema>;
