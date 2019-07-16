'use strict';

const express = require('express');
const uuid = require('uuid/v4');
const logger = require('../logger');
const { bookmarks } = require('../store');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/bookmarks')
  .get((req, res)=>{
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res)=>{
    const { title, url, description='' } = req.body;
    console.log(req.body);

    if(!title){
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if(!description){
      logger.error('URL is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    const id = uuid();

    const bookmark = {
      id, title, url, description
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark with id ${id} created`);
    res.status(201).location(`http://localhost:8000/bookmarks/${id}`).json({id});
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req,res)=>{
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);

    if(!bookmark){
      logger.error(`Bookmark with id ${id} not found`);
      res.status(404).send('Bookmark not found');
    }

    res.json(bookmark);
  })
  .delete((req, res)=>{
    const { id } = req.params;

    const bmIndex = bookmarks.findIndex(bm => bm.id == id);

    if(bmIndex === -1){
      logger.error(`Bookmark with id ${id} not found`);
      return res.status(404).send('Not found');
    }

    bookmarks.splice(bmIndex, 1);

    logger.info(`bookmark with id ${id} deleted`);
    res.status(204).end();
  });

module.exports = bookmarkRouter;