import { Clone, type Static, Type } from '@sinclair/typebox';
import { EventDatesSchema } from './schemas_EventDates.js';
import { EventDescriptionSchema } from './schemas_EventDescription.js';
import { EventIdSchema } from './schemas_EventId.js';
import { EventLocationSchema } from './schemas_EventLocation.js';
import { EventNameSchema } from './schemas_EventName.js';
import { EventPriceSchema } from './schemas_EventPrice.js';

export const SpecialEventSchema = Type.Object({
	eventId: Type.Optional(Clone(EventIdSchema)),
	name: Clone(EventNameSchema),
	location: Clone(EventLocationSchema),
	eventDescription: Clone(EventDescriptionSchema),
	dates: Clone(EventDatesSchema),
	price: Clone(EventPriceSchema),
});
export type SpecialEvent = Static<typeof SpecialEventSchema>;
