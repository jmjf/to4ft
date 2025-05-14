import { Clone, type Static, Type } from '@sinclair/typebox';
import { EventDatesSchema } from './schemas_EventDates.js';
import { EventDescriptionSchema } from './schemas_EventDescription.js';
import { EventLocationSchema } from './schemas_EventLocation.js';
import { EventNameSchema } from './schemas_EventName.js';
import { EventPriceSchema } from './schemas_EventPrice.js';

export const SpecialEventFieldsSchema = Type.Object({
	name: Type.Optional(Clone(EventNameSchema)),
	location: Type.Optional(Clone(EventLocationSchema)),
	eventDescription: Type.Optional(Clone(EventDescriptionSchema)),
	dates: Type.Optional(Clone(EventDatesSchema)),
	price: Type.Optional(Clone(EventPriceSchema)),
});
export type SpecialEventFields = Static<typeof SpecialEventFieldsSchema>;
