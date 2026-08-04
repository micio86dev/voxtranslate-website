/// <reference path="../pb_data/types.d.ts" />

// Withdraw the Pro tier from published blog copy.
//
// The Pro engine is hidden in the product (PRO_TIER_ENABLED is off on both the server and
// the marketing site), so posts that advertised four tiers and walked readers through a
// `Pro` section were selling something the app will not start. This rewrites the records
// in place — the repo-side sources (src/data/*.json, src/data/fallback-posts.ts and the
// earlier seed migrations) carry the identical edits, so a fresh instance never has to run
// this at all.
//
// Idempotent by construction: every rule is a literal/anchored replacement of Pro copy, so
// a second run — or a record an editor already fixed by hand — simply matches nothing.
migrate(
  (db) => {
    const dao = new Dao(db);

    var TEXT_RULES = [
  // ---- EN
  ['Pro and Premium speak a natural AI translation.', 'Premium speaks a natural AI translation.'],
  ['Standard for casual syncs, Pro or Premium when you want', 'Standard for casual syncs, Premium when you want'],
  ['and on Pro and Premium they also hear', 'and on Premium they also hear'],
  ["On VoxTranslate's Pro and Premium tiers, the same translated text", "On VoxTranslate's Premium tier, the same translated text"],
  ['switch up to Pro or Premium for the calls', 'switch up to Premium for the calls'],
  ['switch to Pro for your next meeting', 'switch to Premium for your next meeting'],
  [', <strong>Pro</strong> for customer-facing calls where a natural spoken translation matters, and <strong>Premium</strong>', ', and <strong>Premium</strong>'],
  ['Standard, Enhanced, Pro or Premium?', 'Standard, Enhanced or Premium?'],
  ['four engine tiers', 'three engine tiers'],
  ['gives you four translation engines', 'gives you three translation engines'],
  // ---- IT
  ['Pro e Premium pronunciano una traduzione AI naturale.', 'Premium pronuncia una traduzione AI naturale.'],
  ['Standard per i sync informali, Pro o Premium quando vuoi', 'Standard per i sync informali, Premium quando vuoi'],
  ['e, con Pro e Premium, sentono anche', 'e, con Premium, sentono anche'],
  ['Sui piani Pro e Premium di VoxTranslate, lo stesso testo', 'Sul piano Premium di VoxTranslate, lo stesso testo'],
  ['passare a Pro o Premium per le chiamate', 'passare a Premium per le chiamate'],
  ['passa a Pro per la tua prossima riunione', 'passa a Premium per la tua prossima riunione'],
  [', <strong>Pro</strong> per le call verso il cliente in cui conta una traduzione parlata naturale, e <strong>Premium</strong>', ', e <strong>Premium</strong>'],
  ['Standard, Enhanced, Pro o Premium?', 'Standard, Enhanced o Premium?'],
  ['quattro livelli di motore', 'tre livelli di motore'],
  ['quattro motori di traduzione', 'tre motori di traduzione'],
  // ---- ES
  ['Pro y Premium pronuncian una traducción de AI natural.', 'Premium pronuncia una traducción de AI natural.'],
  ['Standard para sincros informales, Pro o Premium cuando quieras', 'Standard para sincros informales, Premium cuando quieras'],
  ['y, en Pro y Premium, también escuchan', 'y, en Premium, también escuchan'],
  ['En los planes Pro y Premium de VoxTranslate, el mismo texto', 'En el plan Premium de VoxTranslate, el mismo texto'],
  ['subir a Pro o Premium para las llamadas', 'subir a Premium para las llamadas'],
  ['cambia a Pro en tu próxima reunión', 'cambia a Premium en tu próxima reunión'],
  [', <strong>Pro</strong> para llamadas con cliente donde importa una traducción hablada natural, y <strong>Premium</strong>', ', y <strong>Premium</strong>'],
  // (the ES "¿Standard, Enhanced, Pro o Premium?" excerpt is covered by the IT rule above —
  // the clause is identical in both languages once the leading ¿ is excluded)
  ['cuatro niveles de motor', 'tres niveles de motor'],
  ['cuatro motores de traducción', 'tres motores de traducción'],
  // ---- DE
  ['Pro und Premium sprechen eine natürliche AI-Übersetzung aus.', 'Premium spricht eine natürliche AI-Übersetzung aus.'],
  ['Standard für lockere Syncs, Pro oder Premium, wenn du', 'Standard für lockere Syncs, Premium, wenn du'],
  ['und hören bei Pro und Premium zusätzlich', 'und hören bei Premium zusätzlich'],
  ['In den Stufen Pro und Premium von VoxTranslate wird', 'In der Stufe Premium von VoxTranslate wird'],
  ['auf Pro oder Premium hochzuschalten', 'auf Premium hochzuschalten'],
  ['wechsle für dein nächstes Meeting zu Pro', 'wechsle für dein nächstes Meeting zu Premium'],
  [', <strong>Pro</strong> für kundenseitige Calls, in denen eine natürliche gesprochene Übersetzung zählt, und <strong>Premium</strong>', ', und <strong>Premium</strong>'],
  ['Standard, Enhanced, Pro oder Premium?', 'Standard, Enhanced oder Premium?'],
  ['vier Engine-Stufen', 'drei Engine-Stufen'],
  ['vier Übersetzungs-Engines', 'drei Übersetzungs-Engines'],
  // ---- FR
  ['Pro et Premium prononcent une traduction AI naturelle.', 'Premium prononce une traduction AI naturelle.'],
  ['Standard pour les syncs informels, Pro ou Premium quand vous voulez', 'Standard pour les syncs informels, Premium quand vous voulez'],
  ['et, sur Pro et Premium, entendent aussi', 'et, sur Premium, entendent aussi'],
  ['Sur les offres Pro et Premium de VoxTranslate, le même texte', "Sur l'offre Premium de VoxTranslate, le même texte"],
  ['passer à Pro ou Premium pour les appels', 'passer à Premium pour les appels'],
  ['passez à Pro pour votre prochaine réunion', 'passez à Premium pour votre prochaine réunion'],
  [', <strong>Pro</strong> pour les appels client où une traduction parlée naturelle compte, et <strong>Premium</strong>', ', et <strong>Premium</strong>'],
  ['Standard, Enhanced, Pro ou Premium ?', 'Standard, Enhanced ou Premium ?'],
  ['quatre niveaux de moteur', 'trois niveaux de moteur'],
  ['quatre moteurs de traduction', 'trois moteurs de traduction'],
];

    // Newlines are real inside stored HTML, but a record seeded from a JS string literal can
    // still carry the escaped form, so both are accepted.
    var NL = '(?:\\n|\\\\n)';
    var REGEX_RULES = [
      // Whole "<h3>Pro …</h3><p>…</p>" tier section (all 5 languages). Anchored on the em
      // dash so a heading that merely STARTS with "Pro" ("Programmalo, o parti subito")
      // survives untouched.
      new RegExp(NL + '{1,2}<h3>Pro(?: —[^<]*)?<\\/h3>' + NL + '<p>[\\s\\S]*?<\\/p>', 'g'),
      // Pro bullet inside an engine list.
      new RegExp('(?:' + NL + '\\s*)?<li><strong>Pro<\\/strong>[\\s\\S]*?<\\/li>', 'g'),
      // "Presenting to others? Pro." rule-of-thumb bullet.
      new RegExp('(?:' + NL + '\\s*)?<li><strong>[^<]*<\\/strong> Pro\\.<\\/li>', 'g'),
    ];

    // No "does it contain Pro" fast path: the tier-count rules ("four engine tiers")
    // fire on copy that never names the tier.
    function rewrite(text) {
      if (typeof text !== 'string') return text;
      var out = text;
      for (var i = 0; i < REGEX_RULES.length; i++) out = out.replace(REGEX_RULES[i], '');
      for (var j = 0; j < TEXT_RULES.length; j++) out = out.split(TEXT_RULES[j][0]).join(TEXT_RULES[j][1]);
      return out;
    }

    const records = dao.findRecordsByFilter('posts', 'id != ""', '', 0, 0);

    for (const rec of records) {
      let touched = false;

      for (const field of ['title', 'excerpt', 'content']) {
        const before = rec.getString(field);
        const after = rewrite(before);
        if (after !== before) {
          rec.set(field, after);
          touched = true;
        }
      }

      // i18n is a json blob of { locale: { title, excerpt, content } }. Read it through
      // getString(): a json field comes back from get() as types.JsonRaw, which the JS VM
      // exposes as a BYTE ARRAY — round-tripping that through JSON.stringify yields
      // [123,34,...] and every rewrite below silently no-ops.
      const rawI18n = rec.getString('i18n');
      if (rawI18n && rawI18n.charAt(0) === '{') {
        const i18n = JSON.parse(rawI18n);
        let i18nTouched = false;
        for (const locale of Object.keys(i18n)) {
          const tr = i18n[locale];
          if (!tr) continue;
          for (const field of ['title', 'excerpt', 'content']) {
            const after = rewrite(tr[field]);
            if (after !== tr[field]) {
              tr[field] = after;
              i18nTouched = true;
            }
          }
        }
        if (i18nTouched) {
          rec.set('i18n', i18n);
          touched = true;
        }
      }

      if (touched) dao.saveRecord(rec);
    }
  },
  (db) => {
    // Irreversible by design: the Pro copy is withdrawn, not archived. Restoring it means
    // re-running the seed migrations against a clean database.
  },
);
