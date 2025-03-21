import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';

import { create_BookingRouteOptions } from './rod/create_BookingRouteOptions.ts';
import { create_Booking_PaymentRouteOptions } from './rod/create_Booking_PaymentRouteOptions.ts';
import { delete_BookingRouteOptions } from './rod/delete_BookingRouteOptions.ts';
import { get_BookingRouteOptions } from './rod/get_BookingRouteOptions.ts';
import { get_BookingsRouteOptions } from './rod/get_BookingsRouteOptions.ts';
import { get_StationsRouteOptions } from './rod/get_StationsRouteOptions.ts';
import { get_TripsRouteOptions } from './rod/get_TripsRouteOptions.ts';

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
			formats: {
				'iso-country-code': {
					validate: (data: string) =>
						['BE', 'DK', 'DE', 'ES', 'FR', 'IT', 'LU', 'NL', 'PT'].includes(data.toUpperCase()),
				},
			},
		},
	},
});

function requestHandler(request: FastifyRequest, reply: FastifyReply) {
	const { id, url, method, query, body, params, headers } = request;
	request.log.info({ id, url, method, query, body, params, headers }, 'RECEIVED');
	reply.send();
}

fastify.route({ ...create_Booking_PaymentRouteOptions, handler: requestHandler });
fastify.route({ ...create_BookingRouteOptions, handler: requestHandler });
fastify.route({ ...delete_BookingRouteOptions, handler: requestHandler });
fastify.route({ ...get_BookingRouteOptions, handler: requestHandler });
fastify.route({ ...get_BookingsRouteOptions, handler: requestHandler });
fastify.route({ ...get_StationsRouteOptions, handler: requestHandler });
fastify.route({ ...get_TripsRouteOptions, handler: requestHandler });

const start = async () => {
	try {
		await fastify.listen({ port: 3080, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
