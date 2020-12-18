const { Router } = require('express');
const controller = require('../controllers/Controller');

const router = Router();

// Image Upload
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept
    cb(null, true);
  } else {
    cb(function (req, res) {
      res.json({ message: 'Failed to Upload File', flag: false });
    }, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1025 * 8,
  },
  fileFilter: fileFilter,
});

// Signup or Add Member
router.post('/login', controller.member_login);
// Add Ticket
router.post('/add-ticket', controller.add_ticket);
// Add Member
router.post('/add-member', controller.add_member);
// View Tickets
router.get('/view-tickets', controller.view_tickets);

// Edit Profile and uploadImage
router.post(
  '/edit-profile',
  upload.single('profileImage'),
  controller.edit_profile
);

// Get Profile
router.post('/get-profile', controller.get_profile);

// Get members
router.get('/get-members', controller.view_members);

// Change password
router.post('/change-password', controller.change_password);

// Delete Ticket
router.post('/delete-ticket', controller.delete_ticket);

module.exports = router;
