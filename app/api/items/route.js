// pages/api/items/route.js

import DataRepository from '../utils/DataRepository';

const repo = new DataRepository();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const t = searchParams.get('t');
    console.log(t);
    try {
        const items = await repo.getItems();
        Response.statusCode = 200;
        return Response.json(items);
    } catch (error) {
        Response.statusCode = 500;
        return Response.json({ error: 'Error fetching items' });
    }
}
