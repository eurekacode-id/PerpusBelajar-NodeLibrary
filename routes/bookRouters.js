const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', bookController.book_index);

router.get('/create', requireAuth, bookController.book_create_get);

router.post("/create", requireAuth, bookController.book_create_post);

router.get('/edit/:id', requireAuth, bookController.book_edit_get);

router.post("/edit/:id", requireAuth, bookController.book_edit_post);

router.get('/:id', bookController.book_details);

router.delete('/:id', requireAuth, bookController.book_delete);

module.exports = router;