/* ---------- ParfAI note families: used by Browse by note. Needs catalog-lib.js and data.js loaded first. ---------- */
(function () {
  // ---------- Note families ----------
  // Sorts every note in the catalogue into one of 12 families: first the hand-checked list in data.js, then word rules.
  var FAMILIES = ['Citrus', 'Floral', 'Fruity', 'Green & Aromatic', 'Spicy', 'Woody', 'Amber & Resin', 'Gourmand & Sweet', 'Musk & Animalic', 'Leather & Tobacco', 'Marine & Mineral', 'Earthy'];
  var FAM_RULES = [
    ['Leather & Tobacco', /leather|suede|tobacco|cigar|smok|\btar\b|castoreum/],
    ['Musk & Animalic', /musk|civet|animal|powder|ambrette|hyrax|skin\b|cashmere musk/],
    ['Marine & Mineral', /\b(sea|marine|ocean|salt|salty|seaweed|algae|aquatic|mineral|ozone|rain|ice|icy|flint|metal|metallic|watery|water notes|sea water|fresh water|aquozone|ozonic|calone|iodine|driftwood|wet stone|stone)\b/],
    ['Gourmand & Sweet', /coumarin|vanill|tonka|caramel|chocolate|cacao|cocoa|coffee|espresso|praline|\bhoney\b|sugar|candy|cream|milk|marshmallow|almond|hazelnut|walnut|peanut|pecan|coconut|rum\b|cognac|whisk|bourbon|brandy|wine|champagne|liqueur|cake|cookie|biscuit|waffle|toffee|butter|sweet|gourmand|marzipan|licorice|liquorice|pistachio|macaron|syrup|nougat|meringue|custard|dessert|maple|molasses|cotton candy|pastry|cereal|oat|rice|sake/],
    ['Floral', /blossom|flower|floral|bloom|petal|bouquet|\brose\b|roses|rose (oil|absolute|petals?)|jasmin|lily|lilac|iris|orris|violet|peon|tuberose|gardenia|magnolia|neroli|ylang|orchid|freesia|lotus|mimosa|geranium|carnation|narcissus|hyacinth|heliotrope|osmanthus|champaca|frangipani|plumeria|muguet|valley|daisy|tiare|cyclamen|poppy|camellia|honeysuckle|wisteria|hibiscus|marigold|jonquil|lavandin|ranunculus|anemone|buttercup|primrose|tulip|sakura|lotus|tagetes|boronia|linden|lime tree|acacia|mock orange|syringa|zinnia|dahlia|sweet pea|clematis|hawthorn|gillyflower|bellflower|pelargonium|jacaranda|stephanotis|jasmine/],
    ['Citrus', /bergamot|petit ?grain|cedrat|lemon|\blimes?\b|orange|mandarin|tangerine|grapefruit|citrus|citron|yuzu|petitgrain|pomelo|kumquat|clementine|bigarade|satsuma|bitter orange|calamansi|sudachi|bergamote/],
    ['Spicy', /spic|pepper|cinnamon|cardamom|cardamon|clove|nutmeg|ginger|saffron|cumin|spice|coriander|curry|paprika|anise|allspice|pimento|turmeric|chili|chilli|fennel|caraway|\bmace\b|cassia|horseradish|wasabi|mustard|pimenta|tellicherry|szechuan|sichuan/],
    ['Fruity', /apple|pear\b|peach|plum|cherry|cherries|berry|berries|currant|cassis|apricot|fruit|melon|pineapple|mango|banana|papaya|passion|lychee|litchi|guava|pomegranate|grape\b|grapes|nectarine|quince|rhubarb|tropical|kiwi|jam\b|persimmon|mirabelle|tamarind|coconut water|orchard|mulberry|dragon|date\b|dates\b|prune|raisin|fig\b|figs\b|jackfruit|loquat|physalis|ume\b|yumberry|lingonberry/],
    ['Amber & Resin', /ambrofix|oriental|amber|resin|labdanum|benzoin|incense|myrrh|frankincense|olibanum|elemi|copal|balsam|opoponax|styrax|ambroxan|ambrox|ambergris|\bgum\b|mastic|tolu|peru\b|cistus|sap\b|ladanum|dragon'?s blood|beeswax|wax\b|encens/],
    ['Earthy', /\bsand\b|moss|patchouli|earth|truffle|mushroom|soil|dust|clay|\bhay\b|chestnut|papyrus|forest|petrichor|mud\b|ground|peat|cork|root\b|roots|tuber|beetroot|carrot|potato|humus|undergrowth|damp|lichen|compost|vetyver root/],
    ['Woody', /wood|cypriol|amyris|iso e super|cedar|sandal|santal|oud|agar|vetiver|pine\b|cypress|\boak\b|birch|teak|ebony|mahogany|guaiac|gaiac|balsa|\btree\b|bark|cashmeran|palo santo|\bfir\b|spruce|hinoki|sequoia|walnut|bamboo|juniper wood|rosewood|timber|sawdust|pencil|cade\b|hemlock|larch|araucaria|ironwood|hickory|maple wood|cashmere/],
    ['Green & Aromatic', /green|davana|\bmate\b|immortelle|\bgin\b|aromatic|leaf|leaves|grass|herb|mint|sage|basil|thyme|rosemary|lavender|tea\b|fern\b|tarragon|artemisia|wormwood|absinthe|lemongrass|eucalyptus|juniper|galbanum|cucumber|celery|parsley|aldehyd|tomato|\bivy\b|clover|dill\b|oregano|marjoram|cannabis|hemp|tobacco leaf|angelica|rue\b|hyssop|shiso|chamomile|camomile|savory|savoury|lovage|sorrel|bay\b|laurel|myrtle|nettle|watercress|spearmint|peppermint|menthol|lentisque|verbena|matcha|bamboo|pine needle|rhubarb leaf|stem|sprout|vegetal|salad|spinach|aloe|cactus|succulent|yarrow|fenugreek|lemon balm|melissa|hay|botanical/]
  ];
  var famMap = null;
  function family(note) {
    if (!famMap) {
      famMap = {};
      if (typeof NOTE_CATEGORY_MAP !== 'undefined') Object.keys(NOTE_CATEGORY_MAP).forEach(function (k) { if (NOTE_CATEGORY_MAP[k] !== 'Other') famMap[k.toLowerCase()] = NOTE_CATEGORY_MAP[k]; });
    }
    if (famMap[note]) return famMap[note];
    for (var i = 0; i < FAM_RULES.length; i++) if (FAM_RULES[i][1].test(note)) return FAM_RULES[i][0];
    return '';
  }
  // Counts how many perfumes carry each note and groups the notes by family, biggest first.
  function noteFamilies(rows) {
    var count = {}, fams = {};
    rows.forEach(function (r) { if (r.ok) { var seen = {}; r.notes.forEach(function (n) { if (!seen[n]) { seen[n] = 1; count[n] = (count[n] || 0) + 1; } }); } });
    FAMILIES.forEach(function (f) { fams[f] = { name: f, notes: [], perfumes: 0 }; });
    var other = [];
    Object.keys(count).forEach(function (n) { var f = family(n); if (f) fams[f].notes.push([n, count[n]]); else other.push([n, count[n]]); });
    var list = FAMILIES.map(function (f) { var o = fams[f]; o.notes.sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); }); return o; });
    return { families: list, count: count, other: other, total: Object.keys(count).length };
  }
  window.PFC = window.PFC || {};
  window.PFC.noteFamilies = noteFamilies; window.PFC.family = family; window.PFC.FAMILIES = FAMILIES;
})();
