-- Spanish Vocabulary Seeding Script
-- Inserts 50+ Spanish words across 3 difficulty levels

-- BEGINNER LEVEL (20 words)
INSERT INTO language_words (id, word, translation, emoji, definition, example_sentence, difficulty, category) VALUES
('es_001', 'árbol', 'tree', '🌳', 'A tall plant with a trunk and branches', 'The árbol is very tall.', 'BEGINNER', 'NOUN'),
('es_002', 'amigo', 'friend', '👋', 'Someone you like and enjoy spending time with', 'My amigo and I play together.', 'BEGINNER', 'NOUN'),
('es_003', 'casa', 'house', '🏠', 'A building where people live', 'I live in a big casa.', 'BEGINNER', 'NOUN'),
('es_004', 'gato', 'cat', '🐱', 'A small furry pet that says meow', 'The gato is sleeping.', 'BEGINNER', 'NOUN'),
('es_005', 'perro', 'dog', '🐕', 'A friendly pet that barks and wags its tail', 'My perro loves to play fetch.', 'BEGINNER', 'NOUN'),
('es_006', 'sol', 'sun', '☀️', 'The bright star in the sky during the day', 'The sol is shining today.', 'BEGINNER', 'NOUN'),
('es_007', 'luna', 'moon', '🌙', 'The bright object you see in the night sky', 'The luna is full tonight.', 'BEGINNER', 'NOUN'),
('es_008', 'agua', 'water', '💧', 'The clear liquid we drink', 'I need agua to drink.', 'BEGINNER', 'NOUN'),
('es_009', 'libro', 'book', '📚', 'Pages with stories or information', 'I love reading this libro.', 'BEGINNER', 'NOUN'),
('es_010', 'flor', 'flower', '🌸', 'A pretty plant with colorful petals', 'The flor smells nice.', 'BEGINNER', 'NOUN'),
('es_011', 'niño', 'boy', '👦', 'A young male child', 'The niño is playing.', 'BEGINNER', 'NOUN'),
('es_012', 'niña', 'girl', '👧', 'A young female child', 'The niña is happy.', 'BEGINNER', 'NOUN'),
('es_013', 'mamá', 'mom', '👩', 'Your mother', 'My mamá loves me.', 'BEGINNER', 'NOUN'),
('es_014', 'papá', 'dad', '👨', 'Your father', 'My papá is strong.', 'BEGINNER', 'NOUN'),
('es_015', 'comer', 'eat', '🍽️', 'To put food in your mouth and swallow it', 'I like to comer apples.', 'BEGINNER', 'VERB'),
('es_016', 'jugar', 'play', '🎮', 'To have fun with toys or games', 'Let''s jugar together!', 'BEGINNER', 'VERB'),
('es_017', 'dormir', 'sleep', '😴', 'To rest with your eyes closed', 'I need to dormir now.', 'BEGINNER', 'VERB'),
('es_018', 'correr', 'run', '🏃', 'To move very fast with your legs', 'I can correr fast!', 'BEGINNER', 'VERB'),
('es_019', 'saltar', 'jump', '🦘', 'To push yourself off the ground', 'I love to saltar high!', 'BEGINNER', 'VERB'),
('es_020', 'cantar', 'sing', '🎤', 'To make music with your voice', 'She likes to cantar songs.', 'BEGINNER', 'VERB');

