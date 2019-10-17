const fastify = require('fastify')();
const path = require('path');

fastify.register(require('fastify-static'), {
    root: path.resolve(process.cwd(), 'dist/browser')
});

fastify.get('/', async (request, reply) => {
    reply.sendFile('index.html');
});

const start = async () => {
    try {
        await fastify.listen(8080, '0.0.0.0');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
