/* Chrononaut subject-matter archive. Add/edit answer pools here; gameplay rules live in question-engine.js. */
(function (global) {
  const GAME_SEEDS = [
      // ========================================================================
      // SEED 0: EXPEDITION #01 (7 Jumps)
      // ========================================================================
      {
        id: 'EXPEDITION #01',
        rounds: [
          {
            era: 'Ancient History',
            constraint: 'Fell Before 500 AD',
            theme: { accent: '#B85A2A', skyTop: '#F3E5D0', skyBottom: '#E9D4B7', symbol: 'pillar' },
            prompt: 'Name an ancient civilization or empire that fell before 500 AD',
            hint: 'Rome & Egypt give +15–18 yrs fuel; Bronze or Iron Age kingdoms yield up to +100 yrs.',
            answers: [
              { name: 'Western Roman Empire', aliases: ['roman empire', 'rome', 'ancient rome'], year: '476 AD', points: 15, tier: 'Common', fact: 'Collapsed in 476 AD when Germanic chieftain Odoacer deposed Emperor Romulus Augustulus.' },
              { name: 'Ancient Egypt', aliases: ['egypt', 'ptolemaic egypt', 'ptolemaic kingdom'], year: '30 BC', points: 18, tier: 'Common', fact: 'Over three millennia of pharaonic rule ended when Rome annexed Egypt after Cleopatra’s death.' },
              { name: 'Ancient Greece', aliases: ['greece', 'classical greece', 'hellenic'], year: '146 BC', points: 20, tier: 'Common', fact: 'Fell under Roman hegemony following the Battle of Corinth in 146 BC.' },
              { name: 'Persian Empire', aliases: ['achaemenid empire', 'persia', 'achaemenid'], year: '330 BC', points: 25, tier: 'Common', fact: 'Conquered by Alexander the Great after the fall of Persepolis in 330 BC.' },
              { name: 'Macedonian Empire', aliases: ['macedon', 'macedonia', 'alexanders empire'], year: '168 BC', points: 35, tier: 'Uncommon', fact: 'Alexander’s heartland kingdom was dismantled by Rome after the Battle of Pydna.' },
              { name: 'Han Dynasty', aliases: ['han empire', 'han china'], year: '220 AD', points: 38, tier: 'Uncommon', fact: 'China’s golden age dynasty fractured into the Three Kingdoms period in 220 AD.' },
              { name: 'Babylonian Empire', aliases: ['babylon', 'neo babylonian empire', 'babylonia'], year: '539 BC', points: 40, tier: 'Uncommon', fact: 'Fell to Cyrus the Great of Persia in 539 BC without a prolonged siege.' },
              { name: 'Assyrian Empire', aliases: ['assyria', 'neo assyrian empire'], year: '609 BC', points: 45, tier: 'Uncommon', fact: 'Collapsed rapidly after the sack of Nineveh by a coalition of Babylonians and Medes.' },
              { name: 'Carthaginian Empire', aliases: ['carthage', 'punic empire'], year: '146 BC', points: 50, tier: 'Uncommon', fact: 'Rome’s greatest Mediterranean rival was destroyed at the end of the Third Punic War.' },
              { name: 'Qin Dynasty', aliases: ['qin empire', 'qin'], year: '206 BC', points: 55, tier: 'Uncommon', fact: 'The first unified Chinese imperial dynasty collapsed just 15 years after its founding.' },
              { name: 'Maurya Empire', aliases: ['mauryan empire', 'maurya'], year: '185 BC', points: 62, tier: 'Rare', fact: 'Unified nearly the entire Indian subcontinent before fragmenting after Ashoka’s death.' },
              { name: 'Sumer', aliases: ['sumerian civilization', 'sumeria'], year: '2004 BC', points: 65, tier: 'Rare', fact: 'The world’s earliest known urban civilization in Mesopotamia ended with the fall of Ur.' },
              { name: 'Hittite Empire', aliases: ['hittites', 'hatti'], year: '1178 BC', points: 68, tier: 'Rare', fact: 'Anatolian superpower that disintegrated during the Late Bronze Age Collapse.' },
              { name: 'Phoenicia', aliases: ['phoenician civilization', 'phoenicians'], year: '539 BC', points: 70, tier: 'Rare', fact: 'Maritime trading city-states absorbed by the Achaemenid Persian Empire.' },
              { name: 'Parthian Empire', aliases: ['parthia', 'arsacid empire'], year: '224 AD', points: 74, tier: 'Rare', fact: 'Rome’s eastern rival for centuries until overthrown by Ardashir I of the Sasanian Empire.' },
              { name: 'Seleucid Empire', aliases: ['seleucids'], year: '63 BC', points: 76, tier: 'Rare', fact: 'Hellenistic successor state to Alexander’s empire reduced to a Roman province by Pompey.' },
              { name: 'Indus Valley Civilization', aliases: ['harappan civilization', 'harappa', 'indus valley'], year: '1300 BC', points: 78, tier: 'Rare', fact: 'Bronze Age urban culture famed for grid-planned cities like Mohenjo-daro.' },
              { name: 'Minoan Civilization', aliases: ['minoans', 'minoan crete'], year: '1450 BC', points: 82, tier: 'Rare', fact: 'Europe’s first advanced Bronze Age civilization, centered on the palace of Knossos.' },
              { name: 'Mycenaean Greece', aliases: ['mycenaeans', 'mycenaean civilization'], year: '1100 BC', points: 85, tier: 'Paradox', fact: 'Palatial Bronze Age civilization of Homer’s epics that vanished in the Bronze Age Collapse.' },
              { name: 'Olmec Civilization', aliases: ['olmecs', 'olmec'], year: '400 BC', points: 88, tier: 'Paradox', fact: 'Mesoamerica’s earliest major civilization, famous for colossal carved basalt heads.' },
              { name: 'Kushan Empire', aliases: ['kushans'], year: '375 AD', points: 92, tier: 'Paradox', fact: 'Syncretic Central Asian and North Indian empire vital to Silk Road Buddhism.' },
              { name: 'Kingdom of Kush', aliases: ['kush', 'nubian empire', 'meroe'], year: '350 AD', points: 95, tier: 'Paradox', fact: 'Nubian powerhouse south of Egypt whose pyramid-building capital Meroë fell around 350 AD.' },
              { name: 'Akkadian Empire', aliases: ['akkad', 'akkadians'], year: '2154 BC', points: 98, tier: 'Paradox', fact: 'Founded by Sargon of Akkad, widely considered the first true multinational empire in history.' },
              { name: 'Nabataean Kingdom', aliases: ['nabataeans', 'petra kingdom'], year: '106 AD', points: 100, tier: 'Paradox', fact: 'Arabian desert trading kingdom that carved Petra before being annexed by Emperor Trajan.' }
            ]
          },
          {
            era: '19th Century Art',
            constraint: 'Active in 1800s',
            theme: { accent: '#264E70', skyTop: '#E4ECF2', skyBottom: '#D3E0EA', symbol: 'compass' },
            prompt: 'Name a painter who was active during the 1800s (19th century)',
            hint: 'Impressionists, Romantics, Realists, or Ukiyo-e masters.',
            answers: [
              { name: 'Vincent van Gogh', aliases: ['van gogh', 'vincent vangogh'], year: '1853–1890', points: 15, tier: 'Common', fact: 'Painted over 2,100 artworks in just a decade, including The Starry Night in 1889.' },
              { name: 'Claude Monet', aliases: ['monet'], year: '1840–1926', points: 18, tier: 'Common', fact: 'Founder of French Impressionism, named after his 1872 painting Impression, Sunrise.' },
              { name: 'Edgar Degas', aliases: ['degas'], year: '1834–1917', points: 25, tier: 'Common', fact: 'Renowned for his pastel drawings and oil paintings of Parisian ballet dancers.' },
              { name: 'Pierre-Auguste Renoir', aliases: ['renoir', 'auguste renoir'], year: '1841–1919', points: 28, tier: 'Common', fact: 'Leading Impressionist celebrated for vibrant light and candid scenes like Bal du moulin de la Galette.' },
              { name: 'Paul Cézanne', aliases: ['cezanne', 'paul cezanne'], year: '1839–1906', points: 32, tier: 'Uncommon', fact: 'Post-Impressionist pioneer whose geometric brushwork bridged the 19th century and Cubism.' },
              { name: 'Edvard Munch', aliases: ['munch'], year: '1863–1944', points: 35, tier: 'Uncommon', fact: 'Norwegian Expressionist who painted his iconic masterpiece The Scream in 1893.' },
              { name: 'Édouard Manet', aliases: ['manet', 'edouard manet'], year: '1832–1883', points: 38, tier: 'Uncommon', fact: 'Pivotal modernist who shocked the Paris Salon with Olympia and Le Déjeuner sur l’herbe.' },
              { name: 'Paul Gauguin', aliases: ['gauguin'], year: '1848–1903', points: 42, tier: 'Uncommon', fact: 'Post-Impressionist known for bold color palettes and works painted in Tahiti.' },
              { name: 'Georges Seurat', aliases: ['seurat'], year: '1859–1891', points: 46, tier: 'Uncommon', fact: 'Invented Pointillism, painting A Sunday Afternoon on the Island of La Grande Jatte with tiny dots.' },
              { name: 'Francisco Goya', aliases: ['goya'], year: '1746–1828', points: 48, tier: 'Uncommon', fact: 'Spanish Romantic master who created The Third of May 1808 and his haunting Black Paintings.' },
              { name: 'Katsushika Hokusai', aliases: ['hokusai'], year: '1760–1849', points: 52, tier: 'Uncommon', fact: 'Japanese ukiyo-e master who printed The Great Wave off Kanagawa around 1831.' },
              { name: 'Henri de Toulouse-Lautrec', aliases: ['toulouse lautrec', 'lautrec', 'toulouse-lautrec'], year: '1864–1901', points: 58, tier: 'Rare', fact: 'Immortalized Montmartre cabaret nightlife and the Moulin Rouge in vibrant lithographs.' },
              { name: 'J.M.W. Turner', aliases: ['turner', 'william turner', 'joseph mallord william turner'], year: '1775–1851', points: 62, tier: 'Rare', fact: 'English Romantic landscapist nicknamed the "painter of light" for luminous seascapes.' },
              { name: 'Eugène Delacroix', aliases: ['delacroix', 'eugene delacroix'], year: '1798–1863', points: 65, tier: 'Rare', fact: 'Leader of the French Romantic school who painted Liberty Leading the People in 1830.' },
              { name: 'Gustave Courbet', aliases: ['courbet'], year: '1819–1877', points: 68, tier: 'Rare', fact: 'Led the Realism movement, rejecting idealized academic art to depict ordinary working life.' },
              { name: 'Mary Cassatt', aliases: ['cassatt'], year: '1844–1926', points: 72, tier: 'Rare', fact: 'American painter who exhibited alongside the French Impressionists in Paris.' },
              { name: 'Winslow Homer', aliases: ['homer'], year: '1836–1910', points: 75, tier: 'Rare', fact: 'Foremost 19th-century American realist painter, renowned for dramatic marine scenes.' },
              { name: 'Caspar David Friedrich', aliases: ['friedrich', 'caspar friedrich'], year: '1774–1840', points: 78, tier: 'Rare', fact: 'German Romantic icon who painted Wanderer above the Sea of Fog in 1818.' },
              { name: 'John Singer Sargent', aliases: ['sargent'], year: '1856–1925', points: 80, tier: 'Rare', fact: 'Premier Edwardian-era portraitist famous for Madame X (1884).' },
              { name: 'Gustav Klimt', aliases: ['klimt'], year: '1862–1918', points: 82, tier: 'Rare', fact: 'Co-founded the Vienna Secession in 1897 before entering his famed Golden Phase.' },
              { name: 'Berthe Morisot', aliases: ['morisot'], year: '1841–1895', points: 86, tier: 'Paradox', fact: 'Founding member of the Impressionist group praised for luminous domestic scenes.' },
              { name: 'Ilya Repin', aliases: ['repin'], year: '1844–1930', points: 90, tier: 'Paradox', fact: 'Greatest Russian realist painter of the 19th century, creator of Barge Haulers on the Volga.' },
              { name: 'Camille Pissarro', aliases: ['pissarro'], year: '1830–1903', points: 92, tier: 'Paradox', fact: 'The only artist to exhibit in all eight Paris Impressionist exhibitions.' },
              { name: 'Rosa Bonheur', aliases: ['bonheur'], year: '1822–1899', points: 96, tier: 'Paradox', fact: 'Most celebrated female animalier painter of the 19th century, famed for The Horse Fair.' },
              { name: 'Ivan Aivazovsky', aliases: ['aivazovsky'], year: '1817–1900', points: 100, tier: 'Paradox', fact: 'Armenian-Russian Romantic master who painted over 6,000 seascapes, including The Ninth Wave.' }
            ]
          },
          {
            era: '1970s / 80s Music',
            constraint: 'Formed Before 1980',
            theme: { accent: '#C87D28', skyTop: '#F5EAD4', skyBottom: '#EAD7B5', symbol: 'vinyl' },
            prompt: 'Name a rock, pop, or electronic band formed before 1980',
            hint: 'Classic rock giants give safe fuel; post-punk, prog, or krautrock bands burn hot.',
            answers: [
              { name: 'The Beatles', aliases: ['beatles'], year: 'Formed 1960', points: 15, tier: 'Common', fact: 'Formed in Liverpool in 1960 and became the best-selling music act in history.' },
              { name: 'Queen', aliases: [], year: 'Formed 1970', points: 16, tier: 'Common', fact: 'Formed in London in 1970 by Freddie Mercury, Brian May, Roger Taylor, and John Deacon.' },
              { name: 'Pink Floyd', aliases: [], year: 'Formed 1965', points: 18, tier: 'Common', fact: 'Pioneered progressive and psychedelic rock with albums like The Dark Side of the Moon.' },
              { name: 'Led Zeppelin', aliases: ['zeppelin'], year: 'Formed 1968', points: 20, tier: 'Common', fact: 'Formed in London in 1968, redefining heavy rock and album-oriented radio.' },
              { name: 'The Rolling Stones', aliases: ['rolling stones'], year: 'Formed 1962', points: 20, tier: 'Common', fact: 'Formed in London in 1962 and still touring over six decades later.' },
              { name: 'AC/DC', aliases: ['acdc'], year: 'Formed 1973', points: 24, tier: 'Common', fact: 'Formed in Sydney in 1973 by brothers Malcolm and Angus Young.' },
              { name: 'Fleetwood Mac', aliases: [], year: 'Formed 1967', points: 28, tier: 'Common', fact: 'Started as a British blues band in 1967 before achieving global superstardom with Rumours.' },
              { name: 'ABBA', aliases: [], year: 'Formed 1972', points: 30, tier: 'Common', fact: 'Formed in Stockholm in 1972 and won Eurovision 1974 with "Waterloo".' },
              { name: 'The Who', aliases: ['who'], year: 'Formed 1964', points: 35, tier: 'Uncommon', fact: 'Mod rock pioneers famous for rock operas Tommy and Quadrophenia.' },
              { name: 'Black Sabbath', aliases: ['sabbath'], year: 'Formed 1968', points: 38, tier: 'Uncommon', fact: 'Formed in Birmingham in 1968, widely credited with inventing heavy metal.' },
              { name: 'The Clash', aliases: ['clash'], year: 'Formed 1976', points: 42, tier: 'Uncommon', fact: 'Iconic British punk band that blended reggae, dub, and rock on London Calling (1979).' },
              { name: 'Ramones', aliases: ['the ramones'], year: 'Formed 1974', points: 45, tier: 'Uncommon', fact: 'New York punk pioneers formed in Queens in 1974.' },
              { name: 'Aerosmith', aliases: [], year: 'Formed 1970', points: 45, tier: 'Uncommon', fact: 'Boston hard rock icons formed in 1970.' },
              { name: 'Eagles', aliases: ['the eagles'], year: 'Formed 1971', points: 46, tier: 'Uncommon', fact: 'Formed in Los Angeles in 1971; Their Greatest Hits is among the best-selling albums ever.' },
              { name: 'The Cure', aliases: ['cure'], year: 'Formed 1978', points: 52, tier: 'Uncommon', fact: 'Formed in Crawley, England in 1978, shaping gothic rock and alternative pop.' },
              { name: 'Blondie', aliases: [], year: 'Formed 1974', points: 54, tier: 'Uncommon', fact: 'New York new wave trailblazers fronted by Debbie Harry.' },
              { name: 'Rush', aliases: [], year: 'Formed 1968', points: 58, tier: 'Rare', fact: 'Canadian progressive rock trio revered for technical virtuosity and sci-fi epics.' },
              { name: 'Talking Heads', aliases: ['the talking heads'], year: 'Formed 1975', points: 62, tier: 'Rare', fact: 'Art-punk pioneers formed at the Rhode Island School of Design in 1975.' },
              { name: 'Joy Division', aliases: [], year: 'Formed 1976', points: 66, tier: 'Rare', fact: 'Manchester post-punk legends whose 1979 debut Unknown Pleasures reshaped indie music.' },
              { name: 'Kraftwerk', aliases: [], year: 'Formed 1970', points: 72, tier: 'Rare', fact: 'Düsseldorf electronic pioneers whose synth sound laid the blueprint for techno and hip-hop.' },
              { name: 'Steely Dan', aliases: [], year: 'Formed 1971', points: 75, tier: 'Rare', fact: 'Jazz-rock studio perfectionists Walter Becker and Donald Fagen.' },
              { name: 'King Crimson', aliases: [], year: 'Formed 1968', points: 80, tier: 'Rare', fact: 'Founded by Robert Fripp; their 1969 debut In the Court of the Crimson King launched prog rock.' },
              { name: 'Television', aliases: [], year: 'Formed 1973', points: 86, tier: 'Paradox', fact: 'CBGB art-punk pioneers whose 1977 album Marquee Moon influenced generations of guitarists.' },
              { name: 'Thin Lizzy', aliases: [], year: 'Formed 1969', points: 88, tier: 'Paradox', fact: 'Dublin rockers led by Phil Lynott, famed for twin-lead guitar harmonies.' },
              { name: 'Can', aliases: [], year: 'Formed 1968', points: 95, tier: 'Paradox', fact: 'Experimental German krautrock band whose motorik grooves influenced Radiohead and Kanye West.' },
              { name: 'Bauhaus', aliases: [], year: 'Formed 1978', points: 98, tier: 'Paradox', fact: 'Northampton band whose 1979 debut single "Bela Lugosi’s Dead" birthed gothic rock.' },
              { name: 'Sparks', aliases: [], year: 'Formed 1971', points: 100, tier: 'Paradox', fact: 'Cult art-pop duo Ron and Russell Mael, active since the early 1970s.' }
            ]
          },
          {
            era: '1990s Video Games',
            constraint: 'Released Before 2000',
            theme: { accent: '#3D6B52', skyTop: '#E5EDE4', skyBottom: '#D3E1D2', symbol: 'cartridge' },
            prompt: 'Name a video game released before the year 2000',
            hint: '80s arcade hits or 90s console/PC gems—cult classics yield maximum fuel.',
            answers: [
              { name: 'Super Mario Bros.', aliases: ['super mario bros', 'super mario', 'mario'], year: '1985', points: 15, tier: 'Common', fact: 'Shigeru Miyamoto’s 1985 NES platformer that revitalized the North American console market.' },
              { name: 'Tetris', aliases: [], year: '1984 / 1989', points: 16, tier: 'Common', fact: 'Created by Alexey Pajitnov in 1984 and packed with the Nintendo Game Boy in 1989.' },
              { name: 'Pac-Man', aliases: ['pacman'], year: '1980', points: 18, tier: 'Common', fact: 'Namco’s 1980 arcade icon designed by Toru Iwatani.' },
              { name: 'Pokémon Red and Blue', aliases: ['pokemon red', 'pokemon blue', 'pokemon', 'pokemon yellow'], year: '1996', points: 22, tier: 'Common', fact: 'Launched the global Pokémon phenomenon on Game Boy in Japan in 1996.' },
              { name: 'The Legend of Zelda: Ocarina of Time', aliases: ['ocarina of time', 'zelda ocarina of time', 'legend of zelda', 'zelda'], year: '1998', points: 25, tier: 'Common', fact: 'Nintendo 64 action-adventure landmark that introduced Z-targeting in 3D gaming.' },
              { name: 'Super Mario 64', aliases: ['mario 64'], year: '1996', points: 26, tier: 'Common', fact: 'Defined 3D analog movement and camera control at the Nintendo 64 launch.' },
              { name: 'Doom', aliases: [], year: '1993', points: 30, tier: 'Common', fact: 'id Software’s 1993 shareware phenomenon that popularized first-person shooters.' },
              { name: 'Final Fantasy VII', aliases: ['final fantasy 7', 'ff7', 'ffvii'], year: '1997', points: 34, tier: 'Uncommon', fact: 'Square’s PlayStation blockbuster that brought cinematic JRPGs to mainstream global audiences.' },
              { name: 'GoldenEye 007', aliases: ['goldeneye', '007 goldeneye'], year: '1997', points: 38, tier: 'Uncommon', fact: 'Rare’s N64 shooter that proved split-screen console multiplayer FPS games could thrive.' },
              { name: 'Half-Life', aliases: ['halflife'], year: '1998', points: 42, tier: 'Uncommon', fact: 'Valve’s 1998 debut revolutionized FPS storytelling with uninterrupted first-person immersion.' },
              { name: 'Metal Gear Solid', aliases: ['mgs', 'metal gear'], year: '1998', points: 45, tier: 'Uncommon', fact: 'Hideo Kojima’s PlayStation stealth classic featuring Psycho Mantis reading your memory card.' },
              { name: 'StarCraft', aliases: [], year: '1998', points: 48, tier: 'Uncommon', fact: 'Blizzard’s asymmetrical sci-fi RTS that became the foundation of modern esports.' },
              { name: 'Street Fighter II', aliases: ['street fighter 2', 'street fighter'], year: '1991', points: 48, tier: 'Uncommon', fact: 'Sparked the 1990s fighting game arcade boom with combos and special inputs.' },
              { name: 'Sonic the Hedgehog', aliases: ['sonic'], year: '1991', points: 32, tier: 'Uncommon', fact: 'Sega’s high-speed Genesis mascot designed to rival Nintendo’s Mario.' },
              { name: 'Age of Empires II', aliases: ['age of empires 2', 'aoe2', 'age of empires'], year: '1999', points: 54, tier: 'Uncommon', fact: 'Ensemble Studios’ 1999 historical RTS still actively played in tournaments today.' },
              { name: 'Chrono Trigger', aliases: [], year: '1995', points: 62, tier: 'Rare', fact: 'Time-traveling SNES JRPG created by the "Dream Team" of Sakaguchi, Horii, and Toriyama.' },
              { name: 'Super Metroid', aliases: ['metroid'], year: '1994', points: 65, tier: 'Rare', fact: 'Atmospheric 1994 SNES masterpiece that co-defined the "Metroidvania" genre.' },
              { name: 'Castlevania: Symphony of the Night', aliases: ['symphony of the night', 'castlevania sotn', 'castlevania'], year: '1997', points: 68, tier: 'Rare', fact: 'Koji Igarashi’s PlayStation gothic action-RPG featuring an entire inverted castle.' },
              { name: 'Silent Hill', aliases: [], year: '1999', points: 70, tier: 'Rare', fact: 'Konami’s 1999 psychological survival horror game using fog to mask PS1 draw limits.' },
              { name: 'Fallout', aliases: ['fallout 1', 'fallout 2'], year: '1997', points: 72, tier: 'Rare', fact: 'Interplay’s isometric post-apocalyptic RPG introducing the SPECIAL character system.' },
              { name: 'EarthBound', aliases: ['mother 2'], year: '1994', points: 78, tier: 'Rare', fact: 'Quirky modern-day SNES RPG cult classic starring Ness.' },
              { name: 'Grim Fandango', aliases: [], year: '1998', points: 84, tier: 'Rare', fact: 'Tim Schafer’s noir-inspired LucasArts adventure set in the Land of the Dead.' },
              { name: 'Planescape: Torment', aliases: ['planescape torment'], year: '1999', points: 88, tier: 'Paradox', fact: 'Critically acclaimed philosophical RPG set in the Dungeons & Dragons multiverse city of Sigil.' },
              { name: 'System Shock 2', aliases: ['system shock'], year: '1999', points: 92, tier: 'Paradox', fact: 'Ken Levine’s sci-fi horror immersive sim starring the rogue AI SHODAN.' },
              { name: 'Suikoden II', aliases: ['suikoden 2', 'suikoden'], year: '1998', points: 95, tier: 'Paradox', fact: 'Beloved PS1 political JRPG allowing players to recruit 108 Stars of Destiny.' },
              { name: 'Panzer Dragoon Saga', aliases: ['panzer dragoon'], year: '1998', points: 100, tier: 'Paradox', fact: 'Rare Sega Saturn RPG widely considered one of the greatest cult masterpieces of the 32-bit era.' }
            ]
          },
          {
            era: 'Modern Geography',
            constraint: 'Independent After 1990',
            theme: { accent: '#2E6F5E', skyTop: '#E4EFEA', skyBottom: '#CFE2DA', symbol: 'globe' },
            prompt: 'Name a UN-recognized country that gained independence after 1990',
            hint: 'Post-Soviet states, former Yugoslav republics, or 21st-century nations.',
            answers: [
              { name: 'Ukraine', aliases: [], year: '1991', points: 18, tier: 'Common', fact: 'Declared independence from the Soviet Union on August 24, 1991.' },
              { name: 'Russia', aliases: ['russian federation'], year: '1991', points: 20, tier: 'Common', fact: 'Emerged as the primary successor state following the dissolution of the USSR in December 1991.' },
              { name: 'Croatia', aliases: [], year: '1991', points: 28, tier: 'Common', fact: 'Declared independence from Yugoslavia in June 1991.' },
              { name: 'South Sudan', aliases: [], year: '2011', points: 32, tier: 'Uncommon', fact: 'The world’s newest UN member state, gaining independence from Sudan on July 9, 2011.' },
              { name: 'Czech Republic', aliases: ['czechia'], year: '1993', points: 36, tier: 'Uncommon', fact: 'Formed on January 1, 1993 after the peaceful Velvet Divorce of Czechoslovakia.' },
              { name: 'Slovakia', aliases: [], year: '1993', points: 40, tier: 'Uncommon', fact: 'Became an independent sovereign nation alongside Czechia on January 1, 1993.' },
              { name: 'Slovenia', aliases: [], year: '1991', points: 44, tier: 'Uncommon', fact: 'First republic to break away from Yugoslavia in June 1991.' },
              { name: 'Bosnia and Herzegovina', aliases: ['bosnia'], year: '1992', points: 46, tier: 'Uncommon', fact: 'Declared independence from Yugoslavia following a referendum in March 1992.' },
              { name: 'Kazakhstan', aliases: [], year: '1991', points: 48, tier: 'Uncommon', fact: 'The last Soviet republic to declare independence, on December 16, 1991.' },
              { name: 'Estonia', aliases: [], year: '1991', points: 50, tier: 'Uncommon', fact: 'Restored its pre-WWII independence from the USSR in August 1991.' },
              { name: 'Latvia', aliases: [], year: '1991', points: 52, tier: 'Uncommon', fact: 'Baltic nation that restored full independence in August 1991.' },
              { name: 'Lithuania', aliases: [], year: '1990 / 1991', points: 54, tier: 'Uncommon', fact: 'First Soviet republic to declare independence in March 1990, recognized internationally in 1991.' },
              { name: 'Belarus', aliases: [], year: '1991', points: 55, tier: 'Uncommon', fact: 'Gained independence from the Soviet Union in August 1991.' },
              { name: 'Georgia', aliases: [], year: '1991', points: 58, tier: 'Rare', fact: 'Caucasus nation that declared independence from the USSR on April 9, 1991.' },
              { name: 'Armenia', aliases: [], year: '1991', points: 60, tier: 'Rare', fact: 'Declared independence from the Soviet Union in September 1991.' },
              { name: 'Azerbaijan', aliases: [], year: '1991', points: 62, tier: 'Rare', fact: 'Restored independence in October 1991 as the USSR dissolved.' },
              { name: 'Serbia', aliases: [], year: '2006', points: 65, tier: 'Rare', fact: 'Became a separate sovereign state in June 2006 when Montenegro dissolved their union.' },
              { name: 'Montenegro', aliases: [], year: '2006', points: 68, tier: 'Rare', fact: 'Voted for independence from Serbia and Montenegro in a May 2006 referendum.' },
              { name: 'North Macedonia', aliases: ['macedonia'], year: '1991', points: 70, tier: 'Rare', fact: 'Peacefully seceded from Yugoslavia in September 1991.' },
              { name: 'Uzbekistan', aliases: [], year: '1991', points: 72, tier: 'Rare', fact: 'Central Asian nation that declared independence on September 1, 1991.' },
              { name: 'Moldova', aliases: [], year: '1991', points: 76, tier: 'Rare', fact: 'Declared independence from the USSR on August 27, 1991.' },
              { name: 'Eritrea', aliases: [], year: '1993', points: 80, tier: 'Rare', fact: 'Horn of Africa nation that gained formal independence from Ethiopia in May 1993.' },
              { name: 'Timor-Leste', aliases: ['east timor'], year: '2002', points: 86, tier: 'Paradox', fact: 'First new sovereign state of the 21st century, gaining independence on May 20, 2002.' },
              { name: 'Kyrgyzstan', aliases: [], year: '1991', points: 88, tier: 'Paradox', fact: 'Mountainous Central Asian republic independent since August 31, 1991.' },
              { name: 'Tajikistan', aliases: [], year: '1991', points: 90, tier: 'Paradox', fact: 'Declared independence from the Soviet Union on September 9, 1991.' },
              { name: 'Turkmenistan', aliases: [], year: '1991', points: 92, tier: 'Paradox', fact: 'Gained independence from the USSR on October 27, 1991.' },
              { name: 'Palau', aliases: [], year: '1994', points: 98, tier: 'Paradox', fact: 'Pacific island nation that achieved full sovereignty on October 1, 1994.' }
            ]
          },
          {
            era: 'Tech & Inventions',
            constraint: 'Invented Before 1960',
            theme: { accent: '#9E6224', skyTop: '#F2E7D5', skyBottom: '#E6D4B8', symbol: 'gear' },
            prompt: 'Name a consumer appliance or everyday technology invented before 1960',
            hint: 'Telephone or television score safe fuel; niche pre-war devices burn high.',
            answers: [
              { name: 'Telephone', aliases: ['phone'], year: '1876', points: 15, tier: 'Common', fact: 'Patented by Alexander Graham Bell in March 1876.' },
              { name: 'Television', aliases: ['tv'], year: '1927', points: 16, tier: 'Common', fact: 'Philo Farnsworth demonstrated the first fully electronic television system in 1927.' },
              { name: 'Radio', aliases: [], year: '1895', points: 18, tier: 'Common', fact: 'Guglielmo Marconi pioneered long-distance wireless telegraphy in the mid-1890s.' },
              { name: 'Light Bulb', aliases: ['lightbulb', 'incandescent bulb'], year: '1879', points: 18, tier: 'Common', fact: 'Commercialized by Thomas Edison and Joseph Swan in 1879.' },
              { name: 'Automobile', aliases: ['car'], year: '1886', points: 20, tier: 'Common', fact: 'Karl Benz patented the Benz Patent-Motorwagen in January 1886.' },
              { name: 'Airplane', aliases: ['aeroplane', 'aircraft'], year: '1903', points: 22, tier: 'Common', fact: 'Orville and Wilbur Wright achieved sustained powered flight at Kitty Hawk in 1903.' },
              { name: 'Refrigerator', aliases: ['fridge'], year: '1913', points: 28, tier: 'Common', fact: 'Fred W. Wolf invented the domestic electric refrigerator (DOMELRE) in 1913.' },
              { name: 'Microwave Oven', aliases: ['microwave'], year: '1945', points: 34, tier: 'Uncommon', fact: 'Invented by Percy Spencer at Raytheon in 1945 using radar magnetron technology.' },
              { name: 'Vacuum Cleaner', aliases: ['vacuum'], year: '1901', points: 38, tier: 'Uncommon', fact: 'Hubert Cecil Booth patented a motorized suction cleaner in 1901.' },
              { name: 'Washing Machine', aliases: ['washer'], year: '1908', points: 40, tier: 'Uncommon', fact: 'Alva J. Fisher patented the Thor electric drum washing machine in 1908.' },
              { name: 'Toaster', aliases: ['electric toaster'], year: '1893 / 1909', points: 44, tier: 'Uncommon', fact: 'Alan MacMasters invented an early electric bread toaster in Scotland in 1893.' },
              { name: 'Air Conditioner', aliases: ['air conditioning', 'ac'], year: '1902', points: 46, tier: 'Uncommon', fact: 'Willis Carrier built the first modern electrical air conditioning unit in Buffalo, NY in 1902.' },
              { name: 'Dishwasher', aliases: [], year: '1886', points: 52, tier: 'Uncommon', fact: 'Josephine Cochrane patented the first commercially successful hand-powered dishwasher in 1886.' },
              { name: 'Polaroid Camera', aliases: ['instant camera', 'polaroid'], year: '1948', points: 58, tier: 'Rare', fact: 'Edwin Land introduced the Model 95 Land Camera in November 1948.' },
              { name: 'Ballpoint Pen', aliases: ['biro'], year: '1938', points: 62, tier: 'Rare', fact: 'Patented by Hungarian journalist László Bíró in 1938.' },
              { name: 'Zipper', aliases: ['zip fastener'], year: '1913', points: 66, tier: 'Rare', fact: 'Gideon Sundback perfected the modern hookless fastener design in 1913.' },
              { name: 'Velcro', aliases: ['hook and loop'], year: '1948 / 1955', points: 70, tier: 'Rare', fact: 'Swiss engineer George de Mestral invented it after inspecting burrs stuck to his dog.' },
              { name: 'Transistor Radio', aliases: [], year: '1954', points: 74, tier: 'Rare', fact: 'The Regency TR-1 launched in 1954 as the first pocket-sized transistor consumer device.' },
              { name: 'Photocopier', aliases: ['xerox machine', 'xerography'], year: '1938 / 1959', points: 78, tier: 'Rare', fact: 'Chester Carlson invented electrophotography (xerography) in 1938.' },
              { name: 'Electric Guitar', aliases: [], year: '1931', points: 72, tier: 'Rare', fact: 'George Beauchamp and Adolph Rickenbacker created the "Frying Pan" lap steel guitar in 1931.' },
              { name: 'Tape Recorder', aliases: ['magnetic tape recorder'], year: '1935', points: 84, tier: 'Rare', fact: 'AEG unveiled the Magnetophon K1 magnetic tape recorder in Berlin in 1935.' },
              { name: 'Geiger Counter', aliases: [], year: '1908 / 1928', points: 88, tier: 'Paradox', fact: 'Hans Geiger and Walther Müller perfected the radiation detector tube in 1928.' },
              { name: 'Parking Meter', aliases: [], year: '1935', points: 92, tier: 'Paradox', fact: 'First installed in Oklahoma City in July 1935 based on Carl Magee’s design.' },
              { name: 'Zamboni', aliases: ['ice resurfacer'], year: '1949', points: 96, tier: 'Paradox', fact: 'Frank Zamboni built the Model A ice-resurfacing machine in Paramount, California in 1949.' },
              { name: 'Theremin', aliases: [], year: '1920', points: 100, tier: 'Paradox', fact: 'Léon Theremin invented the touchless electronic musical instrument in Soviet Russia in 1920.' }
            ]
          },
          {
            era: '2000s / 2010s Cinema',
            constraint: 'Nolan or Villeneuve',
            theme: { accent: '#6B3A5D', skyTop: '#EFE6ED', skyBottom: '#E0D0DC', symbol: 'reel' },
            prompt: 'Name a feature film directed by Christopher Nolan or Denis Villeneuve',
            hint: 'Blockbusters like Inception or Dune work—early indie thrillers yield maximum fuel.',
            answers: [
              { name: 'Inception', aliases: [], year: '2010', points: 15, tier: 'Common', fact: 'Christopher Nolan’s dream-heist sci-fi thriller starring Leonardo DiCaprio.' },
              { name: 'Interstellar', aliases: [], year: '2014', points: 16, tier: 'Common', fact: 'Nolan’s space epic featuring Kip Thorne-consulted black hole physics.' },
              { name: 'The Dark Knight', aliases: ['dark knight'], year: '2008', points: 16, tier: 'Common', fact: 'Nolan’s landmark Batman sequel featuring Heath Ledger’s Oscar-winning Joker.' },
              { name: 'Oppenheimer', aliases: [], year: '2023', points: 18, tier: 'Common', fact: 'Nolan’s biographical drama that won seven Academy Awards including Best Picture.' },
              { name: 'Dune', aliases: ['dune part one', 'dune 1'], year: '2021', points: 20, tier: 'Common', fact: 'Denis Villeneuve’s visually monumental adaptation of Frank Herbert’s 1965 novel.' },
              { name: 'Dune: Part Two', aliases: ['dune 2', 'dune part 2'], year: '2024', points: 24, tier: 'Common', fact: 'Villeneuve’s acclaimed continuation following Paul Atreides among the Fremen.' },
              { name: 'The Dark Knight Rises', aliases: ['dark knight rises'], year: '2012', points: 28, tier: 'Common', fact: 'Conclusion to Nolan’s Batman trilogy pitting Bruce Wayne against Bane.' },
              { name: 'Batman Begins', aliases: [], year: '2005', points: 32, tier: 'Uncommon', fact: 'Nolan’s grounded 2005 reboot of the Batman film franchise.' },
              { name: 'Dunkirk', aliases: [], year: '2017', points: 35, tier: 'Uncommon', fact: 'Nolan’s triptych WWII evacuation thriller told across land, sea, and air timelines.' },
              { name: 'Tenet', aliases: [], year: '2020', points: 38, tier: 'Uncommon', fact: 'Nolan’s time-inversion espionage thriller.' },
              { name: 'Arrival', aliases: [], year: '2016', points: 42, tier: 'Uncommon', fact: 'Villeneuve’s cerebral sci-fi drama about a linguist decoding heptapod alien language.' },
              { name: 'Blade Runner 2049', aliases: ['blade runner'], year: '2017', points: 44, tier: 'Uncommon', fact: 'Villeneuve’s neo-noir sequel shot by cinematographer Roger Deakins.' },
              { name: 'The Prestige', aliases: ['prestige'], year: '2006', points: 48, tier: 'Uncommon', fact: 'Nolan’s Victorian rivalry thriller starring Hugh Jackman and Christian Bale as rival magicians.' },
              { name: 'Memento', aliases: [], year: '2000', points: 52, tier: 'Uncommon', fact: 'Nolan’s breakthrough neo-noir told in reverse chronological sequences.' },
              { name: 'Sicario', aliases: [], year: '2015', points: 58, tier: 'Rare', fact: 'Villeneuve’s tense border cartel thriller featuring Emily Blunt and Benicio del Toro.' },
              { name: 'Prisoners', aliases: [], year: '2013', points: 62, tier: 'Rare', fact: 'Villeneuve’s gripping Pennsylvania abduction mystery starring Hugh Jackman and Jake Gyllenhaal.' },
              { name: 'Insomnia', aliases: [], year: '2002', points: 72, tier: 'Rare', fact: 'Nolan’s Alaskan psychological thriller starring Al Pacino and Robin Williams.' },
              { name: 'Enemy', aliases: [], year: '2013', points: 78, tier: 'Rare', fact: 'Villeneuve’s surreal doppelgänger thriller starring Jake Gyllenhaal in a dual role.' },
              { name: 'Incendies', aliases: [], year: '2010', points: 86, tier: 'Paradox', fact: 'Villeneuve’s Oscar-nominated French-Canadian drama following twins uncovering family secrets.' },
              { name: 'Following', aliases: [], year: '1998', points: 92, tier: 'Paradox', fact: 'Christopher Nolan’s micro-budget black-and-white feature directorial debut shot on 16mm.' },
              { name: 'Polytechnique', aliases: [], year: '2009', points: 96, tier: 'Paradox', fact: 'Villeneuve’s stark black-and-white dramatization of the 1989 Montreal tragedy.' },
              { name: 'Maelström', aliases: ['maelstrom'], year: '2000', points: 100, tier: 'Paradox', fact: 'Denis Villeneuve’s early Montreal drama famously narrated by a talking fish.' }
            ]
          }
        ]
      },

      // ========================================================================
      // SEED 1: PRACTICE RUN #02 (7 Jumps)
      // ========================================================================
      {
        id: 'PRACTICE RUN #02',
        rounds: [
          {
            era: 'Classical Mythology',
            constraint: 'Greek or Roman Deity',
            theme: { accent: '#B85A2A', skyTop: '#F3E5D0', skyBottom: '#E9D4B7', symbol: 'pillar' },
            prompt: 'Name a major or minor deity from Ancient Greek or Roman mythology',
            hint: 'Olympians give standard fuel; Titans or primordial deities yield up to +100 yrs.',
            answers: [
              { name: 'Zeus', aliases: [], year: 'Olympian', points: 15, tier: 'Common', fact: 'King of the Olympian gods and ruler of sky and thunder in Greek myth.' },
              { name: 'Poseidon', aliases: [], year: 'Olympian', points: 18, tier: 'Common', fact: 'Greek god of the sea, earthquakes, and horses.' },
              { name: 'Hades', aliases: [], year: 'Underworld', points: 18, tier: 'Common', fact: 'Ruler of the Greek underworld and god of wealth beneath the earth.' },
              { name: 'Athena', aliases: [], year: 'Olympian', points: 20, tier: 'Common', fact: 'Goddess of wisdom, strategy, and handicrafts; patron of Athens.' },
              { name: 'Apollo', aliases: [], year: 'Olympian', points: 22, tier: 'Common', fact: 'God of music, prophecy, archery, and light.' },
              { name: 'Ares', aliases: [], year: 'Olympian', points: 24, tier: 'Common', fact: 'Greek god of raw war and bloodshed.' },
              { name: 'Aphrodite', aliases: [], year: 'Olympian', points: 24, tier: 'Common', fact: 'Goddess of love and beauty.' },
              { name: 'Jupiter', aliases: [], year: 'Roman', points: 26, tier: 'Common', fact: 'Supreme sky god of the Roman state pantheon.' },
              { name: 'Mars', aliases: [], year: 'Roman', points: 28, tier: 'Common', fact: 'Roman god of war and legendary father of Romulus and Remus.' },
              { name: 'Hermes', aliases: [], year: 'Olympian', points: 32, tier: 'Uncommon', fact: 'Wing-sandaled messenger of the gods and patron of travelers and merchants.' },
              { name: 'Artemis', aliases: [], year: 'Olympian', points: 34, tier: 'Uncommon', fact: 'Goddess of the hunt, wilderness, and the moon.' },
              { name: 'Dionysus', aliases: ['bacchus'], year: 'Olympian', points: 38, tier: 'Uncommon', fact: 'God of wine, theater, and ritual ecstasy.' },
              { name: 'Hephaestus', aliases: ['vulcan'], year: 'Olympian', points: 42, tier: 'Uncommon', fact: 'Blacksmith of the gods, patron of fire, metalworking, and craftsmen.' },
              { name: 'Persephone', aliases: [], year: 'Underworld', points: 46, tier: 'Uncommon', fact: 'Queen of the underworld and goddess of spring growth.' },
              { name: 'Chronos', aliases: ['kronos', 'saturn'], year: 'Titan', points: 52, tier: 'Uncommon', fact: 'Leader of the Titans who ruled during the mythological Golden Age.' },
              { name: 'Hecate', aliases: [], year: 'Chthonic', points: 64, tier: 'Rare', fact: 'Three-formed goddess of magic, crossroads, and night.' },
              { name: 'Janus', aliases: [], year: 'Roman', points: 68, tier: 'Rare', fact: 'Two-faced Roman god of beginnings, doorways, and transitions—namesake of January.' },
              { name: 'Nemesis', aliases: [], year: 'Primordial', points: 72, tier: 'Rare', fact: 'Goddess of retribution against hubris.' },
              { name: 'Morpheus', aliases: [], year: 'Oneiroi', points: 75, tier: 'Rare', fact: 'Shapeshifting god of dreams.' },
              { name: 'Nyx', aliases: [], year: 'Primordial', points: 82, tier: 'Rare', fact: 'Primordial goddess of night, feared even by Zeus.' },
              { name: 'Hypnos', aliases: [], year: 'Primordial', points: 86, tier: 'Paradox', fact: 'Personification of sleep and twin brother of Thanatos.' },
              { name: 'Thanatos', aliases: [], year: 'Primordial', points: 88, tier: 'Paradox', fact: 'Personification of peaceful death in Greek mythology.' },
              { name: 'Asclepius', aliases: [], year: 'Hero-God', points: 92, tier: 'Paradox', fact: 'God of medicine whose serpent-entwined staff remains a medical symbol today.' },
              { name: 'Eris', aliases: [], year: 'Primordial', points: 95, tier: 'Paradox', fact: 'Goddess of strife and discord who sparked the Trojan War with the Golden Apple.' },
              { name: 'Tyche', aliases: ['fortuna'], year: 'Tutelary', points: 100, tier: 'Paradox', fact: 'Goddess of fortune, chance, and the destiny of cities.' }
            ]
          },
          {
            era: '19th Century Literature',
            constraint: 'Published in 1800s',
            theme: { accent: '#264E70', skyTop: '#E4ECF2', skyBottom: '#D3E0EA', symbol: 'compass' },
            prompt: 'Name a novel or novella published during the 1800s (19th century)',
            hint: 'Victorian classics, Gothic horror, or Russian masterpieces.',
            answers: [
              { name: 'Pride and Prejudice', aliases: [], year: '1813', points: 16, tier: 'Common', fact: 'Jane Austen’s beloved comedy of manners published in 1813.' },
              { name: 'Frankenstein', aliases: [], year: '1818', points: 18, tier: 'Common', fact: 'Mary Shelley’s foundational science-fiction Gothic novel published in 1818.' },
              { name: 'Dracula', aliases: [], year: '1897', points: 20, tier: 'Common', fact: 'Bram Stoker’s epistolary vampire masterpiece published in 1897.' },
              { name: 'Moby-Dick', aliases: ['moby dick'], year: '1851', points: 24, tier: 'Common', fact: 'Herman Melville’s epic tale of Captain Ahab’s obsession with the white whale.' },
              { name: 'A Christmas Carol', aliases: ['christmas carol'], year: '1843', points: 26, tier: 'Common', fact: 'Charles Dickens’ 1843 novella that reshaped Victorian Christmas traditions.' },
              { name: 'Jane Eyre', aliases: [], year: '1847', points: 28, tier: 'Common', fact: 'Charlotte Brontë’s groundbreaking first-person Gothic romance.' },
              { name: 'Great Expectations', aliases: [], year: '1861', points: 32, tier: 'Uncommon', fact: 'Dickens’ coming-of-age classic following Pip and Miss Havisham.' },
              { name: 'Wuthering Heights', aliases: [], year: '1847', points: 35, tier: 'Uncommon', fact: 'Emily Brontë’s sole novel, set on the windswept Yorkshire moors.' },
              { name: 'Crime and Punishment', aliases: [], year: '1866', points: 38, tier: 'Uncommon', fact: 'Fyodor Dostoevsky’s psychological masterpiece set in St. Petersburg.' },
              { name: 'War and Peace', aliases: [], year: '1869', points: 40, tier: 'Uncommon', fact: 'Leo Tolstoy’s sweeping chronicle of Russian society during the Napoleonic era.' },
              { name: 'Les Misérables', aliases: ['les miserables'], year: '1862', points: 42, tier: 'Uncommon', fact: 'Victor Hugo’s epic novel following ex-convict Jean Valjean.' },
              { name: 'The Adventures of Huckleberry Finn', aliases: ['huckleberry finn', 'huck finn'], year: '1884', points: 44, tier: 'Uncommon', fact: 'Mark Twain’s Mississippi River novel published in 1884.' },
              { name: 'The Picture of Dorian Gray', aliases: ['dorian gray'], year: '1890', points: 48, tier: 'Uncommon', fact: 'Oscar Wilde’s only novel, exploring aestheticism and moral corruption.' },
              { name: 'Alice’s Adventures in Wonderland', aliases: ['alice in wonderland'], year: '1865', points: 36, tier: 'Uncommon', fact: 'Lewis Carroll’s landmark work of literary nonsense.' },
              { name: 'The Count of Monte Cristo', aliases: ['count of monte cristo'], year: '1844', points: 56, tier: 'Rare', fact: 'Alexandre Dumas’ gripping adventure of wrongful imprisonment and revenge.' },
              { name: 'Anna Karenina', aliases: [], year: '1878', points: 60, tier: 'Rare', fact: 'Leo Tolstoy’s realist masterpiece opening with one of literature’s most famous first lines.' },
              { name: 'The Time Machine', aliases: ['time machine'], year: '1895', points: 64, tier: 'Rare', fact: 'H.G. Wells’ 1895 novella that popularized the concept of mechanical time travel.' },
              { name: 'The War of the Worlds', aliases: ['war of the worlds'], year: '1898', points: 66, tier: 'Rare', fact: 'H.G. Wells’ pioneering Martian invasion novel.' },
              { name: 'Heart of Darkness', aliases: [], year: '1899', points: 70, tier: 'Rare', fact: 'Joseph Conrad’s 1899 novella serialized at the turn of the century.' },
              { name: 'Madame Bovary', aliases: [], year: '1857', points: 75, tier: 'Rare', fact: 'Gustave Flaubert’s landmark work of literary realism.' },
              { name: 'The Brothers Karamazov', aliases: ['brothers karamazov'], year: '1880', points: 80, tier: 'Rare', fact: 'Dostoevsky’s final novel exploring faith, doubt, and free will.' },
              { name: 'Middlemarch', aliases: [], year: '1871', points: 88, tier: 'Paradox', fact: 'George Eliot’s panoramic portrait of provincial English life.' },
              { name: 'The Scarlet Letter', aliases: ['scarlet letter'], year: '1850', points: 74, tier: 'Rare', fact: 'Nathaniel Hawthorne’s Puritan-era tragedy starring Hester Prynne.' },
              { name: 'The Yellow Wallpaper', aliases: ['yellow wallpaper'], year: '1892', points: 92, tier: 'Paradox', fact: 'Charlotte Perkins Gilman’s haunting psychological short story/novella.' },
              { name: 'Dead Souls', aliases: [], year: '1842', points: 96, tier: 'Paradox', fact: 'Nikolai Gogol’s satirical Russian masterpiece.' },
              { name: 'The Turn of the Screw', aliases: ['turn of the screw'], year: '1898', points: 100, tier: 'Paradox', fact: 'Henry James’ famously ambiguous Gothic ghost novella.' }
            ]
          },
          {
            era: '1980s Synth & Pop',
            constraint: '1980s Solo Artist',
            theme: { accent: '#C87D28', skyTop: '#F5EAD4', skyBottom: '#EAD7B5', symbol: 'vinyl' },
            prompt: 'Name a solo music artist who released a hit album in the 1980s',
            hint: 'Pop royalty scores common fuel; synth-pop or avant-garde pioneers burn high.',
            answers: [
              { name: 'Michael Jackson', aliases: ['mj'], year: 'Thriller (1982)', points: 15, tier: 'Common', fact: 'Released Thriller in 1982, the best-selling album of all time.' },
              { name: 'Madonna', aliases: [], year: 'Like a Virgin (1984)', points: 16, tier: 'Common', fact: 'Defined 1980s pop culture and MTV visual storytelling.' },
              { name: 'Prince', aliases: [], year: 'Purple Rain (1984)', points: 18, tier: 'Common', fact: 'Fused funk, rock, and synth on Purple Rain in 1984.' },
              { name: 'Whitney Houston', aliases: [], year: 'Whitney (1987)', points: 22, tier: 'Common', fact: 'Achieved seven consecutive US Billboard Hot 100 #1 singles in the 80s.' },
              { name: 'David Bowie', aliases: ['bowie'], year: 'Let’s Dance (1983)', points: 24, tier: 'Common', fact: 'Reached peak commercial chart success with Let’s Dance in 1983.' },
              { name: 'Bruce Springsteen', aliases: ['springsteen', 'the boss'], year: 'Born in the U.S.A. (1984)', points: 26, tier: 'Common', fact: 'Born in the U.S.A. produced seven Top 10 singles.' },
              { name: 'George Michael', aliases: [], year: 'Faith (1987)', points: 32, tier: 'Uncommon', fact: 'Transitioned from Wham! to solo superstardom with Faith in 1987.' },
              { name: 'Phil Collins', aliases: [], year: 'No Jacket Required (1985)', points: 35, tier: 'Uncommon', fact: 'Dominated 1980s radio both solo and with Genesis.' },
              { name: 'Tina Turner', aliases: [], year: 'Private Dancer (1984)', points: 38, tier: 'Uncommon', fact: 'Staged one of music’s greatest comebacks with Private Dancer.' },
              { name: 'Cyndi Lauper', aliases: [], year: 'She’s So Unusual (1983)', points: 42, tier: 'Uncommon', fact: 'First female artist to achieve four Top 5 singles from a debut album.' },
              { name: 'Lionel Richie', aliases: [], year: 'Can’t Slow Down (1983)', points: 45, tier: 'Uncommon', fact: 'Won Album of the Year at the 1985 Grammys for Can’t Slow Down.' },
              { name: 'Janet Jackson', aliases: [], year: 'Control (1986)', points: 46, tier: 'Uncommon', fact: 'Pioneered new jack swing pop on Control and Rhythm Nation 1814.' },
              { name: 'Kate Bush', aliases: [], year: 'Hounds of Love (1985)', points: 58, tier: 'Rare', fact: 'Art-pop visionary who self-produced Hounds of Love using the Fairlight CMI.' },
              { name: 'Peter Gabriel', aliases: [], year: 'So (1986)', points: 62, tier: 'Rare', fact: 'Released So in 1986 featuring the groundbreaking stop-motion video for "Sledgehammer".' },
              { name: 'Sade', aliases: ['sade adu'], year: 'Diamond Life (1984)', points: 66, tier: 'Rare', fact: 'Blended soul, jazz, and sophisti-pop on Diamond Life.' },
              { name: 'Billy Idol', aliases: [], year: 'Rebel Yell (1983)', points: 64, tier: 'Rare', fact: 'Brought punk attitude to MTV synth-rock.' },
              { name: 'Grace Jones', aliases: [], year: 'Nightclubbing (1981)', points: 78, tier: 'Rare', fact: 'Avant-garde icon who fused reggae, funk, and new wave on Nightclubbing.' },
              { name: 'Gary Numan', aliases: [], year: 'Telekon (1980)', points: 84, tier: 'Rare', fact: 'Early synth-pop architect whose cold electronic sound influenced Trent Reznor.' },
              { name: 'Thomas Dolby', aliases: [], year: 'The Golden Age of Wireless (1982)', points: 88, tier: 'Paradox', fact: 'Synth innovator behind "She Blinded Me with Science".' },
              { name: 'Laurie Anderson', aliases: [], year: 'Big Science (1982)', points: 94, tier: 'Paradox', fact: 'Experimental performance artist whose vocoder track "O Superman" hit #2 in the UK.' },
              { name: 'Ryuichi Sakamoto', aliases: [], year: 'Merry Christmas, Mr. Lawrence (1983)', points: 98, tier: 'Paradox', fact: 'Yellow Magic Orchestra co-founder who composed iconic 80s electronic film scores.' },
              { name: 'Arthur Russell', aliases: [], year: 'World of Echo (1986)', points: 100, tier: 'Paradox', fact: 'Avant-garde cellist and disco producer whose 1986 solo album became a cult touchstone.' }
            ]
          },
          {
            era: '1990s Console Hardware',
            constraint: 'Released 1985–1999',
            theme: { accent: '#3D6B52', skyTop: '#E5EDE4', skyBottom: '#D3E1D2', symbol: 'cartridge' },
            prompt: 'Name a home or handheld video game console released between 1985 and 1999',
            hint: 'Nintendo, PlayStation, and Sega are easy—niche 90s consoles unlock maximum fuel.',
            answers: [
              { name: 'PlayStation', aliases: ['ps1', 'psx', 'sony playstation'], year: '1994', points: 15, tier: 'Common', fact: 'Sony’s debut console sold over 102 million units worldwide.' },
              { name: 'Nintendo 64', aliases: ['n64'], year: '1996', points: 18, tier: 'Common', fact: 'Last major home console to rely on ROM cartridges.' },
              { name: 'Game Boy', aliases: ['gameboy', 'game boy color', 'gbc'], year: '1989', points: 18, tier: 'Common', fact: 'Gunpei Yokoi’s dot-matrix handheld phenomenon.' },
              { name: 'Super Nintendo Entertainment System', aliases: ['snes', 'super nintendo', 'super famicom'], year: '1990', points: 20, tier: 'Common', fact: '16-bit powerhouse famous for Mode 7 graphics and legendary RPGs.' },
              { name: 'Nintendo Entertainment System', aliases: ['nes', 'famicom'], year: '1985 (US)', points: 22, tier: 'Common', fact: 'Launched in North America in October 1985.' },
              { name: 'Sega Genesis', aliases: ['genesis', 'mega drive', 'sega mega drive'], year: '1988', points: 28, tier: 'Common', fact: 'Sega’s 16-bit rival to the SNES, known as Mega Drive outside North America.' },
              { name: 'Sega Dreamcast', aliases: ['dreamcast'], year: '1998', points: 38, tier: 'Uncommon', fact: 'Ahead-of-its-time console featuring a built-in modem and VMU memory screens.' },
              { name: 'Sega Saturn', aliases: ['saturn'], year: '1994', points: 48, tier: 'Uncommon', fact: 'Dual-CPU 32-bit console revered for 2D arcade ports and cult Japanese titles.' },
              { name: 'Sega Game Gear', aliases: ['game gear'], year: '1990', points: 52, tier: 'Uncommon', fact: 'Full-color backlit handheld rival to the Nintendo Game Boy.' },
              { name: 'Sega Master System', aliases: ['master system'], year: '1985', points: 58, tier: 'Rare', fact: '8-bit Sega console that enjoyed huge popularity in Europe and Brazil.' },
              { name: 'Atari Lynx', aliases: ['lynx'], year: '1989', points: 68, tier: 'Rare', fact: 'World’s first handheld electronic game with a color LCD screen.' },
              { name: 'Neo Geo', aliases: ['neo geo aes', 'snk neo geo'], year: '1990', points: 72, tier: 'Rare', fact: 'Luxury home console bringing exact SNK arcade hardware into living rooms.' },
              { name: 'TurboGrafx-16', aliases: ['turbografx', 'pc engine'], year: '1987', points: 76, tier: 'Rare', fact: 'NEC and Hudson Soft’s compact HuCard console, hugely successful in Japan as PC Engine.' },
              { name: '3DO Interactive Multiplayer', aliases: ['3do', 'panasonic 3do'], year: '1993', points: 82, tier: 'Rare', fact: 'Early 32-bit CD-ROM console licensed to Panasonic, GoldStar, and Sanyo.' },
              { name: 'Atari Jaguar', aliases: ['jaguar'], year: '1993', points: 84, tier: 'Rare', fact: 'Atari’s final home console, marketed as the first "64-bit" system.' },
              { name: 'Virtual Boy', aliases: ['nintendo virtual boy'], year: '1995', points: 80, tier: 'Rare', fact: 'Nintendo’s stereoscopic red-and-black tabletop 3D system.' },
              { name: 'Philips CD-i', aliases: ['cd-i', 'cdi'], year: '1991', points: 88, tier: 'Paradox', fact: 'Interactive multimedia CD player famous for infamously quirky licensed Nintendo games.' },
              { name: 'Neo Geo Pocket Color', aliases: ['neo geo pocket'], year: '1999', points: 92, tier: 'Paradox', fact: 'Beloved handheld featuring a clicky microswitch thumbstick.' },
              { name: 'WonderSwan', aliases: ['bandai wonderswan'], year: '1999', points: 96, tier: 'Paradox', fact: 'Bandai handheld designed by Game Boy creator Gunpei Yokoi.' },
              { name: 'FM Towns Marty', aliases: ['fm towns'], year: '1993', points: 100, tier: 'Paradox', fact: 'Fujitsu’s Japan-exclusive 32-bit CD console based on the FM Towns PC architecture.' }
            ]
          },
          {
            era: 'World Geography',
            constraint: 'Landlocked Country',
            theme: { accent: '#2E6F5E', skyTop: '#E4EFEA', skyBottom: '#CFE2DA', symbol: 'globe' },
            prompt: 'Name a completely landlocked country (no coastline on an open ocean)',
            hint: 'European landlocked nations give common fuel; Central Asian or African ones burn huge.',
            answers: [
              { name: 'Switzerland', aliases: [], year: 'Europe', points: 16, tier: 'Common', fact: 'Alpine nation bordered by France, Germany, Austria, Liechtenstein, and Italy.' },
              { name: 'Austria', aliases: [], year: 'Europe', points: 20, tier: 'Common', fact: 'Landlocked Central European nation sharing borders with eight countries.' },
              { name: 'Mongolia', aliases: [], year: 'Asia', points: 26, tier: 'Common', fact: 'Vast landlocked nation situated between Russia and China.' },
              { name: 'Nepal', aliases: [], year: 'Asia', points: 28, tier: 'Common', fact: 'Himalayan nation wedged between India and China.' },
              { name: 'Czech Republic', aliases: ['czechia'], year: 'Europe', points: 32, tier: 'Uncommon', fact: 'Central European nation with no sea access.' },
              { name: 'Hungary', aliases: [], year: 'Europe', points: 34, tier: 'Uncommon', fact: 'Landlocked in the Carpathian Basin of Central Europe.' },
              { name: 'Bolivia', aliases: [], year: 'South America', points: 38, tier: 'Uncommon', fact: 'One of only two landlocked countries in the Americas (alongside Paraguay).' },
              { name: 'Paraguay', aliases: [], year: 'South America', points: 42, tier: 'Uncommon', fact: 'Landlocked South American nation linked to the Atlantic via the Paraná River.' },
              { name: 'Luxembourg', aliases: [], year: 'Europe', points: 44, tier: 'Uncommon', fact: 'Small landlocked Grand Duchy bordered by Belgium, France, and Germany.' },
              { name: 'Ethiopia', aliases: [], year: 'Africa', points: 48, tier: 'Uncommon', fact: 'Most populous landlocked country in the world.' },
              { name: 'Kazakhstan', aliases: [], year: 'Central Asia', points: 50, tier: 'Uncommon', fact: 'The world’s largest landlocked country by land area.' },
              { name: 'Vatican City', aliases: ['vatican'], year: 'Europe', points: 46, tier: 'Uncommon', fact: 'Landlocked enclave entirely surrounded by Rome, Italy.' },
              { name: 'Andorra', aliases: [], year: 'Europe', points: 58, tier: 'Rare', fact: 'Pyrenean microstate nestled between France and Spain.' },
              { name: 'Liechtenstein', aliases: [], year: 'Europe', points: 64, tier: 'Rare', fact: 'One of only two doubly landlocked countries in the world (with Uzbekistan).' },
              { name: 'Uzbekistan', aliases: [], year: 'Central Asia', points: 72, tier: 'Rare', fact: 'Doubly landlocked—surrounded entirely by other landlocked countries.' },
              { name: 'Bhutan', aliases: [], year: 'Asia', points: 70, tier: 'Rare', fact: 'Eastern Himalayan kingdom known for measuring Gross National Happiness.' },
              { name: 'Laos', aliases: [], year: 'Southeast Asia', points: 68, tier: 'Rare', fact: 'The only landlocked country in Southeast Asia.' },
              { name: 'Botswana', aliases: [], year: 'Africa', points: 74, tier: 'Rare', fact: 'Southern African nation home to the inland Okavango Delta.' },
              { name: 'Zambia', aliases: [], year: 'Africa', points: 76, tier: 'Rare', fact: 'Landlocked Southern African country bordered by eight neighbors.' },
              { name: 'San Marino', aliases: [], year: 'Europe', points: 78, tier: 'Rare', fact: 'World’s oldest surviving republic, completely landlocked inside Italy.' },
              { name: 'Lesotho', aliases: [], year: 'Africa', points: 86, tier: 'Paradox', fact: 'High-altitude kingdom completely enclaved within South Africa.' },
              { name: 'Eswatini', aliases: ['swaziland'], year: 'Africa', points: 88, tier: 'Paradox', fact: 'Landlocked kingdom bordered by South Africa and Mozambique.' },
              { name: 'Burkina Faso', aliases: [], year: 'Africa', points: 92, tier: 'Paradox', fact: 'Landlocked West African nation in the Sahel region.' },
              { name: 'Malawi', aliases: [], year: 'Africa', points: 94, tier: 'Paradox', fact: 'Southeastern African nation defined by the Great Rift Valley and Lake Malawi.' },
              { name: 'Central African Republic', aliases: ['car'], year: 'Africa', points: 98, tier: 'Paradox', fact: 'Landlocked nation in the geographic heart of Africa.' }
            ]
          },
          {
            era: 'Computing Languages',
            constraint: 'Programming Language',
            theme: { accent: '#9E6224', skyTop: '#F2E7D5', skyBottom: '#E6D4B8', symbol: 'gear' },
            prompt: 'Name a computer programming language (any era)',
            hint: 'Python and JavaScript give basic thrust; functional or systems languages burn hot.',
            answers: [
              { name: 'Python', aliases: [], year: '1991', points: 15, tier: 'Common', fact: 'Created by Guido van Rossum; dominant language in AI and data science.' },
              { name: 'JavaScript', aliases: ['js'], year: '1995', points: 15, tier: 'Common', fact: 'Created by Brendan Eich in 10 days; powers interactive web browsers.' },
              { name: 'Java', aliases: [], year: '1995', points: 18, tier: 'Common', fact: 'Created at Sun Microsystems with the motto "Write once, run anywhere".' },
              { name: 'C++', aliases: ['cpp'], year: '1985', points: 20, tier: 'Common', fact: 'Bjarne Stroustrup’s high-performance extension of C used in game engines.' },
              { name: 'C', aliases: [], year: '1972', points: 22, tier: 'Common', fact: 'Dennis Ritchie’s foundational systems language created at Bell Labs.' },
              { name: 'C#', aliases: ['csharp'], year: '2000', points: 26, tier: 'Common', fact: 'Microsoft’s object-oriented language widely used in Unity game development.' },
              { name: 'TypeScript', aliases: ['ts'], year: '2012', points: 32, tier: 'Uncommon', fact: 'Microsoft’s statically typed superset of JavaScript.' },
              { name: 'Ruby', aliases: [], year: '1995', points: 38, tier: 'Uncommon', fact: 'Created by Yukihiro Matsumoto with a focus on programmer happiness.' },
              { name: 'PHP', aliases: [], year: '1995', points: 36, tier: 'Uncommon', fact: 'Server-side scripting language powering a massive share of the web.' },
              { name: 'Swift', aliases: [], year: '2014', points: 40, tier: 'Uncommon', fact: 'Apple’s modern replacement for Objective-C across iOS and macOS.' },
              { name: 'Go', aliases: ['golang'], year: '2009', points: 45, tier: 'Uncommon', fact: 'Designed at Google for scalable cloud infrastructure and concurrency.' },
              { name: 'Rust', aliases: [], year: '2010', points: 48, tier: 'Uncommon', fact: 'Memory-safe systems programming language loved for zero-cost abstractions.' },
              { name: 'Kotlin', aliases: [], year: '2011', points: 52, tier: 'Uncommon', fact: 'JetBrains’ JVM language adopted as Google’s preferred language for Android.' },
              { name: 'SQL', aliases: [], year: '1974', points: 34, tier: 'Uncommon', fact: 'Domain-specific query language for relational databases.' },
              { name: 'Lua', aliases: [], year: '1993', points: 62, tier: 'Rare', fact: 'Lightweight Brazilian scripting language embedded in Roblox, World of Warcraft, and games.' },
              { name: 'COBOL', aliases: [], year: '1959', points: 66, tier: 'Rare', fact: 'Business-oriented legacy language still processing trillions in banking transactions.' },
              { name: 'Fortran', aliases: [], year: '1957', points: 68, tier: 'Rare', fact: 'IBM’s pioneering scientific and numerical computing language.' },
              { name: 'Haskell', aliases: [], year: '1990', points: 76, tier: 'Rare', fact: 'Purely functional, statically typed language with lazy evaluation.' },
              { name: 'Scala', aliases: [], year: '2004', points: 78, tier: 'Rare', fact: 'Combines object-oriented and functional programming on the JVM.' },
              { name: 'Elixir', aliases: [], year: '2012', points: 84, tier: 'Rare', fact: 'Functional, concurrent language built on the Erlang VM.' },
              { name: 'Lisp', aliases: ['common lisp'], year: '1958', points: 82, tier: 'Rare', fact: 'John McCarthy’s second-oldest high-level language, famed for parenthesized syntax.' },
              { name: 'Clojure', aliases: [], year: '2007', points: 88, tier: 'Paradox', fact: 'Modern dialect of Lisp created by Rich Hickey targeting the JVM.' },
              { name: 'Erlang', aliases: [], year: '1986', points: 90, tier: 'Paradox', fact: 'Ericsson’s fault-tolerant telecom language powering WhatsApp’s messaging backbone.' },
              { name: 'Zig', aliases: [], year: '2016', points: 94, tier: 'Paradox', fact: 'Modern low-level systems language designed as a safer, simpler C alternative.' },
              { name: 'Smalltalk', aliases: [], year: '1972', points: 98, tier: 'Paradox', fact: 'Alan Kay’s Xerox PARC language that pioneered object-oriented programming and GUIs.' },
              { name: 'OCaml', aliases: [], year: '1996', points: 100, tier: 'Paradox', fact: 'Industrial-strength functional language heavily used in compilers and quantitative finance.' }
            ]
          },
          {
            era: 'Golden Age Cinema',
            constraint: 'Alfred Hitchcock Film',
            theme: { accent: '#6B3A5D', skyTop: '#EFE6ED', skyBottom: '#E0D0DC', symbol: 'reel' },
            prompt: 'Name a feature film directed by Alfred Hitchcock',
            hint: 'Psycho or Rear Window give common fuel; silent or early British thrillers yield max thrust.',
            answers: [
              { name: 'Psycho', aliases: [], year: '1960', points: 15, tier: 'Common', fact: 'Hitchcock’s 1960 Bates Motel thriller famous for Bernard Herrmann’s screeching strings.' },
              { name: 'Rear Window', aliases: [], year: '1954', points: 18, tier: 'Common', fact: 'James Stewart stars as a wheelchair-bound photographer spying on neighbors.' },
              { name: 'Vertigo', aliases: [], year: '1958', points: 20, tier: 'Common', fact: 'San Francisco psychological thriller featuring the famous dolly-zoom effect.' },
              { name: 'The Birds', aliases: ['birds'], year: '1963', points: 22, tier: 'Common', fact: 'Coastal California town besieged by inexplicable avian attacks.' },
              { name: 'North by Northwest', aliases: [], year: '1959', points: 26, tier: 'Common', fact: 'Cary Grant flees a crop-dusting biplane and scales Mount Rushmore.' },
              { name: 'Dial M for Murder', aliases: [], year: '1954', points: 36, tier: 'Uncommon', fact: 'Grace Kelly stars in Hitchcock’s taut stage-adapted thriller shot in 3D.' },
              { name: 'Rope', aliases: [], year: '1948', points: 42, tier: 'Uncommon', fact: 'Edited to appear as a single continuous uninterrupted shot.' },
              { name: 'Rebecca', aliases: [], year: '1940', points: 44, tier: 'Uncommon', fact: 'Hitchcock’s first American project and the only one to win Best Picture at the Oscars.' },
              { name: 'Strangers on a Train', aliases: [], year: '1951', points: 48, tier: 'Uncommon', fact: 'Two men meet on a train and discuss "crisscross" murders.' },
              { name: 'Notorious', aliases: [], year: '1946', points: 54, tier: 'Uncommon', fact: 'Cary Grant and Ingrid Bergman infiltrate post-WWII espionage in Rio de Janeiro.' },
              { name: 'The Man Who Knew Too Much', aliases: [], year: '1934 / 1956', points: 58, tier: 'Rare', fact: 'The only film Hitchcock directed twice—first in Britain (1934) and later in Hollywood (1956).' },
              { name: 'Shadow of a Doubt', aliases: [], year: '1943', points: 64, tier: 'Rare', fact: 'Hitchcock frequently cited this small-town thriller as his personal favorite.' },
              { name: 'The 39 Steps', aliases: ['39 steps'], year: '1935', points: 68, tier: 'Rare', fact: 'Landmark British spy thriller defining Hitchcock’s "innocent man on the run" formula.' },
              { name: 'To Catch a Thief', aliases: [], year: '1955', points: 62, tier: 'Rare', fact: 'Cary Grant and Grace Kelly on the French Riviera.' },
              { name: 'The Lady Vanishes', aliases: [], year: '1938', points: 74, tier: 'Rare', fact: 'Mystery aboard a transcontinental European express train.' },
              { name: 'Spellbound', aliases: [], year: '1945', points: 78, tier: 'Rare', fact: 'Features a famous dream sequence designed by Salvador Dalí.' },
              { name: 'Frenzy', aliases: [], year: '1972', points: 82, tier: 'Rare', fact: 'Hitchcock’s penultimate film, returning to London in the 1970s.' },
              { name: 'Lifeboat', aliases: [], year: '1944', points: 86, tier: 'Paradox', fact: 'Set entirely inside a single lifeboat adrift in the North Atlantic.' },
              { name: 'Marnie', aliases: [], year: '1964', points: 84, tier: 'Rare', fact: 'Psychological mystery starring Tippi Hedren and Sean Connery.' },
              { name: 'The Trouble with Harry', aliases: [], year: '1955', points: 90, tier: 'Paradox', fact: 'Macabre Vermont black comedy featuring Shirley MacLaine’s film debut.' },
              { name: 'Blackmail', aliases: [], year: '1929', points: 94, tier: 'Paradox', fact: 'Widely regarded as the first British all-talking feature film.' },
              { name: 'The Lodger', aliases: ['the lodger a story of the london fog'], year: '1927', points: 100, tier: 'Paradox', fact: 'Hitchcock’s breakthrough silent thriller—and his very first cameo appearance.' }
            ]
          }
        ]
      },

      // ========================================================================
      // EXPANSION POOLS: independent subject domains for cross-domain expeditions
      // ========================================================================
      {
        id: 'ARCHITECTURE & LANDMARKS',
        rounds: [{
          domain: 'Architecture', era: 'Architecture & Landmarks', constraint: 'Completed before 2000',
          subject: 'architectural landmark',
          prompt: 'Name an architectural landmark completed before the year 2000',
          hint: 'Think bridges, towers, monuments, museums, and historic buildings.',
          theme: { accent: '#8A6847', skyTop: '#EFE5D8', skyBottom: '#DDC9B1', symbol: 'pillar' },
          answers: [
            { name: 'Eiffel Tower', aliases: ['tour eiffel'], year: '1889', points: 15, tier: 'Common', fact: 'Built for the 1889 Exposition Universelle in Paris.' },
            { name: 'Taj Mahal', aliases: [], year: '1653', points: 18, tier: 'Common', fact: 'Commissioned by Mughal emperor Shah Jahan as a mausoleum for Mumtaz Mahal.' },
            { name: 'Colosseum', aliases: ['flavian amphitheatre'], year: '80 AD', points: 20, tier: 'Common', fact: 'The Flavian Amphitheatre opened in Rome under Emperor Titus.' },
            { name: 'Statue of Liberty', aliases: ['liberty enlightening the world'], year: '1886', points: 25, tier: 'Common', fact: 'A gift from France, dedicated in New York Harbor in 1886.' },
            { name: 'Sydney Opera House', aliases: [], year: '1973', points: 32, tier: 'Uncommon', fact: 'Designed by Jørn Utzon and opened by Queen Elizabeth II in 1973.' },
            { name: 'Golden Gate Bridge', aliases: [], year: '1937', points: 38, tier: 'Uncommon', fact: 'The San Francisco suspension bridge opened to pedestrians in May 1937.' },
            { name: 'Hagia Sophia', aliases: ['aya sofya'], year: '537', points: 42, tier: 'Uncommon', fact: 'Justinian I commissioned the great Byzantine church in Constantinople.' },
            { name: 'Petra Treasury', aliases: ['al khazneh', 'the treasury'], year: '1st century AD', points: 48, tier: 'Uncommon', fact: 'The rock-cut façade is one of the best-known monuments of ancient Petra.' },
            { name: 'Sagrada Família', aliases: ['sagrada familia'], year: '1882–present', points: 58, tier: 'Rare', fact: 'Antoni Gaudí took over the Barcelona basilica project in 1883.' },
            { name: 'Fallingwater', aliases: ['kaufmann residence'], year: '1939', points: 68, tier: 'Rare', fact: 'Frank Lloyd Wright designed the house above a waterfall in Pennsylvania.' },
            { name: 'Burj Al Arab', aliases: [], year: '1999', points: 78, tier: 'Rare', fact: 'The sail-shaped Dubai hotel opened in December 1999.' },
            { name: 'Brasília Cathedral', aliases: ['cathedral of brasilia'], year: '1970', points: 90, tier: 'Paradox', fact: 'Oscar Niemeyer designed the hyperboloid cathedral, inaugurated in 1970.' }
          ]
        }]
      },
      {
        id: 'SPACE EXPLORATION',
        rounds: [{
          domain: 'Science & Space', era: 'Space Exploration', constraint: 'Mission milestones', subject: 'space mission',
          prompt: 'Name a space mission or spacecraft that reached a major milestone beyond Earth',
          hint: 'Robotic probes, crewed missions, orbiters, and landers all count.',
          theme: { accent: '#445B8A', skyTop: '#E3E8F2', skyBottom: '#CBD5E8', symbol: 'compass' },
          answers: [
            { name: 'Apollo 11', aliases: [], year: '1969', points: 15, tier: 'Common', fact: 'First crewed lunar landing, with Neil Armstrong and Buzz Aldrin on the surface.' },
            { name: 'Sputnik 1', aliases: ['sputnik'], year: '1957', points: 18, tier: 'Common', fact: 'The Soviet satellite became the first artificial object to orbit Earth.' },
            { name: 'Voyager 1', aliases: [], year: '1977', points: 20, tier: 'Common', fact: 'Launched in 1977, it became the most distant human-made object.' },
            { name: 'Hubble Space Telescope', aliases: ['hubble'], year: '1990', points: 25, tier: 'Common', fact: 'Deployed from Space Shuttle Discovery in April 1990.' },
            { name: 'Viking 1', aliases: [], year: '1976', points: 32, tier: 'Uncommon', fact: 'NASA mission achieved the first successful US landing on Mars.' },
            { name: 'Cassini-Huygens', aliases: ['cassini'], year: '1997', points: 38, tier: 'Uncommon', fact: 'The orbiter studied Saturn; its Huygens probe landed on Titan in 2005.' },
            { name: 'Rosetta', aliases: [], year: '2004', points: 44, tier: 'Uncommon', fact: 'ESA mission delivered Philae, the first probe to soft-land on a comet nucleus.' },
            { name: 'New Horizons', aliases: [], year: '2006', points: 50, tier: 'Uncommon', fact: 'Made the first close flyby of Pluto in July 2015.' },
            { name: 'Juno', aliases: [], year: '2011', points: 60, tier: 'Rare', fact: 'NASA spacecraft entered orbit around Jupiter in 2016.' },
            { name: 'Hayabusa2', aliases: [], year: '2014', points: 72, tier: 'Rare', fact: 'Japanese mission returned samples from asteroid Ryugu to Earth.' },
            { name: 'OSIRIS-REx', aliases: ['osiris rex'], year: '2016', points: 84, tier: 'Rare', fact: 'NASA returned a sample from asteroid Bennu in September 2023.' },
            { name: 'BepiColombo', aliases: [], year: '2018', points: 96, tier: 'Paradox', fact: 'Joint ESA-JAXA mission launched to study Mercury.' }
          ]
        }]
      },
      {
        id: 'SCIENTIFIC BREAKTHROUGHS',
        rounds: [{
          domain: 'Science', era: 'Scientific Breakthroughs', constraint: 'Named discoveries', subject: 'scientific discovery or theory',
          prompt: 'Name a major scientific discovery, theory, or breakthrough',
          hint: 'Physics, biology, chemistry, medicine, and computing are all in play.',
          theme: { accent: '#39756A', skyTop: '#E1EEE9', skyBottom: '#C9E0D8', symbol: 'compass' },
          answers: [
            { name: 'Theory of Evolution by Natural Selection', aliases: ['natural selection', 'darwinian evolution', 'theory of evolution'], year: '1858–1859', points: 15, tier: 'Common', fact: 'Charles Darwin and Alfred Russel Wallace presented the idea in 1858; Darwin published On the Origin of Species in 1859.' },
            { name: 'Penicillin', aliases: [], year: '1928', points: 18, tier: 'Common', fact: 'Alexander Fleming noticed its antibacterial effect in 1928.' },
            { name: 'General Relativity', aliases: ['theory of general relativity'], year: '1915', points: 22, tier: 'Common', fact: 'Einstein presented the field equations of general relativity in 1915.' },
            { name: 'DNA Double Helix', aliases: ['structure of dna', 'dna structure'], year: '1953', points: 28, tier: 'Common', fact: 'The double-helical structure was described by Watson and Crick, building on crucial experimental work by Rosalind Franklin and others.' },
            { name: 'Periodic Table', aliases: ['periodic table of elements'], year: '1869', points: 34, tier: 'Uncommon', fact: 'Dmitri Mendeleev published an influential periodic arrangement of elements in 1869.' },
            { name: 'X-rays', aliases: ['x ray', 'x rays'], year: '1895', points: 40, tier: 'Uncommon', fact: 'Wilhelm Conrad Röntgen discovered X-rays in 1895.' },
            { name: 'Radioactivity', aliases: [], year: '1896', points: 46, tier: 'Uncommon', fact: 'Henri Becquerel discovered spontaneous radioactivity while studying uranium salts.' },
            { name: 'CRISPR-Cas9 Gene Editing', aliases: ['crispr'], year: '2012', points: 56, tier: 'Uncommon', fact: 'Doudna, Charpentier, and colleagues demonstrated programmable genome editing in 2012.' },
            { name: 'Higgs Boson', aliases: ['higgs particle'], year: '2012', points: 66, tier: 'Rare', fact: 'ATLAS and CMS at CERN announced a particle consistent with the Higgs boson in 2012.' },
            { name: 'Quantum Electrodynamics', aliases: ['qed'], year: '1940s', points: 76, tier: 'Rare', fact: 'Developed by physicists including Feynman, Schwinger, and Tomonaga.' },
            { name: 'LIGO Gravitational-Wave Detection', aliases: ['gravitational waves', 'gravitational wave detection'], year: '2015', points: 88, tier: 'Rare', fact: 'LIGO detected gravitational waves from merging black holes in September 2015.' },
            { name: 'mRNA Vaccine Platform', aliases: ['mrna vaccines', 'mrna vaccine'], year: '2020', points: 98, tier: 'Paradox', fact: 'mRNA vaccine technology reached widespread public use during the COVID-19 pandemic.' }
          ]
        }]
      },
      {
        id: 'WORLD LITERATURE',
        rounds: [{
          domain: 'Literature', era: 'World Literature', constraint: 'Published works', subject: 'literary work',
          prompt: 'Name a landmark literary work from any country or period',
          hint: 'Novels, epics, plays, and poetry collections are eligible.',
          theme: { accent: '#76506E', skyTop: '#EEE5ED', skyBottom: '#DCCBDA', symbol: 'reel' },
          answers: [
            { name: 'The Odyssey', aliases: ['odyssey'], year: 'c. 8th century BC', points: 15, tier: 'Common', fact: 'The ancient Greek epic is traditionally attributed to Homer.' },
            { name: 'Don Quixote', aliases: ['don quijote'], year: '1605–1615', points: 18, tier: 'Common', fact: 'Miguel de Cervantes published its two parts in 1605 and 1615.' },
            { name: 'Hamlet', aliases: [], year: 'c. 1600', points: 22, tier: 'Common', fact: 'Shakespeare’s tragedy follows the Prince of Denmark.' },
            { name: 'Pride and Prejudice', aliases: [], year: '1813', points: 28, tier: 'Common', fact: 'Jane Austen’s novel was first published anonymously in 1813.' },
            { name: 'One Hundred Years of Solitude', aliases: ['100 years of solitude', 'cien años de soledad'], year: '1967', points: 36, tier: 'Uncommon', fact: 'Gabriel García Márquez’s novel helped bring global attention to magical realism.' },
            { name: 'The Tale of Genji', aliases: ['genji monogatari'], year: 'early 11th century', points: 42, tier: 'Uncommon', fact: 'Often described as the world’s first novel; written by Murasaki Shikibu.' },
            { name: 'Things Fall Apart', aliases: [], year: '1958', points: 48, tier: 'Uncommon', fact: 'Chinua Achebe’s novel depicts the impact of colonialism on an Igbo community.' },
            { name: 'The Divine Comedy', aliases: ['divine comedy', 'la divina commedia'], year: '14th century', points: 54, tier: 'Uncommon', fact: 'Dante’s epic poem journeys through Inferno, Purgatorio, and Paradiso.' },
            { name: 'The Master and Margarita', aliases: [], year: '1966–1967', points: 64, tier: 'Rare', fact: 'Mikhail Bulgakov’s novel was published posthumously in a censored version.' },
            { name: 'The Conference of the Birds', aliases: ['mantiq al tayr'], year: '12th century', points: 74, tier: 'Rare', fact: 'Persian poet Attar’s allegorical poem follows birds seeking the Simurgh.' },
            { name: 'The Epic of Gilgamesh', aliases: ['gilgamesh'], year: '2nd millennium BC', points: 86, tier: 'Rare', fact: 'One of the oldest surviving works of literature, preserved in cuneiform tablets.' },
            { name: 'Popol Vuh', aliases: [], year: '16th century manuscript', points: 98, tier: 'Paradox', fact: 'A foundational K’iche’ Maya narrative preserved in a colonial-era manuscript.' }
          ]
        }]
      },
      {
        id: 'NATURAL WORLD',
        rounds: [{
          domain: 'Nature & Geography', era: 'Natural World', constraint: 'Natural features', subject: 'natural feature',
          prompt: 'Name a notable natural landmark or geographical feature',
          hint: 'Mountains, rivers, deserts, reefs, lakes, and waterfalls count.',
          theme: { accent: '#47745A', skyTop: '#E5EEE5', skyBottom: '#CDDFD0', symbol: 'compass' },
          answers: [
            { name: 'Mount Everest', aliases: ['everest'], year: 'surveyed 1856', points: 15, tier: 'Common', fact: 'The highest mountain above sea level, in the Himalayas.' },
            { name: 'Grand Canyon', aliases: [], year: 'geological formation: millions of years', points: 18, tier: 'Common', fact: 'The Colorado River carved the immense canyon in Arizona.' },
            { name: 'Great Barrier Reef', aliases: [], year: 'ancient reef system', points: 22, tier: 'Common', fact: 'The world’s largest coral reef system lies off Queensland, Australia.' },
            { name: 'Sahara', aliases: ['sahara desert'], year: 'current form: thousands of years', points: 28, tier: 'Common', fact: 'The largest hot desert on Earth spans much of North Africa.' },
            { name: 'Lake Baikal', aliases: ['baikal'], year: 'formed around 25 million years ago', points: 36, tier: 'Uncommon', fact: 'The Siberian lake is the world’s deepest freshwater lake by depth.' },
            { name: 'Angel Falls', aliases: ['salto angel', 'kerekupai meru'], year: 'documented 1933', points: 42, tier: 'Uncommon', fact: 'Venezuela’s waterfall has the world’s highest uninterrupted drop.' },
            { name: 'Atacama Desert', aliases: ['atacama'], year: 'hyper-arid for millions of years', points: 48, tier: 'Uncommon', fact: 'The plateau and desert region in Chile is among the driest places on Earth.' },
            { name: 'Victoria Falls', aliases: ['mosi oa tunya'], year: 'named 1855', points: 56, tier: 'Uncommon', fact: 'The Zambezi River forms the waterfall on the Zambia–Zimbabwe border.' },
            { name: 'Socotra Archipelago', aliases: ['socotra'], year: 'island separation: millions of years', points: 66, tier: 'Rare', fact: 'Yemen’s archipelago is renowned for endemic species such as the dragon blood tree.' },
            { name: 'Salar de Uyuni', aliases: ['uyuni salt flat'], year: 'formed from prehistoric lakes', points: 76, tier: 'Rare', fact: 'Bolivia’s salt flat is the world’s largest salt flat.' },
            { name: 'Danakil Depression', aliases: ['afar depression'], year: 'geological formation ongoing', points: 88, tier: 'Rare', fact: 'A volcanically active, extremely hot region in the Afar Triangle.' },
            { name: 'Lençóis Maranhenses', aliases: ['lencois maranhenses'], year: 'national park 1981', points: 98, tier: 'Paradox', fact: 'Brazilian coastal dunes fill with seasonal freshwater lagoons.' }
          ]
        }]
      },
      {
        id: 'CLASSICAL COMPOSERS',
        rounds: [{
          id: 'classical-composers-born-before-1900', domain: 'Classical Music', era: 'Classical Music', subject: 'composer', temporalNoun: 'birth year',
          constraint: 'Born before 1900', prompt: 'Name a classical composer born before 1900',
          hint: 'Composers from the Baroque, Classical, Romantic, and early modern eras are eligible.',
          theme: { accent: '#8A5A44', skyTop: '#F0E5D9', skyBottom: '#DCC7B5', symbol: 'reel' },
          sources: ['https://www.pianolibrary.org/composers/', 'https://libguides.uwrf.edu/c.php?g=554487&p=10581893'],
          answers: [
            { name: 'Antonio Vivaldi', aliases: ['Vivaldi'], year: '1678', points: 15, tier: 'Common', fact: 'The Venetian Baroque composer wrote hundreds of concertos, including The Four Seasons.' },
            { name: 'Johann Sebastian Bach', aliases: ['Bach', 'J.S. Bach'], year: '1685', points: 18, tier: 'Common', fact: 'The German composer and organist became a central figure of Baroque music.' },
            { name: 'George Frideric Handel', aliases: ['Handel', 'George Friedrich Handel'], year: '1685', points: 22, tier: 'Common', fact: 'The German-born composer later became a naturalized British subject and wrote Messiah.' },
            { name: 'Joseph Haydn', aliases: ['Haydn', 'Franz Joseph Haydn'], year: '1732', points: 28, tier: 'Common', fact: 'Haydn helped shape the symphony and string quartet in the Classical period.' },
            { name: 'Wolfgang Amadeus Mozart', aliases: ['Mozart', 'Wolfgang Mozart'], year: '1756', points: 36, tier: 'Uncommon', fact: 'The Salzburg-born prodigy composed more than 600 catalogued works.' },
            { name: 'Ludwig van Beethoven', aliases: ['Beethoven'], year: '1770', points: 42, tier: 'Uncommon', fact: 'Beethoven bridged the Classical and Romantic eras and continued composing after losing his hearing.' },
            { name: 'Franz Schubert', aliases: ['Schubert'], year: '1797', points: 48, tier: 'Uncommon', fact: 'Schubert was especially prolific in the art song, or Lied, tradition.' },
            { name: 'Frédéric Chopin', aliases: ['Chopin', 'Frederic Chopin'], year: '1810', points: 56, tier: 'Uncommon', fact: 'The Polish-French composer was renowned for piano music, including nocturnes and études.' },
            { name: 'Franz Liszt', aliases: ['Liszt'], year: '1811', points: 66, tier: 'Rare', fact: 'Liszt was a celebrated virtuoso pianist who helped develop the symphonic poem.' },
            { name: 'Giuseppe Verdi', aliases: ['Verdi'], year: '1813', points: 76, tier: 'Rare', fact: 'Verdi became one of the most influential composers of Italian opera.' },
            { name: 'Pyotr Ilyich Tchaikovsky', aliases: ['Tchaikovsky', 'P.I. Tchaikovsky'], year: '1840', points: 88, tier: 'Rare', fact: 'The Russian composer wrote ballets including Swan Lake, The Sleeping Beauty, and The Nutcracker.' },
            { name: 'Claude Debussy', aliases: ['Debussy'], year: '1862', points: 98, tier: 'Paradox', fact: 'Debussy became a leading figure in French musical impressionism.' },
            { name: 'Maurice Ravel', aliases: ['Ravel'], year: '1875', points: 94, tier: 'Paradox', fact: 'The French composer is known for orchestral works including Boléro.' },
            { name: 'Igor Stravinsky', aliases: ['Stravinsky'], year: '1882', points: 100, tier: 'Paradox', fact: 'Stravinsky’s The Rite of Spring became a landmark of twentieth-century music.' }
          ]
        }]
      },
      {
        id: 'TABLETOP GAMES',
        rounds: [{
          id: 'tabletop-games-first-attested-before-2000', domain: 'Tabletop Games', era: 'Tabletop Games', subject: 'tabletop game', temporalNoun: 'first-attested or publication year',
          constraint: 'First attested before 2000', prompt: 'Name a tabletop game first attested or published before 2000',
          hint: 'Board games and tabletop strategy games count; video games do not.',
          theme: { accent: '#A36B32', skyTop: '#F2E8D6', skyBottom: '#E1CFAD', symbol: 'compass' },
          sources: ['https://www.nationalarchives.gov.uk/education/resources/all-on-board/', 'https://guides.loc.gov/this-month-in-business-history/december/game-of-monopoly-patent', 'https://boardgamegeek.com/wiki/page/Games_Magazine_Hall_of_Fame'],
          answers: [
            { name: 'Senet', aliases: ['senat'], year: 'c. 3100 BC', points: 15, tier: 'Common', fact: 'Ancient Egyptian game boards and depictions show Senet was played thousands of years ago.' },
            { name: 'The Royal Game of Ur', aliases: ['Royal Game of Ur', 'Game of Ur'], year: 'c. 2650 BC', points: 18, tier: 'Common', fact: 'Game boards from the Royal Cemetery of Ur are among the oldest surviving board-game sets.' },
            { name: 'The Checkered Game of Life', aliases: ['Checkered Game of Life'], year: '1860', points: 22, tier: 'Common', fact: 'Milton Bradley published this early parlor game, a predecessor to the modern Game of Life.' },
            { name: 'Reversi', aliases: ['Othello'], year: '1883', points: 28, tier: 'Common', fact: 'The modern game of Othello is based on Reversi, which appeared in the late nineteenth century.' },
            { name: 'Sorry!', aliases: [], year: '1934', points: 36, tier: 'Uncommon', fact: 'The English-language version of Sorry! was patented in the United States in the 1930s.' },
            { name: 'Monopoly', aliases: [], year: '1935', points: 42, tier: 'Uncommon', fact: 'The familiar Parker Brothers edition was patented in 1935; its history includes earlier precursors.' },
            { name: 'Scrabble', aliases: [], year: '1948', points: 48, tier: 'Uncommon', fact: 'Alfred Mosher Butts developed the game in the 1930s; the Scrabble name and commercial release followed in 1948.' },
            { name: 'Clue', aliases: ['Cluedo'], year: '1949', points: 56, tier: 'Uncommon', fact: 'Anthony Pratt created the murder-mystery game, first published in Britain as Cluedo.' },
            { name: 'Candy Land', aliases: ['Candyland'], year: '1949', points: 66, tier: 'Rare', fact: 'Eleanor Abbott designed the color-based children’s game while recovering from polio.' },
            { name: 'Risk', aliases: ['La Conquête du Monde'], year: '1957', points: 76, tier: 'Rare', fact: 'Albert Lamorisse designed the game, first released in France as La Conquête du Monde.' },
            { name: 'Twister', aliases: [], year: '1966', points: 88, tier: 'Rare', fact: 'The physical party game became a pop-culture hit after its release by Milton Bradley.' },
            { name: 'Connect Four', aliases: ['Connect 4'], year: '1974', points: 98, tier: 'Paradox', fact: 'Howard Wexler and Ned Strongin designed the vertical four-in-a-row game.' },
            { name: 'Trivial Pursuit', aliases: [], year: '1981', points: 92, tier: 'Paradox', fact: 'Chris Haney and Scott Abbott created the trivia game in Montreal; it was released in 1981.' },
            { name: 'The Settlers of Catan', aliases: ['Catan'], year: '1995', points: 100, tier: 'Paradox', fact: 'Klaus Teuber’s German strategy game helped popularize modern Eurogames internationally.' }
          ]
        }]
      },
      {
        id: 'CHEMICAL ELEMENTS',
        rounds: [{
          id: 'chemical-elements-discovered-before-1900', domain: 'Chemistry', era: 'Chemistry', subject: 'chemical element', temporalNoun: 'discovery year',
          constraint: 'Discovered before 1900', prompt: 'Name a chemical element first identified or isolated before 1900',
          hint: 'Use the commonly cited modern discovery date; ancient-known elements are excluded from this pool.',
          theme: { accent: '#4F7181', skyTop: '#E3EDF0', skyBottom: '#C9DCE2', symbol: 'compass' },
          sources: ['https://periodic-table.rsc.org/about', 'https://www.periodictable.one/history/periodic-table', 'https://iupac.org/what-we-do/periodic-table-of-elements/periodic-table-archives/'],
          answers: [
            { name: 'Hydrogen', aliases: ['H'], year: '1766', points: 15, tier: 'Common', fact: 'Henry Cavendish recognized hydrogen as a distinct substance in the eighteenth century.' },
            { name: 'Nitrogen', aliases: ['N'], year: '1772', points: 18, tier: 'Common', fact: 'Daniel Rutherford described nitrogen as a distinct component of air in 1772.' },
            { name: 'Oxygen', aliases: ['O'], year: '1774', points: 22, tier: 'Common', fact: 'Joseph Priestley and Carl Wilhelm Scheele independently obtained oxygen in the 1770s.' },
            { name: 'Chlorine', aliases: ['Cl'], year: '1774', points: 28, tier: 'Common', fact: 'Carl Wilhelm Scheele produced chlorine-containing gas in 1774; its elemental nature was established later.' },
            { name: 'Sodium', aliases: ['Na'], year: '1807', points: 36, tier: 'Uncommon', fact: 'Humphry Davy isolated sodium by electrolysis in 1807.' },
            { name: 'Potassium', aliases: ['K'], year: '1807', points: 42, tier: 'Uncommon', fact: 'Humphry Davy isolated potassium in 1807 using electrolysis.' },
            { name: 'Iodine', aliases: ['I'], year: '1811', points: 48, tier: 'Uncommon', fact: 'Bernard Courtois discovered iodine in seaweed-processing residues in 1811.' },
            { name: 'Bromine', aliases: ['Br'], year: '1826', points: 56, tier: 'Uncommon', fact: 'Antoine Jérôme Balard and Carl Jacob Löwig independently identified bromine in the 1820s.' },
            { name: 'Helium', aliases: ['He'], year: '1868', points: 66, tier: 'Rare', fact: 'Helium was first detected in the Sun’s spectrum during the 1868 solar eclipse.' },
            { name: 'Gallium', aliases: ['Ga'], year: '1875', points: 76, tier: 'Rare', fact: 'Paul-Émile Lecoq de Boisbaudran discovered gallium in 1875, confirming a prediction by Mendeleev.' },
            { name: 'Germanium', aliases: ['Ge'], year: '1886', points: 88, tier: 'Rare', fact: 'Clemens Winkler discovered germanium in 1886, another element anticipated by Mendeleev.' },
            { name: 'Argon', aliases: ['Ar'], year: '1894', points: 98, tier: 'Paradox', fact: 'Lord Rayleigh and William Ramsay identified argon in 1894 as a previously unknown component of air.' },
            { name: 'Polonium', aliases: ['Po'], year: '1898', points: 92, tier: 'Paradox', fact: 'Marie and Pierre Curie announced the discovery of polonium in 1898.' },
            { name: 'Radium', aliases: ['Ra'], year: '1898', points: 100, tier: 'Paradox', fact: 'Marie and Pierre Curie, with Gustave Bémont, announced radium in 1898.' }
          ]
        }]
      },
      {
        id: 'CIVIL ENGINEERING',
        rounds: [{
          id: 'famous-bridges-completed-before-2000', domain: 'Civil Engineering', era: 'Civil Engineering', subject: 'bridge', temporalNoun: 'completion year',
          constraint: 'Completed before 2000', prompt: 'Name a famous bridge completed before 2000',
          hint: 'The year refers to completion or opening, not the start of construction.',
          theme: { accent: '#687A70', skyTop: '#E7ECE5', skyBottom: '#D0D9CC', symbol: 'compass' },
          sources: ['https://www.asce.org/about-civil-engineering/history-and-heritage/historic-landmarks/brooklyn-bridge/', 'https://www.goldengate.org/faq/', 'https://www.theforthbridges.org/media/rvrb40ql/forth-bridge-world-heritage-nomination-document.pdf'],
          answers: [
            { name: 'Ponte Vecchio', aliases: [], year: '1345', points: 15, tier: 'Common', fact: 'Florence’s medieval stone bridge is lined with shops and crosses the Arno.' },
            { name: 'Charles Bridge', aliases: ['Karluv Most'], year: '1402', points: 18, tier: 'Common', fact: 'The Prague bridge was begun in 1357 and completed in the early fifteenth century.' },
            { name: 'Iron Bridge', aliases: ['The Iron Bridge'], year: '1781', points: 22, tier: 'Common', fact: 'The cast-iron bridge over the River Severn became a landmark of the Industrial Revolution.' },
            { name: 'Clifton Suspension Bridge', aliases: ['Clifton Bridge'], year: '1864', points: 28, tier: 'Common', fact: 'Isambard Kingdom Brunel designed the bridge spanning the Avon Gorge at Bristol.' },
            { name: 'Brooklyn Bridge', aliases: [], year: '1883', points: 36, tier: 'Uncommon', fact: 'The bridge opened in 1883 after fourteen years of construction.' },
            { name: 'Forth Bridge', aliases: ['Forth Rail Bridge'], year: '1890', points: 42, tier: 'Uncommon', fact: 'The Scottish cantilever railway bridge opened in 1890 and is a UNESCO World Heritage Site.' },
            { name: 'Tower Bridge', aliases: [], year: '1894', points: 48, tier: 'Uncommon', fact: 'London’s combined bascule and suspension bridge opened in 1894.' },
            { name: 'Verrazzano-Narrows Bridge', aliases: ['Verrazano-Narrows Bridge'], year: '1964', points: 56, tier: 'Uncommon', fact: 'The New York City suspension bridge opened in 1964 and connected Staten Island with Brooklyn.' },
            { name: 'George Washington Bridge', aliases: ['GW Bridge'], year: '1931', points: 66, tier: 'Rare', fact: 'The bridge connecting New York and New Jersey opened in 1931.' },
            { name: 'Sydney Harbour Bridge', aliases: ['Harbour Bridge'], year: '1932', points: 76, tier: 'Rare', fact: 'The steel arch bridge opened in 1932 and became a defining feature of Sydney Harbour.' },
            { name: 'Golden Gate Bridge', aliases: [], year: '1937', points: 88, tier: 'Rare', fact: 'The San Francisco landmark opened to vehicular traffic in May 1937.' },
            { name: 'Humber Bridge', aliases: [], year: '1981', points: 98, tier: 'Paradox', fact: 'The suspension bridge in England opened in 1981 and was then the world’s longest single-span suspension bridge.' },
            { name: 'Akashi Kaikyo Bridge', aliases: ['Akashi-Kaikyo Bridge', 'Pearl Bridge'], year: '1998', points: 100, tier: 'Paradox', fact: 'Japan’s suspension bridge opened in 1998 and set a new record for central span length.' }
          ]
        }]
      },
      {
        id: 'HISTORIC EXPEDITIONS',
        rounds: [{
          id: 'historic-expeditions-launched-before-1950', domain: 'Exploration', era: 'Exploration', subject: 'expedition', temporalNoun: 'launch year',
          constraint: 'Launched before 1950', prompt: 'Name a historic exploration expedition launched before 1950',
          hint: 'Use the year the voyage or expedition began, not the year it reached its destination.',
          theme: { accent: '#557C82', skyTop: '#E2ECEB', skyBottom: '#C8DAD8', symbol: 'compass' },
          sources: ['https://msi.nga.mil/api/publications/download?key=16694492%2FSFH00000%2FPub200bk.pdf', 'https://resources.amdigital.co.uk/aoe/map/', 'https://historiasdanavegacao.com.br/historias/'],
          answers: [
            { name: 'Marco Polo’s Asian Journey', aliases: ['Marco Polo expedition', 'Marco Polo journey'], year: '1271', points: 15, tier: 'Common', fact: 'Marco Polo departed Venice with his family in 1271 on the journey that took him to the court of Kublai Khan.' },
            { name: 'Zheng He’s First Voyage', aliases: ['Zheng He first expedition'], year: '1405', points: 18, tier: 'Common', fact: 'The Ming admiral’s first major maritime expedition departed in 1405.' },
            { name: 'Columbus’s First Voyage', aliases: ['Columbus first voyage'], year: '1492', points: 22, tier: 'Common', fact: 'Christopher Columbus’s first Atlantic voyage began in August 1492.' },
            { name: 'Magellan–Elcano Expedition', aliases: ['Magellan expedition', 'First circumnavigation'], year: '1519', points: 28, tier: 'Common', fact: 'The expedition departed in 1519; Juan Sebastián Elcano completed the first circumnavigation in 1522.' },
            { name: 'James Cook’s First Voyage', aliases: ['Cook first voyage', 'Endeavour voyage'], year: '1768', points: 36, tier: 'Uncommon', fact: 'Cook’s first Pacific voyage aboard HMS Endeavour began in 1768.' },
            { name: 'Lewis and Clark Expedition', aliases: ['Corps of Discovery'], year: '1804', points: 42, tier: 'Uncommon', fact: 'The Corps of Discovery set out in 1804 to explore the newly acquired Louisiana Territory and routes west.' },
            { name: 'Voyage of the Beagle', aliases: ['HMS Beagle voyage', 'Darwin expedition'], year: '1831', points: 48, tier: 'Uncommon', fact: 'Charles Darwin joined HMS Beagle’s second survey voyage, which departed in 1831.' },
            { name: 'Franklin Expedition', aliases: ['Lost Franklin Expedition'], year: '1845', points: 56, tier: 'Uncommon', fact: 'John Franklin’s expedition left England in 1845 to chart the Northwest Passage.' },
            { name: 'Fram Expedition', aliases: ['Nansen Fram expedition'], year: '1893', points: 66, tier: 'Rare', fact: 'Fridtjof Nansen’s Fram expedition began in 1893 to drift across the Arctic Ocean.' },
            { name: 'Amundsen’s South Pole Expedition', aliases: ['Amundsen expedition'], year: '1910', points: 76, tier: 'Rare', fact: 'Roald Amundsen’s Antarctic expedition sailed in 1910 and reached the South Pole in December 1911.' },
            { name: 'Terra Nova Expedition', aliases: ['Scott expedition'], year: '1910', points: 88, tier: 'Rare', fact: 'Robert Falcon Scott’s Terra Nova expedition began in 1910; its party reached the South Pole in January 1912.' },
            { name: 'Endurance Expedition', aliases: ['Shackleton Endurance expedition'], year: '1914', points: 98, tier: 'Paradox', fact: 'Ernest Shackleton’s Imperial Trans-Antarctic Expedition departed in 1914; Endurance was trapped and crushed by pack ice.' },
            { name: 'Operation Highjump', aliases: ['US Navy Antarctic Developments Program'], year: '1946', points: 92, tier: 'Paradox', fact: 'The United States Navy’s large Antarctic expedition began in 1946.' },
            { name: 'Kon-Tiki Expedition', aliases: ['Kon Tiki'], year: '1947', points: 100, tier: 'Paradox', fact: 'Thor Heyerdahl’s balsa-raft voyage from South America to Polynesia began in 1947.' }
          ]
        }]
      }
    ];
  // Editorial metadata layer: the engine consumes explicit domains and only
  // uses temporal facts when the source's year field is unambiguous.
  const DOMAIN_BY_PROMPT = [
    ['History', 'ancient civilization', 'fall date'],
    ['Visual Arts', 'painter', 'active-start year'],
    ['Music', 'music band', 'formation year'],
    ['Video Games', 'video game', 'release year'],
    ['Geopolitics', 'country', 'independence year'],
    ['Invention & Technology', 'invention', 'invention year'],
    ['Cinema', 'feature film', 'release year'],
    ['Mythology', 'deity', ''],
    ['Literature', 'novel or novella', 'publication year'],
    ['Music', 'solo music artist', 'album release year'],
    ['Video Games', 'video game console', 'release year'],
    ['Geography', 'landlocked country', ''],
    ['Computing', 'programming language', 'first-appeared year'],
    ['Cinema', 'feature film', 'release year'],
    ['Architecture', 'architectural landmark', 'completion year'],
    ['Space & Exploration', 'space mission or spacecraft', 'milestone year'],
    ['Science', 'scientific discovery or theory', 'discovery year'],
    ['Literature', 'literary work', 'publication year'],
    ['Nature & Geography', 'natural landmark', ''],
    ['Classical Music', 'composer', 'birth year'],
    ['Tabletop Games', 'tabletop game', 'first-attested or publication year'],
    ['Chemistry', 'chemical element', 'discovery year'],
    ['Civil Engineering', 'bridge', 'completion year'],
    ['Exploration', 'expedition', 'launch year']
  ];

  function parseExplicitYear(raw) {
    const value = String(raw ?? '').trim();
    if (!value || /\b(million|thousand|century|millennium|millennia|ongoing|prehistoric|surveyed|documented|named|current form|formed from|ancient reef|geological formation)\b/i.test(value)) return null;
    if (/\//.test(value)) return null; // region-dependent or multiple-year notation
    const match = value.match(/^(?:Formed\s+|c\.\s*)?(\d{1,4})(?:\s*[–-]\s*(\d{1,4}))?\s*(BC|BCE|AD|CE)?$/i)
      || value.match(/^.*?\((\d{4})\)$/);
    if (!match) return null;
    const year = Number(match[1]);
    if (!Number.isFinite(year) || year < 1) return null;
    const era = String(match[3] || '').toUpperCase();
    return era === 'BC' || era === 'BCE' ? -year : year;
  }

  let metadataIndex = 0;
  GAME_SEEDS.forEach(collection => {
    collection.rounds.forEach(pool => {
      const descriptor = DOMAIN_BY_PROMPT[metadataIndex++] || ['General Knowledge', pool.subject || 'entry', ''];
      pool.domain = pool.domain || descriptor[0];
      pool.subject = pool.subject || descriptor[1];
      pool.id = pool.id || pool.prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 56);
      // External answer expansion is enabled only for categories with an explicit,
      // machine-checkable definition. Unsupported prompts keep their curated list.
      const promptKey = pool.prompt.toLowerCase();
      if (promptKey.includes('ancient civilization or empire that fell before 500 ad')) {
        pool.answerCriteria = { classesAny: ['Q48349', 'Q3024240'], date: { before: 500 }, dateProperty: 'P582' };
      } else if (promptKey.includes('painter who was active during the 1800s')) {
        pool.temporalNoun = null;
        pool.answerCriteria = { classesAny: ['Q1028181'], lifePeriod: { birthBefore: 1900, deathAfter: 1800 }, dateProperties: ['P569', 'P570'] };
      } else if (promptKey.includes('band formed before 1980')) {
        pool.answerCriteria = { classesAny: ['Q215380'], date: { before: 1980 }, dateProperty: 'P571' };
      } else if (promptKey.includes('video game released before the year 2000')) {
        pool.answerCriteria = { classesAny: ['Q7889'], date: { before: 2000 }, dateProperty: 'P577' };
      } else if (promptKey.includes('feature film directed by christopher nolan or denis villeneuve')) {
        pool.answerCriteria = { classesAny: ['Q11424'], directorIds: ['Q25191', 'Q187484'], dateProperty: 'P577' };
      } else if (promptKey.includes('deity from ancient greek or roman mythology')) {
        pool.answerCriteria = { classesAny: ['Q178885'] };
      } else if (promptKey.includes('novel or novella published during the 1800s')) {
        pool.answerCriteria = { classesAny: ['Q8261'], date: { after: 1799, before: 1900 }, dateProperty: 'P577' };
      } else if (promptKey.includes('video game console released between 1985 and 1999')) {
        pool.answerCriteria = { classesAny: ['Q8076'], date: { after: 1984, before: 2000 }, dateProperty: 'P571' };
      } else if (promptKey.includes('computer programming language')) {
        pool.answerCriteria = { classesAny: ['Q9143'] };
      } else if (promptKey.includes('feature film directed by alfred hitchcock')) {
        pool.answerCriteria = { classesAny: ['Q11424'], directorIds: ['Q425'], dateProperty: 'P577' };
      } else if (promptKey.includes('architectural landmark completed before')) {
        pool.answerCriteria = { classesAny: ['Q811979'], date: { before: 2000 }, dateProperty: 'P571' };
      } else if (promptKey.includes('space mission or spacecraft')) {
        pool.temporalNoun = null;
        pool.answerCriteria = { classesAny: ['Q2133344', 'Q40218'], dateProperty: 'P619' };
      } else if (promptKey.includes('landmark literary work')) {
        pool.answerCriteria = { classesAny: ['Q7725634'] };
      } else if (promptKey.includes('natural landmark or geographical feature')) {
        pool.answerCriteria = { classesAny: ['Q618123'] };
      } else if (promptKey.includes('classical composer born before 1900')) {
        pool.answerCriteria = { classesAny: ['Q36834'], date: { before: 1900 }, dateProperty: 'P569' };
      } else if (promptKey.includes('tabletop game first attested or published before 2000')) {
        pool.answerCriteria = { classesAny: ['Q131436'], date: { before: 2000 }, dateProperty: 'P571' };
      } else if (promptKey.includes('chemical element first identified or isolated before 1900')) {
        pool.answerCriteria = { classesAny: ['Q11344'], date: { before: 1900 }, dateProperty: 'P575' };
      } else if (promptKey.includes('bridge completed before 2000')) {
        pool.answerCriteria = { classesAny: ['Q12280'], date: { before: 2000 }, dateProperty: 'P1619' };
      } else if (promptKey.includes('exploration expedition launched before 1950')) {
        pool.answerCriteria = { classesAny: ['Q1371819'], date: { before: 1950 }, dateProperty: 'P580' };
      }
      if (!pool.temporalNoun && descriptor[2]) pool.temporalNoun = descriptor[2];
      pool.answers.forEach(answer => {
        const year = parseExplicitYear(answer.year);
        if (year !== null && pool.temporalNoun) {
          answer.metadata = { ...(answer.metadata || {}), temporalYear: year, temporalSource: answer.year };
        }
      });

      if (pool.id === 'classical-composers-born-before-1900') {
        const birthCountries = {
          'Antonio Vivaldi': 'Italy', 'Johann Sebastian Bach': 'Germany', 'George Frideric Handel': 'Germany',
          'Joseph Haydn': 'Austria', 'Wolfgang Amadeus Mozart': 'Austria', 'Ludwig van Beethoven': 'Germany',
          'Franz Schubert': 'Austria', 'Frédéric Chopin': 'Poland', 'Franz Liszt': 'Hungary',
          'Giuseppe Verdi': 'Italy', 'Pyotr Ilyich Tchaikovsky': 'Russia', 'Claude Debussy': 'France',
          'Maurice Ravel': 'France', 'Igor Stravinsky': 'Russia'
        };
        pool.answers.forEach(answer => {
          answer.metadata = { ...(answer.metadata || {}), origin: birthCountries[answer.name] };
        });
        pool.constraintVariants = [
          { type: 'origin', origin: 'Germany', subject: 'composer', prompt: 'Name a composer born in Germany.', label: 'German-born composers' },
          { type: 'origin', origin: 'Austria', subject: 'composer', prompt: 'Name a composer born in Austria.', label: 'Austrian-born composers' },
          { label: 'German-born composers before 1800', subject: 'composer', prompt: 'Name a German-born composer born before 1800.', allOf: [
            { type: 'origin', origin: 'Germany' }, { type: 'temporal', direction: 'before', year: 1800 }
          ] }
        ];
      }
      if (pool.id === 'tabletop-games-first-attested-before-2000') {
        const origins = {
          'Senet': 'Egypt', 'The Royal Game of Ur': 'Mesopotamia', 'The Checkered Game of Life': 'United States',
          'Reversi': 'United Kingdom', 'Sorry!': 'United Kingdom', 'Monopoly': 'United States',
          'Scrabble': 'United States', 'Clue': 'United Kingdom', 'Candy Land': 'United States',
          'Risk': 'France', 'Twister': 'United States', 'Connect Four': 'United States',
          'Trivial Pursuit': 'Canada', 'The Settlers of Catan': 'Germany'
        };
        pool.answers.forEach(answer => {
          const associations = ['The Checkered Game of Life', 'Twister', 'Connect Four'].includes(answer.name) ? ['Milton Bradley'] : [];
          answer.metadata = { ...(answer.metadata || {}), origin: origins[answer.name], associations };
        });
        pool.constraintVariants = [
          { type: 'origin', origin: 'United States', subject: 'tabletop game', prompt: 'Name a tabletop game first published or developed in the United States.', label: 'US-origin games' },
          { type: 'associative', person: 'Milton Bradley', relation: 'published by', subject: 'tabletop game', prompt: 'Name a tabletop game published by Milton Bradley.', label: 'Milton Bradley games' },
          { label: 'US-origin or Milton Bradley games', subject: 'tabletop game', prompt: 'Name a tabletop game first published in the United States or published by Milton Bradley.', anyOf: [
            { type: 'origin', origin: 'United States' }, { type: 'associative', person: 'Milton Bradley' }
          ] }
        ];
      }

      // Two balanced temporal variants are generated only when enough answers
      // carry an explicit, parseable event year. No origin/association is guessed.
      const dated = pool.answers.filter(answer => Number.isFinite(answer.metadata?.temporalYear));
      const years = [...new Set(dated.map(answer => answer.metadata.temporalYear))].sort((a, b) => a - b);
      if (years.length >= 6 && pool.temporalNoun) {
        const low = years[Math.floor((years.length - 1) * 0.35)];
        const high = years[Math.floor((years.length - 1) * 0.65)];
        const generatedTemporalVariants = [
          { type: 'temporal', direction: 'before', year: low, subject: pool.subject,
            prompt: `Name a ${pool.subject} with a ${pool.temporalNoun} before ${Math.abs(low)}${low < 0 ? ' BC' : ''}.`,
            label: `Earlier ${pool.temporalNoun}` },
          { type: 'temporal', direction: 'after', year: high, subject: pool.subject,
            prompt: `Name a ${pool.subject} with a ${pool.temporalNoun} after ${Math.abs(high)}${high < 0 ? ' BC' : ''}.`,
            label: `Later ${pool.temporalNoun}` }
        ];
        pool.constraintVariants = [...(pool.constraintVariants || []), ...generatedTemporalVariants];
      }
    });
  });

  global.ChrononautContent = Object.freeze({ seeds: GAME_SEEDS });
})(window);
