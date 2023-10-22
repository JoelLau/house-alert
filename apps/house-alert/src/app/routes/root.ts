import {
  PropertyForSalePage,
  SKYVILLE_AT_DAWSON,
} from '@joellau/property-guru';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function (fastify: FastifyInstance) {
  const salesPage = new PropertyForSalePage();
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      return { data: 'Hello, World!' };
    }
  );

  fastify.get(
    '/houses',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const houses = await salesPage.fetchHouses(SKYVILLE_AT_DAWSON);
      return { data: houses };
    }
  );
}
