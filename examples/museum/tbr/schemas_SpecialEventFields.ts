import { Clone, type Static, Type } from '@sinclair/typebox';
import { EventDatesSchema } from './schemas_EventDates.ts';
import { EventDescriptionSchema } from './schemas_EventDescription.ts';
import { EventLocationSchema } from './schemas_EventLocation.ts';
import { EventNameSchema } from './schemas_EventName.ts';
import { EventPriceSchema } from './schemas_EventPrice.ts';

export const SpecialEventFieldsSchema = Type.Object({
	name: Type.Optional(Clone(EventNameSchema)),
	location: Type.Optional(Clone(EventLocationSchema)),
	eventDescription: Type.Optional(Clone(EventDescriptionSchema)),
	dates: Type.Optional(Clone(EventDatesSchema)),
	price: Type.Optional(Clone(EventPriceSchema)),
});
export type SpecialEventFields = Static<typeof SpecialEventFieldsSchema>;
