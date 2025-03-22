import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';

import { buyMuseumTicketsRouteOptions } from './ror/buyMuseumTicketsRouteOptions.ts';
import { createSpecialEventRouteOptions } from './ror/createSpecialEventRouteOptions.ts';
import { deleteSpecialEventRouteOptions } from './ror/deleteSpecialEventRouteOptions.ts';
import { getMuseumHoursRouteOptions } from './ror/getMuseumHoursRouteOptions.ts';
import { getSpecialEventRouteOptions } from './ror/getSpecialEventRouteOptions.ts';
import { getTicketCodeRouteOptions } from './ror/getTicketCodeRouteOptions.ts';
import { listSpecialEventsRouteOptions } from './ror/listSpecialEventsRouteOptions.ts';
import { updateSpecialEventRouteOptions } from './ror/updateSpecialEventRouteOptions.ts';

const fastify = Fastify({
	logger: true,
	ajv: {
		customOptions: {
			keywords: [
				{
					keyword: 'example',
					errors: false,
				},
			],
		},
	},
});

function requestHandler(request: FastifyRequest, reply: FastifyReply) {
	const { id, url, method, query, body, params, headers } = request;
	request.log.info({ id, url, method, query, body, params, headers }, 'RECEIVED');
	reply.send();
}

fastify.route({ ...buyMuseumTicketsRouteOptions, handler: requestHandler });
fastify.route({ ...createSpecialEventRouteOptions, handler: requestHandler });
fastify.route({ ...deleteSpecialEventRouteOptions, handler: requestHandler });
fastify.route({ ...getMuseumHoursRouteOptions, handler: requestHandler });
fastify.route({ ...getSpecialEventRouteOptions, handler: requestHandler });
fastify.route({ ...getTicketCodeRouteOptions, handler: requestHandler });
fastify.route({ ...listSpecialEventsRouteOptions, handler: requestHandler });
fastify.route({ ...updateSpecialEventRouteOptions, handler: requestHandler });

const start = async () => {
	try {
		await fastify.listen({ port: 3080, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