-- INTERMEDIATE LEVEL (20 words)
INSERT INTO language_words (id, word, translation, emoji, definition, example_sentence, difficulty, category) VALUES
('es_021', 'aventura', 'adventure', '🗺️', 'An exciting experience or journey', 'We went on a great aventura.', 'INTERMEDIATE', 'NOUN'),
('es_022', 'bosque', 'forest', '🌲', 'A large area with many trees', 'The bosque is full of animals.', 'INTERMEDIATE', 'NOUN'),
('es_023', 'montaña', 'mountain', '⛰️', 'A very tall hill', 'The montaña is covered in snow.', 'INTERMEDIATE', 'NOUN'),
('es_024', 'río', 'river', '🏞️', 'A long stream of water', 'We swam in the río.', 'INTERMEDIATE', 'NOUN'),
('es_025', 'estrella', 'star', '⭐', 'A bright point of light in the night sky', 'I saw a shooting estrella.', 'INTERMEDIATE', 'NOUN'),
('es_026', 'mariposa', 'butterfly', '🦋', 'A colorful flying insect', 'The mariposa landed on the flower.', 'INTERMEDIATE', 'NOUN'),
('es_027', 'tesoro', 'treasure', '💎', 'Valuable things like gold or jewels', 'We found a hidden tesoro.', 'INTERMEDIATE', 'NOUN'),
('es_028', 'dragón', 'dragon', '🐉', 'A mythical creature that breathes fire', 'The dragón guards the castle.', 'INTERMEDIATE', 'NOUN'),
('es_029', 'castillo', 'castle', '🏰', 'A large building where kings and queens live', 'The castillo has tall towers.', 'INTERMEDIATE', 'NOUN'),
('es_030', 'mapa', 'map', '🗺️', 'A drawing that shows where places are', 'Use the mapa to find the treasure.', 'INTERMEDIATE', 'NOUN'),
('es_031', 'explorar', 'explore', '🔍', 'To look around and discover new things', 'Let''s explorar the cave.', 'INTERMEDIATE', 'VERB'),
('es_032', 'descubrir', 'discover', '🔎', 'To find something for the first time', 'We will descubrir new lands.', 'INTERMEDIATE', 'VERB'),
('es_033', 'volar', 'fly', '✈️', 'To move through the air', 'Birds can volar high.', 'INTERMEDIATE', 'VERB'),
('es_034', 'nadar', 'swim', '🏊', 'To move through water', 'I love to nadar in summer.', 'INTERMEDIATE', 'VERB'),
('es_035', 'escalar', 'climb', '🧗', 'To go up something using your hands and feet', 'We will escalar the mountain.', 'INTERMEDIATE', 'VERB'),
('es_036', 'brillar', 'shine', '✨', 'To give off light', 'The stars brillar at night.', 'INTERMEDIATE', 'VERB'),
('es_037', 'mágico', 'magical', '🪄', 'Having special powers', 'This place is mágico.', 'INTERMEDIATE', 'ADJECTIVE'),
('es_038', 'valiente', 'brave', '🦁', 'Not afraid of danger', 'The hero is very valiente.', 'INTERMEDIATE', 'ADJECTIVE'),
('es_039', 'hermoso', 'beautiful', '🌺', 'Very pretty or lovely', 'The sunset is hermoso.', 'INTERMEDIATE', 'ADJECTIVE'),
('es_040', 'grande', 'big', '📏', 'Large in size', 'The elephant is grande.', 'INTERMEDIATE', 'ADJECTIVE');

-- ADVANCED LEVEL (15 words)
INSERT INTO language_words (id, word, translation, emoji, definition, example_sentence, difficulty, category) VALUES
('es_041', 'sabiduría', 'wisdom', '🦉', 'Deep knowledge and good judgment', 'The owl has great sabiduría.', 'ADVANCED', 'NOUN'),
('es_042', 'valentía', 'courage', '💪', 'The ability to do something brave', 'She showed great valentía.', 'ADVANCED', 'NOUN'),
('es_043', 'amistad', 'friendship', '🤝', 'A close relationship between friends', 'Our amistad is strong.', 'ADVANCED', 'NOUN'),
('es_044', 'esperanza', 'hope', '🌟', 'A feeling that good things will happen', 'Never lose esperanza.', 'ADVANCED', 'NOUN'),
('es_045', 'destino', 'destiny', '🎯', 'What is meant to happen in the future', 'It was our destino to meet.', 'ADVANCED', 'NOUN'),
('es_046', 'transformar', 'transform', '🔄', 'To change completely', 'The spell will transformar him.', 'ADVANCED', 'VERB'),
('es_047', 'proteger', 'protect', '🛡️', 'To keep safe from harm', 'I will proteger my friends.', 'ADVANCED', 'VERB'),
('es_048', 'perseverar', 'persevere', '💪', 'To keep trying even when it''s hard', 'We must perseverar to succeed.', 'ADVANCED', 'VERB'),
('es_049', 'imaginar', 'imagine', '💭', 'To create pictures in your mind', 'Can you imaginar a better world?', 'ADVANCED', 'VERB'),
('es_050', 'extraordinario', 'extraordinary', '🌟', 'Very unusual or remarkable', 'This is an extraordinario day.', 'ADVANCED', 'ADJECTIVE'),
('es_051', 'misterioso', 'mysterious', '🔮', 'Strange and not easy to understand', 'The cave is misterioso.', 'ADVANCED', 'ADJECTIVE'),
('es_052', 'poderoso', 'powerful', '⚡', 'Having great strength or ability', 'The wizard is poderoso.', 'ADVANCED', 'ADJECTIVE'),
('es_053', 'increíble', 'incredible', '😲', 'Hard to believe; amazing', 'That was increíble!', 'ADVANCED', 'ADJECTIVE'),
('es_054', 'legendario', 'legendary', '📜', 'Very famous and talked about', 'The hero is legendario.', 'ADVANCED', 'ADJECTIVE'),
('es_055', 'encantado', 'enchanted', '✨', 'Under a magic spell', 'The forest is encantado.', 'ADVANCED', 'ADJECTIVE');

