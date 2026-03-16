const { Item, Category, User } = require('./models');

async function testItem() {
    try {
        const parentCat = await Category.findOne({ where: { name: "All Categories" } });
        const elecCat = await Category.findOne({ where: { name: "Electronics" } });
        const sellerUser = await User.findOne({ where: { username: "seller" } });

        const now = new Date();
        const ends = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        await Item.create({
            name: "iPhone 13 Pro Test",
            description: "Test.",
            buy_price: 600,
            first_bid: 300,
            currently: 300,
            location: "Athens",
            country: "Greece",
            started: now,
            ends: ends,
            state: "AVAILABLE",
            UserId: sellerUser.id,
            furthermostCategoryId: elecCat.id,
            number_of_bids: 0
        });
        console.log("Success");
    } catch(err) {
        console.error("Item validation error:", err);
    }
}

testItem();
