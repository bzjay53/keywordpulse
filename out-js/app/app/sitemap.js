export default function sitemap() {
    var baseUrl = 'https://keywordpulse.vercel.app';
    return [
        {
            url: "".concat(baseUrl),
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: "".concat(baseUrl, "/login"),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: "".concat(baseUrl, "/profile"),
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}