-- =====================================================
-- SEED DATA - Using simple INSERT with hardcoded user IDs
-- Note: User ID 1 will be the registered user (Arda)
-- User ID 100 will be the system user
-- =====================================================

-- Insert System User (ID 100)
INSERT INTO users (id, email, password_hash, display_name, created_at, updated_at, premium) 
VALUES (100, 'system@childstory.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'ChildStory', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), true);

-- Insert Arda (ID 1) - Password is 'password'
INSERT INTO users (id, email, password_hash, display_name, created_at, updated_at, premium) 
VALUES (1, 'arda@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'Arda Kara', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), true);

-- =====================================================
-- ARDA'S CHILDREN PROFILES (ID 1)
-- =====================================================

INSERT INTO children (id, name, user_id, language_learning_enabled, target_language, proficiency_level, words_learned, last_quest_date, avatar_url, birth_date)
VALUES 
(1, 'Ali', 1, true, 'Spanish', 'BEGINNER', 12, CURRENT_TIMESTAMP(), '👦', DATEADD('YEAR', -6, CURRENT_DATE())),
(2, 'Ayse', 1, true, 'Spanish', 'INTERMEDIATE', 45, CURRENT_TIMESTAMP(), '👧', DATEADD('YEAR', -8, CURRENT_DATE())),
(3, 'Zeynep', 1, true, 'Spanish', 'BEGINNER', 8, CURRENT_TIMESTAMP(), '👶', DATEADD('YEAR', -4, CURRENT_DATE())),
(4, 'Mehmet', 1, true, 'Spanish', 'INTERMEDIATE', 28, CURRENT_TIMESTAMP(), '🧑', DATEADD('YEAR', -10, CURRENT_DATE()));

-- =====================================================
-- ARDA'S LIBRARY STORIES (ID 1)
-- =====================================================

-- Delete existing stories for Arda (ID 1) to avoid duplicates/conflicts
DELETE FROM stories WHERE user_id = 1;

INSERT INTO stories (id, title, content, theme, is_favorite, is_staff_pick, upvotes, total_vocabulary_words, user_id, child_id, created_at, updated_at, thumbnail, duration)
VALUES 
(1, 'Ayse''s Space Adventure', '[
  {"pageNumber": 1, "text": "Once upon a time, Ayse looked up at the starry night sky and wished she could visit the stars.", "imagePath": "assets/images/story_pages/story_1_page_1.png"},
  {"pageNumber": 2, "text": "Suddenly, a magical spaceship appeared in her backyard, glowing with rainbow colors!", "imagePath": "assets/images/story_pages/story_1_page_2.png"},
  {"pageNumber": 3, "text": "Ayse climbed aboard and met Captain Stella, a friendly alien with sparkly purple skin.", "imagePath": "assets/images/story_pages/story_1_page_3.png"},
  {"pageNumber": 4, "text": "\"Welcome aboard!\" said Captain Stella. \"We''re going on an adventure to find the Lost Star of Courage.\"", "imagePath": "assets/images/story_pages/story_1_page_4.png"},
  {"pageNumber": 5, "text": "They flew past colorful planets, dancing comets, and friendly space whales.", "imagePath": "assets/images/story_pages/story_1_page_5.png"},
  {"pageNumber": 6, "text": "When they reached the Dark Nebula, Ayse felt scared. But Captain Stella said, \"Being brave means doing something even when you''re afraid.\"", "imagePath": "assets/images/story_pages/story_1_page_6.png"},
  {"pageNumber": 7, "text": "Ayse took a deep breath and steered the ship through the nebula. And there it was - the Lost Star of Courage, shining brightly!", "imagePath": "assets/images/story_pages/story_1_page_7.png"},
  {"pageNumber": 8, "text": "The star gave Ayse a special gift: whenever she felt scared, she could remember that she was brave enough to fly through space. The End.", "imagePath": "assets/images/story_pages/story_1_page_8.png"}
]', 'Space and Adventure', true, true, 156, 8, 1, 2, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'assets/images/stories/story_1_thumbnail.png', '8 min'),

(2, 'Ali and the Pirate Treasure', '[
  {"pageNumber": 1, "text": "Ali found an old treasure map in his attic. \"X marks the spot!\" he exclaimed.", "imagePath": "assets/images/story_pages/story_2_page_1.png"},
  {"pageNumber": 2, "text": "He built a cardboard pirate ship and set sail across the living room sea.", "imagePath": "assets/images/story_pages/story_2_page_2.png"},
  {"pageNumber": 3, "text": "Captain Ali met a silly parrot named Squawk who only spoke in rhymes.", "imagePath": "assets/images/story_pages/story_2_page_3.png"},
  {"pageNumber": 4, "text": "\"The treasure you seek is not gold or jewels, but something better for little ghouls!\" squawked the parrot.", "imagePath": "assets/images/story_pages/story_2_page_4.png"},
  {"pageNumber": 5, "text": "They dug under the big oak tree and found a chest full of... cookies!", "imagePath": "assets/images/story_pages/story_2_page_5.png"},
  {"pageNumber": 6, "text": "Ali wanted to keep them all, but Squawk reminded him: \"Sharing is caring, that''s the pirate code!\"", "imagePath": "assets/images/story_pages/story_2_page_6.png"},
  {"pageNumber": 7, "text": "So Ali shared the cookies with all his friends, and they had the best pirate party ever!", "imagePath": "assets/images/story_pages/story_2_page_7.png"},
  {"pageNumber": 8, "text": "Ali learned that sharing treasure with friends is the greatest treasure of all. The End.", "imagePath": "assets/images/story_pages/story_2_page_8.png"}
]', 'Pirates and Adventure', false, false, 89, 6, 1, 1, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'assets/images/stories/story_2_thumbnail.png', '10 min'),

(3, 'Zeynep''s Magical Garden', '[
  {"pageNumber": 1, "text": "Zeynep discovered a tiny door at the bottom of her garden fence.", "imagePath": "assets/images/story_pages/story_3_page_1.png"},
  {"pageNumber": 2, "text": "When she opened it, she found a magical garden where flowers could talk!", "imagePath": "assets/images/story_pages/story_3_page_2.png"},
  {"pageNumber": 3, "text": "\"Help us!\" cried a sad sunflower. \"The Rainbow Butterfly has lost her colors.\"", "imagePath": "assets/images/story_pages/story_3_page_3.png"},
  {"pageNumber": 4, "text": "Zeynep met the butterfly, who was now completely white. \"I lost my colors because I forgot to be kind,\" she whispered.", "imagePath": "assets/images/story_pages/story_3_page_4.png"},
  {"pageNumber": 5, "text": "Zeynep had an idea! She helped the butterfly do kind things: watering thirsty flowers, helping a lost bee find its hive.", "imagePath": "assets/images/story_pages/story_3_page_5.png"},
  {"pageNumber": 6, "text": "With each kind deed, a new color appeared on the butterfly''s wings!", "imagePath": "assets/images/story_pages/story_3_page_6.png"},
  {"pageNumber": 7, "text": "Soon, the Rainbow Butterfly was more beautiful than ever, with all the colors of kindness.", "imagePath": "assets/images/story_pages/story_3_page_7.png"},
  {"pageNumber": 8, "text": "Zeynep learned that kindness makes the world more colorful and magical. The End.", "imagePath": "assets/images/story_pages/story_3_page_8.png"}
]', 'Fairy Tales and Magic', true, true, 200, 10, 1, 3, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'assets/images/stories/story_3_thumbnail.png', '7 min');

-- =====================================================
-- PUBLIC EXPLORE STORIES (System User ID=100)
-- =====================================================

INSERT INTO stories (id, title, content, theme, is_favorite, is_staff_pick, upvotes, total_vocabulary_words, user_id, created_at, updated_at)
VALUES 
(100, 'The Little Seed', 'A tiny seed dreamed of becoming a mighty tree. With patience, sunshine, and rain, the little seed grew stronger each day until it became the tallest tree in the forest.', 'Growth and Patience', false, true, 45, 8, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(101, 'The Brave Little Mouse', 'When a lion was trapped in a hunter''s net, a tiny mouse proved that even the smallest friend can make the biggest difference by gnawing through the ropes.', 'Kindness and Courage', false, true, 52, 10, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(102, 'The Starlight Express', 'Every night, a magical train made of starlight travels across the sky, carrying dreams to sleeping children all around the world.', 'Dreams and Wonder', false, true, 38, 12, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(103, 'The Friendly Dragon', 'Everyone feared the dragon on the mountain, but a brave child discovered he was actually lonely and just wanted friends. Together they showed the village that being different is wonderful.', 'Acceptance and Friendship', false, true, 41, 14, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(104, 'The Magic Paintbrush', 'A young artist found a paintbrush that brought everything she painted to life! She learned to use her gift wisely, creating beauty and helping those in need.', 'Creativity and Responsibility', false, true, 48, 11, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(105, 'The Moonlight Garden', 'In a secret garden that only blooms under moonlight, flowers sing lullabies and fireflies dance. A child who couldn''t sleep discovered this peaceful paradise.', 'Bedtime and Calm', false, true, 35, 9, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(106, 'The Time-Traveling Treehouse', 'A magical treehouse can travel through time! Visit dinosaurs, meet knights and princesses, and even peek into the future where robots and flying cars exist.', 'History and Adventure', false, true, 44, 15, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(107, 'The Kindness Fairy', 'Whenever someone does something kind, the Kindness Fairy sprinkles magic dust that makes flowers bloom and rainbows appear. One child learned that kindness creates real magic.', 'Kindness and Values', false, true, 50, 7, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(108, 'The Cloud Maker', 'High in the sky lives the Cloud Maker who sculpts clouds into amazing shapes - animals, castles, and dragons. Children who look up with imagination can see the magic.', 'Imagination and Nature', false, true, 39, 10, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(109, 'The Giggling Volcano', 'Instead of lava, this volcano erupts with giggles and bubbles! The island''s children discovered that laughter is the most powerful force in nature.', 'Joy and Humor', false, true, 42, 6, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(110, 'The Wishing Well', 'An ancient well grants wishes, but only to those with pure hearts. A child learned that the best wishes are those made for others, not ourselves.', 'Selflessness and Wisdom', false, true, 46, 13, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
(111, 'The Singing Mountains', 'When the wind blows through the mountains, they create beautiful music. A young musician discovered that nature is the greatest orchestra of all.', 'Music and Nature', false, true, 37, 11, 100, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- =====================================================
-- RESET SEQUENCES (Fix for PK Violations)
-- =====================================================
ALTER TABLE users ALTER COLUMN id RESTART WITH 200;
ALTER TABLE children ALTER COLUMN id RESTART WITH 200;
ALTER TABLE stories ALTER COLUMN id RESTART WITH 200;
