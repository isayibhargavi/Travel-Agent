import { DestinationTemplate } from '../types.ts';

import kyotoImg from '../assets/images/dest_kyoto_gardens_1790759988479.jpg';
import amalfiImg from '../assets/images/dest_amalfi_coast_1790760005327.jpg';
import alpsImg from '../assets/images/dest_swiss_alps_1790760017993.jpg';

export const FEATURED_DESTINATIONS: DestinationTemplate[] = [
  {
    id: 'kyoto-traditions',
    title: 'Kyoto Imperial Sanctuaries',
    country: 'Japan',
    tagline: 'Centuries of Zen aesthetics, private temple teahouses, and cedar forests.',
    image: kyotoImg,
    suggestedDuration: '10 Days / 9 Nights',
    suggestedNights: 9,
    defaultTravelType: 'Couple',
    estimatedBudget: 5500,
    interests: ['Tea Ceremonies', 'Zen Gardens', 'Michelin Kaiseki', 'Bamboo Forest Walks', 'Historic Ryokans'],
    description: 'Immerse in the timeless heart of Japan. Private dawn access to Kennin-ji, master-guided matcha tastings in Uji, and evenings in tranquil Gion machiyas.',
    highlights: [
      'Private dawn walking meditation through Arashiyama bamboo groves',
      'Exclusive reservation at 3-star Michelin Kyoto kaiseki masters',
      'High-speed Shinkansen transit with mountain views of Fuji',
    ],
  },
  {
    id: 'amalfi-coast',
    title: 'Amalfi Cliffside & Maritime Coast',
    country: 'Italy',
    tagline: 'Terraced lemon groves, pastel coastal villages, and private Mediterranean sailing.',
    image: amalfiImg,
    suggestedDuration: '8 Days / 7 Nights',
    suggestedNights: 7,
    defaultTravelType: 'Couple',
    estimatedBudget: 6200,
    interests: ['Private Boat Charters', 'Cliffside Gastronomy', 'Artisan Ceramics', 'Limoncello Tastings', 'Path of the Gods Trek'],
    description: 'Experience the sublime drama of the Gulf of Salerno. From sunrise cliff walks in Ravello to private gozzo boat cruising along secluded Capri grottos.',
    highlights: [
      'Private wooden gozzo sunset sail along Positano cliffs with Prosecco',
      'Vineyard tasting in terraced cliff gardens above the Tyrrhenian Sea',
      'Guided walk along the legendary Sentiero degli Dei (Path of the Gods)',
    ],
  },
  {
    id: 'swiss-alps',
    title: 'Swiss High-Altitude Alpine Grandeur',
    country: 'Switzerland',
    tagline: 'Glacier vistas, panoramic cogwheel railways, and secluded alpine spa sanctuaries.',
    image: alpsImg,
    suggestedDuration: '7 Days / 6 Nights',
    suggestedNights: 6,
    defaultTravelType: 'Friends',
    estimatedBudget: 7800,
    interests: ['Glacier Express Rail', 'High-Altitude Hiking', 'Thermal Mineral Spas', 'Alpine Cheese Tastings', 'Matterhorn Sunrise'],
    description: 'Breathe crisp mountain air across Zermatt and the Bernese Oberland. Ride iconic mountain railways, hike wildflower trails, and unwind in cliffside thermal pools.',
    highlights: [
      'Glacier Express Excellence Class journey across towering viaducts',
      'Sunrise helicopter or cogwheel ascent facing the Matterhorn',
      'Private thermal bath sessions overlooking alpine snow peaks',
    ],
  },
];

export const POPULAR_INTEREST_TAGS = [
  'Michelin Gastronomy',
  'Ancient Architecture',
  'Scenic Railway Journeys',
  'Private Boat Charters',
  'Wellness & Thermal Spas',
  'Artisan Workshops & Craft',
  'Wildflower Alpine Treks',
  'Historic Palaces & Temples',
  'Hidden Wine Cellars',
  'Secluded Coastal Coves',
  'Wildlife & Nature Reserves',
  'Photography Expeditions',
];

export const POPULAR_ORIGIN_CITIES = [
  'New York (JFK)',
  'London (LHR)',
  'San Francisco (SFO)',
  'Tokyo (HND)',
  'Dubai (DXB)',
  'Singapore (SIN)',
  'Sydney (SYD)',
  'Frankfurt (FRA)',
];
