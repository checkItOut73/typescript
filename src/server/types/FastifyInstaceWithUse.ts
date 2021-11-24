import { FastifyInstance } from 'fastify';
import { NextHandleFunction } from 'connect';

export type FastifyInstanceWithUse = FastifyInstance &
    PromiseLike<FastifyInstance> & {
        use?: (handler: NextHandleFunction) => void;
    };
