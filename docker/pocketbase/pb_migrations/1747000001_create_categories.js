/// <reference path="../pb_data/types.d.ts" />

// categories collection — optional taxonomy, one record per (slug, lang).
migrate(
  (db) => {
    const collection = new Collection({
      name: 'categories',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      schema: [
        { name: 'name', type: 'text', required: true, options: {} },
        { name: 'slug', type: 'text', required: true, options: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } },
        {
          name: 'lang',
          type: 'select',
          required: true,
          options: { maxSelect: 1, values: ['en', 'it', 'es', 'de', 'fr'] },
        },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_categories_slug_lang ON categories (slug, lang)'],
    });

    return new Dao(db).saveCollection(collection);
  },
  (db) => {
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId('categories');
    return dao.deleteCollection(collection);
  },
);
