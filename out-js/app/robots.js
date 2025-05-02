export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/private/'],
        },
        sitemap: 'https://keywordpulse.vercel.app/sitemap.xml',
    };
}
