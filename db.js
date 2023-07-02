const mongoose = require('mongoose');

// connect to the mongoDB database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then (() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));