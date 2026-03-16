const { Item } = require('./models');

async function updateImages() {
  try {
    console.log("Updating product images in database...");
    
    const items = await Item.findAll();
    
    for (let item of items) {
      if (item.name) {
        // Encode the item name for the URL, replacing spaces with commas for loremflickr
        const keyword = encodeURIComponent(item.name.replace(/\s+/g, ','));
        const newImage = `https://loremflickr.com/800/600/${keyword}?random=${item.id}`;
        
        await Item.update({
          coverPhoto: newImage
        }, {
          where: { id: item.id }
        });
      }
    }
    
    console.log(`Updated images for ${items.length} items successfully.`);
    
  } catch (error) {
    console.error("Error updating images:", error);
  }
}

updateImages().then(() => process.exit(0));
