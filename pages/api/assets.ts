import fs from 'fs';
import dirTree from 'directory-tree';
import path from 'path';

export default async function handler(req, res) {
    const folder = path.join(process.cwd(), 'public/i/');
    const filesObject = dirTree(folder);

    res.json(filesObject)
}