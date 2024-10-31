let env = '';

const { host, search } = location;

env = host.includes('pre-') || host.includes('localhost') || host.includes('sj') ? 'pre-' : '';

export default {
    hostEnv: env,
    isPre: env === 'pre-',
};
