import * as dotenv from 'dotenv';
dotenv.config();

const getPortByEnvironment = (env: string | undefined): number => env === 'production'
    ? getDotEnvPropAsNumber('PROD_PORT')
    : getDotEnvPropAsNumber('DEV_PORT');

const getDotEnvPropAsNumber = (property: string): number => {
    const propertyVal: string | undefined = process.env[property];
    return parseInt(propertyVal || '');  // Returns NaN when propertyVal is undefined.
};

export default {

    getPort(): number {
        const port: number = getPortByEnvironment(process.env['NODE_ENV']);
        if (isNaN(port)) {  // NaN returned indicates .env config error. Shut down...
            console.error('Invalid port value. Check your .env file. Exiting...');
            process.exit(1);
        }
        return port;
    },

    startServer(server: any, port: number) {
        server.listen(port, async () => {
            console.log(`Server is running on port ${port}! :'D `);
        });
    }
};
