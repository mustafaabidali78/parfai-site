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
];

const FAM_COLOR = {
  Chypre:['#FF8C42','#FF4D6D'], Woody:['#A855F7','#7C3AED'], Oriental:['#FF8C42','#CC4400'],
  Fresh:['#00D2D3','#0099CC'], Floral:['#FF6BAE','#C9184A'], Aromatic:['#3D9CF5','#1565C0'],
  Amber:['#FFB86B','#C9772E'], Gourmand:['#FFD93D','#FF8F00'],
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
    dupeIds:['lattafa-yara'],
    image:"images/perfumes/black-opium.png" },
  { id:'coco-mademoiselle', name:'Coco Mademoiselle', houseId:'chanel', family:'Chypre', gender:'Women', year:2001, perfumer:'Jacques Polge', concentration:'EDP', price:145, rating:4.5, reviews:7120, tier:'Designer',
    notes:{top:['Orange','Bergamot'],heart:['Jasmine','Rose','Litchi'],base:['Patchouli','Vetiver','White Musk']},
    accords:['Chypre','Floral','Woody'],
    longevity:'Long lasting (7-12h)', sillage:'Moderate',
    description:'A modern chypre that pairs bright citrus with a warm patchouli base — sophisticated, office-appropriate, ages beautifully on skin.',
    dupeIds:[],
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
    dupeIds:[],
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
const GRADS = ['#00B8D4,#6C4CFF','#FF4D9D,#FF8C42','#A855F7,#7C3AED','#00C48B,#00B8D4','#FF6BAE,#C9184A','#3D9CF5,#1565C0','#FFD93D,#FF8F00','#6C4CFF,#FF4D9D'];
function gr(i){ return `linear-gradient(140deg,${GRADS[i%GRADS.length]})`; }
function av(i){ return `background:${gr(i+2)}`; }
function famColor(fam){ return FAM_COLOR[fam] || ['#6C4CFF','#00B8D4']; }
function houseName(id){ const h = HOUSES.find(h=>h.id===id); return h ? h.name : id; }
function perfumeById(id){ return PERFUMES.find(p=>p.id===id); }
function qs(name){ return new URLSearchParams(window.location.search).get(name); }

function pcardHTML(p, i){
  const g = famColor(p.family);
  const dupeBadge = p.dupeOf ? `<span class="dupe">DUPE</span>` : '';
  const art = p.image ? `<img class="realphoto" src="${p.image}" alt="${p.name} bottle" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'bottle'}))">` : `<div class="bottle"></div>`;
  return `<a class="pcard" href="perfume.html?id=${p.id}">
    <div class="em" style="background:linear-gradient(140deg,${g[0]},${g[1]})"><span class="fam">${p.family.toUpperCase()}</span>${dupeBadge}${art}</div>
    <div class="info"><div class="bd">${houseName(p.houseId)}</div><div class="nm">${p.name}</div>
    <div class="prow"><span class="rate">★ ${p.rating}</span><span class="buy">$${p.price} ↗</span></div></div></a>`;
}

/* ---------- logo mark ---------- */
function logoSVG(w,h){
  return `<svg width="${w}" height="${h}" viewBox="0 0 240 300" aria-hidden="true">
    <defs><linearGradient id="navg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#00D2FF"/><stop offset=".36" stop-color="#6C4CFF"/><stop offset=".7" stop-color="#FF4D9D"/><stop offset="1" stop-color="#00C48B"/>
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
    <div class="navlinks">
      <span class="megawrap"><span class="menu">Explore <span class="car">▾</span></span>
        <div class="mega"><div class="cols">
          <div><div class="colhead">Browse fragrances</div>
            <a class="it" href="explore.html"><b>By family</b><span>Woody, floral, fresh &amp; more</span></a>
            <a class="it" href="houses.html"><b>By house</b><span>Creed, Dior, Chanel…</span></a>
            <a class="it" href="explore.html"><b>All fragrances</b><span>Browse the full catalog</span></a></div>
          <div><div class="colhead">&nbsp;</div>
            <a class="it" href="explore.html?sort=new"><b>New releases</b><span>Just dropped</span></a>
            <a class="it" href="explore.html?sort=trending"><b>Trending</b><span>Hot right now</span></a>
            <a class="it" href="explore.html?tier=Affordable"><b>Best value</b><span>Big scent, small price</span></a></div>
          <div><div class="colhead">AI tools</div>
            <a class="it" href="dupe-finder.html"><b>Dupe Finder</b><span>Affordable alternatives</span></a>
            <a class="it" href="explore.html"><b>Find My Scent</b><span>Describe it, AI picks</span></a>
            <a class="it" href="pricing.html"><b>Scent DNA</b><span>Your scent personality</span></a>
            <a class="it" href="pricing.html"><b>Gift Finder</b><span>The perfect present</span></a></div>
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
      ${link('pricing.html','Pricing','pricing')}
    </div>
    <div class="navsp"></div>
    <a class="btn ghost" href="login.html">Log in</a>
    <a class="btn" href="signup.html">Get started</a>
  </div>`;
}

function renderFooter(){
  return `<div class="wrap"><footer>
    <div class="fcols">
      <div><b>ParfAI</b><span>The world's first AI perfumer</span></div>
      <div><b>Explore</b><a href="explore.html">Discover</a><a href="dupe-finder.html">Dupe Finder</a><a href="explore.html">Fragrance wheel</a><a href="houses.html">Houses</a></div>
      <div><b>Community</b><a href="community.html">Reviews</a><a href="community.html">Photo wall</a><a href="community.html">Discussions</a></div>
      <div><b>Company</b><a href="about.html">About</a><a href="affiliate-disclosure.html">Affiliate disclosure</a><a href="privacy.html">Privacy</a><a href="contact.html">Contact</a></div>
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
    w.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      closeAll(w);
      w.classList.add('open');
    });
    w.addEventListener('mouseleave', () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => w.classList.remove('open'), 300);
    });

    const trigger = w.querySelector('.menu');
    if (trigger){
      // Tapping/clicking the trigger opens it (for touch/keyboard, where
      // there's no hover). It deliberately doesn't toggle closed on a
      // second click, since on desktop the hover that opened it already
      // fires mouseenter before the click lands — closing here instead of
      // outside/Escape/mouseleave would make it snap shut immediately.
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        clearTimeout(closeTimer);
        closeAll(w);
        w.classList.add('open');
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

document.addEventListener('DOMContentLoaded', () => {
  const navSlot = document.getElementById('nav-slot');
  const footSlot = document.getElementById('footer-slot');
  if (navSlot) {
    navSlot.innerHTML = renderNav(navSlot.dataset.active || '');
    bindMegaMenus(navSlot);
  }
  if (footSlot) footSlot.innerHTML = renderFooter();
});
