const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({    
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    archiveDate: {
        type: Date,
    },
}, { collection: 'news_collection' });

const News = mongoose.model('News', newsSchema);

module.exports = News;