// Basic API health check test
const fetch = require('node-fetch');

test('API should return 200 OK', async () => {
    const response = await fetch('https://fengshui-skill-api.vercel.app/api/index.js');
    expect(response.status).toBe(200);
});
