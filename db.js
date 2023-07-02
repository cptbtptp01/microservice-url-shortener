const mongoose = require('mongoose');
const uri = process.env.MONGODB_URL;
// connect to the mongoDB database
mongoose.connect(uri, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then (() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));