const { Category, Item, User } = require('./models');

async function forceSeed() {
  try {
    console.log("Force seeding mock data...");

    // Create Categories regardless
    const cat1 = await Category.create({ name: 'Home Appliances ' + Date.now() });
    const cat2 = await Category.create({ name: 'Books ' + Date.now() });
    const cat3 = await Category.create({ name: 'Automotive ' + Date.now() });
    const cat4 = await Category.create({ name: 'Art & Collectibles ' + Date.now() });
    const cat5 = await Category.create({ name: 'Musical Instruments ' + Date.now() });
    const cat6 = await Category.create({ name: 'Pet Supplies ' + Date.now() });
    const cat7 = await Category.create({ name: 'Health & Beauty ' + Date.now() });
    const cat8 = await Category.create({ name: 'Real Estate ' + Date.now() });

    console.log("Mock categories added.");

    const user = await User.findOne();
    if (!user) {
        console.log("No user found.");
        return;
    }

    const itemsToCreate = [];
    const categories = [cat1, cat2, cat3, cat4, cat5, cat6, cat7, cat8];
    const itemNames = [
        "Blender", "Vacuum Cleaner", "Sci-Fi Novel", "History Book", 
        "Car Tires", "Oil Filter", "Abstract Painting", "Vintage Coin",
        "Acoustic Guitar", "Digital Piano", "Dog Bed", "Cat Tree",
        "Face Cream", "Hair Dryer", "Apartment in Center", "House in Suburbs"
    ];

    for (let i = 0; i < 20; i++) {
        const cat = categories[i % categories.length];
        itemsToCreate.push({
            name: itemNames[i % itemNames.length] + ' ' + i,
            currently: 10 + i * 5,
            first_bid: 10 + i * 5,
            buy_price: 100 + i * 10,
            number_of_bids: 0,
            location: 'Mock City',
            country: 'Mock Country',
            started: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
            ends: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            description: 'Mock description for ' + itemNames[i % itemNames.length],
            state: 'AVAILABLE',
            furthermostCategoryId: cat.id,
            UserId: user.id
        });
    }

    for (let item of itemsToCreate) {
        await Item.create(item);
    }
    console.log("Mock products added.");

  } catch (error) {
    console.error("Error setting up data:", error);
  }
}

forceSeed().then(() => process.exit(0));
