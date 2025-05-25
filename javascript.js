document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded, starting initialization...');

  // Mock API data
  const imageTitles = [
    "Serene Mountain Landscape", "Urban City Skyline", "Peaceful Ocean Waves", "Vibrant Sunset Colors",
    "Misty Forest Path", "Desert Sand Dunes", "Blooming Spring Flowers", "Starry Night Sky",
    "Rustic Countryside", "Modern Architecture", "Tropical Beach Paradise", "Snow-Capped Peaks",
    "Autumn Leaves Falling", "Bustling Street Market", "Calm Lake Reflection", "Dramatic Cloud Formation",
    "Colorful Stone Bridge", "Golden Hour Meadow", "Crystal Clear Waterfall", "Majestic Eagle Soaring",
    "Cozy Coffee Shop", "Neon City Lights", "Peaceful Garden Path", "Vintage Car Collection",
    "Lighthouse on Cliff", "Butterfly on Flower", "Snowy Pine Forest", "Abstract Geometric Patterns",
    "Rustic Barn Bridge", "Ocean Sunset Silhouette", "Mountain Lake Mirror", "Urban Wildflower Field",
    "Gothic Cathedral Interior", "Modern Glass Skyscraper", "Desert Cactus Bloom", "Foggy Morning Trail",
    "Colorful Hot Air Balloons", "Ancient Temple Ruins", "Peaceful Zen Garden", "Stormy Ocean Path",
    "Cherry Blossom Pathway", "Industrial Cityscape", "Tropical Rainforest Canopy", "Vintage Bookstore",
    "Minimalist Art Gallery", "Dramatic Mountain Range", "Street Food Vendor Stall", "Elegant Swan on Lake",
    "Rustic Wooden Pier", "Vibrant Market Square", "Moonlit Forest Clearing", "Modern Coastal Gallery",
    "Coastal Cliff View", "Autumn Forest Trail", "Urban Rooftop Garden", "Vintage Train Depot",
    "Peaceful Mountain Monastery", "Colorful Coral Reef", "Snow-Covered Hamlet", "Abstract Light Patterns",
    "Rustic Farmhouse Landscape", "City Bridge at Dusk", "Tropical Fish Aquarium", "Gothic Archway",
    "Modern Sculpture Garden", "Desert Sunrise Glow", "Peaceful River Bend", "Urban Street Mural",
    "Mountain Hiking Path", "Vintage Village Square", "Colorful Butterfly Sanctuary", "Dramatic Sky Panorama",
    "Rustic Stone Cottage", "Modern City Plaza", "Tropical Island Lagoon", "Ancient Castle Ruins",
    "Peaceful Garden Retreat", "Urban Night Bazaar", "Mountain Peak Sunrise", "Vintage Cafe Interior",
    "Colorful Street Carnival", "Rustic Windmill Farm", "Modern Coastal Bridge", "Tropical Jungle Trail",
    "Ancient Stone Arch", "Peaceful Garden Pond", "Urban Skyline Reflection", "Mountain Forest Stream",
    "Vintage Artisan Market", "Colorful Festival Lights", "Rainbow Farmers Market", "Rustic River Bridge"
  ];

  const imageCategories = [
    "nature", "city", "landscape", "architecture", "beach", "food", "mountain",
    "technology", "animal", "flower", "sunset", "island", "winter", "spring",
    "summer", "autumn", "forest", "desert", "night", "morning", "evening",
    "art", "culture", "street", "building", "water", "sky", "wildlife",
    "urban", "rural", "tropical", "vintage", "modern", "history", "adventure",
    "relaxation", "scenic", "colorful", "minimalist", "rustic", "contemporary"
  ];

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generateRandomImage(index) {
    const width = 450;
    const height = 350;
    const category = getRandomElement(imageCategories);
    const title = getRandomElement(imageTitles);
    const seed = Math.floor(Math.random() * 10000) + index;
    const imageServices = [
      `https://picsum.photos/${width}/${height}?random=${seed}`,
      `https://source.unsplash.com/${width}x${height}/?${category}&sig=${seed}`,
      `https://picsum.photos/${width}/${height}?blur=1&random=${seed + 1000}`,
      `https://source.unsplash.com/${width}x${height}/?${category}&orientation=landscape&sig=${seed + 2000}`,
    ];
    const imageUrl = getRandomElement(imageServices);
    return {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${index}`,
      title,
      image: imageUrl,
      category,
      timestamp: new Date().toISOString(),
    };
  }

  async function mockFetchImages(count, offset, category) {
    try {
      console.log(`mockFetchImages called with count=${count}, offset=${offset}, category=${category}`);
      const images = [];
      count = Math.min(Math.max(parseInt(count) || 1, 1), 1000);
      offset = parseInt(offset) || 0;

      for (let i = 0; i < count; i++) {
        const image = generateRandomImage(i + offset);
        if (category && category !== "all" && imageCategories.includes(category.toLowerCase())) {
          image.category = category.toLowerCase();
          image.image = `https://source.unsplash.com/450x350/?${category}&sig=${Date.now() + i + offset}`;
        }
        images.push(image);
      }

      const response = {
        success: true,
        count: images.length,
        offset: offset,
        total_requested: count,
        data: count === 1 ? images[0] : images,
      };

      if (count > 25) {
        response.pagination = {
          current_offset: offset,
          current_count: count,
          next_offset: offset + count,
          has_more: true,
        };
      }

      console.log('mockFetchImages response:', response);
      return response;
    } catch (error) {
      console.error('Error in mockFetchImages:', error);
      return { success: false, error: "Failed to generate mock images" };
    }
  }

  // State
  let count = "5";
  let offset = "0";
  let category = "all";

  // DOM Elements
  const countInput = document.querySelector('#count');
  const offsetInput = document.querySelector('#offset');
  const categorySelect = document.querySelector('#category');
  const fetchButton = document.querySelector('#fetch-images');
  const generatedUrl = document.querySelector('#generated-url');
  const apiResponse = document.querySelector('#api-response');
  const responseContent = document.querySelector('#response-content');
  const imagesContainer = document.querySelector('#images-container');
  const imagesTitle = document.querySelector('#images-title');
  const imagesGrid = document.querySelector('#images-grid');
  const moreImages = document.querySelector('#more-images');
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const copyButtons = document.querySelectorAll('.copy-button');

  // Validate DOM Elements
  const requiredElements = [
    { name: 'countInput', element: countInput },
    { name: 'offsetInput', element: offsetInput },
    { name: 'categorySelect', element: categorySelect },
    { name: 'fetchButton', element: fetchButton },
    { name: 'generatedUrl', element: generatedUrl },
    { name: 'apiResponse', element: apiResponse },
    { name: 'responseContent', element: responseContent },
    { name: 'imagesContainer', element: imagesContainer },
    { name: 'imagesTitle', element: imagesTitle },
    { name: 'imagesGrid', element: imagesGrid },
    { name: 'moreImages', element: moreImages },
  ];

  let missingElements = false;
  requiredElements.forEach(({ name, element }) => {
    if (!element) {
      console.error(`Missing DOM element: ${name}`);
      missingElements = true;
    }
  });

  if (missingElements) {
    console.error('Critical DOM elements are missing, aborting initialization');
    return;
  }

  console.log(`Found ${tabButtons.length} tab buttons and ${tabContents.length} tab contents`);
  console.log(`Found ${copyButtons.length} copy buttons`);

  // Generate Code Snippets
  function generateCurlCommand() {
    const params = new URLSearchParams();
    if (count) params.append('count', count);
    if (offset) params.append('offset', offset);
    if (category !== 'all') params.append('category', category);
    return `curl -X GET "https://your-app-name.vercel.app/api/random-images?${params}"`;
  }

  function generateJavaScriptCode() {
    const params = new URLSearchParams();
    if (count) params.append('count', count);
    if (offset) params.append('offset', offset);
    if (category !== 'all') params.append('category', category);
    return `// Fetch random images
const response = await fetch('/api/random-images?${params}');
const data = await response.json();
if (data.success) {
  console.log(\`Generated \${data.count} images\`);
  console.log(data.data);
} else {
  console.error('API Error:', data.error);
}`;
  }

  function generatePythonCode() {
    const params = new URLSearchParams();
    if (count) params.append('count', count);
    if (offset) params.append('offset', offset);
    if (category !== 'all') params.append('category', category);
    return `import requests
# Fetch random images
response = requests.get('https://your-app-name.vercel.app/api/random-images?${params}')
data = response.json();
if data['success']:
    print(f"Generated {data['count']} images")
    print(data['data'])
else:
    print(f"API Error: {data['error']}")
`;
  }

  function generateNodeJsCode() {
    const params = new URLSearchParams();
    if (count) params.append('count', count);
    if (offset) params.append('offset', offset);
    if (category !== 'all') params.append('category', category);
    return `const axios = require('axios');
// Fetch random images
const response = await axios.get('/api/random-images', {
  params: {
    count: ${count},
    offset: ${offset},
    ${category !== 'all' ? `category: '${category}'` : '// category: "nature"'}
  }
});
console.log('Generated images:', response.data.count);
console.log(response.data.data);`;
  }

  // Sample Responses
  const sampleResponse = {
    success: true,
    count: 3,
    offset: 0,
    total_requested: 3,
    data: [
      {
        id: "img_1704123456789_abc123def_0",
        title: "Serene Mountain Landscape",
        image: "https://source.unsplash.com/450x350/?nature&sig=12345",
        category: 'nature',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
      {
        id: 'img_1704123456790_def456ghi_1',
        title: 'Urban City Skyline',
        image: 'https://picsum.photos/450/350?random=67890',
        category: 'city',
        timestamp: '2024-01-15T10:30:01.000Z',
      },
      {
        id: 'img_1704123456791_ghi789jkl_2',
        title: 'Peaceful Ocean Waves',
        image: 'https://source.unsplash.com/450/350/?ocean&sig=54321',
        category: 'ocean',
        timestamp: '2024-01-15T10:30:02.000Z',
      },
    ],
  };

  const samplePaginatedResponse = {
    success: true,
    count: 50,
    offset: 0,
    total_requested: 50,
    data: '... array of 50 image objects ...',
    pagination: {
      current_offset: 0,
      current_count: 50,
      next_offset: 50,
      has_more: true,
    },
  };

  const singleResponse = {
    success: true,
    count: 1,
    offset: 0,
    total_requested: 1,
    data: {
      id: 'img_1704123456789_abc123',
      title: 'Mountain Landscape',
      image: 'https://source.unsplash.com/450x350/?nature&sig=12345',
      category: 'nature',
      timestamp: '2024-01-15T10:00:00.000Z',
    },
  };

  const errorResponse = {
    success: false,
    error: 'Failed to generate random images',
  };

  // Initialize Code Snippets and Responses
  function initializeContent() {
    console.log('Starting initializeContent...');
    const elements = [
      { id: 'curl-code', content: generateCurlCommand() },
      { id: 'js-code', content: generateJavaScriptCode() },
      { id: 'python-code', content: generatePythonCode() },
      { id: 'nodejs-code', content: generateNodeJsCode() },
      { id: 'single-response', content: JSON.stringify(singleResponse, null, 2) },
      { id: 'multiple-response', content: JSON.stringify(sampleResponse, null, 2) },
      { id: 'paginated-response', content: JSON.stringify(samplePaginatedResponse, null, 2) },
      { id: 'error-response', content: JSON.stringify(errorResponse, null, 2) },
    ];

    elements.forEach(({ id, content }) => {
      const element = document.querySelector(`#${id}`);
      if (element) {
        element.textContent = content || 'Content unavailable';
        console.log(`Populated element: ${id}`);
      } else {
        console.error(`Failed to find element with id: ${id}`);
      }
    });
    console.log('initializeContent completed');
  }

  // Update Generated URL
  function updateGeneratedUrl() {
    try {
      generatedUrl.textContent = generateCurlCommand();
      console.log('Generated URL updated:', generatedUrl.textContent);
    } catch (error) {
      console.error('Error updating generated URL:', error);
    }
  }

  // Initialize Tabs
  function initializeTabs() {
    console.log('Initializing tabs...');
    tabContents.forEach(content => content.classList.add('hidden'));
    const documentationTab = document.querySelector('#documentation');
    if (documentationTab) {
      documentationTab.classList.remove('hidden');
      console.log('Documentation tab set as default');
    } else {
      console.error('Documentation tab not found');
    }

    const documentationButton = document.querySelector('.tab-button[data-tab="documentation"]');
    if (documentationButton) {
      tabButtons.forEach(btn => {
        btn.classList.remove('tab-active');
        btn.classList.add('tab-inactive');
      });
      documentationButton.classList.remove('tab-inactive');
      documentationButton.classList.add('tab-active');
      console.log('Documentation button set as active');
    } else {
      console.error('Documentation button not found');
    }
  }

  // Run Initialization
  try {
    initializeContent();
    updateGeneratedUrl();
    initializeTabs();
  } catch (error) {
    console.error('Initialization error:', error);
  }

  // Event Listeners for Inputs
  try {
    countInput.addEventListener('input', () => {
      count = countInput.value;
      updateGeneratedUrl();
      console.log('Count updated:', count);
    });

    offsetInput.addEventListener('input', () => {
      offset = offsetInput.value;
      updateGeneratedUrl();
      console.log('Offset updated:', offset);
    });

    categorySelect.addEventListener('change', () => {
      category = categorySelect.value;
      updateGeneratedUrl();
      console.log('Category updated:', category);
    });
  } catch (error) {
    console.error('Error setting up input event listeners:', error);
  }

  // Fetch Button for API Playground
  try {
    fetchButton.addEventListener('click', async () => {
      console.log('Fetch button clicked');
      fetchButton.disabled = true;
      fetchButton.innerHTML = `
        <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Test API
      `;

      const response = await mockFetchImages(count, offset, category);
      fetchButton.disabled = false;
      fetchButton.innerHTML = `
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
        Test API
      `;

      apiResponse.classList.remove('hidden');
      responseContent.textContent = JSON.stringify(response, null, 2);
      console.log('API response set');

      if (response.success) {
        const images = Array.isArray(response.data) ? response.data : [response.data];
        imagesTitle.textContent = `Generated Images (${images.length})`;
        imagesGrid.innerHTML = '';

        images.slice(0, 6).forEach((image, idx) => {
          const card = document.createElement('div');
          card.className = 'bg-white shadow rounded-lg overflow-hidden';
          card.innerHTML = `
            <div class="relative" style="padding-top: 56.25%;">
              <img src="${image.image}" alt="${image.title}" class="absolute top-0 left-0 w-full h-full object-cover" crossorigin="anonymous">
            </div>
            <div class="p-3">
              <h4 class="font-medium text-sm line-clamp-2">${image.title}</h4>
              <p class="text-xs text-gray-600">${image.category}</p>
            </div>
          `;
          imagesGrid.appendChild(card);
          console.log(`Added image ${idx + 1}: ${image.title}`);
        });

        imagesContainer.classList.remove('hidden');
        if (images.length > 6) {
          moreImages.textContent = `... and ${images.length - 6} more images`;
          moreImages.classList.remove('hidden');
        } else {
          moreImages.classList.add('hidden');
        }
        console.log('Images displayed:', images.length);
      } else {
        imagesContainer.classList.add('hidden');
        moreImages.classList.add('hidden');
        console.log('Error response displayed');
      }
    });
  } catch (error) {
    console.error('Error setting up fetch button:', error);
  }

  // Tab Switching
  try {
    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        console.log(`Switching to tab: ${button.dataset.tab}`);
        tabButtons.forEach(btn => {
          btn.classList.remove('tab-active');
          btn.classList.add('tab-inactive');
        });
        button.classList.remove('tab-inactive');
        button.classList.add('tab-active');

        tabContents.forEach(content => content.classList.add('hidden'));
        const targetTab = document.querySelector(`#${button.dataset.tab}`);
        if (targetTab) {
          targetTab.classList.remove('hidden');
          console.log(`Tab ${button.dataset.tab} now visible`);
          // Reinitialize content for dynamic tabs
          if (button.dataset.tab === 'examples' || button.dataset.tab === 'responses') {
            initializeContent();
          }
        } else {
          console.error(`Tab content with id ${button.dataset.tab} not found`);
        }
      });
    });
  } catch (error) {
    console.error('Error setting up tab switching:', error);
  }

  // Copy Buttons
  try {
    copyButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        console.log(`Copy button clicked: ${button.dataset.copy}`);
        let text;
        switch (button.dataset.copy) {
          case 'endpoint':
            text = '/api/random-images';
            break;
          case 'url':
            text = generateCurlCommand();
            break;
          case 'curl':
            text = generateCurlCommand();
            break;
          case 'javascript':
            text = generateJavaScriptCode();
            break;
          case 'python':
            text = generatePythonCode();
            break;
          case 'nodejs':
            text = generateNodeJsCode();
            break;
          case 'single':
            text = JSON.stringify(singleResponse, null, 2);
            break;
          case 'multiple':
            text = JSON.stringify(sampleResponse, null, 2);
            break;
          case 'paginated':
            text = JSON.stringify(samplePaginatedResponse, null, 2);
            break;
          case 'error':
            text = JSON.stringify(errorResponse, null, 2);
            break;
          case 'response':
            text = responseContent.textContent;
            break;
          default:
            console.error(`Unknown copy action: ${button.dataset.copy}`);
            return;
        }
        try {
          await navigator.clipboard.writeText(text);
          const originalInnerHTML = button.innerHTML;
          button.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          `;
          setTimeout(() => {
            button.innerHTML = originalInnerHTML;
          }, 1000);
          console.log(`Copied: ${button.dataset.copy}`);
        } catch (err) {
          console.error('Failed to copy text:', err);
        }
      });
    });
  } catch (error) {
    console.error('Error setting up copy buttons:', error);
  }
});