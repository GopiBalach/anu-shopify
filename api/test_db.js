const { User } = require('./models');

async function check() {
    const users = await User.findAll();
    console.log(users.map(u => ({ id: u.id, username: u.username, approved: u.approved })));
}

check();
