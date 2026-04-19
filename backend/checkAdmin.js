const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const admin = await User.findOne({ email: 'admin@freshdish.com' }).lean();
    console.log('admin?', !!admin);
    console.log(admin);
    await mongoose.disconnect();
  } catch (e) {
    console.error('ERROR', e.message);
    process.exit(1);
  }
})();
