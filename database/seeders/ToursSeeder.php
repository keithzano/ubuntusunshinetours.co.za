<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Location;
use App\Models\Tour;
use App\Models\TourPricingTier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class ToursSeeder extends Seeder
{
    private string $baseImageUrl = 'https://ubuntusunshinetours.co.za/wp-content/uploads';

    public function run(): void
    {
        $categories = Category::all()->keyBy('slug');
        $locations = Location::all()->keyBy('slug');

        $tours = [
            // ── Port Elizabeth / Gqeberha Tours ──────────────────────────
            [
                'title' => 'Gqeberha: City Highlights Guided Tour',
                'slug' => 'gqeberha-city-highlights-guided-tour',
                'description' => "Explore Gqeberha (Port Elizabeth) – aka the Windy City, Ibhayi ('the bay' in isiXhosa) or the Friendly City as it is affectionately known by locals. This coastal hub in the Eastern Cape has many hidden treasures and some amazing history.\n\nTake a guided city tour through the inner city of one of the oldest cities in South Africa. Start your tour at the Campanile Memorial, an important landmark situated at the entrance to the railway station.\n\nFollow Route 67, an exciting trail that combines the best elements – both historical and modern-day – of the people and culture of the Eastern Cape. It also pays tribute to Madiba's 67 years of service to South Africans.\n\nVisit the Donkin Reserve at Belmont Terrace and the old lighthouse. Here you will find yourself surrounded by a mix of exquisite old Victorian churches; newly renovated, terraced cottages on Donkin Street; and a lighthouse that once guided ships into Algoa Bay.\n\nBe sure to get a picture next to a large metal cut-out of Nelson Mandela, fist raised in triumph, leading a line of South Africans representing the voters who cast their ballots in the country's first democratic elections on 27 April 1994. Visit the Castle Hill Museum house and the famous Fort Frederick. Take a walk at the historical public library and city town hall and so much more.",
                'short_description' => 'Discover the rich history of Gqeberha on a guided walking tour through Route 67, the Donkin Reserve, and the city\'s most iconic landmarks.',
                'category_slug' => 'city-tour',
                'location_slug' => 'port-elizabeth',
                'price' => 650.00,
                'duration' => '4 hours',
                'duration_minutes' => 240,
                'is_featured' => true,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['Discover the rich history of Gqeberha on a guided walking tour', 'Explore the city\'s inner city and learn about its history and culture', 'Visit the Campanile Memorial and the Donkin Reserve at Belmont Terrace', 'See the old lighthouse and the large metal cut-out of Nelson Mandela', 'Follow Route 67, a trail that combines the best elements of the Eastern Cape'],
                'includes' => ['Breakfast', 'Expert guide', 'Guide', 'Snacks', 'Transport'],
                'excludes' => ['Airport Transfer', 'BBQ Night', 'Insurance', 'Meals'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/pexels-laarkstudio-7346441.jpg',
                'gallery_urls' => ['2025/01/5.jpg', '2025/01/6.jpg', '2025/01/4-1.jpg', '2025/01/3-1.jpg', '2025/01/2.jpg', '2025/01/1.jpg'],
            ],
            [
                'title' => 'Port Elizabeth: Double Safari and City Tour',
                'slug' => 'port-elizabeth-double-safari-and-city-tour',
                'description' => "Explore the Addo Elephant National Park, home to the 'Big 5' and one of the densest elephant populations in Africa. Enjoy a full-day tour of the park, which offers unrivaled biodiversity and a magnificent game viewing experience in a malaria-free environment.\n\nDepart from Port Elizabeth and head to the park. The original elephant section of the park was proclaimed in 1931, when only 11 elephants remained in the area. Today, this finely-tuned ecosystem is home to one of the densest elephant populations on earth, with over 600 elephants, lions, buffaloes, the endangered black rhino, spotted hyenas, leopards, a variety of antelope and zebra species, as well as the unique Addo flightless dung beetle.\n\nAt Kragga Kamma Game Park, enjoy a strict zero-tolerance policy to hunting or any form of disturbances to the animals. This means that you can get close-up views and great photo opportunities of the animals. Explore the park from the comfort of your own vehicle on well-maintained roads and enjoy viewing the game at your own pace.\n\nFor really close encounters with the animals, choose this tour, by a professional guide who is ready to provide interesting facts and information about the animals as well as plentiful historical background to the area.",
                'short_description' => 'Full-day double safari combining Addo Elephant National Park and Kragga Kamma Game Park with a city orientation tour.',
                'category_slug' => 'safari',
                'location_slug' => 'port-elizabeth',
                'price' => 2400.00,
                'duration' => 'Full day',
                'duration_minutes' => 600,
                'is_featured' => true,
                'is_bestseller' => true,
                'free_cancellation' => true,
                'highlights' => ['Explore the beautiful city', 'See a variety of animals including elephants, lions, buffalo, and rhinos', 'Enjoy a guided tour in an open Game Viewer accompanied by a professional guide', 'Explore the park from the comfort of your own vehicle on well-maintained roads', 'Discover the Addo Elephant National Park, home to the Big 5 and more'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Full-day game viewing', 'Guide', 'Snacks', 'Transport'],
                'excludes' => ['Accommodation', 'Insurance', 'Lunch', 'Meals', 'Welcome Drinks'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water', 'Passport, copy accepted'],
                'featured_image_url' => '2025/01/145.jpg',
                'gallery_urls' => ['2025/01/145-1.jpg', '2025/01/kragga-kamma.jpg', '2025/01/8.jpg'],
            ],
            [
                'title' => 'Port Elizabeth: Kragga Kamma Private Game Reserve Safari',
                'slug' => 'kragga-kamma-private-game-reserve-safari',
                'description' => "Enjoy a day trip to the Kragga Kamma Game Park from Port Elizabeth. See a variety of animals in the game park roaming around in their natural habitat.\n\nEnjoy a short drive from Port Elizabeth to the Kragga Kamma Game Park, a sanctuary for a variety of animals. Explore the lush coastal forest and grassland which is home to vast herds of African game, including white rhino, buffalo, cheetah, giraffe, zebra, nyala, bontebok, lechwe, eland, lion, and many other species.\n\nSee animals roaming freely, unrestricted in natural surroundings. The park is small as compared to other private game reserves, with animals enclosed in just over 200 hectares of natural habitat; yet there is no shortage of animals.",
                'short_description' => 'Half-day safari at Kragga Kamma Game Park with white rhino, buffalo, cheetah, giraffe, and more in natural coastal forest.',
                'category_slug' => 'safari',
                'location_slug' => 'port-elizabeth',
                'price' => 950.00,
                'duration' => '4 hours',
                'duration_minutes' => 240,
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['See many animals in the game park roaming around in their natural habitat', 'Enjoy a short drive from Port Elizabeth to the Kragga Kamma Game Park', 'Explore the coastal forest and grasslands, home to vast herds of African game', 'See animals roaming freely, unrestricted in natural surroundings', 'See white rhino, buffalo, cheetah, giraffe, zebra, nyala, bontebok, and lion'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Full-day game viewing', 'Guide', 'Snacks', 'Transport'],
                'excludes' => ['Airport Transfer', 'Insurance', 'Lunch', 'Meals', 'Welcome Drinks'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/01/kragga-kamma.jpg',
                'gallery_urls' => ['2025/01/145.jpg', '2025/01/145-1.jpg'],
            ],
            [
                'title' => 'Port Elizabeth: Kragga Kamma Game Park and City Tour',
                'slug' => 'port-elizabeth-kragga-kamma-game-park-and-city-tour',
                'description' => "Enjoy a short drive from Port Elizabeth to the Kragga Kamma Game Park, a sanctuary for a variety of animals. Explore the lush coastal forest and grassland which is home to vast herds of African game, including white rhino, buffalo, cheetah, giraffe, zebra, nyala, bontebok, lechwe, eland, lion, and many other species. See animals roaming freely, unrestricted in natural surroundings.\n\nThe park is small as compared to other private game reserves, with animals enclosed in just over 200 hectares of natural habitat; yet there is no shortage of animals. After your visit to the game park, take a historical, cultural, and scenic orientation tour of Port Elizabeth.\n\nSee the No 7 Castle Hill Museum, the Donkin Reserve, the Pier at Hobie Beach, the city center, Fort Frederick, and Settler's Park and much more. Including souvenir shopping. Also a visit to SANCCOB penguins sanctuary and Cape Recife lighthouse and much more.\n\nNote: The drive takes place in a private vehicle. Open safari is available on special request for additional fees.",
                'short_description' => 'Combo tour with Kragga Kamma Game Park safari and a historical, cultural city orientation of Port Elizabeth.',
                'category_slug' => 'safari',
                'location_slug' => 'port-elizabeth',
                'price' => 1200.00,
                'duration' => '8 hours',
                'duration_minutes' => 480,
                'is_featured' => false,
                'is_bestseller' => true,
                'free_cancellation' => true,
                'highlights' => ['Get up close to a variety of animals at the Kragga Kamma Game Park', 'See animals such as white rhino, buffalo, cheetah, giraffe, and zebra', 'Explore the lush coastal forest and grassland of the game park', 'Visit the No 7 Castle Hill Museum and the Donkin Reserve in Port Elizabeth', 'See the city center, Fort Frederick, Settler\'s Park, and much more'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Game Drive', 'Guide', 'Transport'],
                'excludes' => ['Airport Transfer', 'Breakfast', 'Insurance', 'Meals'],
                'what_to_bring' => ['Passport or ID card', 'Comfortable shoes', 'Sun hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/01/kragga-kamma.jpg',
                'gallery_urls' => ['2025/01/145.jpg', '2025/01/8.jpg', '2025/01/145-1.jpg'],
            ],
            [
                'title' => 'Port Elizabeth Addo Elephant National Park Tour',
                'slug' => 'port-elizabeth-addo-elephant-national-park-tour',
                'description' => "Enjoy a safari in the Addo Elephant National Park, home to the densest elephant population in the world. Get up close and personal with the Big 5 and see other animals such as zebra, jackal, warthog, and the native South African suricata.\n\nStart your tour with a pick-up from your accommodation. Drive past Sundays River and the salt pans before entering the Addo Elephant National Park at the south gate, also known as Gate Matholweni.\n\nEnter from this side to see lots of grass feeders such as zebra, hartebeest, eland, and buffalo. Make your way to the more densely vegetated northern section of the park where the elephants feed on spekboom and play at the waterholes.\n\nStop at Jack's Picnic Site for a light lunch and rest. Proceed to the main camp for more fun and bird watching. There is a lovely restaurant and gift shop on site for those who are interested.\n\nNote: The drive takes place in a private vehicle. Open safari is available on special request for additional fees. Pick up from accommodation, port or anywhere in Port Elizabeth.",
                'short_description' => 'Full-day Addo Elephant National Park safari to see the Big 5, the world\'s densest elephant population, and incredible birdlife.',
                'category_slug' => 'safari',
                'location_slug' => 'addo',
                'price' => 1500.00,
                'duration' => 'Full day',
                'duration_minutes' => 540,
                'is_featured' => true,
                'is_bestseller' => true,
                'free_cancellation' => true,
                'highlights' => ['Discover the Addo Elephant National Park, home to the Big 5 and more', 'See the world\'s densest elephant population in their natural habitat', 'Look out for lions, hyenas, Cape buffalo, and rhinos on a guided safari', 'Enjoy a light lunch at Jack\'s Picnic Site and take a rest in the shade', 'Visit the main camp and enjoy some bird watching at the waterholes'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Full-day game viewing', 'Game Drive', 'Guide', 'Snacks', 'Transport'],
                'excludes' => ['Breakfast', 'Insurance', 'Meals', 'Welcome Drinks'],
                'what_to_bring' => ['Passport', 'Comfortable shoes', 'Sun hat', 'Camera', 'Sunscreen', 'Water', 'Insect repellent', 'Binoculars'],
                'featured_image_url' => '2025/01/145.jpg',
                'gallery_urls' => ['2025/01/145-1.jpg', '2025/01/kragga-kamma.jpg', '2025/01/8.jpg'],
            ],
            [
                'title' => 'Guided Port Elizabeth Coastal Tour',
                'slug' => 'guided-port-elizabeth-coastal-tour',
                'description' => "Discover the beauty of Port Elizabeth's (Gqeberha) beautiful coastline on a short day tour from Port Elizabeth. Visit Shark Rock Pier, SANCCOB penguin rehabilitation center, the Cape Recife Lighthouse, Sacramento and Sardinia Bay Beach.\n\nStart your day with a visit of Shark Rock Pier then move on to the SANCCOB penguin rehabilitation center. Enjoy a guided tour from one of the organization's on-site guides.\n\nNext, head to the Cape Recife Lighthouse, the third oldest operating lighthouse in South Africa. Continue driving along the coastline to Sacramento Monument where you can hear the story of the old cannon.\n\nHead inland before visiting the stunning Sardinia Bay Beach with its golden sand dunes. See why the Wildside is so much talked about as one of the best coastlines in the world.\n\nBring swimwear and a towel if you would like to have a quick swim and enjoy the pleasant waters of the Indian Ocean.",
                'short_description' => 'Coastal day tour visiting Shark Rock Pier, SANCCOB penguins, Cape Recife Lighthouse, and the stunning Sardinia Bay Beach.',
                'category_slug' => 'beach-coast',
                'location_slug' => 'port-elizabeth',
                'price' => 750.00,
                'duration' => '5 hours',
                'duration_minutes' => 300,
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['Learn about the conservation of penguins at the SANCCOB Penguin Rehabilitation', 'Visit the third oldest operating lighthouse in South Africa at Cape Recife', 'Admire the stunning views of the Indian Ocean from the lighthouse', 'Stop at Sacramento to hear the story of the old cannon', 'Visit the stunning Sardinia Bay Beach with its golden sand dune beach'],
                'includes' => ['Bottled Water', 'Expert guide', 'Transport'],
                'excludes' => ['Airport Transfer', 'Insurance', 'Meals'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Swimwear', 'Towel', 'Camera', 'Sunscreen'],
                'featured_image_url' => '2025/01/8.jpg',
                'gallery_urls' => ['2025/01/5.jpg', '2025/01/6.jpg'],
            ],
            [
                'title' => 'Port Elizabeth Schotia Private Game Wildlife Safari',
                'slug' => 'port-elizabeth-schotia-private-game-wildlife-safari',
                'description' => "Experience the raw beauty of the African bush on a thrilling half-day safari in Schotia Private Game Reserve. This intimate encounter with the wild offers a glimpse into the diverse ecosystem and incredible wildlife that call this breathtaking region home.\n\nExpert Guiding: Our experienced and knowledgeable guides will share their passion for the African bush, providing fascinating insights into the local flora and fauna.\n\nWildlife Encounters: Embark on a thrilling game drive in an open 4x4 vehicle, searching for the 'Big 5' – lion, elephant, rhinoceros, and buffalo – as well as a myriad of other species, including giraffes, zebras, hippos, and countless bird species.\n\nBreathtaking Scenery: Immerse yourself in the stunning landscapes of Schotia, from rolling Albany thicket and breathtaking vistas.\n\nAuthentic Safari Experience: Enjoy a truly authentic safari experience with a focus on responsible wildlife viewing and conservation.\n\nIdeal for cruiseship passengers with limited time, first-time safari-goers, families with children, time-conscious travelers, and those seeking a thrilling yet relaxed wildlife encounter.",
                'short_description' => 'Half-day open 4x4 safari at Schotia Private Game Reserve searching for the Big 5 in the oldest private reserve in the Eastern Cape.',
                'category_slug' => 'safari',
                'location_slug' => 'port-elizabeth',
                'price' => 1800.00,
                'duration' => '5 hours',
                'duration_minutes' => 300,
                'is_featured' => true,
                'is_bestseller' => true,
                'free_cancellation' => true,
                'highlights' => ['Life time game drive experience with exciting memories', 'Give nature some time to communicate with you', 'Enjoy learning facts about nature', 'High chance to view Big 5', 'Have a better chance for locating some of Africa\'s Big 5'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Full-day game viewing', 'Game Drive', 'Guide', 'Transport'],
                'excludes' => ['Accommodation', 'Flights', 'Hotel Rent', 'Insurance', 'Lunch', 'Meals'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/Schotia.jpg',
                'gallery_urls' => ['2025/02/3-5.jpg', '2025/02/1-6.jpg', '2025/02/2-6.jpg', '2025/02/4-6.jpg', '2025/02/5-4.jpg', '2025/02/6-6.jpg', '2025/02/8-5.jpg', '2025/02/9-4.jpg', '2025/02/10.jpg'],
            ],
            [
                'title' => 'Kwantu Private Game Reserve Safari',
                'slug' => 'kwantu-tours',
                'description' => "Your preferred Big 5 game Safari family vacation destination.\n\nExplore the wild wonders with heart-pounding Big 5 Game Drives, indulge in the art of Bird Watching, and partake in a myriad of outdoor sports. For those seeking tranquility, our serene environment invites you to relax, recover, and recharge.\n\nThis award-winning private game reserve sets the stage for an extraordinary experience, boasting world-class luxury safari accommodations, intimate wildlife encounters, personalized service, and delectable cuisine.\n\nThe Malaria-Free Kwantu Game Lodge stands as an idyllic backdrop for your Safari Wedding, Honeymoon, Family Getaways, Conferencing, Team Building, Group Outings, and beyond. Discover a world where adventure and luxury converge, creating memories that last a lifetime.\n\nIncluded: Welcome snacks and beverages on arrival, full 3-hour game drive including a visit to the predator educational centre, meal and beverages upon conclusion of the game drive.",
                'short_description' => 'Award-winning Big 5 private game reserve experience with luxury safari, 3-hour game drive, and predator educational centre visit.',
                'category_slug' => 'safari',
                'location_slug' => 'port-elizabeth',
                'price' => 2100.00,
                'duration' => '6 hours',
                'duration_minutes' => 360,
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['Heart-pounding Big 5 Game Drives', 'Visit to predator educational centre', 'Welcome snacks and beverages on arrival', 'Meal and beverages after the game drive', 'World-class luxury safari accommodations'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Game Drive', 'Lunch', 'Transport', 'Welcome Drinks'],
                'excludes' => ['Accommodation', 'Airport Transfer', 'BBQ Night', 'Flights', 'Insurance'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/elephants-at-kwantu.jpeg',
                'gallery_urls' => ['2025/02/BRouILVz4zArtTfikYFUJy4EBeQ.avif', '2025/02/5-3.jpg'],
            ],
            [
                'title' => 'Nyosi Full Day Open Vehicle Safari',
                'slug' => 'nyosi-full-day-open-vehicle-safari',
                'description' => "Escape to safari living just 25 minutes from the city. Nyosi combines urban convenience with wild allure, offering a day retreat where luxury meets nature. Experience safari chic, unwind in the midst of wildlife, and savour moments of serenity within easy reach of the city lights. Join us for an unforgettable day, harmonising the call of the wild with the rhythms of city life.\n\nGame Drives: Discover the wonders of nature on our morning or afternoon game drives. Witness elephants, cheetahs, buffalos, and a variety of birds in their natural habitat, all while enjoying stunning views of the reserve.\n\nDay Center Restaurant: Savour the flavours of Nyosi at a beautiful restaurant, which features a variety of options and a menu bursting with seasonal hearty dishes crafted to foster 'reconnection'.",
                'short_description' => 'Open vehicle safari just 25 minutes from the city with elephants, cheetahs, buffalos, and a gourmet day center restaurant.',
                'category_slug' => 'safari',
                'location_slug' => 'port-elizabeth',
                'price' => 1600.00,
                'duration' => 'Full day',
                'duration_minutes' => 480,
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['Open vehicle safari just 25 minutes from the city', 'Witness elephants, cheetahs, buffalos, and a variety of birds', 'Enjoy stunning views of the reserve', 'Savour gourmet seasonal dishes at the Day Center Restaurant', 'Experience safari chic where luxury meets nature'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Game Drive', 'Transport'],
                'excludes' => ['Accommodation', 'Insurance', 'Meals'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/5-3.jpg',
                'gallery_urls' => ['2025/02/elephants-at-kwantu.jpeg', '2025/02/BRouILVz4zArtTfikYFUJy4EBeQ.avif'],
            ],

            // ── Cape Town Tours ──────────────────────────────────────────
            [
                'title' => 'Cape of Good Hope and Boulders Beach Private Tour',
                'slug' => 'cape-of-good-hope-and-boulders-beach-private-tour',
                'description' => "Take a private guided full-day tour to the Cape of Good Hope and Boulders Beach penguins. Enjoy a small snack and bottled water as you explore the Cape of Good Hope and Cape Point, and see the African penguins at Boulders Beach.\n\nBe picked up from your accommodation or anywhere in Cape Town and head to the Cape of Good Hope. Admire the spectacular scenery of the Cape Peninsula, a wild, rugged, and scenic national park. Learn about the stormy weather and rough seas that are encountered there.\n\nDiscover the history of the Cape of Good Hope, which was discovered by Europeans in the 15th century and opened the first all-water route from Europe to Asia. See the point where the warm-water Agulhas current meets the cold-water Benguela current.\n\nContinue to Boulders Beach near Simon's Town. Admire the ancient granite boulders that protect the beach from the wind and large waves, making it an ideal swimming spot for kids. See the African penguins in their thousands and learn about the conservation efforts to protect them.",
                'short_description' => 'Private full-day tour to the Cape of Good Hope and Boulders Beach penguin colony with pick-up from your accommodation.',
                'category_slug' => 'beach-coast',
                'location_slug' => 'cape-town',
                'price' => 1800.00,
                'duration' => 'Full day',
                'duration_minutes' => 540,
                'is_featured' => true,
                'is_bestseller' => true,
                'free_cancellation' => true,
                'highlights' => ['Discover the Cape of Good Hope and Cape Point, the southernmost tip of Africa', 'See the meeting point of the warm Agulhas and cold Benguela currents', 'Visit the Boulders Beach penguin colony and see the African penguins up close', 'Explore the Cape Peninsula, a wild, rugged, and scenic national park', 'Enjoy a small snack and bottled water to keep you energized throughout the day'],
                'includes' => ['Accommodation', 'Bottled Water', 'Entrance fees', 'Full-day game viewing', 'Snacks'],
                'excludes' => ['Airport Transfer', 'Lunch', 'Meals', 'Welcome Drinks'],
                'what_to_bring' => ['Passport', 'Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/Boulders-Beach.jpeg',
                'gallery_urls' => ['2025/02/1.jpg', '2025/02/2.jpg', '2025/02/3.jpg', '2025/02/4.jpg', '2025/02/5.jpg', '2025/02/6.jpg'],
            ],
            [
                'title' => 'Cape Town: Hout Bay Scenic Tour, Seal Island, World of Birds',
                'slug' => 'cape-town-houtbay-scenic-tour-seal-island-world-of-birds',
                'description' => "Discover the beauty of Hout Bay and the surrounding area on a boat trip to Seal Island and a visit to the World of Birds. Set sail from Hout Bay Harbour to Duiker Island, home to a large colony of Cape Fur Seals. Cruise around the island and see the seals up close in their natural habitat.\n\nNext, head to the World of Birds for an amazing experience. Step into Africa's largest bird sanctuary and one of the few large bird parks in the world. Get up close and personal with birds indigenous to South Africa, including ostriches, cormorants, pelicans, penguins, parrots, and others.\n\nOver 3,000 birds (and small animals) of 400 different species are uniquely presented in more than 100 spacious landscaped walk-through aviaries, allowing you the most intimate closeness with nature. A tropical garden setting in the Hout Bay Valley is the environment in which the aviaries are spaced over 4 hectares of land, framed by the back of Table Mountain, the Twelve Apostles, Constantiaberg, Chapman's Peak, and Little Lion's Head.\n\nA paradise for nature lovers and photographers, the World of Birds is one of Cape Town's premier tourist attractions which no visitor should miss.",
                'short_description' => 'Scenic tour of Hout Bay with a boat trip to Seal Island and visit to Africa\'s largest bird sanctuary, World of Birds.',
                'category_slug' => 'day-trip',
                'location_slug' => 'cape-town',
                'price' => 1400.00,
                'duration' => '6 hours',
                'duration_minutes' => 360,
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['Boat trip to Seal Island to see Cape Fur Seals up close', 'Visit Africa\'s largest bird sanctuary with over 3,000 birds', 'Walk through 100+ spacious landscaped aviaries', 'Scenic views of Table Mountain, Twelve Apostles, and Chapman\'s Peak', 'Paradise for nature lovers and photographers'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Transport'],
                'excludes' => ['Airport Transfer', 'Breakfast', 'Insurance', 'Meals'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/5-1.jpg',
                'gallery_urls' => ['2025/02/8-1.jpg', '2025/02/istockphoto-1296067494-612x612-1.jpg'],
            ],
            [
                'title' => 'Cape Town: Giraffe House and Cheetah Encounter with Wine',
                'slug' => 'cape-town-giraffe-house-and-cheetah-encounter-with-wine',
                'description' => "Start your day with a visit to the Giraffe House, where you can feed and interact with these gentle giants. Next, head to the Cheetah Encounter, where you can get up close and personal with these majestic predators.\n\nAfter the wildlife encounters, head to a local winery for a wine tasting experience. At the Giraffe House Wildlife Awareness Centre, enjoy easy access to some of Africa's wonderful wildlife and bird species.\n\nFocusing on African wildlife, Giraffe House aims to provide a place for people to enjoy the outdoors, whilst experiencing and learning about animals and why they are special.\n\nNext, visit a local winery for a wine tasting experience. Fairview is well known not only for its drinkable wines but also for its exquisite goat's milk cheeses. Goats are well known for their climbing ability and Fairview's goats love climbing the tall stone tower that has been built just for them.\n\nWatch as they ascend a spiral staircase that leads around the outside of the tower. One of Fairview's biggest draws is its cheese selection, which includes over 50 cow's milk and goat's milk cheeses. The newest addition of farm-reared, free-range meat is quickly becoming a popular attraction.",
                'short_description' => 'Feed giraffes, encounter cheetahs, and enjoy wine tasting at Fairview estate with its famous goat tower and artisan cheeses.',
                'category_slug' => 'wine-tour',
                'location_slug' => 'cape-town',
                'price' => 1500.00,
                'duration' => '7 hours',
                'duration_minutes' => 420,
                'is_featured' => false,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['Get up close and personal with giraffes and cheetahs at a wildlife sanctuary', 'Feed and interact with giraffes and learn about their behavior and habitat', 'Enjoy a wine tasting experience at a local winery and sample a variety of wines', 'Watch goats climb a spiral staircase at Fairview and sample goat\'s milk cheese', 'Learn about the animals and why they are special at the Giraffe House'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Snacks', 'Transport'],
                'excludes' => ['Airport Transfer', 'Breakfast', 'Meals', 'Welcome Drinks'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/02/istockphoto-172748025-612x612-1.jpg',
                'gallery_urls' => ['2025/02/5-1.jpg', '2025/02/8-1.jpg'],
            ],
            [
                'title' => 'Aquila Big 5 Safari',
                'slug' => 'aquilla-big-5-safari',
                'description' => "See South Africa's Big Five at Aquila Private Game Reserve. Located under 2 hours from Cape Town, Aquila captures the magic of a South African safari close to the city. Book your Day Trip Safari or save big on your family-friendly Big 5 Game Reserve adventure with Aquila's discounted children's rates.\n\nFounded in 1999, Aquila Private Game Reserve is proud to have reintroduced Africa's Big 5 wildlife back into the Western Cape, establishing the first official Big 5 Game reserve close to Cape Town.\n\nToday, Aquila's award-winning conservation efforts are dedicated to protecting and restoring the Western Cape's natural wildlife, and are a vital part of Aquila's nature reserve and animal rescue initiative.",
                'short_description' => 'Big 5 safari at Aquila Private Game Reserve, the first official Big 5 reserve near Cape Town, under 2 hours from the city.',
                'category_slug' => 'safari',
                'location_slug' => 'cape-town',
                'price' => 2500.00,
                'duration' => 'Full day',
                'duration_minutes' => 600,
                'is_featured' => true,
                'is_bestseller' => false,
                'free_cancellation' => true,
                'highlights' => ['See all of Africa\'s Big 5 at Aquila Private Game Reserve', 'First official Big 5 Game reserve close to Cape Town', 'Award-winning conservation and animal rescue initiative', 'Family-friendly with discounted children\'s rates', 'Located under 2 hours from Cape Town'],
                'includes' => ['Bottled Water', 'Entrance fees', 'Expert guide', 'Game Drive', 'Transport'],
                'excludes' => ['Accommodation', 'Airport Transfer', 'Flights', 'Insurance', 'Meals', 'Welcome Drinks'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water', 'Binoculars'],
                'featured_image_url' => '2025/02/Aquila-big-5-day-trip-safari-2023-132-.jpeg',
                'gallery_urls' => ['2025/02/aquila-mvr-2021-07-049.jpg', '2025/02/aquila-private-game-reserve-19-04-0097-e1713795286178.jpg', '2025/02/Elephants-at-Aquila-Private-Game-Reserve.webp', '2025/02/leopard.jpg'],
            ],
            [
                'title' => 'Full Day Peninsula Tour',
                'slug' => 'full-day-peninsula-tour',
                'description' => "Clifton and Camps Bay: These two beaches have been awarded Blue Flag status because of their pristine white beaches with crystal clear, blue waters that make visitors stream in on beautiful sunny days.\n\nHout Bay and Seal Island: Locally known as the 'Republic of Hout Bay' by the Cape Town locals, Hout Bay is seen as being an entire town on its own. Hout Bay is known to be the fishing village as they have many seafood markets and restaurants for people to enjoy the fresh cuisine. You will also have the option of going to admire the thousands of seals that inhabit Seal Island.\n\nCape Point: No Cape Town tour is complete without a visit to Cape Point. It is situated on the very tip of the Peninsula with the Indian Ocean on the one side and the Atlantic Ocean on the other. Cape Point is one of the most famous landmarks in Cape Town.\n\nSimon's Town and Penguin Colony: Simon's Town is filled with history. It has plenty of museums and other sites. Boulders Beach is also nearby and it is the only place you get to experience swimming alongside penguins.\n\nKalk Bay: This is a perfect place for whale watching during whale season which is between June and November.",
                'short_description' => 'Full day tour covering Clifton, Camps Bay, Hout Bay, Seal Island, Cape Point, Simon\'s Town penguin colony, and Kalk Bay.',
                'category_slug' => 'day-trip',
                'location_slug' => 'cape-town',
                'price' => 1600.00,
                'duration' => 'Full day',
                'duration_minutes' => 540,
                'is_featured' => false,
                'is_bestseller' => true,
                'free_cancellation' => true,
                'highlights' => ['Visit Blue Flag beaches at Clifton and Camps Bay', 'Boat trip to Seal Island at Hout Bay', 'Visit Cape Point, one of Cape Town\'s most famous landmarks', 'See African penguins at Boulders Beach in Simon\'s Town', 'Whale watching at Kalk Bay during whale season (June-November)'],
                'includes' => ['Bottled Water', 'Expert guide', 'Guide', 'Transport'],
                'excludes' => ['Airport Transfer', 'Breakfast', 'Insurance', 'Lunch', 'Meals'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water'],
                'featured_image_url' => '2025/03/cape-p-small.jpg',
                'gallery_urls' => ['2025/02/Boulders-Beach.jpeg', '2025/02/1.jpg', '2025/02/2.jpg', '2025/02/3.jpg'],
            ],

            // ── Multi-day / Garden Route ─────────────────────────────────
            [
                'title' => 'Amazing Garden Route Coastal Tour',
                'slug' => 'amazing-garden-route-coastal-tour',
                'description' => "Looking to explore the Garden Route in one epic weekend? Then you've found your match! This three-day itinerary is filled to the brim with the best highlights the area has to offer.\n\nWander along the Garden Route – a piece of paradise on the southeastern coast of South Africa. Search for members of Africa's Big 5, bungy jump, walk through dense forests and spot African wildlife on a safari, all in one action-packed itinerary.\n\nThe road trip begins as you drive along the longest wine route in the world, South Africa's very own Route 62. Enjoy the rugged scenery and winding roads as you make your way to Oudtshoorn to explore the fascinating underground maze of the Cango Caves.\n\nAdventure awaits over the next two days. Walk with three orphaned elephants as they venture to their water hole. Canoe along the tranquil waters of the Touws River in Wilderness National Park, keeping an eye out for the abundant birdlife.\n\nFace your fears as you hurtle off the world's highest bridge bungy, or visit the lush forests of the Tsitsikamma area. Bundu-bash through the fynbos on a 4x4 safari with a game ranger as you set out to spot members of Africa's Big Five, and connect with nature on a tranquil bush walk in a private game reserve.\n\nThere's a lot to explore on this 3-day adventure, and you can custom design your tour also and change places to visit.",
                'short_description' => '3-day Garden Route adventure with Cango Caves, elephant walks, bungy jumping, Tsitsikamma forests, and Big 5 safari.',
                'category_slug' => 'day-trip',
                'location_slug' => 'garden-route',
                'price' => 8500.00,
                'duration' => '3 days',
                'duration_minutes' => 4320,
                'is_featured' => true,
                'is_bestseller' => false,
                'free_cancellation' => false,
                'highlights' => ['Drive along Route 62, the longest wine route in the world', 'Explore the Cango Caves underground maze in Oudtshoorn', 'Walk with orphaned elephants to their water hole', 'Bungy jump off the world\'s highest bridge or visit Tsitsikamma forests', 'Custom design your tour and change places to visit'],
                'includes' => ['Accommodation', 'Expert guide', 'Guide', 'Hotel Rent', 'Transport'],
                'excludes' => ['BBQ Night', 'Flights', 'Insurance', 'Newspaper', 'Welcome Drinks'],
                'what_to_bring' => ['Comfortable shoes', 'Hat', 'Camera', 'Sunscreen', 'Water', 'Warm jacket', 'Swimwear'],
                'featured_image_url' => '2025/02/5-3.jpg',
                'gallery_urls' => ['2025/02/3-5.jpg', '2025/01/8.jpg'],
            ],
        ];

        foreach ($tours as $tourData) {
            $category = $categories->get($tourData['category_slug']);
            $location = $locations->get($tourData['location_slug']);

            if (!$category || !$location) {
                $this->command?->warn("Skipping {$tourData['title']}: category={$tourData['category_slug']} or location={$tourData['location_slug']} not found");
                continue;
            }

            $featuredImage = $this->downloadImage($tourData['featured_image_url'] ?? null, 'tours');
            $gallery = [];
            foreach ($tourData['gallery_urls'] ?? [] as $url) {
                $path = $this->downloadImage($url, 'tours/gallery');
                if ($path) {
                    $gallery[] = $path;
                }
            }

            Tour::updateOrCreate(
                ['slug' => $tourData['slug']],
                [
                    'title' => $tourData['title'],
                    'description' => $tourData['description'],
                    'short_description' => $tourData['short_description'],
                    'category_id' => $category->id,
                    'location_id' => $location->id,
                    'price' => $tourData['price'],
                    'duration' => $tourData['duration'],
                    'duration_minutes' => $tourData['duration_minutes'] ?? null,
                    'highlights' => $tourData['highlights'] ?? null,
                    'includes' => $tourData['includes'] ?? null,
                    'excludes' => $tourData['excludes'] ?? null,
                    'what_to_bring' => $tourData['what_to_bring'] ?? null,
                    'is_featured' => $tourData['is_featured'],
                    'is_bestseller' => $tourData['is_bestseller'],
                    'free_cancellation' => $tourData['free_cancellation'],
                    'instant_confirmation' => true,
                    'max_participants' => 20,
                    'min_participants' => 2,
                    'is_active' => true,
                    'featured_image' => $featuredImage,
                    'gallery' => !empty($gallery) ? $gallery : null,
                ]
            );

            $this->command?->info("Seeded: {$tourData['title']}");
        }

        // Create pricing tiers for all tours
        $allTours = Tour::all();

        foreach ($allTours as $tour) {
            if ($tour->pricingTiers()->count() > 0) {
                continue;
            }

            TourPricingTier::create([
                'tour_id' => $tour->id,
                'name' => 'Adult',
                'description' => 'Adult ticket (12+ years)',
                'price' => $tour->price,
                'min_age' => 12,
                'max_age' => null,
                'is_active' => true,
                'sort_order' => 1,
            ]);

            TourPricingTier::create([
                'tour_id' => $tour->id,
                'name' => 'Child',
                'description' => 'Child ticket (3-11 years)',
                'price' => round($tour->price * 0.5, 2),
                'min_age' => 3,
                'max_age' => 11,
                'is_active' => true,
                'sort_order' => 2,
            ]);

            TourPricingTier::create([
                'tour_id' => $tour->id,
                'name' => 'Senior',
                'description' => 'Senior ticket (60+ years)',
                'price' => round($tour->price * 0.8, 2),
                'min_age' => 60,
                'max_age' => null,
                'is_active' => true,
                'sort_order' => 3,
            ]);
        }
    }

    private function downloadImage(?string $relativePath, string $storagePath): ?string
    {
        if (!$relativePath) {
            return null;
        }

        $filename = basename($relativePath);
        $localPath = $storagePath . '/' . $filename;

        if (Storage::disk('public')->exists($localPath)) {
            return $localPath;
        }

        try {
            $url = $this->baseImageUrl . '/' . $relativePath;
            $response = Http::timeout(30)->get($url);

            if ($response->successful()) {
                Storage::disk('public')->put($localPath, $response->body());
                return $localPath;
            }
        } catch (\Exception $e) {
            $this->command?->warn("Failed to download image: {$relativePath} - {$e->getMessage()}");
        }

        return null;
    }
}
