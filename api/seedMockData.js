const { Category, Item, User } = require('./models');

async function seedDatabase() {
  try {
    console.log("Seeding databases...");
    
    // Check if categories exist
    const categoriesCount = await Category.count();
    
    if (categoriesCount === 0) {
      console.log("Creating categories...");
      const electronics = await Category.create({ name: 'Electronics' });
      const fashion = await Category.create({ name: 'Fashion' });
      const home = await Category.create({ name: 'Home & Garden' });
      const sports = await Category.create({ name: 'Sports' });
      const toys = await Category.create({ name: 'Toys' });
      
      const phones = await Category.create({ name: 'Mobile Phones', CategoryId: electronics.id });
      const laptops = await Category.create({ name: 'Laptops', CategoryId: electronics.id });
      const mensClothing = await Category.create({ name: 'Men\'s Clothing', CategoryId: fashion.id });
      const womensClothing = await Category.create({ name: 'Women\'s Clothing', CategoryId: fashion.id });
      
      console.log("Categories created.");
      
      // Look for a user to assign items to
      const user = await User.findOne();
      if (!user) {
        console.log("No user found. Please create a user first before running this script.");
        return;
      }

      console.log("Creating items for user:", user.username);
      
      const items = [
        {
          name: 'iPhone 13 Pro',
          currently: 500,
          first_bid: 500,
          number_of_bids: 0,
          location: 'New York',
          country: 'USA',
          started: new Date(),
          ends: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          description: 'A great condition iPhone 13 Pro 256GB.',
          state: 'AVAILABLE',
          furthermostCategoryId: phones.id,
          UserId: user.id
        },
        {
          name: 'Samsung Galaxy S22',
          currently: 450,
          first_bid: 450,
          number_of_bids: 0,
          location: 'San Francisco',
          country: 'USA',
          started: new Date(),
          ends: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          description: 'Brand new Galaxy S22',
          state: 'AVAILABLE',
          furthermostCategoryId: phones.id,
          UserId: user.id
        },
        {
          name: 'MacBook Pro M1',
          currently: 1200,
          first_bid: 1200,
          number_of_bids: 0,
          location: 'London',
          country: 'UK',
          started: new Date(),
          ends: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000),
          description: 'MacBook Pro 14 inch with M1 Pro chip.',
          state: 'AVAILABLE',
          furthermostCategoryId: laptos.id, // typo: laptops
          UserId: user.id
        },
        {
          name: 'Mens Leather Jacket',
          currently: 150,
          first_bid: 150,
          number_of_bids: 0,
          location: 'Paris',
          country: 'France',
          started: new Date(),
          ends: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
          description: 'Vintage leather jacket in excellent condition.',
          state: 'AVAILABLE',
          furthermostCategoryId: mensClothing.id,
          UserId: user.id
        },
        {
          name: 'Wooden Coffee Table',
          currently: 80,
          first_bid: 80,
          number_of_bids: 0,
          location: 'Berlin',
          country: 'Germany',
          started: new Date(),
          ends: new Date(new Date().getTime() + 4 * 24 * 60 * 60 * 1000),
          description: 'Handcrafted oak wooden coffee table.',
          state: 'AVAILABLE',
          furthermostCategoryId: home.id,
          UserId: user.id
        },
        {
          name: 'Tennis Racket Wilson Pro',
          currently: 120,
          first_bid: 120,
          number_of_bids: 0,
          location: 'Madrid',
          country: 'Spain',
          started: new Date(),
          ends: new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000),
          description: 'Professional tennis racket, lightly used.',
          state: 'AVAILABLE',
          furthermostCategoryId: sports.id,
          UserId: user.id
        },
        {
          name: 'Lego Star Wars Millennium Falcon',
          currently: 300,
          first_bid: 300,
          number_of_bids: 0,
          location: 'Toronto',
          country: 'Canada',
          started: new Date(),
          ends: new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000),
          description: 'Complete Lego set, unopened.',
          state: 'AVAILABLE',
          furthermostCategoryId: toys.id,
          UserId: user.id
        }
      ];

      // Fix typo
      items[2].furthermostCategoryId = laptops.id;

      for (let item of items) {
        await Item.create(item);
      }
      
      console.log("Mock items created.");
    } else {
      console.log("Categories already exist. Skipping seed.");
    }

  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase().then(() => process.exit(0));
