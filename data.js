/* ==========================================================================
   ParfAI — shared dataset + page chrome (nav/footer/logo)
   Every page includes this after parfai.css. It injects the nav and footer
   into #nav-slot / #footer-slot, and exposes PERFUMES / HOUSES / helpers
   on window for page-specific scripts to use.
   ========================================================================== */

const HOUSES = [
  { id:'creed', name:'Creed', tier:'Niche', blurb:'French-founded royal perfumery, now best known for Aventus.' },
  { id:'dior', name:'Dior', tier:'Designer', blurb:'French luxury house; Sauvage is the best-selling men\'s fragrance worldwide.' },
  { id:'chanel', name:'Chanel', tier:'Designer', blurb:'The house that invented the modern abstract fragrance with No. 5.' },
  { id:'tomford', name:'Tom Ford', tier:'Niche', blurb:'Bold, opulent, unapologetically maximalist compositions.' },
  { id:'ysl', name:'Yves Saint Laurent', tier:'Designer', blurb:'Fashion-forward French house with strong, modern signatures.' },
  { id:'versace', name:'Versace', tier:'Designer', blurb:'Italian glamour — bright, loud, and instantly recognizable.' },
  { id:'mfk', name:'Maison Francis Kurkdjian', tier:'Niche', blurb:'Precision perfumery from one of the industry\'s most in-demand noses.' },
  { id:'pdm', name:'Parfums de Marly', tier:'Niche', blurb:'French equestrian-inspired house blending classic and modern.' },
  { id:'xerjoff', name:'Xerjoff', tier:'Niche', blurb:'Italian maximalist niche house known for rich, rare materials.' },
  { id:'armaf', name:'Armaf', tier:'Affordable', blurb:'UAE-based house known for well-made, budget-friendly alternatives.' },
  { id:'lattafa', name:'Lattafa', tier:'Affordable', blurb:'Dubai perfume house, hugely popular for long-lasting, low-cost scents.' },
  { id:'zara', name:'Zara', tier:'Affordable', blurb:'Fashion retailer\'s in-house fragrance line — cheap, cheerful, surprisingly good.' },
  { id:"lelabo", name:"Le Labo", tier:"Niche", blurb:"New York-born niche house famous for freshly hand-blended fragrances, led by Santal 33." },
  { id:"jomalone", name:"Jo Malone London", tier:"Designer", blurb:"British house known for elegant colognes and inventive scent-layering." },
  { id:"margiela", name:"Maison Margiela", tier:"Designer", blurb:"Avant-garde fashion house whose Replica line bottles specific memories and places." },
  { id:"lancome", name:"Lancôme", tier:"Designer", blurb:"French beauty house behind La Vie Est Belle, one of the best-selling women's fragrances ever." },
  { id:"hermes", name:"Hermès", tier:"Designer", blurb:"French luxury house; Jean-Claude Ellena's era defined a whole generation of minimalist perfumery." },
  { id:"viktorrolf", name:"Viktor&Rolf", tier:"Designer", blurb:"Dutch fashion duo known for bold bottle design and maximalist florals like Flowerbomb." },
  { id:"byredo", name:"Byredo", tier:"Niche", blurb:"Stockholm-founded niche house built on minimalist bottles and evocative, story-driven scents." },
  { id:"dg", name:"Dolce & Gabbana", tier:"Designer", blurb:"Italian fashion house whose Light Blue became a Mediterranean-summer signature scent." },
  { id:"carolinaherrera", name:"Carolina Herrera", tier:"Designer", blurb:"Venezuelan-American fashion house behind the coffee-tuberose hit Good Girl." },
  { id:"amouage", name:"Amouage", tier:"Niche", blurb:"Omani luxury house making some of the most opulent, maximalist fragrances in the world." },
  { id:"acquadiparma", name:"Acqua di Parma", tier:"Niche", blurb:"Italian house making refined colognes since 1916, led by the original Colonia." },
  { id:"guerlain", name:"Guerlain", tier:"Designer", blurb:"One of perfumery's oldest houses; Shalimar essentially invented the oriental fragrance family." },
  { id:"diptyque", name:"Diptyque", tier:"Niche", blurb:"Parisian candle-and-fragrance house known for poetic, single-note-driven compositions." },
  { id:"narcisorodriguez", name:"Narciso Rodriguez", tier:"Designer", blurb:"American-Cuban designer whose musky signatures redefined modern minimalist perfumery." },
  { id:"armani", name:"Giorgio Armani", tier:"Designer", blurb:"Italian fashion house; Acqua di Giò remains one of the best-selling men's fragrances ever made." },
  { id:"pacorabanne", name:"Paco Rabanne", tier:"Designer", blurb:"French house known for loud, maximalist, hugely popular mainstream bestsellers." },
  { id:"jpg", name:"Jean Paul Gaultier", tier:"Designer", blurb:"French couturier famous for the torso-shaped Le Male and Classique bottles." },
  { id:"louisvuitton", name:"Louis Vuitton", tier:"Niche", blurb:"French luxury maison's in-house perfumery, led by master perfumer Jacques Cavallier." },
  { id:"arianagrande", name:"Ariana Grande", tier:"Designer", blurb:"Celebrity fragrance line known for sweet, gourmand-leaning scents like Cloud." },
  { id:"bykilian", name:"By Kilian", tier:"Niche", blurb:"French luxury niche house known for refillable bottles and rich, boozy orientals." },
  { id:"alhambra", name:"Maison Alhambra", tier:"Affordable", blurb:"Dubai-based house making budget eau de parfums inspired by well-known designer scents." },
  { id:"dossier", name:"Dossier", tier:"Affordable", blurb:"US direct-to-consumer label making openly \"inspired by\" versions of designer fragrances." },
  { id:'prada', name:'Prada', tier:'Designer', blurb:'Italian fashion house whose scents mirror its runway - intellectual, a little uncanny, always elegant.' },
  { id:'bvlgari', name:'Bvlgari', tier:'Designer', blurb:'Roman jeweller-turned-perfumer known for polished, gem-inspired fragrances.' },
  { id:'valentino', name:'Valentino', tier:'Designer', blurb:'Italian couture house pairing old-world glamour with modern amber and musk.' },
  { id:'gucci', name:'Gucci', tier:'Designer', blurb:'Florentine fashion house whose fragrances swing between maximalist florals and moody woods.' },
  { id:'hugoboss', name:'Hugo Boss', tier:'Designer', blurb:'German menswear house behind some of the most recognizable mainstream men\'s colognes.' },
  { id:'davidoff', name:'Davidoff', tier:'Designer', blurb:'Swiss house whose Cool Water helped invent the modern aquatic fragrance in the late \'80s.' },
  { id:'azzaro', name:'Azzaro', tier:'Designer', blurb:'French house known for sharp, high-energy men\'s fragrances built for longevity.' },
  { id:'montblanc', name:'Montblanc', tier:'Designer', blurb:'German luxury-goods maker offering dependable, well-priced men\'s staples.' },
  { id:'isseymiyake', name:'Issey Miyake', tier:'Designer', blurb:'Japanese fashion house that brought minimalist, water-clear compositions to mainstream perfumery.' },
  { id:'mugler', name:'Mugler', tier:'Designer', blurb:'French house behind two genre-defining scents - Angel-style gourmands and Alien\'s modern amber.' },
  { id:'calvinklein', name:'Calvin Klein', tier:'Designer', blurb:'American fashion house that pioneered the unisex fragrance with CK One.' },
  { id:'burberry', name:'Burberry', tier:'Designer', blurb:'British heritage house making classic English-garden and rain-fresh fragrances.' },
  { id:'nishane', name:'Nishane', tier:'Niche', blurb:'Istanbul-based niche house blending Turkish craft with maximalist, long-lasting compositions.' },
  { id:'initio', name:'Initio Parfums Privés', tier:'Niche', blurb:'French niche house built on "molecular" positioning and intensely potent orientals.' },
  { id:'montale', name:'Montale', tier:'Niche', blurb:'Paris-based niche house famous for oud and rose worn at very high concentration.' },
  { id:'mancera', name:'Mancera', tier:'Niche', blurb:'French niche house founded by ex-Montale perfumers, known for sweet, potent orientals.' },
  { id:'rojaparfums', name:'Roja Parfums', tier:'Niche', blurb:'British ultra-luxury house from perfumer Roja Dove, prized for old-world richness and steep prices.' },
  { id:'kayali', name:'Kayali', tier:'Designer', blurb:'Huda Kattan\'s fragrance line built around a numbered concentration system on a few signature accords.' },
  { id:'ajmal', name:'Ajmal', tier:'Affordable', blurb:'UAE perfume house with over 70 years of Middle Eastern attar and oud-making heritage.' },
  { id:'rasasi', name:'Rasasi', tier:'Affordable', blurb:'Emirati perfume house known for rich, long-lasting scents at accessible prices.' },
];

/* A single curated, muted palette — terracotta, moss, slate, plum, ochre,
   dusty rose, umber, sage — shared by every family so the perfume cards
   read as one coordinated system with the rust/cream Atelier hero above
   them, instead of the old saturated rainbow. */
const FAM_COLOR = {
  Oriental:['#A8613E','#7A4028'], Chypre:['#6B7A4F','#47522F'], Gourmand:['#8B5169','#5C3348'],
  Fresh:['#5E7A93','#3D5266'], Floral:['#C08379','#8A564E'], Aromatic:['#7C9683','#526B58'],
  Amber:['#C6963C','#8F6A24'], Woody:['#6B4B3A','#402B20'],
};

