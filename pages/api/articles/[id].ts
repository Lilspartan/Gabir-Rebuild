import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

export default async function handler(req, res) {
    const account_id = req.query.id;

    const folder = path.join(process.cwd(), 'posts/');
    const files = fs.readdirSync(folder);
    const markdownPosts = files.filter((file) => file.endsWith(".md"));
    const posts = markdownPosts.filter((fileName) => {
        const fileContents = fs.readFileSync(`${folder}${fileName}`);
        const matterResults = matter(fileContents);

        if (matterResults.data.authorID === Number(account_id)) {
            return fileName;
        }
    }).map((fileName) => {
        const fileContents = fs.readFileSync(`${folder}${fileName}`);
        const matterResults = matter(fileContents);

        return {
            title: matterResults.data.title,
            subtitle: matterResults.data.subtitle,
            edited: matterResults.data.edited,
            date: matterResults.data.date,
            headerImg: matterResults.data.headerImg || null,
            headerAlt: matterResults.data.headerAlt || null,
            tags: matterResults.data.tags,
            slug: fileName.replace('.md', ''),
            hidden: matterResults.data.hidden,
        }
    })

    res.status(200).json( posts);
}