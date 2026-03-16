const { Item } = require('./models');

async function check() {
    const items = await Item.findAll();
    console.log("Items:", items.map(i => ({ id: i.id, name: i.name })));
}

check();
