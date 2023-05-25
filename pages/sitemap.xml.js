import React from "react";
import fs from "fs";
import path from 'path';

const Sitemap = () => {};

export const getServerSideProps = ({
    res
}) => {
    const baseUrl = {
        development: "http://localhost:3000",
        production: "https://gabirmotors.com",
    } [process.env.NODE_ENV];

    const staticPages = fs
        .readdirSync({
            development: 'pages',
            production: './',
        }[process.env.NODE_ENV])
        .filter((staticPage) => {
            return ![
                "_app.tsx",
                "_document.js",
                "_error.js",
                "404.tsx",
                "sitemap.xml.js",
            ].includes(staticPage);
        })
        .map((staticPagePath) => {
            return `${baseUrl}/${staticPagePath.replace('.tsx', '').replace('index', '')}`;
        });

    const folder = path.join(process.cwd(), 'posts/');
    const files = fs.readdirSync(folder);
    const markdownPosts = files.filter((file) => file.endsWith(".md"));
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticPages
        .map((url) => {
          return `
            <url>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>weekly</changefreq>
              <priority>1.0</priority>
            </url>
          `;
        })
        .join("")}

        ${markdownPosts
            .map((url) => {
              return `
                <url>
                  <loc>${baseUrl}/tutorials/${url.replace('.md', '')}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                  <changefreq>weekly</changefreq>
                  <priority>0.9</priority>
                </url>
              `;
            })
            .join("")}
    </urlset>
  `;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    console.log(staticPages);

    return {
        props: {},
    };
};

export default Sitemap;