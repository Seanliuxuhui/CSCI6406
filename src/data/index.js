const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const dir = __dirname;


router.use('/wordcloud/subtopics', require('./wordcloudSubtopics'));
router.use('/wordcloud/topics', require('./wordcloudTopics'));
router.use('/scatterplot', require('./scatterPlot'));
router.use('/sankeydiagram', require('./sankeyDiagram'));
router.use('/streamDiagram', require('./streamDiagram'))

module.exports = router;