const PERFUMES = [
  { id:'aventus', name:'Aventus', houseId:'creed', family:'Chypre', gender:'Men', year:2010, perfumer:'Olivier Creed & Erwin Creed', concentration:'EDP', price:395, rating:4.6, reviews:3120, tier:'Niche',
    notes:{top:['Pineapple','Bergamot','Black Currant','Apple'],heart:['Birch','Patchouli','Moroccan Jasmine','Rose'],base:['Musk','Oak Moss','Ambergris','Vanilla']},
    accords:['Fruity','Smoky','Woody','Fresh'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'The modern icon that launched a thousand dupes. A sparkling pineapple-and-birch opening settles into a smoky, dry-down that reads confident and expensive from across the room.',
    dupeIds:['clubdenuit','armaf-derby'],
    image:"https://cdn.fragella.com/images/creed-aventus.jpg" },
  { id:'baccarat-rouge', name:'Baccarat Rouge 540', houseId:'mfk', family:'Amber', gender:'Unisex', year:2015, perfumer:'Francis Kurkdjian', concentration:'EDP', price:325, rating:4.5, reviews:2840, tier:'Niche',
    notes:{top:['Saffron','Jasmine'],heart:['Amberwood','Ambergris'],base:['Fir Resin','Cedar','Musk']},
    accords:['Amber','Sweet','Woody','Floral'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Ethereal, addictive, and instantly identifiable. A little goes an enormous way — two sprays and strangers will ask what you\'re wearing.',
    dupeIds:['zara-red-vanilla','lattafa-ameer'],
    image:"images/perfumes/baccarat-rouge.png" },
  { id:'sauvage', name:'Sauvage', houseId:'dior', family:'Aromatic', gender:'Men', year:2015, perfumer:'François Demachy', concentration:'EDT', price:105, rating:4.4, reviews:9840, tier:'Designer',
    notes:{top:['Calabrian Bergamot','Pepper'],heart:['Sichuan Pepper','Lavender','Pink Pepper','Geranium'],base:['Ambroxan','Cedar','Labdanum']},
    accords:['Fresh Spicy','Aromatic','Ambery'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'The best-selling men\'s fragrance on the planet for a reason: fresh, loud, and safe for almost any occasion. Bergamot and pepper up top, warm ambroxan underneath.',
    dupeIds:['armaf-club-sauvage'],
    image:"images/perfumes/sauvage.png" },
  { id:'bleu-chanel', name:'Bleu de Chanel', houseId:'chanel', family:'Woody', gender:'Men', year:2010, perfumer:'Jacques Polge', concentration:'EDP', price:135, rating:4.5, reviews:6210, tier:'Designer',
    notes:{top:['Grapefruit','Lemon','Mint'],heart:['Ginger','Nutmeg','Jasmine'],base:['Incense','Vetiver','Cedar','Sandalwood']},
    accords:['Woody Aromatic','Fresh','Citrus'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A clean, versatile citrus-woody signature that reads corporate-boardroom in the morning and date-night by evening. Universally flattering.',
    dupeIds:[],
    image:"images/perfumes/bleu-chanel.png" },
  { id:'oud-wood', name:'Oud Wood', houseId:'tomford', family:'Woody', gender:'Unisex', year:2007, perfumer:'Richard Herpin', concentration:'EDP', price:340, rating:4.6, reviews:1870, tier:'Niche',
    notes:{top:['Oud','Rosewood','Cardamom'],heart:['Sandalwood','Vetiver'],base:['Tonka Bean','Vanilla','Amber']},
    accords:['Woody','Smoky','Warm Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A smooth, restrained take on oud — smoky and exotic without the barnyard funk some oud fragrances lean into. Unisex, expensive-smelling, quietly confident.',
    dupeIds:['zara-vibrant-oud'],
    image:"images/perfumes/oud-wood.png" },
  { id:'black-opium', name:'Black Opium', houseId:'ysl', family:'Gourmand', gender:'Women', year:2014, perfumer:'Nathalie Lorson', concentration:'EDP', price:120, rating:4.4, reviews:5430, tier:'Designer',
    notes:{top:['Pink Pepper','Orange Blossom','Pear'],heart:['Coffee','Jasmine','Bitter Almond'],base:['Vanilla','Patchouli','Cedar']},
    accords:['Sweet','Warm Spicy','Vanilla'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A cozy coffee-and-vanilla gourmand that feels made for cold-weather nights out. Sweet without tipping into cloying, thanks to the bitter-coffee heart.',
    dupeIds:['alhambra-opera-noir'],
    image:"images/perfumes/black-opium.png" },
  { id:'coco-mademoiselle', name:'Coco Mademoiselle', houseId:'chanel', family:'Chypre', gender:'Women', year:2001, perfumer:'Jacques Polge', concentration:'EDP', price:145, rating:4.5, reviews:7120, tier:'Designer',
    notes:{top:['Orange','Bergamot'],heart:['Jasmine','Rose','Litchi'],base:['Patchouli','Vetiver','White Musk']},
    accords:['Chypre','Floral','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A modern chypre that pairs bright citrus with a warm patchouli base — sophisticated, office-appropriate, ages beautifully on skin.',
    dupeIds:['armaf-la-rosa'],
    image:"https://upload.wikimedia.org/wikipedia/commons/e/ef/Coco_mademoiselle.jpg" },
  { id:'delina', name:'Delina', houseId:'pdm', family:'Floral', gender:'Women', year:2017, perfumer:'Quentin Bisch', concentration:'EDP', price:250, rating:4.5, reviews:1420, tier:'Niche',
    notes:{top:['Rhubarb','Lychee','Bergamot'],heart:['Turkish Rose','Peony','Muguet'],base:['Musk','Vanilla','Cashmere Wood']},
    accords:['Floral','Fruity','Musky'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A pink, powdery rose that manages to feel both classic and undeniably modern. One of the most complimented niche florals of the last decade.',
    dupeIds:['lattafa-yara'],
    image:"images/perfumes/delina.png" },
  { id:'layton', name:'Layton', houseId:'pdm', family:'Amber', gender:'Men', year:2016, perfumer:'Hamid Merati-Kashani', concentration:'EDP', price:250, rating:4.5, reviews:1680, tier:'Niche',
    notes:{top:['Apple','Bergamot','Lavender'],heart:['Geranium','Jasmine'],base:['Vanilla','Cardamom','Sandalwood']},
    accords:['Amber','Fresh Spicy','Sweet'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Apple and vanilla over a spicy amber base — sweet, huge projection, and one of the most talked-about "smells expensive" scents in the niche world.',
    dupeIds:['armaf-derby'],
    image:"images/perfumes/layton.png" },
  { id:'erba-pura', name:'Erba Pura', houseId:'xerjoff', family:'Fresh', gender:'Unisex', year:2016, perfumer:'Chris Maurice', concentration:'EDP', price:295, rating:4.4, reviews:960, tier:'Niche',
    notes:{top:['Sicilian Lemon','Red Berries','Bergamot'],heart:['Apricot','Peach'],base:['Musk','Amber']},
    accords:['Fresh','Fruity','Sweet'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A sun-drenched citrus-fruit bomb that smells like an Italian summer. Instantly likeable, crowd-pleasing, easy to wear.',
    dupeIds:[],
    image:"images/perfumes/erba-pura.png" },
  { id:'green-irish-tweed', name:'Green Irish Tweed', houseId:'creed', family:'Fresh', gender:'Men', year:1985, perfumer:'Pierre Bourdon', concentration:'EDP', price:395, rating:4.6, reviews:1340, tier:'Niche',
    notes:{top:['Lemon Verbena','Iris'],heart:['Violet Leaf','Sandalwood'],base:['Ambergris','Musk']},
    accords:['Fresh','Green','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A clean, green classic — the fragrance most often cited as "smells like a shower, but expensive." Understated and timeless.',
    dupeIds:[],
    image:"images/perfumes/green-irish-tweed.png" },
  { id:'eros', name:'Eros', houseId:'versace', family:'Aromatic', gender:'Men', year:2012, perfumer:'Aurelien Guichard', concentration:'EDT', price:95, rating:4.3, reviews:4210, tier:'Designer',
    notes:{top:['Mint','Green Apple','Lemon'],heart:['Tonka Bean','Ambroxan','Geranium'],base:['Vanilla','Vetiver','Oakmoss']},
    accords:['Sweet','Aromatic','Fresh'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Loud, sweet, mint-and-vanilla — a club-and-date-night staple that punches well above its price point on projection.',
    dupeIds:[],
    image:"images/perfumes/eros.png" },
  { id:'clubdenuit', name:'Club de Nuit Intense Man', houseId:'armaf', family:'Chypre', gender:'Men', year:2014, perfumer:undefined, concentration:'EDT', price:35, rating:4.3, reviews:18400, tier:'Affordable',
    notes:{top:['Pineapple','Blackcurrant','Apple'],heart:['Birch','Jasmine'],base:['Musk','Ambergris']},
    accords:['Fruity','Smoky','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'The most talked-about Aventus alternative in the fragrance community. Same pineapple-and-smoke skeleton at a fraction of the price.',
    dupeOf:'aventus',
    image:"images/perfumes/clubdenuit.png" },
  { id:'armaf-derby', name:'Derby', houseId:'armaf', family:'Amber', gender:'Men', year:2020, perfumer:undefined, concentration:'EDP', price:32, rating:4.1, reviews:3960, tier:'Affordable',
    notes:{top:['Apple','Bergamot'],heart:['Geranium','Cardamom'],base:['Vanilla','Sandalwood']},
    accords:['Amber','Sweet','Fresh Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Budget-friendly take on the sweet-apple-and-amber Layton style of fragrance, at roughly a tenth of the price.',
    dupeOf:'layton',
    image:"images/perfumes/armaf-derby.png" },
  { id:'armaf-club-sauvage', name:'Club de Nuit Man', houseId:'armaf', family:'Aromatic', gender:'Men', year:2016, perfumer:undefined, concentration:'EDT', price:29, rating:4.0, reviews:5120, tier:'Affordable',
    notes:{top:['Bergamot','Lemon'],heart:['Pepper','Lavender'],base:['Ambroxan','Musk']},
    accords:['Fresh Spicy','Aromatic'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A fresh, peppery citrus-ambroxan blend in the same general lane as Sauvage, priced for everyday wear.',
    dupeOf:'sauvage',
    image:"images/perfumes/armaf-club-sauvage.png" },
  { id:'zara-red-vanilla', name:'Red Vanilla', houseId:'zara', family:'Amber', gender:'Women', year:2021, perfumer:undefined, concentration:'EDP', price:26, rating:4.0, reviews:2760, tier:'Affordable',
    notes:{top:['Saffron'],heart:['Jasmine','Amberwood'],base:['Musk','Vanilla']},
    accords:['Amber','Sweet','Floral'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'Zara\'s widely-shared take on the saffron-amberwood profile that made Baccarat Rouge 540 famous. Noticeably softer, but the family resemblance is unmistakable.',
    dupeOf:'baccarat-rouge',
    image:"images/perfumes/zara-red-vanilla.png" },
  { id:'zara-vibrant-oud', name:'Vibrant Leather', houseId:'zara', family:'Woody', gender:'Unisex', year:2020, perfumer:undefined, concentration:'EDT', price:26, rating:3.9, reviews:1980, tier:'Affordable',
    notes:{top:['Rosewood','Cardamom'],heart:['Sandalwood'],base:['Vanilla','Amber']},
    accords:['Woody','Warm Spicy'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'A gentler, budget-friendly nod to smooth-oud niche fragrances — good for a first taste of the genre before committing to the full-price original.',
    dupeOf:'oud-wood',
    image:"images/perfumes/zara-vibrant-oud.png" },
  { id:'lattafa-yara', name:'Yara', houseId:'lattafa', family:'Floral', gender:'Women', year:2021, perfumer:undefined, concentration:'EDP', price:24, rating:4.4, reviews:9870, tier:'Affordable',
    notes:{top:['Orange Blossom','Pear'],heart:['Sambac Jasmine','Vanilla'],base:['Musk','Sandalwood']},
    accords:['Sweet','Floral','Vanilla'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'One of the breakout affordable fragrances of the last few years — huge sweet-floral projection at a price that makes it an easy first bottle.',
    dupeOf:'delina',
    image:"images/perfumes/lattafa-yara.png" },
  { id:'lattafa-ameer', name:'Ameer Al Oudh', houseId:'lattafa', family:'Amber', gender:'Unisex', year:2019, perfumer:undefined, concentration:'EDP', price:28, rating:4.1, reviews:4340, tier:'Affordable',
    notes:{top:['Saffron','Oud'],heart:['Rose'],base:['Amber','Musk']},
    accords:['Amber','Woody','Sweet'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A warm, saffron-forward amber in the same neighborhood as Baccarat Rouge, with more oud presence and a lower price of entry.',
    dupeOf:'baccarat-rouge',
    image:"images/perfumes/lattafa-ameer.png" },
  { id:'armaf-la-rosa', name:'La Rosa Pour Femme', houseId:'armaf', family:'Floral', gender:'Women', year:2016, perfumer:undefined, concentration:'EDP', price:28, rating:4.0, reviews:2140, tier:'Affordable',
    notes:{top:['Black Currant','Pear','Pink Pepper','Bergamot'],heart:['Jasmine','Orange Blossom','Mimosa','Tuberose'],base:['Praline','Patchouli','Tonka Bean']},
    accords:['Floral','Sweet','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A rose-and-patchouli floral built in the same lane as Coco Mademoiselle, with a sweeter praline-tonka base standing in for the original\'s dry chypre finish.',
    dupeOf:'coco-mademoiselle',
    image:"images/perfumes/armaf-la-rosa.png" },
  { id:'alhambra-opera-noir', name:'Opera Noir', houseId:'alhambra', family:'Gourmand', gender:'Women', year:2022, perfumer:undefined, concentration:'EDP', price:29, rating:4.1, reviews:1860, tier:'Affordable',
    notes:{top:['Pear','Mandarin'],heart:['Vanilla','Orange Blossom','White Flowers'],base:['Coffee','Cedarwood','White Musk','Patchouli']},
    accords:['Sweet','Vanilla','Warm Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A coffee-and-vanilla gourmand built explicitly as a Black Opium alternative — same pear-and-orange-blossom opening over a sweet, dark coffee base.',
    dupeOf:'black-opium',
    image:"images/perfumes/alhambra-opera-noir.png" },
  { id:'dossier-powdery-tobacco', name:'Powdery Tobacco', houseId:'dossier', family:'Oriental', gender:'Unisex', year:2024, perfumer:undefined, concentration:'EDP', price:35, rating:4.2, reviews:2510, tier:'Affordable',
    notes:{top:['Tobacco','Ginger','Apricot'],heart:['Honey','Vanilla','Cocoa'],base:['Tonka Bean','Dried Fruits','Blond Woods']},
    accords:['Tobacco','Vanilla','Warm Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Dossier\'s openly-labeled take on Tobacco Vanille — same tobacco-and-honeyed-vanilla core as the Tom Ford original, in a plainer bottle at a fraction of the price.',
    dupeOf:'tobacco-vanille',
    image:"images/perfumes/dossier-powdery-tobacco.png" },

  /* ---- expanded catalog: legitimately-sourced (hand-curated facts, no scraped data/images) ---- */
  { id:"no-5", name:"No. 5", houseId:"chanel", family:"Floral", gender:"Women", year:1921, perfumer:"Ernest Beaux", concentration:"EDP", price:165, rating:4.5, reviews:15420, tier:"Designer",
    image:"https://upload.wikimedia.org/wikipedia/commons/8/85/CHANEL_No5_parfum.jpg",
    notes:{top:["Aldehydes", "Neroli", "Ylang-Ylang"],heart:["Rose", "Jasmine", "Lily of the Valley"],base:["Sandalwood", "Vetiver", "Musk", "Amber"]},
    accords:["Aldehydic", "Floral", "Powdery"],
    longevity:"Long lasting (7-12h)", sillage:"Moderate",
    description:"The original abstract floral and still the most famous perfume on Earth. Powdery, soapy-clean aldehydes over a rich rose-jasmine heart — a cultural landmark as much as a scent.",
    dupeIds:[] },
  { id:"black-orchid", name:"Black Orchid", houseId:"tomford", family:"Oriental", gender:"Unisex", year:2006, perfumer:"David Apel", concentration:"EDP", price:150, rating:4.3, reviews:8750, tier:"Niche",
    notes:{top:["Black Truffle", "Ylang-Ylang", "Bergamot"],heart:["Black Orchid", "Lotus Wood", "Fruit"],base:["Patchouli", "Vanilla", "Sandalwood", "Incense"]},
    accords:["Oriental", "Floral", "Woody"],
    longevity:"Very long lasting (12h+)", sillage:"Strong",
    description:"Dark, syrupy, and unapologetically maximalist. Black truffle and fruit swirl over a heavy patchouli-incense base — a room-filling signature for evening wear.",
    dupeIds:[],
    image:"images/perfumes/black-orchid.png" },
  { id:"peony-blush-suede", name:"Peony & Blush Suede", houseId:"jomalone", family:"Floral", gender:"Women", year:2013, perfumer:"Christine Nagel", concentration:"Cologne", price:115, rating:4.5, reviews:11200, tier:"Designer",
    notes:{top:["Red Apple", "Red Currant"],heart:["Peony", "Jasmine", "Gillyflower"],base:["Suede"]},
    accords:["Floral", "Fruity", "Musky"],
    longevity:"Moderate (4-7h)", sillage:"Soft",
    description:"Peonies in full bloom, warmed by a soft suede base. Feminine and refined without ever tipping into sugary — a favorite for effortless everyday wear.",
    dupeIds:[],
    image:"images/perfumes/peony-blush-suede.png" },
  { id:"jazz-club", name:"Jazz Club", houseId:"margiela", family:"Aromatic", gender:"Men", year:2013, perfumer:"Alienor Massenet", concentration:"EDT", price:108, rating:4.4, reviews:9870, tier:"Designer",
    notes:{top:["Pink Pepper", "Lemon", "Neroli"],heart:["Clary Sage", "Jasmine", "Mastic"],base:["Rum", "Tobacco", "Vetiver", "Vanilla"]},
    accords:["Aromatic", "Tobacco", "Sweet"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"The hazy warmth of a late-night jazz bar — rum, tobacco leaf, and vetiver make this one of the coziest, most-loved scents in the Replica line.",
    dupeIds:[],
    image:"images/perfumes/jazz-club.png" },
  { id:"la-vie-est-belle", name:"La Vie Est Belle", houseId:"lancome", family:"Oriental", gender:"Women", year:2012, perfumer:"Dominique Ropion, Anne Flipo, Olivier Polge", concentration:"EDP", price:130, rating:4.3, reviews:18900, tier:"Designer",
    notes:{top:["Black Currant", "Pear", "Grapefruit"],heart:["Iris", "Jasmine", "Orange Blossom"],base:["Patchouli", "Praline", "Vanilla", "Sandalwood"]},
    accords:["Sweet", "Oriental", "Floral"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"An iris-patchouli-praline gourmand built around the idea of choosing happiness. Sweet, radiant, and one of the best-selling women's fragrances of the last decade.",
    dupeIds:[],
    image:"images/perfumes/la-vie-est-belle.png" },
  { id:"terre-dhermes", name:"Terre d'Hermès", houseId:"hermes", family:"Woody", gender:"Men", year:2006, perfumer:"Jean-Claude Ellena", concentration:"EDP", price:155, rating:4.5, reviews:14500, tier:"Designer",
    notes:{top:["Grapefruit", "Orange"],heart:["Pepper", "Geranium", "Pelargonium"],base:["Vetiver", "Patchouli", "Flint", "Cedar"]},
    accords:["Woody", "Fresh", "Earthy"],
    longevity:"Long lasting (7-12h)", sillage:"Moderate",
    description:"A dialogue between man and earth — mineral, vegetal, and underpinned by a striking orange note. Ellena's masterpiece of restraint and complexity.",
    dupeIds:[],
    image:"https://upload.wikimedia.org/wikipedia/commons/5/59/Terre_d%E2%80%99Herm%C3%A8s_%28cropped%29.JPG" },
  { id:"flowerbomb", name:"Flowerbomb", houseId:"viktorrolf", family:"Floral", gender:"Women", year:2005, perfumer:"Olivier Polge, Carlos Benaïm, Domitille Bertier", concentration:"EDP", price:128, rating:4.4, reviews:21000, tier:"Designer",
    notes:{top:["Tea", "Bergamot", "Grapefruit"],heart:["Freesia", "Jasmine", "Rose", "Orchid"],base:["Patchouli", "Vanilla", "Musk"]},
    accords:["Floral", "Sweet", "Musky"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"An explosion of white flowers on an addictive musky-patchouli base. The sweet modern floral that launched a thousand imitators — still unmatched at full strength.",
    dupeIds:[],
    image:"images/perfumes/flowerbomb.png" },
  { id:"gypsy-water", name:"Gypsy Water", houseId:"byredo", family:"Fresh", gender:"Unisex", year:2008, perfumer:"Jérôme Epinette", concentration:"EDP", price:210, rating:4.3, reviews:7200, tier:"Niche",
    notes:{top:["Bergamot", "Lemon", "Pepper"],heart:["Juniper Berries", "Incense", "Pine Needles", "Orris"],base:["Sandalwood", "Vanilla", "Amber", "Musk"]},
    accords:["Fresh", "Woody", "Oriental"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"Bohemian and road-worn — crisp bergamot and juniper open into incense and pine, settling into a warm sandalwood-vanilla base. A minimalist-niche favorite.",
    dupeIds:[],
    image:"images/perfumes/gypsy-water.png" },
  { id:"light-blue", name:"Light Blue", houseId:"dg", family:"Fresh", gender:"Women", year:2001, perfumer:"Olivier Cresp", concentration:"EDT", price:98, rating:4.2, reviews:23400, tier:"Designer",
    notes:{top:["Sicilian Cedar", "Apple", "Bellflower"],heart:["Bamboo", "Jasmine", "White Rose"],base:["Cedar", "Amber", "Musk"]},
    accords:["Fresh", "Citrus", "Floral"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"The scent of a Sicilian summer — sun-kissed citrus and apple over bamboo and jasmine. Effortless, sheer, and instantly recognizable poolside.",
    dupeIds:[],
    image:"images/perfumes/light-blue.png" },
  { id:"good-girl", name:"Good Girl", houseId:"carolinaherrera", family:"Oriental", gender:"Women", year:2016, perfumer:"Louise Turner", concentration:"EDP", price:132, rating:4.3, reviews:15800, tier:"Designer",
    notes:{top:["Almond", "Coffee", "Bergamot"],heart:["Tuberose", "Jasmine", "Lily"],base:["Tonka Bean", "Cacao", "Vetiver", "Sandalwood", "Musk"]},
    accords:["Sweet", "Floral", "Gourmand"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"Good on top, bad underneath — coffee and tuberose in a stiletto-shaped bottle. Luminous and dark at once, with serious sillage.",
    dupeIds:[],
    image:"images/perfumes/good-girl.png" },
  { id:"reflection-man", name:"Reflection Man", houseId:"amouage", family:"Aromatic", gender:"Men", year:2007, perfumer:"Lucas Sieuzac", concentration:"EDP", price:320, rating:4.4, reviews:4200, tier:"Niche",
    notes:{top:["Neroli", "Aldehydes", "Rosemary"],heart:["Narcissus", "Ylang-Ylang", "Jasmine", "Lily"],base:["Sandalwood", "Vetiver", "Musk"]},
    accords:["Floral", "Aromatic", "Powdery"],
    longevity:"Long lasting (7-12h)", sillage:"Moderate",
    description:"Refined, aldehydic, and quietly luxurious — an aromatic floral for men that trades loudness for old-world elegance.",
    dupeIds:[],
    image:"images/perfumes/reflection-man.png" },
  { id:"colonia", name:"Colonia", houseId:"acquadiparma", family:"Fresh", gender:"Unisex", year:1916, perfumer:undefined, concentration:"EDC", price:175, rating:4.4, reviews:9100, tier:"Niche",
    notes:{top:["Calabrian Bergamot", "Lemon", "Sweet Orange", "Grapefruit"],heart:["Lavender", "Rosemary", "Verbena", "Rose"],base:["Vetiver", "Sandalwood", "Patchouli", "Musk"]},
    accords:["Citrus", "Aromatic", "Woody"],
    longevity:"Light (2-4h)", sillage:"Soft",
    description:"The original Italian cologne, unchanged in spirit since 1916. Clean, sophisticated citrus-and-herb — timeless rather than trendy.",
    dupeIds:[],
    image:"images/perfumes/colonia.png" },
  { id:"shalimar", name:"Shalimar", houseId:"guerlain", family:"Oriental", gender:"Women", year:1925, perfumer:"Jacques Guerlain", concentration:"EDP", price:145, rating:4.3, reviews:7800, tier:"Designer",
    image:"https://upload.wikimedia.org/wikipedia/commons/b/b0/Perfume_Shalimar.jpg",
    notes:{top:["Citrus", "Bergamot"],heart:["Iris", "Rose", "Jasmine", "Incense"],base:["Vanilla", "Opoponax", "Sandalwood", "Civet"]},
    accords:["Oriental", "Vanilla", "Powdery"],
    longevity:"Long lasting (7-12h)", sillage:"Moderate",
    description:"The original oriental fragrance, created in 1925 as a tribute to eternal love. It effectively invented an entire perfume family that's still being copied a century later.",
    dupeIds:[] },
  { id:"philosykos", name:"Philosykos", houseId:"diptyque", family:"Fresh", gender:"Unisex", year:1996, perfumer:"Olivier Pécheux", concentration:"EDT", price:165, rating:4.4, reviews:6500, tier:"Niche",
    notes:{top:["Fig Leaf", "Fig Tree Wood"],heart:["Fig", "Dried Fruit"],base:["White Cedar", "Milk Accord"]},
    accords:["Green", "Fresh", "Woody"],
    longevity:"Moderate (4-7h)", sillage:"Soft",
    description:"An entire fig tree in a bottle — milky wood, green leaves, and round fruit. Cool, aromatic, and one of the most original niche scents of the '90s.",
    dupeIds:[],
    image:"images/perfumes/philosykos.png" },
  { id:"for-her", name:"For Her", houseId:"narcisorodriguez", family:"Floral", gender:"Women", year:2003, perfumer:"Carlos Benaïm, Christine Nagel", concentration:"EDP", price:118, rating:4.2, reviews:12700, tier:"Designer",
    notes:{top:["Rose", "Peach"],heart:["Rose", "Jasmine", "Muguet"],base:["Musk", "Sandalwood", "Vetiver"]},
    accords:["Musky", "Floral", "Woody"],
    longevity:"Moderate (4-7h)", sillage:"Soft",
    description:"A quiet, sensual musk that feels like a second skin. Understated and intimate rather than loud — one of the defining modern musks.",
    dupeIds:[],
    image:"images/perfumes/for-her.png" },
  { id:"santal-33", name:"Santal 33", houseId:"lelabo", family:"Woody", gender:"Unisex", year:2011, perfumer:"Frank Voelkl", concentration:"EDP", price:250, rating:4.3, reviews:18200, tier:"Niche",
    image:"https://upload.wikimedia.org/wikipedia/commons/8/86/Le_Labo_Santal_33_in_a_50_milliliter_bottle_%28cropped%29.jpg",
    notes:{top:["Cardamom", "Iris", "Violet"],heart:["Ambrox", "Papyrus"],base:["Cedarwood", "Sandalwood", "Leather", "Musk"]},
    accords:["Woody", "Leather", "Aromatic"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"Leather, cedar, and cardamom — the scent that came to smell like the American West, and then became a New York institution in its own right.",
    dupeIds:[] },
  { id:"tobacco-vanille", name:"Tobacco Vanille", houseId:"tomford", family:"Oriental", gender:"Unisex", year:2007, perfumer:undefined, concentration:"EDP", price:320, rating:4.5, reviews:6100, tier:"Niche",
    notes:{top:["Tobacco Leaf", "Spices"],heart:["Tonka Bean", "Tobacco Blossom", "Vanilla"],base:["Cocoa", "Dried Fruits", "Woody Notes"]},
    accords:["Tobacco", "Vanilla", "Warm Spicy"],
    longevity:"Very long lasting (12h+)", sillage:"Strong",
    description:"A rich tobacco-and-vanilla oriental that reads like a warm cigar lounge. One of the most beloved Private Blends — sweet, cozy, and enormous in projection.",
    dupeIds:['dossier-powdery-tobacco'],
    image:"images/perfumes/tobacco-vanille.png" },
  { id:"lost-cherry", name:"Lost Cherry", houseId:"tomford", family:"Oriental", gender:"Unisex", year:2018, perfumer:undefined, concentration:"EDP", price:340, rating:4.4, reviews:5300, tier:"Niche",
    notes:{top:["Black Cherry", "Cherry Liqueur", "Bitter Almond"],heart:["Turkish Rose", "Jasmine", "Plum"],base:["Tonka", "Vanilla", "Sandalwood"]},
    accords:["Sweet", "Almond", "Cherry"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"Boozy cherry liqueur over bitter almond and rose. Gourmand, seductive, and one of the most-hyped Tom Ford releases of the last decade.",
    dupeIds:[],
    image:"images/perfumes/lost-cherry.png" },
  { id:"acqua-di-gio", name:"Acqua di Gio", houseId:"armani", family:"Fresh", gender:"Men", year:1996, perfumer:undefined, concentration:"EDT", price:92, rating:4.3, reviews:19600, tier:"Designer",
    notes:{top:["Bergamot", "Neroli", "Green Tangerine"],heart:["Jasmine", "Rosemary", "Sea Notes"],base:["Patchouli", "Cedar", "Musk"]},
    accords:["Aquatic", "Citrus", "Fresh"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"The fragrance that defined the '90s aquatic trend and never really left. Clean, marine, and still one of the best-selling men's scents ever made.",
    dupeIds:[],
    image:"images/perfumes/acqua-di-gio.png" },
  { id:"y", name:"Y", houseId:"ysl", family:"Aromatic", gender:"Men", year:2018, perfumer:undefined, concentration:"EDP", price:112, rating:4.2, reviews:6800, tier:"Designer",
    notes:{top:["Apple", "Ginger", "Bergamot"],heart:["Sage", "Geranium", "Juniper"],base:["Amberwood", "Tonka", "Cedar", "Vetiver"]},
    accords:["Fresh", "Woody", "Aromatic"],
    longevity:"Long lasting (7-12h)", sillage:"Moderate",
    description:"A modern fresh-woody signature built around apple and ambergris — sharper and more contemporary than YSL's older masculines.",
    dupeIds:[],
    image:"images/perfumes/y.png" },
  { id:"dior-homme-intense", name:"Dior Homme Intense", houseId:"dior", family:"Woody", gender:"Men", year:2011, perfumer:undefined, concentration:"EDP", price:138, rating:4.4, reviews:7400, tier:"Designer",
    notes:{top:["Lavender"],heart:["Iris", "Ambrette", "Pear"],base:["Virginia Cedar", "Vetiver"]},
    accords:["Iris", "Powdery", "Woody"],
    longevity:"Long lasting (7-12h)", sillage:"Moderate",
    description:"A powdery iris-and-cedar reinterpretation of the men's floral — cult-favorite among fragrance enthusiasts for its unusual, elegant sobriety.",
    dupeIds:[],
    image:"images/perfumes/dior-homme-intense.png" },
  { id:"1-million", name:"1 Million", houseId:"pacorabanne", family:"Oriental", gender:"Men", year:2008, perfumer:undefined, concentration:"EDT", price:95, rating:4.2, reviews:17200, tier:"Designer",
    notes:{top:["Blood Mandarin", "Grapefruit", "Mint"],heart:["Rose", "Cinnamon", "Spices"],base:["Leather", "Amber", "Woody Notes"]},
    accords:["Spicy", "Leather", "Sweet"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"Loud, sweet, and instantly recognizable in a gold-bar bottle. One of the biggest mainstream masculine hits of the 2000s.",
    dupeIds:[],
    image:"images/perfumes/1-million.png" },
  { id:"invictus", name:"Invictus", houseId:"pacorabanne", family:"Fresh", gender:"Men", year:2013, perfumer:undefined, concentration:"EDT", price:88, rating:4.1, reviews:9300, tier:"Designer",
    notes:{top:["Grapefruit", "Marine Notes", "Mandarin"],heart:["Bay Leaf", "Jasmine"],base:["Guaiac Wood", "Oakmoss", "Amber", "Patchouli"]},
    accords:["Aquatic", "Woody", "Fresh"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"An aquatic-woody gym-bag staple — fresh grapefruit and marine notes over an amber base built for everyday wear.",
    dupeIds:[],
    image:"images/perfumes/invictus.png" },
  { id:"le-male", name:"Le Male", houseId:"jpg", family:"Aromatic", gender:"Men", year:1995, perfumer:undefined, concentration:"EDT", price:90, rating:4.3, reviews:11400, tier:"Designer",
    notes:{top:["Mint", "Lavender", "Bergamot"],heart:["Cinnamon", "Cumin", "Orange Blossom"],base:["Vanilla", "Tonka Bean", "Sandalwood"]},
    accords:["Aromatic", "Sweet", "Powdery"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"The torso-shaped bottle that became a '90s icon. Sweet vanilla-lavender over spicy cinnamon — still a benchmark 'barbershop fresh' scent.",
    dupeIds:[],
    image:"images/perfumes/le-male.png" },
  { id:"libre", name:"Libre", houseId:"ysl", family:"Floral", gender:"Women", year:2019, perfumer:undefined, concentration:"EDP", price:128, rating:4.3, reviews:9600, tier:"Designer",
    notes:{top:["Lavender", "Mandarin", "Blackcurrant"],heart:["Lavender", "Orange Blossom", "Jasmine"],base:["Madagascar Vanilla", "Musk", "Cedar", "Ambergris"]},
    accords:["Floral", "Lavender", "Sweet"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"Lavender pushed into floral territory — a couture-inspired clash of masculine lavender and sweet orange blossom, worn defiantly by anyone.",
    dupeIds:[],
    image:"images/perfumes/libre.png" },
  { id:"bright-crystal", name:"Bright Crystal", houseId:"versace", family:"Floral", gender:"Women", year:2006, perfumer:undefined, concentration:"EDT", price:82, rating:4.2, reviews:10500, tier:"Designer",
    notes:{top:["Pomegranate", "Yuzu", "Ice Notes"],heart:["Peony", "Magnolia", "Lotus"],base:["Musk", "Plant Amber", "Mahogany"]},
    accords:["Fruity", "Floral", "Fresh"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"A light, sparkling fruity-floral built for warm weather — pomegranate and peony over a soft musk base.",
    dupeIds:[],
    image:"images/perfumes/bright-crystal.png" },
  { id:"wood-sage-sea-salt", name:"Wood Sage & Sea Salt", houseId:"jomalone", family:"Fresh", gender:"Unisex", year:2014, perfumer:undefined, concentration:"EDC", price:108, rating:4.4, reviews:8900, tier:"Designer",
    notes:{top:["Ambrette Seeds"],heart:["Sea Salt", "Sage"],base:["Grapefruit", "Red Algae"]},
    accords:["Aromatic", "Marine", "Woody"],
    longevity:"Light (2-4h)", sillage:"Soft",
    description:"A minimalist ode to the English coastline — salt-washed sage over driftwood. Understated, unisex, endlessly layerable.",
    dupeIds:[],
    image:"images/perfumes/wood-sage-sea-salt.png" },
  { id:"silver-mountain-water", name:"Silver Mountain Water", houseId:"creed", family:"Fresh", gender:"Unisex", year:1995, perfumer:undefined, concentration:"EDP", price:350, rating:4.4, reviews:6100, tier:"Niche",
    notes:{top:["Bergamot", "Mandarin"],heart:["Green Tea", "Blackcurrant"],base:["Galbanum", "Sandalwood", "Musk"]},
    accords:["Fresh", "Tea", "Woody"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"A crisp green-tea freshness from Creed's archive — clean and mineral, a quiet counterpoint to Aventus' loud fruit-and-smoke.",
    dupeIds:[],
    image:"images/perfumes/silver-mountain-water.png" },
  { id:"spicebomb", name:"Spicebomb", houseId:"viktorrolf", family:"Oriental", gender:"Men", year:2012, perfumer:undefined, concentration:"EDT", price:98, rating:4.3, reviews:10200, tier:"Designer",
    notes:{top:["Bergamot", "Grapefruit", "Pink Pepper"],heart:["Cinnamon", "Saffron", "Paprika"],base:["Tobacco", "Leather", "Vetiver"]},
    accords:["Warm Spicy", "Tobacco", "Leather"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"A grenade-shaped bottle of warm cinnamon-saffron spice over tobacco and leather. Loud, confident, built for cold-weather nights out.",
    dupeIds:[],
    image:"images/perfumes/spicebomb.png" },
  { id:"stronger-with-you", name:"Stronger With You", houseId:"armani", family:"Oriental", gender:"Men", year:2017, perfumer:undefined, concentration:"EDT", price:90, rating:4.2, reviews:8100, tier:"Designer",
    notes:{top:["Cardamom", "Pink Pepper", "Violet"],heart:["Sage", "Cinnamon", "Melon"],base:["Vanilla", "Chestnut", "Amberwood"]},
    accords:["Sweet", "Spicy", "Warm"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"A cozy cardamom-vanilla warmer with a modern gourmand streak — softer and sweeter than most mainstream masculines.",
    dupeIds:[],
    image:"images/perfumes/stronger-with-you.png" },
  { id:"ombre-nomade", name:"Ombre Nomade", houseId:"louisvuitton", family:"Woody", gender:"Unisex", year:2018, perfumer:"Jacques Cavallier", concentration:"EDP", price:325, rating:4.5, reviews:3900, tier:"Niche",
    notes:{top:["Raspberry", "Saffron"],heart:["Rose", "Incense"],base:["Oud", "Benzoin", "Amber"]},
    accords:["Oud", "Woody", "Smoky"],
    longevity:"Very long lasting (12h+)", sillage:"Strong",
    description:"Louis Vuitton's most acclaimed fragrance — smoky, resinous oud balanced by an unexpected raspberry top note. Cult-favorite among oud lovers.",
    dupeIds:[],
    image:"images/perfumes/ombre-nomade.png" },
  { id:"cloud", name:"Cloud", houseId:"arianagrande", family:"Oriental", gender:"Women", year:2018, perfumer:undefined, concentration:"EDP", price:65, rating:4.3, reviews:14700, tier:"Designer",
    notes:{top:["Lavender", "Pear", "Bergamot"],heart:["Whipped Cream", "Coconut", "Praline"],base:["Musk", "Vanilla Orchid", "Cashmere Wood"]},
    accords:["Sweet", "Vanilla", "Creamy"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"A whipped-cream-and-praline gourmand that became one of the biggest celebrity-fragrance hits ever — sweet, cozy, and hugely popular with a younger audience.",
    dupeIds:[],
    image:"images/perfumes/cloud.png" },
  { id:"grand-soir", name:"Grand Soir", houseId:"mfk", family:"Oriental", gender:"Unisex", year:2016, perfumer:"Francis Kurkdjian", concentration:"EDP", price:280, rating:4.5, reviews:4700, tier:"Niche",
    notes:{top:["Amber Notes"],heart:["Benzoin", "Tonka Bean"],base:["Vanilla", "Cistus Labdanum"]},
    accords:["Amber", "Vanilla", "Warm"],
    longevity:"Very long lasting (12h+)", sillage:"Strong",
    description:"A pure, glowing amber built almost entirely around benzoin and vanilla. Warm, simple, and one of MFK's most elegant orientals.",
    dupeIds:[],
    image:"images/perfumes/grand-soir.png" },
  { id:"angels-share", name:"Angels Share", houseId:"bykilian", family:"Oriental", gender:"Unisex", year:2020, perfumer:undefined, concentration:"EDP", price:260, rating:4.5, reviews:3300, tier:"Niche",
    notes:{top:["Cognac"],heart:["Cinnamon", "Tonka Bean", "Oak"],base:["Praline", "Vanilla", "Sandalwood"]},
    accords:["Sweet", "Boozy", "Warm Spicy"],
    longevity:"Long lasting (7-12h)", sillage:"Strong",
    description:"A boozy cognac-and-praline oriental named for the whisky lost to evaporation during aging. Warm, sweet, and deeply comforting.",
    dupeIds:[],
    image:"images/perfumes/angels-share.png" },
  { id:"phantom", name:"Phantom", houseId:"pacorabanne", family:"Aromatic", gender:"Men", year:2021, perfumer:undefined, concentration:"EDT", price:92, rating:4.2, reviews:7100, tier:"Designer",
    notes:{top:["Lavender", "Lemon"],heart:["Vetiver", "Sage"],base:["Vanilla", "Patchouli"]},
    accords:["Aromatic", "Fresh", "Sweet"],
    longevity:"Moderate (4-7h)", sillage:"Moderate",
    description:"A modern fougère wrapped in a smart-speaker-shaped bottle — fresh lavender and vetiver over a sweet vanilla-patchouli base.",
    dupeIds:[],
    image:"images/perfumes/phantom.png" },
  { id:'prada-luna-rossa', name:'Luna Rossa', houseId:'prada', family:'Aromatic', gender:'Men', year:2012, perfumer:'Daniela Andrier', concentration:'EDT', price:95, rating:4.3, reviews:2100, tier:'Designer',
    notes:{top:['Lavender','Bitter Orange'],heart:['Sage','Salt'],base:['Ambroxan']},
    accords:['Aromatic','Fresh','Salty'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A sharp lavender-and-salt sailing scent that trades sweetness for a crisp, mineral edge - built for warm weather and clean shirts.',
    dupeIds:[] },
  { id:'prada-candy', name:'Candy', houseId:'prada', family:'Gourmand', gender:'Women', year:2011, perfumer:'Daniela Andrier', concentration:'EDP', price:110, rating:4.1, reviews:1780, tier:'Designer',
    notes:{top:['Caramel'],heart:['Musk','Benzoin'],base:['Vanilla','Powdery notes']},
    accords:['Gourmand','Sweet'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Toasted caramel and powdery musk in a bottle shaped like a hard candy - one of the sweeter, more playful designer gourmands.',
    dupeIds:[] },
  { id:'prada-paradoxe', name:'Paradoxe', houseId:'prada', family:'Amber', gender:'Women', year:2022, perfumer:'Daniela Andrier & Nathalie Lorson', concentration:'EDP', price:130, rating:4.4, reviews:960, tier:'Designer',
    notes:{top:['Pear','Neroli'],heart:['Amberwood'],base:['Musk','Vanilla']},
    accords:['Amber','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A modern amber built on a proprietary "Ambrofix" note - soft, ambiguous, warm rather than sweet, and very office-friendly.',
    dupeIds:[] },
  { id:'bvlgari-man-in-black', name:'Man in Black', houseId:'bvlgari', family:'Oriental', gender:'Men', year:2014, perfumer:'Alberto Morillas', concentration:'EDP', price:115, rating:4.4, reviews:2450, tier:'Designer',
    notes:{top:['Rum'],heart:['Spices','Leather'],base:['Tobacco','Amber','Tonka Bean']},
    accords:['Oriental','Boozy','Leather'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Rum, leather and tonka bean pushed into deep, boozy territory - one of the richer mainstream men\'s orientals.',
    dupeIds:[] },
  { id:'bvlgari-omnia-crystalline', name:'Omnia Crystalline', houseId:'bvlgari', family:'Floral', gender:'Women', year:2005, perfumer:'Alberto Morillas', concentration:'EDT', price:90, rating:4.1, reviews:1340, tier:'Designer',
    notes:{top:['Lotus','Bamboo'],heart:['Nashi Pear','White Rose'],base:['White Musk']},
    accords:['Floral','Fresh'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'A translucent, watery floral built around lotus and nashi pear - office-appropriate and never loud.',
    dupeIds:[] },
  { id:'valentino-born-in-roma-donna', name:'Born in Roma Donna', houseId:'valentino', family:'Amber', gender:'Women', year:2019, perfumer:'Antoine Maisondieu, Antoine Lie & Sonia Constant', concentration:'EDP', price:120, rating:4.2, reviews:1120, tier:'Designer',
    notes:{top:['Black Pepper','Bergamot'],heart:['Jasmine','White Musk'],base:['Vanilla','Ambrette']},
    accords:['Amber','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Cool bergamot and pepper collide with sweet ambrette and vanilla for a fragrance built to feel both edgy and glamorous.',
    dupeIds:[] },
  { id:'valentino-uomo', name:'Valentino Uomo', houseId:'valentino', family:'Oriental', gender:'Men', year:2014, perfumer:'Olivier Polge', concentration:'EDT', price:100, rating:4.2, reviews:1680, tier:'Designer',
    notes:{top:['Bergamot'],heart:['Hazelnut','Iris'],base:['Leather','Cedarwood']},
    accords:['Oriental','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A gourmand-leaning leather built around toasted hazelnut - unusual, warm, and one of the more distinctive designer men\'s scents.',
    dupeIds:[] },
  { id:'gucci-bloom', name:'Bloom', houseId:'gucci', family:'Floral', gender:'Women', year:2017, perfumer:'Alberto Morillas', concentration:'EDP', price:115, rating:4.3, reviews:3200, tier:'Designer',
    notes:{top:['Jasmine Sambac'],heart:['Tuberose'],base:['Rangoon Creeper']},
    accords:['Floral'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'An intentionally maximalist, un-modernized white floral - dense jasmine and tuberose with no citrus top note to soften it.',
    dupeIds:[] },
  { id:'gucci-guilty', name:'Guilty', houseId:'gucci', family:'Woody', gender:'Men', year:2010, perfumer:'Aurelien Guichard', concentration:'EDT', price:90, rating:4.1, reviews:2050, tier:'Designer',
    notes:{top:['Lemon','Pink Pepper'],heart:['Lavender','Orange Flower'],base:['Patchouli','Cedarwood']},
    accords:['Woody','Aromatic'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A patchouli-lavender skeleton dressed up with pink pepper and orange flower - built for the Gucci nightlife campaign look.',
    dupeIds:[] },
  { id:'boss-bottled', name:'Boss Bottled', houseId:'hugoboss', family:'Woody', gender:'Men', year:1998, perfumer:'Annick Menardo', concentration:'EDT', price:85, rating:4.5, reviews:7400, tier:'Designer',
    notes:{top:['Apple','Plum','Bergamot'],heart:['Cinnamon','Mahogany','Geranium'],base:['Vanilla','Sandalwood','Vetiver']},
    accords:['Woody','Fruity','Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'The archetypal \'90s boardroom scent - spiced apple over warm sandalwood, still one of the best-selling men\'s fragrances of all time.',
    dupeIds:[] },
  { id:'hugoboss-the-scent', name:'The Scent', houseId:'hugoboss', family:'Oriental', gender:'Men', year:2015, perfumer:'Honorine Blanc', concentration:'EDT', price:95, rating:4.3, reviews:2280, tier:'Designer',
    notes:{top:['Ginger','Bergamot'],heart:['Maninka Fruit'],base:['Leather']},
    accords:['Oriental','Boozy'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Ginger and boozy maninka fruit over a warm leather base - one of the more seductive mainstream men\'s fragrances.',
    dupeIds:[] },
  { id:'cool-water', name:'Cool Water', houseId:'davidoff', family:'Aromatic', gender:'Men', year:1988, perfumer:'Pierre Bourdon', concentration:'EDT', price:55, rating:4.3, reviews:5600, tier:'Designer',
    notes:{top:['Mint','Lavender','Coriander'],heart:['Geranium','Jasmine','Sandalwood'],base:['Musk','Tobacco','Amber']},
    accords:['Aromatic','Fresh','Aquatic'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'The fragrance that invented the modern "aquatic" - mint and lavender over a warm musk base. Nearly every fresh men\'s scent since owes it something.',
    dupeIds:[] },
  { id:'azzaro-chrome', name:'Chrome', houseId:'azzaro', family:'Fresh', gender:'Men', year:1996, perfumer:'Morgane Rousseau & Fabrice Pellegrin', concentration:'EDT', price:50, rating:4.2, reviews:3900, tier:'Designer',
    notes:{top:['Bergamot','Lemon'],heart:['Rosemary','Jasmine'],base:['Cedarwood','Musk']},
    accords:['Fresh','Aromatic','Citrus'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A crisp citrus-and-metal shower-scent that defined a whole category of budget-friendly aromatic fresheners in the late \'90s.',
    dupeIds:[] },
  { id:'azzaro-wanted', name:'Wanted', houseId:'azzaro', family:'Aromatic', gender:'Men', year:2016, perfumer:'Nathalie Lorson & Fabrice Pellegrin', concentration:'EDT', price:75, rating:4.3, reviews:2100, tier:'Designer',
    notes:{top:['Bergamot','Cardamom','Apple Brandy'],heart:['Lavender','Juniper Berries'],base:['Vetiver','Amberwood']},
    accords:['Aromatic','Fresh'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Boozy apple brandy and cardamom over a sharp lavender-vetiver base - loud, confident, built for the club rather than the office.',
    dupeIds:[] },
  { id:'montblanc-explorer', name:'Explorer', houseId:'montblanc', family:'Woody', gender:'Men', year:2019, perfumer:'Fabrice Pellegrin & Marypierre Julien', concentration:'EDP', price:65, rating:4.2, reviews:1450, tier:'Designer',
    notes:{top:['Bergamot','Pink Pepper'],heart:['Leather Accord'],base:['Patchouli','Vetiver']},
    accords:['Woody','Leather'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A patchouli-and-leather adventure scent at an unusually low price point - one of the better value-for-money designer picks.',
    dupeIds:[] },
  { id:'montblanc-legend', name:'Legend', houseId:'montblanc', family:'Aromatic', gender:'Men', year:2011, perfumer:'Olivier Pescheux', concentration:'EDT', price:55, rating:4.1, reviews:1980, tier:'Designer',
    notes:{top:['Bergamot','Lavender','Pineapple Leaf'],heart:['Oakmoss','Geranium','Dried Fruits'],base:['Tonka Bean','Coumarin','Sandalwood']},
    accords:['Aromatic','Fougère'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A classic fougère - lavender and oakmoss over sweet tonka - built as an accessible everyday signature scent.',
    dupeIds:[] },
  { id:'eau-dissey-pour-homme', name:'L\'Eau d\'Issey Pour Homme', houseId:'isseymiyake', family:'Fresh', gender:'Men', year:1994, perfumer:'Jacques Cavallier', concentration:'EDT', price:65, rating:4.3, reviews:2650, tier:'Designer',
    notes:{top:['Yuzu','Lemon','Watery Notes'],heart:['Nutmeg','Cedar Leaf','Coriander'],base:['Sandalwood','Musk','Tobacco']},
    accords:['Fresh','Aquatic','Aromatic'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A watery, transparent citrus scent that helped define \'90s minimalist Japanese perfumery.',
    dupeIds:[] },
  { id:'eau-dissey', name:'L\'Eau d\'Issey', houseId:'isseymiyake', family:'Floral', gender:'Women', year:1992, perfumer:'Jacques Cavallier', concentration:'EDT', price:60, rating:4.2, reviews:2380, tier:'Designer',
    notes:{top:['Freesia','Lotus','Cyclamen'],heart:['Lily','Peony','Carnation'],base:['Sandalwood','Musk','Vanilla']},
    accords:['Floral','Fresh','Aquatic'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'The scent that popularized "watery florals" - lotus and freesia over clean musk, still worn as a quiet, elegant signature.',
    dupeIds:[] },
  { id:'mugler-alien', name:'Alien', houseId:'mugler', family:'Amber', gender:'Women', year:2005, perfumer:'Dominique Ropion & Laurent Bruyère', concentration:'EDP', price:125, rating:4.4, reviews:3350, tier:'Designer',
    notes:{top:['Jasmine Sambac'],heart:['Cashmeran'],base:['White Amber']},
    accords:['Amber','Woody','Floral'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A radically simple three-note formula - jasmine, cashmeran and white amber - built to feel otherworldly rather than pretty.',
    dupeIds:[] },
  { id:'mugler-a-men', name:'A*Men', houseId:'mugler', family:'Gourmand', gender:'Men', year:1996, perfumer:'Jacques Huclier', concentration:'EDT', price:95, rating:4.3, reviews:1920, tier:'Designer',
    notes:{top:['Mint','Lavender','Bergamot'],heart:['Caramel','Coffee','Patchouli'],base:['Vanilla','Chocolate','Tonka Bean']},
    accords:['Gourmand','Sweet','Woody'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Angel\'s darker, more masculine sibling - patchouli and chocolate pushed to an almost aggressive gourmand intensity.',
    dupeIds:[] },
  { id:'ck-one', name:'CK One', houseId:'calvinklein', family:'Fresh', gender:'Unisex', year:1994, perfumer:'Alberto Morillas & Harry Fremont', concentration:'EDT', price:45, rating:4.1, reviews:4700, tier:'Affordable',
    notes:{top:['Bergamot','Lemon','Pineapple'],heart:['Jasmine','Violet','Nutmeg'],base:['Musk','Cedarwood','Amber']},
    accords:['Fresh','Citrus','Aquatic'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'The fragrance that invented the modern unisex category - clean citrus over soft musk, still a dorm-room and gym-bag staple.',
    dupeIds:[] },
  { id:'ck-eternity', name:'Eternity', houseId:'calvinklein', family:'Floral', gender:'Women', year:1988, perfumer:'Sophia Grojsman', concentration:'EDP', price:60, rating:4.2, reviews:2150, tier:'Designer',
    notes:{top:['Freesia','Mandarin','Sage'],heart:['Lily','Marigold','Muguet'],base:['Sandalwood','Amber','Musk']},
    accords:['Floral','Green'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A green, soapy-clean floral from the perfumer behind some of the best-selling fragrances of the 20th century.',
    dupeIds:[] },
  { id:'burberry-her', name:'Her', houseId:'burberry', family:'Gourmand', gender:'Women', year:2018, perfumer:'Nathalie Lorson', concentration:'EDP', price:100, rating:4.3, reviews:2700, tier:'Designer',
    notes:{top:['Blackberry','Black Cherry'],heart:['Violet','Jasmine'],base:['Musk','Vanilla','Amber']},
    accords:['Gourmand','Fruity'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Boozy blackberry and cherry syrup over soft musk - a warm, London-street-style gourmand built for cooler weather.',
    dupeIds:[] },
  { id:'burberry-brit', name:'Brit for Him', houseId:'burberry', family:'Woody', gender:'Men', year:2003, perfumer:'Antoine Lie', concentration:'EDT', price:70, rating:4.1, reviews:1650, tier:'Designer',
    notes:{top:['Almond','Bergamot','Cardamom'],heart:['Nutmeg','Cinnamon','Sandalwood'],base:['Amber','Tonka Bean','Mahogany']},
    accords:['Woody','Spicy','Gourmand'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'Warm almond and spice over amber and tonka - an easy-wearing English take on the spiced-gourmand men\'s fragrance.',
    dupeIds:[] },
  { id:'nishane-hacivat', name:'Hacivat', houseId:'nishane', family:'Amber', gender:'Unisex', year:2015, perfumer:'Cristiano Canali', concentration:'Extrait', price:210, rating:4.5, reviews:890, tier:'Niche',
    notes:{top:['Bergamot','Grapefruit'],heart:['Turkish Rose','Fig Leaf'],base:['Tonka Bean','Musk','Cedarwood']},
    accords:['Amber','Woody','Fruity'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Turkish rose and fig over sweet tonka - Istanbul niche perfumery\'s best-known name, and a genuinely distinctive signature scent.',
    dupeIds:[] },
  { id:'nishane-ani', name:'Ani', houseId:'nishane', family:'Woody', gender:'Unisex', year:2017, perfumer:'Cristiano Canali', concentration:'Extrait', price:210, rating:4.4, reviews:610, tier:'Niche',
    notes:{top:['Pistachio','Cardamom'],heart:['Iris','Suede'],base:['Musk','Tonka Bean']},
    accords:['Woody','Gourmand','Nutty'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A toasted-pistachio gourmand with a suede-and-iris heart - richer and nuttier than most mainstream sweet scents.',
    dupeIds:[] },
  { id:'oud-for-greatness', name:'Oud for Greatness', houseId:'initio', family:'Oriental', gender:'Unisex', year:2016, perfumer:'Initio Parfums Privés', concentration:'EDP', price:290, rating:4.4, reviews:1240, tier:'Niche',
    notes:{top:['Saffron','Cardamom'],heart:['Rose','Patchouli','Agarwood (Oud)'],base:['Amberwood','Tonka Bean']},
    accords:['Oriental','Woody','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Saffron, rose and oud pushed to maximal intensity - a full-bottle-fills-the-room fragrance built for special occasions.',
    dupeIds:[] },
  { id:'initio-side-effect', name:'Side Effect', houseId:'initio', family:'Gourmand', gender:'Unisex', year:2015, perfumer:'Initio Parfums Privés', concentration:'EDP', price:290, rating:4.3, reviews:720, tier:'Niche',
    notes:{top:['Rum','Cinnamon'],heart:['Tobacco Leaf','Honey'],base:['Tonka Bean','Benzoin']},
    accords:['Gourmand','Boozy','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Rum-soaked tobacco and honey - one of the boozier, more hedonistic niche gourmands on the market.',
    dupeIds:[] },
  { id:'montale-black-aoud', name:'Black Aoud', houseId:'montale', family:'Woody', gender:'Unisex', year:2006, perfumer:'Pierre Montale', concentration:'EDP', price:180, rating:4.3, reviews:1580, tier:'Niche',
    notes:{top:['Rose','Bergamot'],heart:['Agarwood (Oud)','Patchouli'],base:['Musk','Sandalwood']},
    accords:['Woody','Rose','Oud'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Montale\'s signature rose-and-oud formula - sharp, medicinal oud softened by damask rose, worn at very high concentration.',
    dupeIds:['aventus'] },
  { id:'montale-intense-cafe', name:'Intense Café', houseId:'montale', family:'Gourmand', gender:'Unisex', year:2007, perfumer:'Pierre Montale', concentration:'EDP', price:180, rating:4.2, reviews:940, tier:'Niche',
    notes:{top:['Coffee','Bergamot'],heart:['Cocoa','Jasmine'],base:['Vanilla','Musk']},
    accords:['Gourmand','Sweet'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Roasted coffee and cocoa over sweet vanilla musk - one of the most straightforwardly "dessert in a bottle" niche scents.',
    dupeIds:[] },
  { id:'mancera-cedrat-boise', name:'Cedrat Boisé', houseId:'mancera', family:'Woody', gender:'Unisex', year:2010, perfumer:'Mancera', concentration:'EDP', price:160, rating:4.3, reviews:860, tier:'Niche',
    notes:{top:['Cedrat (Citron)','Bergamot'],heart:['Pink Pepper','Cedarwood'],base:['Musk','Ambroxan']},
    accords:['Woody','Citrus'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Bright candied citron over clean cedarwood and musk - Mancera\'s best-known, most complimented release.',
    dupeIds:[] },
  { id:'mancera-roses-vanille', name:'Roses Vanille', houseId:'mancera', family:'Gourmand', gender:'Women', year:2010, perfumer:'Mancera', concentration:'EDP', price:160, rating:4.2, reviews:540, tier:'Niche',
    notes:{top:['Rose','Bergamot'],heart:['Vanilla','Jasmine'],base:['Musk','Amber']},
    accords:['Gourmand','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Damask rose folded into thick vanilla - a sweet, feminine take on the rose-oud niche formula without the oud.',
    dupeIds:[] },
  { id:'roja-elysium', name:'Elysium Parfum Cologne', houseId:'rojaparfums', family:'Chypre', gender:'Men', year:2013, perfumer:'Roja Dove', concentration:'Parfum', price:395, rating:4.5, reviews:410, tier:'Niche',
    notes:{top:['Bergamot','Lemon','Mint'],heart:['Jasmine','Rose','Clary Sage'],base:['Oakmoss','Vetiver','Musk']},
    accords:['Chypre','Aromatic'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A modern, maximalist take on the classic aromatic chypre structure - old-world formality at an old-world price.',
    dupeIds:[] },
  { id:'roja-danger', name:'Danger Pour Homme', houseId:'rojaparfums', family:'Oriental', gender:'Men', year:2013, perfumer:'Roja Dove', concentration:'Parfum', price:420, rating:4.4, reviews:320, tier:'Niche',
    notes:{top:['Cognac','Cinnamon'],heart:['Praline','Rose'],base:['Leather','Tobacco','Amber']},
    accords:['Oriental','Boozy','Leather'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Cognac and praline over leather and tobacco - unapologetically rich, built for evening wear in cold weather.',
    dupeIds:[] },
  { id:'kayali-vanilla-28', name:'Vanilla | 28', houseId:'kayali', family:'Gourmand', gender:'Unisex', year:2018, perfumer:'Kayali', concentration:'EDP', price:89, rating:4.4, reviews:2900, tier:'Designer',
    notes:{top:['Bergamot'],heart:['Vanilla Orchid','Praline'],base:['Sandalwood','Tonka Bean']},
    accords:['Gourmand','Sweet'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Huda Kattan\'s numbered-strength vanilla, dialed up to "28" - a straightforward, crowd-pleasing bakery-sweet scent.',
    dupeIds:[] },
  { id:'kayali-musk-12', name:'Musk | 12', houseId:'kayali', family:'Amber', gender:'Unisex', year:2019, perfumer:'Kayali', concentration:'EDP', price:89, rating:4.2, reviews:1450, tier:'Designer',
    notes:{top:['Pink Pepper','Bergamot'],heart:['White Musk','Jasmine'],base:['Ambrette','Cedarwood']},
    accords:['Amber','Musky'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A clean, skin-like musk built around Kayali\'s numbered-intensity concept - soft rather than sweet, easy to wear daily.',
    dupeIds:[] },
  { id:'ajmal-amber-wood', name:'Amber Wood', houseId:'ajmal', family:'Amber', gender:'Unisex', year:2015, perfumer:'Ajmal', concentration:'EDP', price:60, rating:4.1, reviews:780, tier:'Affordable',
    notes:{top:['Bergamot','Saffron'],heart:['Rose','Oud'],base:['Amber','Sandalwood','Musk']},
    accords:['Amber','Woody','Oud'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'An accessible amber-oud built for longevity - a common budget pick among fans of heavier Middle Eastern-style fragrances.',
    dupeIds:[] },
  { id:'rasasi-hawas', name:'Hawas for Him', houseId:'rasasi', family:'Woody', gender:'Men', year:2018, perfumer:'Rasasi', concentration:'EDP', price:40, rating:4.3, reviews:1950, tier:'Affordable',
    notes:{top:['Bergamot','Pink Pepper'],heart:['Cardamom','Nutmeg'],base:['Cedarwood','Amber','Musk']},
    accords:['Woody','Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A spicy-woody scent that punches well above its price - a frequently recommended budget alternative to pricier niche orientals.',
    dupeIds:[] },
  { id:'rasasi-la-yuqawam', name:'La Yuqawam', houseId:'rasasi', family:'Amber', gender:'Unisex', year:2015, perfumer:'Rasasi', concentration:'EDP', price:65, rating:4.2, reviews:1120, tier:'Affordable',
    notes:{top:['Saffron','Cardamom'],heart:['Rose','Oud'],base:['Amber','Musk','Tonka Bean']},
    accords:['Amber','Oud','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A dense saffron-rose-oud oriental at a fraction of niche-house prices - one of Rasasi\'s most-recommended releases.',
    dupeIds:[] },
  { id:'jadore', name:'J\'adore', houseId:'dior', family:'Floral', gender:'Women', year:1999, perfumer:'Calice Becker', concentration:'EDP', price:130, rating:4.6, reviews:5900, tier:'Designer',
    notes:{top:['Ylang-Ylang','Bergamot'],heart:['Damask Rose','Jasmine','Orchid'],base:['Blackberry','Musk']},
    accords:['Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A lush, golden bouquet built around jasmine and ylang-ylang - one of the best-selling women\'s fragrances of the last 25 years.',
    dupeIds:[] },
  { id:'dior-homme', name:'Dior Homme', houseId:'dior', family:'Woody', gender:'Men', year:2005, perfumer:'François Demachy', concentration:'EDT', price:110, rating:4.5, reviews:3400, tier:'Designer',
    notes:{top:['Bergamot','Elemi'],heart:['Iris','Cocoa'],base:['Leather','Vetiver']},
    accords:['Woody','Powdery'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Powdery iris over cocoa and leather - a rare men\'s fragrance built on iris as the star note rather than a supporting one.',
    dupeIds:[] },
  { id:'poison', name:'Poison', houseId:'dior', family:'Oriental', gender:'Women', year:1985, perfumer:'Edouard Fléchier', concentration:'EDP', price:115, rating:4.2, reviews:1230, tier:'Designer',
    notes:{top:['Pimento','Coriander','Wild Berries'],heart:['Tuberose','Plum','Cinnamon'],base:['Honey','Vanilla','Musk']},
    accords:['Oriental','Fruity','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'The definitive \'80s power-fragrance - dense tuberose, plum and spice engineered to be noticed from across a room.',
    dupeIds:[] },
  { id:'chance-chanel', name:'Chance', houseId:'chanel', family:'Floral', gender:'Women', year:2002, perfumer:'Jacques Polge', concentration:'EDP', price:145, rating:4.3, reviews:2870, tier:'Designer',
    notes:{top:['Pink Pepper','Pineapple'],heart:['Jasmine','Iris','Hyacinth'],base:['Patchouli','Amber','Vetiver']},
    accords:['Floral','Fruity'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A fizzy pink-pepper opening over a soft iris heart - designed as Chanel\'s answer to the modern, upbeat fruity-floral.',
    dupeIds:[] },
  { id:'allure-homme-sport', name:'Allure Homme Sport', houseId:'chanel', family:'Fresh', gender:'Men', year:2004, perfumer:'Jacques Polge', concentration:'EDT', price:100, rating:4.5, reviews:4100, tier:'Designer',
    notes:{top:['Sicilian Mandarin','Aldehydes'],heart:['Neroli','Cedar'],base:['Musk','Amberwood']},
    accords:['Fresh','Citrus','Aromatic'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'Sparkling citrus and aldehydes over a warm musk base - a gym-bag and boardroom staple in equal measure.',
    dupeIds:[] },
  { id:'egoiste', name:'Égoïste', houseId:'chanel', family:'Woody', gender:'Men', year:1990, perfumer:'Jacques Polge', concentration:'EDT', price:130, rating:4.4, reviews:780, tier:'Designer',
    notes:{top:['Cinnamon','Coriander','Rosewood'],heart:['Sandalwood','Isobutyl Quinoline'],base:['Vanilla','Musk']},
    accords:['Woody','Spicy'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A dense, singular sandalwood-and-spice composition with almost no citrus opening - one of Chanel\'s most polarizing men\'s scents.',
    dupeIds:[] },
  { id:'opium-ysl', name:'Opium', houseId:'ysl', family:'Oriental', gender:'Women', year:1977, perfumer:'Jean-Louis Sieuzac & Jean Amic', concentration:'EDP', price:110, rating:4.3, reviews:1560, tier:'Designer',
    notes:{top:['Mandarin','Clove','Coriander'],heart:['Jasmine','Myrrh','Carnation'],base:['Labdanum','Vanilla','Patchouli']},
    accords:['Oriental','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'The fragrance that made the modern spicy oriental mainstream - clove and myrrh over thick labdanum and vanilla.',
    dupeIds:[] },
  { id:'mon-paris', name:'Mon Paris', houseId:'ysl', family:'Gourmand', gender:'Women', year:2016, perfumer:'Anne Flipo, Dominique Ropion & Loc Dong', concentration:'EDP', price:115, rating:4.2, reviews:1980, tier:'Designer',
    notes:{top:['Strawberry','Raspberry','Pear'],heart:['Peony','Orange Blossom'],base:['Patchouli','White Musk','Ambergris']},
    accords:['Gourmand','Fruity','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Berry and pear over a patchouli-musk base - Y.S.L.\'s take on the modern candy-sweet fruity floral.',
    dupeIds:[] },
  { id:'neroli-portofino', name:'Neroli Portofino', houseId:'tomford', family:'Fresh', gender:'Unisex', year:2011, perfumer:'Rodrigo Flores-Roux', concentration:'EDT', price:250, rating:4.5, reviews:1340, tier:'Niche',
    notes:{top:['Bergamot','Lemon','Mandarin'],heart:['Neroli','Angelica','African Orange Flower'],base:['Amber','Musk','Sandalwood']},
    accords:['Fresh','Citrus'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A sun-drenched Mediterranean citrus built around neroli - one of Tom Ford\'s brightest, most universally loved releases.',
    dupeIds:[] },
  { id:'ombre-leather', name:'Ombré Leather', houseId:'tomford', family:'Woody', gender:'Unisex', year:2018, perfumer:'Tom Ford', concentration:'EDP', price:250, rating:4.6, reviews:1670, tier:'Niche',
    notes:{top:['Cardamom','Coriander','Rum'],heart:['Suede','Jasmine'],base:['Amber','Musk','Sandalwood']},
    accords:['Woody','Leather'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A minimalist, near-abstract leather - suede and jasmine over warm amber, with none of the smoky harshness of classic leathers.',
    dupeIds:['aventus'] },
  { id:'versace-pour-homme', name:'Versace Pour Homme', houseId:'versace', family:'Aromatic', gender:'Men', year:2002, perfumer:'Alberto Morillas', concentration:'EDT', price:75, rating:4.3, reviews:2740, tier:'Designer',
    notes:{top:['Bergamot','Lemon','Neroli'],heart:['Clary Sage','Geranium','Cedarwood'],base:['Musk','Tonka Bean','Amber']},
    accords:['Aromatic','Fresh','Citrus'],
    longevity:'Moderate (4-7h)', sillage:'Moderate',
    description:'A clean Mediterranean citrus-aromatic - one of the most consistently recommended "safe signature scent" picks in its price range.',
    dupeIds:[] },
  { id:'crystal-noir', name:'Crystal Noir', houseId:'versace', family:'Oriental', gender:'Women', year:2004, perfumer:'Alberto Morillas', concentration:'EDT', price:85, rating:4.2, reviews:1050, tier:'Designer',
    notes:{top:['Ginger','Peach','Gardenia'],heart:['Bulgarian Rose','Jasmine','Amber'],base:['Musk','Sandalwood','Suede']},
    accords:['Oriental','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Bright ginger and gardenia settle into a soft amber-suede base - a warmer, more mysterious sibling to Bright Crystal.',
    dupeIds:[] },
  { id:'habit-rouge', name:'Habit Rouge', houseId:'guerlain', family:'Oriental', gender:'Men', year:1965, perfumer:'Jean-Paul Guerlain', concentration:'EDT', price:115, rating:4.5, reviews:940, tier:'Designer',
    notes:{top:['Bergamot','Lemon','Mandarin'],heart:['Rose','Patchouli','Cinnamon'],base:['Vanilla','Leather','Sandalwood']},
    accords:['Oriental','Spicy','Citrus'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'One of the first "gourmand" men\'s fragrances - citrus and cinnamon over vanilla and leather, decades ahead of its time.',
    dupeIds:[] },
  { id:'mon-guerlain', name:'Mon Guerlain', houseId:'guerlain', family:'Gourmand', gender:'Women', year:2017, perfumer:'Thierry Wasser & Delphine Jelk', concentration:'EDP', price:120, rating:4.4, reviews:2560, tier:'Designer',
    notes:{top:['Lavender','Bergamot'],heart:['Jasmine','Sambac'],base:['Vanilla','Coumarin']},
    accords:['Gourmand','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Lavender - normally a men\'s-fragrance note - reworked into a soft vanilla gourmand for women, to considerable commercial success.',
    dupeIds:[] },
  { id:'armani-code', name:'Code', houseId:'armani', family:'Oriental', gender:'Men', year:2004, perfumer:'Antoine Lie', concentration:'EDT', price:95, rating:4.4, reviews:3900, tier:'Designer',
    notes:{top:['Lemon','Bergamot'],heart:['Guaiac Wood','Star Anise'],base:['Tonka Bean','Leather','Tobacco']},
    accords:['Oriental','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Star anise and guaiac wood over sweet tonka bean - a smooth, date-night staple for most of the 2000s and 2010s.',
    dupeIds:[] },
  { id:'armani-si', name:'Sì', houseId:'armani', family:'Chypre', gender:'Women', year:2013, perfumer:'Loc Dong', concentration:'EDP', price:115, rating:4.5, reviews:2980, tier:'Designer',
    notes:{top:['Cassis','Freesia'],heart:['Vanilla','May Rose','Freesia'],base:['Patchouli','Musk','Blond Woods']},
    accords:['Chypre','Fruity'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Blackcurrant nectar over a modern patchouli base - a fresher, fruitier reinvention of the classic chypre structure.',
    dupeIds:[] },
  { id:'tresor', name:'Trésor', houseId:'lancome', family:'Floral', gender:'Women', year:1990, perfumer:'Sophia Grojsman', concentration:'EDP', price:100, rating:4.3, reviews:1470, tier:'Designer',
    notes:{top:['Apricot Blossom','Lilac'],heart:['Rose','Iris','Heliotrope'],base:['Sandalwood','Musk','Vanilla']},
    accords:['Floral','Fruity'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A soft, rounded rose-and-apricot composition from the perfumer behind several of the era\'s best-selling florals.',
    dupeIds:[] },
  { id:'jardin-sur-le-nil', name:'Un Jardin sur le Nil', houseId:'hermes', family:'Fresh', gender:'Unisex', year:2005, perfumer:'Jean-Claude Ellena', concentration:'EDT', price:130, rating:4.3, reviews:720, tier:'Niche',
    notes:{top:['Green Mango','Grapefruit'],heart:['Lotus','Water Hyacinth'],base:['Sycamore Wood','Incense']},
    accords:['Fresh','Green','Fruity'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'Green mango over a lotus heart - one of Ellena\'s travel-inspired "garden" series, transparent and unusually literal.',
    dupeIds:[] },
  { id:'herod', name:'Herod', houseId:'pdm', family:'Oriental', gender:'Men', year:2018, perfumer:'Parfums de Marly', concentration:'EDP', price:300, rating:4.5, reviews:1080, tier:'Niche',
    notes:{top:['Cinnamon','Cardamom'],heart:['Tobacco','Praline'],base:['Amberwood','Tonka Bean','Vanilla']},
    accords:['Oriental','Gourmand','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Praline and tobacco over a thick amber-vanilla base - one of Parfums de Marly\'s most-hyped, most-discussed men\'s releases.',
    dupeIds:['baccarat-rouge'] },
  { id:'xerjoff-naxos', name:'Naxos', houseId:'xerjoff', family:'Gourmand', gender:'Men', year:2013, perfumer:'Xerjoff', concentration:'EDP', price:320, rating:4.6, reviews:1290, tier:'Niche',
    notes:{top:['Lavender','Bergamot','Lemon'],heart:['Honey','Tobacco Blossom'],base:['Tonka Bean','Vanilla','Sandalwood']},
    accords:['Gourmand','Tobacco','Sweet'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Honeyed tobacco over sweet tonka bean - widely considered one of the best cold-weather gourmands in niche perfumery.',
    dupeIds:[] },
  { id:'oud-satin-mood', name:'Oud Satin Mood', houseId:'mfk', family:'Amber', gender:'Unisex', year:2014, perfumer:'Francis Kurkdjian', concentration:'EDP', price:345, rating:4.4, reviews:1560, tier:'Niche',
    notes:{top:['Raspberry','Saffron'],heart:['Rose','Agarwood (Oud)'],base:['Vanilla','Amber']},
    accords:['Amber','Oud','Fruity'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A softened, fruited oud - raspberry and saffron smooth out the smokiness that scares people off most oud fragrances.',
    dupeIds:[] },
  { id:'bal-dafrique', name:'Bal d\'Afrique', houseId:'byredo', family:'Woody', gender:'Unisex', year:2009, perfumer:'Jerome Epinette', concentration:'EDP', price:220, rating:4.4, reviews:980, tier:'Niche',
    notes:{top:['Bergamot','Neroli','Cassis'],heart:['African Marigold','Violet'],base:['Cedarwood','Musk','Vetiver']},
    accords:['Woody','Floral','Fresh'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A marigold-and-violet heart over clean cedarwood - one of Byredo\'s most consistently recommended, easiest-to-wear scents.',
    dupeIds:[] },
  { id:'another-13', name:'Another 13', houseId:'lelabo', family:'Amber', gender:'Unisex', year:2013, perfumer:'Le Labo', concentration:'EDP', price:210, rating:4.5, reviews:1420, tier:'Niche',
    notes:{top:['Ambroxan','Musk'],heart:['Jasmine'],base:['Iso E Super']},
    accords:['Amber','Musky','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A minimalist Ambroxan-and-musk formula famous for smelling different on almost everyone - Le Labo\'s cult "skin scent."',
    dupeIds:[] },
  { id:'eau-duelle', name:'Eau Duelle', houseId:'diptyque', family:'Amber', gender:'Unisex', year:2011, perfumer:'Fabrice Pellegrin', concentration:'EDP', price:180, rating:4.1, reviews:410, tier:'Niche',
    notes:{top:['Cardamom','Star Anise'],heart:['Coffee','Elemi'],base:['Vanilla','Vetiver','Tonka Bean']},
    accords:['Amber','Spicy','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A spiced coffee-and-vanilla amber built around the ambivalence between fresh and warm notes worn on the same skin.',
    dupeIds:[] },
  { id:'amouage-interlude-man', name:'Interlude Man', houseId:'amouage', family:'Oriental', gender:'Men', year:2012, perfumer:'Pierre Negrin & Karine Vinchon-Spehner', concentration:'EDP', price:340, rating:4.6, reviews:1180, tier:'Niche',
    notes:{top:['Bergamot','Oregano','Pink Pepper'],heart:['Frankincense','Clove','Cinnamon'],base:['Amber','Patchouli','Labdanum']},
    accords:['Oriental','Spicy','Incense'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A chaotic, incense-heavy oriental widely regarded as one of the most challenging - and most acclaimed - niche men\'s releases of the 2010s.',
    dupeIds:[] },
  { id:'amouage-reflection-woman', name:'Reflection Woman', houseId:'amouage', family:'Floral', gender:'Women', year:2007, perfumer:'Daniel Maurel', concentration:'EDP', price:320, rating:4.5, reviews:760, tier:'Niche',
    notes:{top:['Coriander','Neroli','Lemon'],heart:['Lily-of-the-Valley','Jasmine','Frangipani'],base:['Musk','Amber','Vetiver']},
    accords:['Floral','Fresh'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A crisp, restrained white floral - the counterpart to Reflection Man, and one of Amouage\'s most "wearable" releases.',
    dupeIds:['reflection-man'] },
  { id:'english-pear-freesia', name:'English Pear & Freesia', houseId:'jomalone', family:'Floral', gender:'Unisex', year:2010, perfumer:'Christine Nagel', concentration:'Cologne', price:95, rating:4.4, reviews:2680, tier:'Designer',
    notes:{top:['Pear','Fig Leaf'],heart:['Freesia','Amber'],base:['Patchouli','White Musk']},
    accords:['Fruity','Floral'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'Crisp English pear over a green fig leaf - one of Jo Malone\'s best-sellers and a frequent "first niche fragrance" recommendation.',
    dupeIds:[] },
  { id:'replica-by-the-fireplace', name:'Replica By the Fireplace', houseId:'margiela', family:'Gourmand', gender:'Unisex', year:2015, perfumer:'Maison Margiela', concentration:'EDT', price:145, rating:4.5, reviews:1930, tier:'Niche',
    notes:{top:['Pink Pepper','Orange'],heart:['Chestnut','Clove'],base:['Vanilla','Guaiac Wood']},
    accords:['Gourmand','Woody','Smoky'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Warm chestnut and clove over smoky guaiac wood - built to smell exactly like sitting near a real wood fire.',
    dupeIds:[] },
  { id:'the-one-dg', name:'The One', houseId:'dg', family:'Oriental', gender:'Women', year:2006, perfumer:'Olivier Cresp & Aurelien Guichard', concentration:'EDP', price:100, rating:4.3, reviews:1240, tier:'Designer',
    notes:{top:['Bergamot','Lychee','Peach'],heart:['Madonna Lily','Jasmine','Plum'],base:['Vanilla','Amber','Musk']},
    accords:['Oriental','Floral','Fruity'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A warm, plummy floral oriental - one of D&G\'s most consistently reordered women\'s fragrances since launch.',
    dupeIds:[] },
  { id:'212-vip', name:'212 VIP', houseId:'carolinaherrera', family:'Gourmand', gender:'Women', year:2011, perfumer:'Jean-Christophe Herault', concentration:'EDP', price:95, rating:4.2, reviews:2340, tier:'Designer',
    notes:{top:['Passion Fruit','Rum'],heart:['Musk','Gardenia'],base:['Vanilla','Amber']},
    accords:['Gourmand','Fruity'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'A boozy passion-fruit gourmand built for the club rather than the office - loud, sweet, and hard to miss.',
    dupeIds:[] },
  { id:'fico-di-amalfi', name:'Blu Mediterraneo - Fico di Amalfi', houseId:'acquadiparma', family:'Fresh', gender:'Unisex', year:2006, perfumer:'Acqua di Parma', concentration:'EDT', price:115, rating:4.4, reviews:880, tier:'Niche',
    notes:{top:['Fig Leaf','Bergamot','Lemon'],heart:['Fig Accord','Mimosa'],base:['Cedarwood','Musk']},
    accords:['Fresh','Green','Fruity'],
    longevity:'Moderate (4-7h)', sillage:'Soft',
    description:'A green fig fragrance built around the smell of a fig tree in Mediterranean sun - herbal, milky, unmistakably summer.',
    dupeIds:[] },
  { id:'narciso-edp', name:'Narciso Eau de Parfum', houseId:'narcisorodriguez', family:'Amber', gender:'Women', year:2014, perfumer:'Aurelien Guichard', concentration:'EDP', price:115, rating:4.4, reviews:2160, tier:'Designer',
    notes:{top:['Musk'],heart:['White Flowers','Musk'],base:['Vetiver','Amberwood']},
    accords:['Amber','Musky','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'An almost single-note musk composition - deliberately minimal, and one of the most-complimented "my skin but better" scents.',
    dupeIds:[] },
  { id:'lady-million', name:'Lady Million', houseId:'pacorabanne', family:'Floral', gender:'Women', year:2010, perfumer:'Ophelia Buchan & Anne Flipo', concentration:'EDP', price:100, rating:4.3, reviews:3050, tier:'Designer',
    notes:{top:['Raspberry','Neroli','Bitter Orange'],heart:['Gardenia','Jasmine','Orange Blossom'],base:['Honey','Patchouli','Amber']},
    accords:['Floral','Fruity'],
    longevity:'Long lasting (7-12h)', sillage:'Strong',
    description:'Neroli and orange blossom over honeyed patchouli - the fizzy, gold-bottled counterpart to 1 Million.',
    dupeIds:[] },
  { id:'jpg-classique', name:'Classique', houseId:'jpg', family:'Oriental', gender:'Women', year:1993, perfumer:'Jacques Cavallier', concentration:'EDT', price:90, rating:4.3, reviews:1560, tier:'Designer',
    notes:{top:['Rose','Orange Blossom','Mandarin'],heart:['Ginger','Cinnamon','Spearmint'],base:['Vanilla','Amber','Sandalwood']},
    accords:['Oriental','Spicy','Floral'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Ginger and spearmint over a warm vanilla-amber base - packaged in the equally famous corset-shaped bottle.',
    dupeIds:[] },
  { id:'lv-imagination', name:'Imagination', houseId:'louisvuitton', family:'Fresh', gender:'Men', year:2019, perfumer:'Jacques Cavallier', concentration:'EDP', price:340, rating:4.4, reviews:720, tier:'Niche',
    notes:{top:['Sea Notes','Bergamot'],heart:['Freesia','Ginger'],base:['Cedarwood','Musk']},
    accords:['Fresh','Woody','Citrus'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A clean, sheer citrus-woody scent built as Louis Vuitton\'s approachable, everyday men\'s entry into its in-house line.',
    dupeIds:[] },
  { id:'ariana-grande-rem', name:'R.E.M.', houseId:'arianagrande', family:'Amber', gender:'Women', year:2021, perfumer:'Ariana Grande Perfumes', concentration:'EDP', price:65, rating:4.3, reviews:1980, tier:'Designer',
    notes:{top:['Lavender','Pear'],heart:['Marshmallow','Blueberry'],base:['Musk','Tonka Bean']},
    accords:['Amber','Gourmand','Sweet'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'Lavender and marshmallow over sweet musk - a soft, dreamy gourmand aimed squarely at a younger audience.',
    dupeIds:[] },
  { id:'love-dont-be-shy', name:'Love, Don\'t Be Shy', houseId:'bykilian', family:'Gourmand', gender:'Women', year:2007, perfumer:'Sidonie Lancesseur & Calice Becker', concentration:'EDP', price:270, rating:4.5, reviews:1340, tier:'Niche',
    notes:{top:['Orange Blossom','Neroli'],heart:['Marshmallow'],base:['Vanilla','Musk','Sandalwood']},
    accords:['Gourmand','Floral','Sweet'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'Marshmallow and orange blossom in one of niche perfumery\'s most-hyped, most-imitated gourmand florals.',
    dupeIds:[] },
  { id:'lattafa-khamrah', name:'Khamrah', houseId:'lattafa', family:'Oriental', gender:'Unisex', year:2022, perfumer:'Lattafa', concentration:'EDP', price:30, rating:4.6, reviews:4900, tier:'Affordable',
    notes:{top:['Cinnamon','Nutmeg','Orange'],heart:['Dates','Praline','Cardamom'],base:['Amber','Vanilla','Tonka Bean']},
    accords:['Oriental','Gourmand','Spicy'],
    longevity:'Very long lasting (12h+)', sillage:'Strong',
    description:'A spiced date-and-praline oriental that became one of Lattafa\'s fastest word-of-mouth hits - startling value for the concentration.',
    dupeIds:['herod'] },
];

/* ---------- community sample data (shared across community.html + homepage) ---------- */
const PHOTOWALL = [
  { u:'ScentSofia', t:'My winter shelf 🖤 Tobacco Vanille living here rent free', h:190, l:214, c:32 },
  { u:'OudMike', t:'Today’s haul — decant day!', h:150, l:98, c:11 },
  { u:'Lena_P', t:'Baccarat 540 in the morning light', h:230, l:341, c:54 },
  { u:'FragBro', t:'The everyday rotation', h:150, l:120, c:9 },
  { u:'Amira', t:'Niche corner ✨ Xerjoff + PdM', h:200, l:276, c:41 },
  { u:'DanC', t:'Blind buy that paid off', h:150, l:66, c:7 },
  { u:'RoseW', t:'Spring florals are back out', h:210, l:188, c:26 },
  { u:'KaiT', t:'Sample vials > full bottles, change my mind', h:160, l:143, c:19 },
];

const REVIEWS = [
  { p:'Aventus', b:'Creed', s:5, who:'ScentSofia', tx:'The pineapple opening is unreal and the smoky dry-down lasts all day. A compliment magnet — worth the hype.', hp:214, id:'aventus' },
  { p:'Black Opium', b:'YSL', s:4, who:'Lena_P', tx:'Cozy coffee-vanilla bomb. Perfect for autumn nights, though a little sweet for the office.', hp:88, id:'black-opium' },
  { p:'Sauvage', b:'Dior', s:4, who:'FragBro', tx:'Yes it’s everywhere, but for a reason. Fresh, loud, safe. My go-to for a first date.', hp:132, id:'sauvage' },
  { p:'Baccarat Rouge 540', b:'MFK', s:5, who:'Amira', tx:'Ethereal and addictive. A little goes a long way — 2 sprays and people ask what you’re wearing.', hp:176, id:'baccarat-rouge' },
];

const SOTD = [
  { u:'OudMike', w:'Tom Ford Oud Wood', t:'12m', id:'oud-wood' },
  { u:'RoseW', w:'Chanel No. 5', t:'34m', id:'coco-mademoiselle' },
  { u:'KaiT', w:'Dior Sauvage', t:'1h', id:'sauvage' },
  { u:'DanC', w:'Armaf Club de Nuit', t:'2h', id:'clubdenuit' },
  { u:'Amira', w:'PdM Delina', t:'3h', id:'delina' },
];

const THREADS = [
  { t:'Best affordable Aventus dupe in 2026?', c:'Recommendations', r:142 },
  { t:'What’s your most complimented fragrance?', c:'General talk', r:308 },
  { t:'New to fragrance — where do I even start?', c:'Beginners', r:97 },
  { t:'Notino vs Sephora — where are you buying?', c:'Deals', r:64 },
  { t:'Decant swap thread — August', c:'Swaps', r:51 },
];

/* ---------- helpers ---------- */
const GRADS = ['#A8613E,#7A4028','#6B7A4F,#47522F','#8B5169,#5C3348','#5E7A93,#3D5266','#C08379,#8A564E','#7C9683,#526B58','#C6963C,#8F6A24','#6B4B3A,#402B20'];
function gr(i){ return `linear-gradient(140deg,${GRADS[i%GRADS.length]})`; }
function av(i){ return `background:${gr(i+2)}`; }
function lighten(hex, amt){
  const n = parseInt(hex.slice(1), 16), r = (n>>16)&255, g = (n>>8)&255, b = n&255;
  const mix = c => Math.round(c + (255-c)*amt).toString(16).padStart(2,'0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}
/* Photo-wall "studio backdrop" treatment (Direction A): a lit, vignetted
   paper backdrop per post instead of a flat diagonal swatch. Kept around in
   case the shared-backdrop direction (C) below gets swapped back. */
function wallVignette(i){
  const [base, dark] = GRADS[i%GRADS.length].split(',');
  return `radial-gradient(130% 100% at 50% 22%, ${lighten(base,.32)} 0%, ${base} 58%, ${dark} 120%)`;
}
/* Direction C: every card shares one warm-paper backdrop; color moves down
   to a small per-post tag dot instead of tinting the whole photo. */
function tagColor(i){ return GRADS[i%GRADS.length].split(',')[0]; }
function famColor(fam){ return FAM_COLOR[fam] || ['#6C4CFF','#00B8D4']; }
function houseName(id){ const h = HOUSES.find(h=>h.id===id); return h ? h.name : id; }
function perfumeById(id){ return PERFUMES.find(p=>p.id===id); }
function qs(name){ return new URLSearchParams(window.location.search).get(name); }
function perfumeAllNotes(p){ return [...p.notes.top, ...p.notes.heart, ...p.notes.base]; }

/* ---------- note taxonomy (for the note-picker / Explore by note page) ---------- */
const NOTE_CATEGORY_ORDER = ['Citrus','Floral','Fruity','Green & Aromatic','Spicy','Woody','Amber & Resin','Gourmand & Sweet','Musk & Animalic','Leather & Tobacco','Marine & Mineral','Earthy','Other'];
const NOTE_CATEGORY_MAP = {
  'Bergamot':'Citrus','Calabrian Bergamot':'Citrus','Citrus':'Citrus','Grapefruit':'Citrus','Green Tangerine':'Citrus','Lemon':'Citrus','Lemon Verbena':'Citrus','Mandarin':'Citrus','Blood Mandarin':'Citrus','Orange':'Citrus','Sweet Orange':'Citrus','Sicilian Lemon':'Citrus','Yuzu':'Citrus',
  'Bellflower':'Floral','Black Orchid':'Floral','Freesia':'Floral','Geranium':'Floral','Gillyflower':'Floral','Iris':'Floral','Jasmine':'Floral','Moroccan Jasmine':'Floral','Sambac Jasmine':'Floral','Lily':'Floral','Lily of the Valley':'Floral','Lotus':'Floral','Magnolia':'Floral','Muguet':'Floral','Narcissus':'Floral','Neroli':'Floral','Orange Blossom':'Floral','Orchid':'Floral','Orris':'Floral','Peony':'Floral','Pelargonium':'Floral','Rose':'Floral','Turkish Rose':'Floral','White Rose':'Floral','Tuberose':'Floral','Violet':'Floral','Violet Leaf':'Floral','Ylang-Ylang':'Floral',
  'Apple':'Fruity','Red Apple':'Fruity','Green Apple':'Fruity','Apricot':'Fruity','Black Cherry':'Fruity','Cherry Liqueur':'Fruity','Black Currant':'Fruity','Blackcurrant':'Fruity','Red Currant':'Fruity','Dried Fruit':'Fruity','Dried Fruits':'Fruity','Fruit':'Fruity','Litchi':'Fruity','Lychee':'Fruity','Melon':'Fruity','Peach':'Fruity','Pear':'Fruity','Pineapple':'Fruity','Plum':'Fruity','Pomegranate':'Fruity','Raspberry':'Fruity','Red Berries':'Fruity','Rhubarb':'Fruity',
  'Aldehydes':'Green & Aromatic','Bamboo':'Green & Aromatic','Bay Leaf':'Green & Aromatic','Clary Sage':'Green & Aromatic','Fig':'Green & Aromatic','Fig Leaf':'Green & Aromatic','Galbanum':'Green & Aromatic','Green Tea':'Green & Aromatic','Juniper':'Green & Aromatic','Juniper Berries':'Green & Aromatic','Lavender':'Green & Aromatic','Mint':'Green & Aromatic','Rosemary':'Green & Aromatic','Sage':'Green & Aromatic','Tea':'Green & Aromatic','Verbena':'Green & Aromatic',
  'Cardamom':'Spicy','Cinnamon':'Spicy','Cumin':'Spicy','Ginger':'Spicy','Nutmeg':'Spicy','Paprika':'Spicy','Pepper':'Spicy','Pink Pepper':'Spicy','Saffron':'Spicy','Sichuan Pepper':'Spicy','Spices':'Spicy',
  'Amberwood':'Woody','Birch':'Woody','Cashmere Wood':'Woody','Cedar':'Woody','Cedarwood':'Woody','Sicilian Cedar':'Woody','Virginia Cedar':'Woody','White Cedar':'Woody','Fig Tree Wood':'Woody','Guaiac Wood':'Woody','Lotus Wood':'Woody','Mahogany':'Woody','Oak':'Woody','Oud':'Woody','Pine Needles':'Woody','Rosewood':'Woody','Sandalwood':'Woody','Vetiver':'Woody','Woody Notes':'Woody',
  'Amber':'Amber & Resin','Amber Notes':'Amber & Resin','Ambergris':'Amber & Resin','Ambrox':'Amber & Resin','Ambroxan':'Amber & Resin','Benzoin':'Amber & Resin','Cistus Labdanum':'Amber & Resin','Fir Resin':'Amber & Resin','Incense':'Amber & Resin','Labdanum':'Amber & Resin','Mastic':'Amber & Resin','Opoponax':'Amber & Resin','Plant Amber':'Amber & Resin',
  'Almond':'Gourmand & Sweet','Bitter Almond':'Gourmand & Sweet','Cacao':'Gourmand & Sweet','Cocoa':'Gourmand & Sweet','Coconut':'Gourmand & Sweet','Coffee':'Gourmand & Sweet','Cognac':'Gourmand & Sweet','Madagascar Vanilla':'Gourmand & Sweet','Milk Accord':'Gourmand & Sweet','Praline':'Gourmand & Sweet','Rum':'Gourmand & Sweet','Tonka':'Gourmand & Sweet','Tonka Bean':'Gourmand & Sweet','Vanilla':'Gourmand & Sweet','Vanilla Orchid':'Gourmand & Sweet','Whipped Cream':'Gourmand & Sweet',
  'Ambrette':'Musk & Animalic','Ambrette Seeds':'Musk & Animalic','Civet':'Musk & Animalic','Musk':'Musk & Animalic','White Musk':'Musk & Animalic',
  'Leather':'Leather & Tobacco','Suede':'Leather & Tobacco','Tobacco':'Leather & Tobacco','Tobacco Blossom':'Leather & Tobacco','Tobacco Leaf':'Leather & Tobacco',
  'Flint':'Marine & Mineral','Ice Notes':'Marine & Mineral','Marine Notes':'Marine & Mineral','Red Algae':'Marine & Mineral','Sea Notes':'Marine & Mineral','Sea Salt':'Marine & Mineral',
  'Black Truffle':'Earthy','Chestnut':'Earthy','Oak Moss':'Earthy','Oakmoss':'Earthy','Papyrus':'Earthy','Patchouli':'Earthy'
};
function noteCategory(n){ return NOTE_CATEGORY_MAP[n] || 'Other'; }

/* ---------- note photos: a real photo per note, not an abstract family
   icon — an earlier pass shipped hand-drawn family-level line icons
   (one per NOTE_CATEGORY, e.g. every floral note got the same flower
   glyph) and that was explicitly rejected as not showing the actual
   note. This replaces it with real photographs sourced from Wikimedia
   Commons under free licenses, mapped per exact note name. Coverage
   starts with the ~50 most-used notes across the catalog (by design —
   see credits.html for the full source list) and will grow toward all
   notes over time; a note with no mapped photo renders no icon at all
   rather than falling back to a generic/abstract stand-in. */
const NOTE_IMAGE = {
  'Vanilla':{url:'https://upload.wikimedia.org/wikipedia/commons/8/8e/Vanilla_planifolia_cluster_of_green_pods.JPG',page:'https://commons.wikimedia.org/wiki/File:Vanilla_planifolia_cluster_of_green_pods.JPG',license:'CC BY-SA 3.0',author:'B.navez'},
  'Musk':{url:'https://upload.wikimedia.org/wikipedia/commons/3/32/Fruits_and_seeds_of_Abelmoschus_moschatus.jpg',page:'https://commons.wikimedia.org/wiki/File:Fruits_and_seeds_of_Abelmoschus_moschatus.jpg',license:'CC BY 4.0',author:'M108t'},
  'Jasmine':{url:'https://upload.wikimedia.org/wikipedia/commons/8/8e/Jasmine_(Jasminum_sambac).jpg',page:'https://commons.wikimedia.org/wiki/File:Jasmine_(Jasminum_sambac).jpg',license:'CC BY-SA 3.0',author:'Mokkie'},
  'Sandalwood':{url:'https://upload.wikimedia.org/wikipedia/commons/2/2d/White_Sandal_Wood_001.jpg',page:'https://commons.wikimedia.org/wiki/File:White_Sandal_Wood_001.jpg',license:'CC BY-SA 3.0',author:'Jacopo188'},
  'Bergamot':{url:'https://upload.wikimedia.org/wikipedia/commons/9/97/Citrus_bergamia_-_Bergamot.jpg',page:'https://commons.wikimedia.org/wiki/File:Citrus_bergamia_-_Bergamot.jpg',license:'CC BY-SA 3.0',author:'James Steakley'},
  'Vetiver':{url:'https://upload.wikimedia.org/wikipedia/commons/2/23/Vetiveria_zizanoides_dsc07810.jpg',page:'https://commons.wikimedia.org/wiki/File:Vetiveria_zizanoides_dsc07810.jpg',license:'CC BY-SA 3.0',author:'David Monniaux'},
  'Patchouli':{url:'https://upload.wikimedia.org/wikipedia/commons/1/17/Pogostemon_cablin_001.jpg',page:'https://commons.wikimedia.org/wiki/File:Pogostemon_cablin_001.jpg',license:'CC BY-SA 3.0',author:'Valérie75'},
  'Rose':{url:'https://upload.wikimedia.org/wikipedia/commons/2/28/Red_rose.jpg',page:'https://commons.wikimedia.org/wiki/File:Red_rose.jpg',license:'Public domain',author:null},
  'Amber':{url:'https://upload.wikimedia.org/wikipedia/commons/b/be/Cistus_ladanifer_maculatus.JPG',page:'https://commons.wikimedia.org/wiki/File:Cistus_ladanifer_maculatus.JPG',license:'Public domain',author:null},
  'Lavender':{url:'https://upload.wikimedia.org/wikipedia/commons/f/fe/Lavender_Flower_Closeup_2.jpg',page:'https://commons.wikimedia.org/wiki/File:Lavender_Flower_Closeup_2.jpg',license:'CC0',author:null},
  'Cedar':{url:'https://upload.wikimedia.org/wikipedia/commons/2/28/City_of_London_Cemetery_and_Crematorium_~_cedar_branch_and_cone.jpg',page:'https://commons.wikimedia.org/wiki/File:City_of_London_Cemetery_and_Crematorium_~_cedar_branch_and_cone.jpg',license:'CC BY-SA 4.0',author:'Acabashi'},
  'Grapefruit':{url:'https://upload.wikimedia.org/wikipedia/commons/d/d0/Citrus_paradisi_(Grapefruit,_pink)_white_bg.jpg',page:'https://commons.wikimedia.org/wiki/File:Citrus_paradisi_(Grapefruit,_pink)_white_bg.jpg',license:'CC BY-SA 2.5',author:'א (Aleph); derivative work by Raeky'},
  'Tonka Bean':{url:'https://upload.wikimedia.org/wikipedia/commons/8/81/Fava_Tonka%2C_cumaru_02.jpg',page:'https://commons.wikimedia.org/wiki/File:Fava_Tonka,_cumaru_02.jpg',license:'CC BY-SA 4.0',author:'Carlo Brescia'},
  'Lemon':{url:'https://upload.wikimedia.org/wikipedia/commons/f/f8/Whole-Lemon.jpg',page:'https://commons.wikimedia.org/wiki/File:Whole-Lemon.jpg',license:'CC0',author:null},
  'Orange Blossom':{url:'https://upload.wikimedia.org/wikipedia/commons/b/bd/Orange_Blossom.JPG',page:'https://commons.wikimedia.org/wiki/File:Orange_Blossom.JPG',license:'CC BY 3.0',author:'Alexander Hardin'},
  'Pear':{url:'https://upload.wikimedia.org/wikipedia/commons/2/2f/Forelle_pear.jpg',page:'https://commons.wikimedia.org/wiki/File:Forelle_pear.jpg',license:'CC BY-SA 4.0',author:'Rhododendrites'},
  'Apple':{url:'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',page:'https://commons.wikimedia.org/wiki/File:Red_Apple.jpg',license:'CC BY 2.0',author:'Abhijit Tembhekar'},
  'Cardamom':{url:'https://upload.wikimedia.org/wikipedia/commons/6/64/Cardomom_pods.jpg',page:'https://commons.wikimedia.org/wiki/File:Cardomom_pods.jpg',license:'CC BY-SA 3.0',author:'Quadell'},
  'Geranium':{url:'https://upload.wikimedia.org/wikipedia/commons/8/82/Pelargonium_graveolens_2.jpg',page:'https://commons.wikimedia.org/wiki/File:Pelargonium_graveolens_2.jpg',license:'CC BY-SA 2.5',author:'Eric Hunt'},
  'Pink Pepper':{url:'https://upload.wikimedia.org/wikipedia/commons/7/7e/Fruto_de_Schinus_molle.JPG',page:'https://commons.wikimedia.org/wiki/File:Fruto_de_Schinus_molle.JPG',license:'CC BY-SA 4.0',author:'Cristofor Ferrandis'},
  'Ambergris':{url:'https://upload.wikimedia.org/wikipedia/commons/2/2a/Ambergris,_Skagway_Museum.JPG',page:'https://commons.wikimedia.org/wiki/File:Ambergris,_Skagway_Museum.JPG',license:'CC0',author:null},
  'Cinnamon':{url:'https://upload.wikimedia.org/wikipedia/commons/7/76/Cassia_bark_-_(1).jpg',page:'https://commons.wikimedia.org/wiki/File:Cassia_bark_-_(1).jpg',license:'CC BY 2.0',author:'trophygeek (via Flickr)'},
  'Incense':{url:'https://upload.wikimedia.org/wikipedia/commons/1/14/Frankincense_2005-12-31.jpg',page:'https://commons.wikimedia.org/wiki/File:Frankincense_2005-12-31.jpg',license:'Public domain',author:'snotch'},
  'Iris':{url:'https://upload.wikimedia.org/wikipedia/commons/7/76/Purple_iris_flower.JPG',page:'https://commons.wikimedia.org/wiki/File:Purple_iris_flower.JPG',license:'CC BY-SA 4.0',author:'Oleg Yunakov'},
  'Saffron':{url:'https://upload.wikimedia.org/wikipedia/commons/2/21/Crocus_sativus_-_Saffron_crocus_-_Safran_02.JPG',page:'https://commons.wikimedia.org/wiki/File:Crocus_sativus_-_Saffron_crocus_-_Safran_02.JPG',license:'CC BY-SA 4.0',author:'Zeynel Cebeci'},
  'Amberwood':{url:'https://upload.wikimedia.org/wikipedia/commons/2/2d/White_Sandal_Wood_001.jpg',page:'https://commons.wikimedia.org/wiki/File:White_Sandal_Wood_001.jpg',license:'CC BY-SA 3.0',author:'Jacopo188'},
  'Mandarin':{url:'https://upload.wikimedia.org/wikipedia/commons/4/49/Mandarin_Oranges_(Citrus_Reticulata).jpg',page:'https://commons.wikimedia.org/wiki/File:Mandarin_Oranges_(Citrus_Reticulata).jpg',license:'CC BY-SA 3.0',author:'Joe Ravi'},
  'Mint':{url:'https://upload.wikimedia.org/wikipedia/commons/7/7f/CSA-Chocolate-Mint.jpg',page:'https://commons.wikimedia.org/wiki/File:CSA-Chocolate-Mint.jpg',license:'Public domain',author:null},
  'Neroli':{url:'https://upload.wikimedia.org/wikipedia/commons/9/9d/Bitter_orange_-_Citrus_aurantium_01.JPG',page:'https://commons.wikimedia.org/wiki/File:Bitter_orange_-_Citrus_aurantium_01.JPG',license:'CC BY-SA 4.0',author:'Zeynel Cebeci'},
  'Pepper':{url:'https://upload.wikimedia.org/wikipedia/commons/c/c8/Black_Peppercorns.jpg',page:'https://commons.wikimedia.org/wiki/File:Black_Peppercorns.jpg',license:'CC BY-SA 4.0',author:'Xitop753'},
  'Praline':{url:'https://upload.wikimedia.org/wikipedia/commons/b/b2/Lindt_Pralines_Classic.jpg',page:'https://commons.wikimedia.org/wiki/File:Lindt_Pralines_Classic.jpg',license:'Public domain',author:null},
  'Sage':{url:'https://upload.wikimedia.org/wikipedia/commons/3/39/Sage_-_Salvia_officinalis.jpg',page:'https://commons.wikimedia.org/wiki/File:Sage_-_Salvia_officinalis.jpg',license:'CC BY-SA 3.0',author:'Takkk'},
  'Ambroxan':{url:'https://upload.wikimedia.org/wikipedia/commons/5/53/Labdanum_fest.jpg',page:'https://commons.wikimedia.org/wiki/File:Labdanum_fest.jpg',license:'Public domain',author:null},
  'Black Currant':{url:'https://upload.wikimedia.org/wikipedia/commons/d/d2/Black_currant_fruit.jpg',page:'https://commons.wikimedia.org/wiki/File:Black_currant_fruit.jpg',license:'CC0',author:null},
  'Blackcurrant':{url:'https://upload.wikimedia.org/wikipedia/commons/d/d2/Black_currant_fruit.jpg',page:'https://commons.wikimedia.org/wiki/File:Black_currant_fruit.jpg',license:'CC0',author:null},
  'Coffee':{url:'https://upload.wikimedia.org/wikipedia/commons/c/c5/Roasted_coffee_beans.jpg',page:'https://commons.wikimedia.org/wiki/File:Roasted_coffee_beans.jpg',license:'Public domain',author:null},
  'Ginger':{url:'https://upload.wikimedia.org/wikipedia/commons/f/fa/Ginger_Root.jpg',page:'https://commons.wikimedia.org/wiki/File:Ginger_Root.jpg',license:'CC BY-SA 4.0',author:'Sanjay Acharya'},
  'Leather':{url:'https://upload.wikimedia.org/wikipedia/commons/b/b2/Leather.jpg',page:'https://commons.wikimedia.org/wiki/File:Leather.jpg',license:'CC BY-SA 3.0',author:'Tomascastelazo'},
  'Oud':{url:'https://upload.wikimedia.org/wikipedia/commons/9/94/Agarwood_top_grade.jpg',page:'https://commons.wikimedia.org/wiki/File:Agarwood_top_grade.jpg',license:'CC BY-SA 3.0',author:'Hafizmuar'},
  'Peony':{url:'https://upload.wikimedia.org/wikipedia/commons/b/b2/Pink_Peony_Flower.jpg',page:'https://commons.wikimedia.org/wiki/File:Pink_Peony_Flower.jpg',license:'CC0',author:null},
  'Rosemary':{url:'https://upload.wikimedia.org/wikipedia/commons/2/2e/Rosmarinus_officinalis_g1.jpg',page:'https://commons.wikimedia.org/wiki/File:Rosmarinus_officinalis_g1.jpg',license:'CC BY-SA 3.0',author:'Giancarlo Dessì'},
  'Tobacco':{url:'https://upload.wikimedia.org/wikipedia/commons/3/31/P1000483_Nicotiana_tabacum_(tobacco)_(Solanaceae)_Leaf.JPG',page:'https://commons.wikimedia.org/wiki/File:P1000483_Nicotiana_tabacum_(tobacco)_(Solanaceae)_Leaf.JPG',license:'CC BY-SA 3.0',author:'Magnus Manske'},
  'Ylang-Ylang':{url:'https://upload.wikimedia.org/wikipedia/commons/f/f4/Cananga_odorata_02.JPG',page:'https://commons.wikimedia.org/wiki/File:Cananga_odorata_02.JPG',license:'CC BY-SA 3.0',author:'Prenn'},
  'Apricot':{url:'https://upload.wikimedia.org/wikipedia/commons/c/c4/Apricot_fruit.jpg',page:'https://commons.wikimedia.org/wiki/File:Apricot_fruit.jpg',license:'CC BY-SA 3.0',author:'User:Geierunited'},
  'Benzoin':{url:'https://upload.wikimedia.org/wikipedia/commons/c/c8/Kemenyan_110112-11054_tdp.jpg',page:'https://commons.wikimedia.org/wiki/File:Kemenyan_110112-11054_tdp.jpg',license:'CC BY-SA 3.0',author:'Wibowo Djatmiko (Wie146)'},
  'Birch':{url:'https://upload.wikimedia.org/wikipedia/commons/6/63/Peeling_birch.jpg',page:'https://commons.wikimedia.org/wiki/File:Peeling_birch.jpg',license:'CC BY 2.0',author:'Sheila Sund'},
  'Bitter Almond':{url:'https://upload.wikimedia.org/wikipedia/commons/5/5a/Amygdalae_dulcis1.jpg',page:'https://commons.wikimedia.org/wiki/File:Amygdalae_dulcis1.jpg',license:'CC BY-SA 3.0',author:'Tina1'},
  'Calabrian Bergamot':{url:'https://upload.wikimedia.org/wikipedia/commons/8/87/Bergamot_orange_-_whole_and_slice.jpg',page:'https://commons.wikimedia.org/wiki/File:Bergamot_orange_-_whole_and_slice.jpg',license:'CC BY-SA 4.0',author:'Ivar Leidus'},
  'Cashmere Wood':{url:'https://upload.wikimedia.org/wikipedia/commons/2/2d/White_Sandal_Wood_001.jpg',page:'https://commons.wikimedia.org/wiki/File:White_Sandal_Wood_001.jpg',license:'CC BY-SA 3.0',author:'Jacopo188'},
};
// Wikimedia serves originals at full camera resolution (often 3000px+) —
// far too heavy for a 20px chip icon. Its thumbnail service generates a
// resized JPEG on the fly from a predictable URL shape, so request a small
// one instead of shipping megabytes of image data for a tiny circle.
// Confirmed live (2026-08-25): a direct/hotlinked request to Wikimedia's
// thumbnail endpoint for an arbitrary width (e.g. .../240px-Foo.jpg) comes
// back as an HTTP 400 "Use thumbnail sizes listed on https://w.wiki/GHai" —
// unlike the PHP-mediated InstantCommons/imageinfo path, direct hotlinking
// is restricted to a fixed set of widths and does NOT get silently rounded
// up. This is what made every note photo on the live site fail at once.
// Snap the requested width up to the nearest size Wikimedia actually serves.
const WIKI_THUMB_STEPS = [20, 40, 60, 120, 250, 330, 500, 960, 1280, 1920, 3840];
function wikiThumb(url, px){
  const m = url.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/(\w\/\w\w)\/(.+)$/);
  if (!m) return url;
  const step = WIKI_THUMB_STEPS.find(s => s >= px) || WIKI_THUMB_STEPS[WIKI_THUMB_STEPS.length - 1];
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${m[1]}/${m[2]}/${step}px-${m[2]}`;
}
function noteIcon(n){
  const img = NOTE_IMAGE[n];
  if (!img) return '';
  return `<img class="nphoto" src="${wikiThumb(img.url, 48)}" alt="" width="18" height="18" loading="lazy" onerror="this.remove()">`;
}

/* ---------- note descriptions: a short, plain-language primer for each
   photographed note — what it smells like and where it shows up — used by
   the "Know your notes" library on notes.html and each note's own page
   (note.html?n=...). Scoped to the same notes as NOTE_IMAGE for now, since
   a card in that library always has a photo. ---------- */
const NOTE_DESC = {
  'Vanilla':'Warm, sweet and creamy with a soft powdery edge — one of the most-used base notes, prized for rounding out sharper accords.',
  'Musk':'A soft, skin-like warmth with a faintly animalic depth. Modern musks are synthetic, added to a fragrance\'s base for sensuality and lasting power.',
  'Jasmine':'An intensely heady white floral, sweet and slightly narcotic. One of perfumery\'s most prized heart notes, especially the Grasse and Sambac varieties.',
  'Sandalwood':'A soft, creamy, milky wood with a faint natural sweetness. Long prized — especially Mysore sandalwood — for the velvety base it lends a composition.',
  'Bergamot':'A bright, zesty citrus with a subtle floral bitterness. The signature opening note of colognes (and of Earl Grey tea), grown mainly in Calabria, Italy.',
  'Vetiver':'An earthy, smoky root with green, woody facets. A backbone of masculine fragrances, giving grounding depth to a composition\'s base.',
  'Patchouli':'A dark, earthy leaf note with chocolatey, camphorous undertones. At home equally in bohemian 1970s-style scents and modern chypres.',
  'Rose':'The classic floral — sweet, dewy and slightly spicy, ranging from jammy Turkish rose to the greener, tea-like Bulgarian varieties.',
  'Amber':'A warm, resinous, honeyed accord — not a single raw material, but a blend built from labdanum, benzoin and vanilla. Instantly recognizable as cozy and sweet.',
  'Lavender':'Fresh and herbaceous with a camphorous edge and a hint of sweetness. A fougère staple, pairing barbershop freshness with a calming, aromatic quality.',
  'Cedar':'A dry, pencil-shavings wood note, clean and slightly sharp. A workhorse base note that adds structure without heaviness.',
  'Grapefruit':'A tart, bittersweet citrus with a slightly bitter pith facet. Gives fragrances a modern, sparkling, energetic opening.',
  'Tonka Bean':'Sweet, warm and hay-like, with a hint of almond and vanilla. A gourmand base note beloved for its soft, cozy sweetness.',
  'Lemon':'Sharp, juicy and unmistakably fresh. The brightest of the citrus top notes — it evaporates quickly but leaves instant sparkle.',
  'Orange Blossom':'The delicate, honeyed flower of the bitter orange tree — softer and less indolic than neroli, with a warm, sunny sweetness.',
  'Pear':'A crisp, juicy fruit note with a soft, slightly green sweetness. Lends fragrances a fresh, modern fruitiness without excess sugar.',
  'Apple':'Crisp and green, or sweet and red, depending on the accord. A familiar, approachable fruit note common in fresh, youthful compositions.',
  'Cardamom':'A warm, spicy-green seed with a camphorous, faintly citrus edge. Adds an exotic lift to both gourmand and woody fragrances.',
  'Geranium':'Green, rosy and minty all at once. Often used as an affordable, herbal echo of rose in the heart of a fragrance.',
  'Pink Pepper':'A light, fruity-spicy berry (not a true pepper). Adds a sparkling, slightly rosy tingle to modern fragrance openings.',
  'Ambergris':'A rare, prized marine material historically from sperm whales, now almost always replaced by synthetics — salty, warm and softly animalic.',
  'Cinnamon':'Warm, sweet-spicy bark with a slight woody bite. Brings cozy, gourmand warmth to oriental and holiday-style compositions.',
  'Incense':'Resinous and smoky with a churchlike, meditative quality. Usually built from frankincense or myrrh, lending mystery and depth.',
  'Iris':'Powdery, cool and faintly carroty, drawn from the dried root (orris) of the iris flower. One of perfumery\'s most luxurious raw materials.',
  'Saffron':'A leathery, slightly medicinal spice with a dry warmth. Used sparingly to add an exotic, luxurious edge to oriental fragrances.',
  'Amberwood':'A modern accord pairing amber\'s warmth with a smooth woody backbone. Common in contemporary unisex and masculine scents.',
  'Mandarin':'Sweeter and softer than orange, with a slightly green, zesty rind character. A gentle, approachable citrus opening.',
  'Mint':'Cool, sharp and immediately refreshing. Used in small doses to add a crisp, invigorating edge to citrus and aromatic openings.',
  'Neroli':'The bitter orange blossom in its brighter, greener form — fresh, slightly bitter and honeyed. A classic eau de cologne note.',
  'Pepper':'A dry, sharp spice with a warming bite. Black pepper especially adds an energetic, slightly smoky kick to an opening.',
  'Praline':'A sweet, toasted, nutty-caramel gourmand note. Brings a dessert-like richness to sweet, indulgent compositions.',
  'Sage':'Herbal, slightly peppery and faintly medicinal. Adds an aromatic, savory green facet to fougères and woody blends.',
  'Ambroxan':'A clean, dry, mineral-amber facet derived from ambergris chemistry. A modern staple prized for its diffusive, skin-like warmth.',
  'Black Currant':'A tart, sharp berry note with a green, almost catty facet. A signature opening in many modern fruity-chypre fragrances.',
  'Blackcurrant':'A tart, sharp berry note with a green, almost catty facet. A signature opening in many modern fruity-chypre fragrances.',
  'Coffee':'Roasted, dark and bittersweet. A bold gourmand note that adds richness and a jolt of modernity to oriental compositions.',
  'Ginger':'Warm, spicy and slightly citrusy with a peppery bite. Adds a zesty, energizing spark to fresh and oriental blends alike.',
  'Leather':'A dry, smoky, slightly animalic accord evoking tanned hide — ranging from soft suede to birch-tar harshness depending on the composition.',
  'Oud':'A dark, smoky, intensely complex wood from resin-infected agarwood. One of perfumery\'s most prized — and expensive — raw materials.',
  'Peony':'A soft, dewy, slightly rosy-fruity floral. Peonies have little natural scent, so "peony" accords are built to feel fresh, romantic and youthful.',
  'Rosemary':'Sharp, herbal and faintly camphorous. A classic aromatic note that adds a savory, invigorating green edge.',
  'Tobacco':'Rich, sweet and slightly fermented with a dried-leaf warmth. Lends fragrances an old-world, smoky-sweet sophistication.',
  'Ylang-Ylang':'A heady, creamy tropical flower with banana- and custard-like facets. A key note in classic florals like Chanel No. 5.',
  'Apricot':'A soft, velvety stone fruit note with a gentle sweetness. Adds a warm, sun-ripened fruitiness without being sharp.',
  'Benzoin':'A sweet, vanilla-like resin with a soft balsamic warmth. A classic amber-family base note that adds cozy depth.',
  'Birch':'A smoky, slightly tarry wood note with a leathery edge. Historically used (as birch tar) to give leather accords their rugged character.',
  'Bitter Almond':'A marzipan-like, slightly bitter nutty note. Brings a soft, gourmand sweetness reminiscent of cherry stones.',
  'Calabrian Bergamot':'Bergamot specifically from Calabria, Italy — considered the finest source, with an especially bright, refined citrus character.',
  'Cashmere Wood':'A soft, smooth, modern woody accord designed to feel the way cashmere fabric feels — warm and comforting rather than sharp.',
};
function noteDescription(n){ return NOTE_DESC[n] || ''; }

function pcardHTML(p, i){
  const g = famColor(p.family);
  const dupeBadge = p.dupeOf ? `<span class="dupe">DUPE</span>` : '';
  const art = p.image ? `<img class="realphoto" src="${p.image}" alt="${p.name} bottle" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'bottle'}))">` : `<div class="bottle"></div>`;
  return `<a class="pcard" href="perfume.html?id=${p.id}" style="background:linear-gradient(150deg,${g[0]},${g[1]})">
    <div class="em">${sigCanvasHTML(p)}<span class="fam">${p.family.toUpperCase()}</span>${dupeBadge}${art}</div>
    <div class="info"><div class="bd">${houseName(p.houseId)}</div><div class="nm">${p.name}</div>
    <div class="prow"><span class="rate">★ ${p.rating}</span><span class="buy">$${p.price} ↗</span></div></div></a>`;
}

/* ---------- Scent DNA: per-fragrance accord fingerprint (radar chart) ---------- */
const NOTE_CATEGORY_SHORT = { 'Green & Aromatic':'Green', 'Amber & Resin':'Amber', 'Gourmand & Sweet':'Sweet', 'Musk & Animalic':'Musk', 'Leather & Tobacco':'Leather', 'Marine & Mineral':'Marine' };
function shortCat(c){ return NOTE_CATEGORY_SHORT[c] || c; }

function perfumeCategoryTally(p){
  const cats = NOTE_CATEGORY_ORDER.filter(c => c !== 'Other');
  const t = {}; cats.forEach(c => t[c] = 0);
  perfumeAllNotes(p).forEach(n => { const c = noteCategory(n); if (t.hasOwnProperty(c)) t[c]++; });
  return t;
}

function scentDnaSVG(p, size){
  size = size || 300;
  const cats = NOTE_CATEGORY_ORDER.filter(c => c !== 'Other');
  const tally = perfumeCategoryTally(p);
  const maxVal = Math.max(1, ...cats.map(c => tally[c]));
  const cx = size/2, cy = size/2, R = size*0.34, n = cats.length;
  const g = famColor(p.family);
  const angle = i => (Math.PI*2*i/n) - Math.PI/2;
  const pt = (i,frac) => [cx + Math.cos(angle(i))*R*frac, cy + Math.sin(angle(i))*R*frac];

  let rings = '';
  [0.25,0.5,0.75,1].forEach(f => {
    rings += `<polygon points="${cats.map((_,i)=>pt(i,f).join(',')).join(' ')}" style="fill:none;stroke:var(--border);stroke-width:1"/>`;
  });
  let spokes = '', labels = '';
  cats.forEach((c,i) => {
    const [x,y] = pt(i,1);
    spokes += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" style="stroke:var(--border)"/>`;
    const [lx,ly] = pt(i,1.2);
    labels += `<text x="${lx}" y="${ly}" font-size="11" text-anchor="middle" dominant-baseline="middle" style="fill:var(--muted);font-family:var(--disp);font-weight:700">${shortCat(c)}</text>`;
  });
  const dataPts = cats.map((c,i) => pt(i, Math.min((tally[c]||0)/maxVal, 1)).join(',')).join(' ');
  const gid = 'dna-' + p.id;
  return `<svg viewBox="0 0 ${size} ${size}" class="dnasvg">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${g[0]}"/><stop offset="100%" stop-color="${g[1]}"/>
    </linearGradient></defs>
    ${rings}${spokes}
    <polygon points="${dataPts}" fill="url(#${gid})" fill-opacity="0.5" stroke="${g[0]}" stroke-width="2.5"/>
    ${labels}
  </svg>`;
}

/* ---------- Scent Signature: animated note-driven visual identity ----------
   Replaces the flat gradient behind every bottle/photo with a small canvas
   of drifting particles seeded from that fragrance's own top/heart/base note
   counts (small+fast+bright near the top for top notes, large+slow+deep near
   the bottom for base notes). A single shared rAF loop drives every canvas
   on the page; a periodic scan picks up canvases added by later re-renders
   (filter changes, etc.) without any page needing to call anything itself.
*/
function sigCanvasHTML(p){
  const g = famColor(p.family);
  return `<canvas class="sigcanvas" data-top="${p.notes.top.length}" data-heart="${p.notes.heart.length}" data-base="${p.notes.base.length}" data-c1="${g[0]}" data-c2="${g[1]}" aria-hidden="true"></canvas>`;
}

function _sigHexToRgb(h){ h = h.replace('#',''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; }
function _sigMix(a,b,t){ return a.map((v,i)=>Math.round(v+(b[i]-v)*t)); }

const _sigSystems = [];
let _sigStarted = false;
const _sigObserver = (typeof IntersectionObserver !== 'undefined') ? new IntersectionObserver(entries => {
  entries.forEach(en => { const sys = _sigSystems.find(s => s.canvas === en.target); if (sys) sys.visible = en.isIntersecting; });
}, {rootMargin:'150px'}) : null;

function _sigBuild(canvas){
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 200;
  const h = canvas.clientHeight || (canvas.parentElement && canvas.parentElement.clientHeight) || 150;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const c1 = _sigHexToRgb(canvas.dataset.c1), c2 = _sigHexToRgb(canvas.dataset.c2);
  const top = +canvas.dataset.top || 0, heart = +canvas.dataset.heart || 0, base = +canvas.dataset.base || 0;
  const particles = [];
  function seed(count, zoneY, zoneH, sizeR, speedR, tR){
    for (let i=0;i<count;i++){
      particles.push({
        x: Math.random()*w,
        baseY: zoneY + Math.random()*zoneH,
        r: sizeR[0] + Math.random()*(sizeR[1]-sizeR[0]),
        speed: speedR[0] + Math.random()*(speedR[1]-speedR[0]),
        phase: Math.random()*Math.PI*2,
        t: tR[0] + Math.random()*(tR[1]-tR[0]),
        drift: w * (0.02 + Math.random()*0.035)
      });
    }
  }
  seed(top,   h*0.04, h*0.28, [2,4],  [0.018,0.03],  [0.05,0.25]);
  seed(heart, h*0.36, h*0.28, [4,8],  [0.010,0.017], [0.35,0.6]);
  seed(base,  h*0.66, h*0.30, [8,15], [0.004,0.009], [0.7,0.95]);
  return { canvas, ctx, w, h, particles, c1, c2, visible: true };
}

function _sigDraw(sys){
  const { ctx, w, h, particles, c1, c2 } = sys;
  ctx.clearRect(0, 0, w, h);
  particles.forEach(pt => {
    pt.phase += pt.speed;
    const x = pt.x + Math.sin(pt.phase) * pt.drift;
    const y = pt.baseY + Math.cos(pt.phase * 0.7) * (pt.drift * 0.55);
    const col = _sigMix(c1, c2, pt.t);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, pt.r);
    grad.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.85)`);
    grad.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(x, y, pt.r, 0, Math.PI*2); ctx.fill();
  });
}

function _sigScan(){
  document.querySelectorAll('canvas.sigcanvas:not([data-siginit])').forEach(canvas => {
    canvas.dataset.siginit = '1';
    const sys = _sigBuild(canvas);
    _sigSystems.push(sys);
    if (_sigObserver) _sigObserver.observe(canvas);
  });
}

function _sigTick(){
  for (let i = _sigSystems.length - 1; i >= 0; i--){
    const sys = _sigSystems[i];
    if (!sys.canvas.isConnected){
      if (_sigObserver) _sigObserver.unobserve(sys.canvas);
      _sigSystems.splice(i, 1);
      continue;
    }
    if (sys.visible !== false) _sigDraw(sys);
  }
  requestAnimationFrame(_sigTick);
}

function startSigSystem(){
  if (_sigStarted) return;
  _sigStarted = true;
  _sigScan();
  setInterval(_sigScan, 400);
  requestAnimationFrame(_sigTick);
}

/* ---------- logo mark ---------- */
function logoSVG(w,h){
  return `<svg width="${w}" height="${h}" viewBox="0 0 240 300" aria-hidden="true">
    <defs><linearGradient id="navg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00D2FF"/><stop offset=".36" stop-color="#8B7CFF"/><stop offset=".7" stop-color="#FF4D9D"/><stop offset="1" stop-color="#00C48B"/>
    </linearGradient></defs>
    <g fill="none" stroke="url(#navg)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">
      <path d="M120 26 C133 26 143 36 143 49 L143 64 L97 64 L97 49 C97 36 107 26 120 26 Z"/>
      <rect x="104" y="64" width="32" height="20" rx="3"/>
      <rect x="44" y="96" width="152" height="160" rx="24"/>
      <rect x="62" y="114" width="116" height="124" rx="12" stroke-width="3.2"/>
      <g stroke-width="4"><ellipse cx="120" cy="176" rx="21" ry="50"/><ellipse cx="120" cy="176" rx="50" ry="21"/><ellipse cx="120" cy="176" rx="17" ry="46" transform="rotate(45 120 176)"/><ellipse cx="120" cy="176" rx="17" ry="46" transform="rotate(-45 120 176)"/></g>
      <circle cx="120" cy="176" r="8" fill="url(#navg)" stroke="none"/>
    </g>
  </svg>`;
}

/* ---------- nav + footer chrome ---------- */
function renderNav(active){
  const link = (href,label,key)=>`<a href="${href}"${active===key?' class="on"':''}>${label}</a>`;
  return `<div class="wrap nav">
    <a class="logo" href="index.html">${logoSVG(44,55)}ParfAI</a>
    <div class="navlinks" id="navlinks-drawer">
      <span class="megawrap"><span class="menu">Explore <span class="car">▾</span></span>
        <div class="mega"><div class="cols">
          <div><div class="colhead">Browse fragrances</div>
            <a class="it" href="explore.html"><b>By family</b><span>Woody, floral, fresh &amp; more</span></a>
            <a class="it" href="notes.html"><b>By note</b><span>Rose, oud, vanilla &amp; more</span></a>
            <a class="it" href="houses.html"><b>By house</b><span>Creed, Dior, Chanel…</span></a>
            <a class="it" href="explore.html"><b>All fragrances</b><span>Browse the full catalog</span></a></div>
          <div><div class="colhead">&nbsp;</div>
            <a class="it" href="explore.html?sort=new"><b>New releases</b><span>Just dropped</span></a>
            <a class="it" href="explore.html?sort=trending"><b>Trending</b><span>Hot right now</span></a>
            <a class="it" href="explore.html?tier=Affordable"><b>Best value</b><span>Big scent, small price</span></a></div>
          <div><div class="colhead">Smart tools</div>
            <a class="it" href="dupe-finder.html"><b>Dupe Finder</b><span>Affordable alternatives</span></a>
            <a class="it" href="explore.html"><b>Find My Scent</b><span>Filter by family, note &amp; more</span></a>
            <a class="it" href="explore.html"><b>Scent DNA</b><span>Any fragrance's note fingerprint</span></a>
            <a class="it" href="layering.html"><b>Layering Recipe Builder <span class="newbadge" style="background:var(--rust)">SOON</span></b><span>Combine fragrances into a recipe</span></a>
            <a class="it" href="weather-pick.html"><b>Weather-Aware Pick <span class="newbadge">LIVE</span></b><span>Today's pick, based on real weather</span></a></div>
        </div></div>
      </span>
      <span class="megawrap"><span class="menu">Houses <span class="car">▾</span></span>
        <div class="mega"><div class="cols">
          <div><div class="colhead">Designer</div>
            <a class="it" href="house.html?id=dior"><b>Dior</b><span>Sauvage, Homme…</span></a>
            <a class="it" href="house.html?id=chanel"><b>Chanel</b><span>Bleu, No. 5, Coco…</span></a>
            <a class="it" href="house.html?id=ysl"><b>Yves Saint Laurent</b><span>Y, Libre, Black Opium</span></a>
            <a class="it" href="house.html?id=versace"><b>Versace</b><span>Eros, Bright Crystal</span></a></div>
          <div><div class="colhead">Niche</div>
            <a class="it" href="house.html?id=creed"><b>Creed</b><span>Aventus, Green Irish Tweed</span></a>
            <a class="it" href="house.html?id=mfk"><b>Maison Francis Kurkdjian</b><span>Baccarat Rouge 540</span></a>
            <a class="it" href="house.html?id=pdm"><b>Parfums de Marly</b><span>Layton, Delina</span></a>
            <a class="it" href="house.html?id=xerjoff"><b>Xerjoff</b><span>Erba Pura, Naxos</span></a></div>
          <div><div class="colhead">Browse</div>
            <a class="it" href="houses.html"><b>All houses A–Z</b><span>Every brand</span></a>
            <a class="it" href="houses.html?tier=Affordable"><b>Affordable houses</b><span>Armaf, Lattafa, Zara</span></a>
            <a class="it" href="houses.html?tier=Niche"><b>Niche vs designer</b><span>Explore the difference</span></a>
            <a class="it" href="houses.html"><b>All houses</b><span>Full directory</span></a></div>
        </div></div>
      </span>
      <span class="megawrap"><span class="menu">Community <span class="car">▾</span></span>
        <div class="mega"><div class="cols">
          <div><div class="colhead">Join in</div>
            <a class="it" href="community.html"><b>Reviews &amp; ratings</b><span>Rate any fragrance</span></a>
            <a class="it" href="community.html"><b>Scent of the Day</b><span>What you're wearing today</span></a>
            <a class="it" href="community.html"><b>Photo wall</b><span>Shelfies &amp; collections</span></a>
            <a class="it" href="community.html"><b>Ask &amp; recommend</b><span>Get help finding scents</span></a></div>
          <div><div class="colhead">Discuss</div>
            <a class="it" href="community.html"><b>General perfume talk</b><span>Everything fragrance</span></a>
            <a class="it" href="community.html"><b>New to fragrance</b><span>Beginner friendly</span></a>
            <a class="it" href="community.html"><b>Deals &amp; where to buy</b><span>Best prices &amp; drops</span></a>
            <a class="it" href="community.html"><b>Decants &amp; swaps</b><span>Trade samples</span></a></div>
          <div><div class="colhead">Highlights</div>
            <a class="it" href="community.html"><b>Trending discussions</b><span>Hot right now</span></a>
            <a class="it" href="community.html"><b>Top reviewers</b><span>Community leaderboard</span></a>
            <a class="it" href="community.html"><b>Fragrance of the week</b><span>Community pick</span></a>
            <a class="it" href="community.html"><b>Your feed</b><span>People you follow</span></a></div>
        </div></div>
      </span>
      <!-- Pricing nav item removed 2026-08-28 — page archived at archive/pricing.html,
           full content/history preserved in git (see archive/README.md for the
           exact restore steps, including the one nav line to add back here). -->
    </div>
    <div class="navsp"></div>
    <a class="btn ghost" href="login.html">Log in</a>
    <a class="btn" href="signup.html">Get started</a>
    <button class="navburger" id="navburger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navlinks-drawer">
      <span></span><span></span><span></span>
    </button>
  </div>`;
}

function renderFooter(){
  return `<div class="wrap"><footer>
    <div class="fcols">
      <div><b>ParfAI</b><span>The world's first AI perfumer</span></div>
      <div><b>Explore</b><a href="explore.html">Discover</a><a href="dupe-finder.html">Dupe Finder</a><a href="notes.html">Browse by note</a><a href="houses.html">Houses</a></div>
      <div><b>Community</b><a href="community.html">Reviews</a><a href="community.html">Photo wall</a><a href="community.html">Discussions</a></div>
      <div><b>Company</b><a href="about.html">About</a><a href="affiliate-disclosure.html">Affiliate disclosure</a><a href="privacy.html">Privacy</a><a href="credits.html">Photo credits</a><a href="contact.html">Contact</a></div>
    </div>
    <div style="margin-top:24px">© 2026 ParfAI · Some links are affiliate links.</div>
  </footer></div>`;
}

/* ---------- mega-menu open/close ----------
   Pure-CSS :hover chains break the instant the pointer crosses the small
   gap between the nav trigger and the dropdown panel (or moves diagonally
   toward an item instead of straight down), closing the menu before the
   user can click anything inside it. This drives the menu with a JS
   "open" class instead, with a short grace period on mouseleave so a
   diagonal or gap-crossing path doesn't kill the hover state.
*/
function bindMegaMenus(navSlot){
  const wraps = navSlot.querySelectorAll('.megawrap');
  if (!wraps.length) return;
  let closeTimer = null;

  function closeAll(except){
    wraps.forEach(w => { if (w !== except) w.classList.remove('open'); });
  }

  wraps.forEach(w => {
    // Touch browsers commonly synthesize a hover/mouseenter on first tap
    // (to support :hover styling), which would otherwise fight with the
    // tap-to-toggle accordion logic below inside the mobile drawer — so
    // hover only drives anything above the 900px breakpoint.
    w.addEventListener('mouseenter', () => {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      clearTimeout(closeTimer);
      closeAll(w);
      w.classList.add('open');
    });
    w.addEventListener('mouseleave', () => {
      if (window.matchMedia('(max-width: 900px)').matches) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => w.classList.remove('open'), 300);
    });

    const trigger = w.querySelector('.menu');
    if (trigger){
      // Tapping/clicking the trigger opens it (for touch/keyboard, where
      // there's no hover). On desktop it deliberately doesn't toggle closed
      // on a second click, since the hover that opened it already fires
      // mouseenter before the click lands — closing here instead of
      // outside/Escape/mouseleave would make it snap shut immediately.
      // Inside the mobile drawer (see bindMobileNav below) there's no hover
      // at all, so a tap there is a real accordion toggle instead.
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isMobileDrawer = window.matchMedia('(max-width: 900px)').matches;
        if (isMobileDrawer){
          const wasOpen = w.classList.contains('open');
          closeAll(w);
          w.classList.toggle('open', !wasOpen);
        } else {
          clearTimeout(closeTimer);
          closeAll(w);
          w.classList.add('open');
        }
      });
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.megawrap')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

/* ---------- mobile nav (hamburger + slide-down drawer) ----------
   Below the 900px breakpoint .navlinks is hidden by default (see
   parfai.css) — there is no way to reach Explore/Houses/Community
   otherwise. This reveals the same .navlinks markup as a
   full-height drawer instead of duplicating the link data anywhere. */
function bindMobileNav(navSlot){
  const burger = navSlot.querySelector('#navburger');
  const drawer = navSlot.querySelector('#navlinks-drawer');
  if (!burger || !drawer) return;

  function closeDrawer(){
    drawer.classList.remove('mobileopen');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('navlock');
  }
  function openDrawer(){
    drawer.classList.add('mobileopen');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('navlock');
  }

  burger.addEventListener('click', () => {
    drawer.classList.contains('mobileopen') ? closeDrawer() : openDrawer();
  });
  // Tapping an actual link (not a mega-menu accordion trigger) closes the drawer and navigates.
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a[href]')) closeDrawer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
  // Resizing past the breakpoint (e.g. rotating a tablet) shouldn't leave a phantom open drawer.
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 901px)').matches) closeDrawer();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const navSlot = document.getElementById('nav-slot');
  const footSlot = document.getElementById('footer-slot');
  if (navSlot) {
    navSlot.innerHTML = renderNav(navSlot.dataset.active || '');
    bindMegaMenus(navSlot);
    bindMobileNav(navSlot);
  }
  if (footSlot) footSlot.innerHTML = renderFooter();
  startSigSystem();
});
