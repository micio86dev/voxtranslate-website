/// <reference path="../pb_data/types.d.ts" />

// posts collection — blog content, one record per (slug, lang).
migrate(
  (db) => {
    const collection = new Collection({
      name: 'posts',
      type: 'base',
      // Public API only ever exposes published posts.
      listRule: 'published = true',
      viewRule: 'published = true',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'title', type: 'text', required: true, options: {} },
        { name: 'slug', type: 'text', required: true, options: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } },
        { name: 'excerpt', type: 'text', required: true, options: { max: 200 } },
        { name: 'content', type: 'editor', required: true, options: {} },
        {
          name: 'cover',
          type: 'file',
          required: false,
          options: {
            maxSelect: 1,
            maxSize: 5242880,
            mimeTypes: ['image/webp', 'image/jpeg', 'image/png', 'image/avif'],
          },
        },
        { name: 'author', type: 'text', required: true, options: {} },
        { name: 'published_at', type: 'date', required: true, options: {} },
        {
          name: 'lang',
          type: 'select',
          required: true,
          options: { maxSelect: 1, values: ['en', 'it', 'es', 'de', 'fr'] },
        },
        { name: 'tags', type: 'json', required: false, options: { maxSize: 200000 } },
        { name: 'seo_title', type: 'text', required: false, options: {} },
        { name: 'seo_desc', type: 'text', required: false, options: { max: 200 } },
        { name: 'published', type: 'bool', required: false, options: {} },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_posts_slug_lang ON posts (slug, lang)'],
    });

    return new Dao(db).saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('posts');
    return dao.deleteCollection(collection);
  },
);
