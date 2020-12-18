const User = require('../models/Model');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Controller Actions

// userSchema.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// Add Member
module.exports.add_member = async (req, res) => {
  const { email, password } = req.body;
  const pass = password ? password : 'invite@desk';
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPass = await bcrypt.hash(pass, salt);
    const user = await User.create({
      email,
      password: encryptedPass,
    });
    // Nodemailer
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: 'Invite to join internal ticket management system',
      text: `Please login with username as your email id and password as: 'invite@desk', we advise you to change your password at the login page. Please make sure that you update your profile once you are logged in. `,
    };

    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log('Error while sending Mail', err);
      } else {
        console.log('Email Sent !!');
        res.json({ message: 'Email send Successfully' });
      }
    });

    res
      .status(201)
      .json({ message: 'Invite sent successfully', user: user._id });
  } catch (error) {
    const message = error.message;
    res.status(400).json({ message, flag: 'false' });
  }
};

// Login
module.exports.member_login = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        // If there any Error in procedure
        if (err) {
          res.json({ message: err });
        }
        // If Compared passwords are same
        if (result) {
          res.json({
            message: 'Login Successful!',
            id: user._id,
            flag: true,
            email: email,
          });
        }

        // If the passwords are not matching
        else {
          res.json({
            error: 'You have entered a wrong password',
            flag: false,
          });
        }
      });
    }
    // User not found in the database
    else {
      res.json({
        error: 'User not found, please register and then Login',
        flag: false,
      });
    }
  });
};

// Add Ticket
module.exports.add_ticket = (req, res) => {
  const { name, email, description, due, priority, image } = req.body;
  const ticket = {
    name,
    description,
    email,
    due,
    priority,
    date: new Date(),
    image,
  };
  console.log('Raising new Ticket', ticket);

  User.findOne({ email: email }, (err, data) => {
    if (err || !data || !ticket) {
      return res.json({ message: "User doesn't exist", error: err });
    } else {
      data.ticketsRaised.push(ticket);
      data.save((err) => {
        if (err) {
          return res.json({
            message: 'Failed to raise new ticket',
            error: err,
          });
        }
        return res.json({ message: 'Ticket raised successfully', data: data });
      });
    }
  });
};

// View Tickets
module.exports.view_tickets = async (req, res) => {
  let tickets = [];
  try {
    const filter = {};
    const all = await User.find(filter);
    all.forEach((ele) => {
      tickets.push(ele.ticketsRaised);
    });
    return res.json({ tickets });
  } catch (error) {
    return res.json({ error: error });
  }
};

// Update Profile and Image Input
module.exports.edit_profile = async (req, res) => {
  const { email, name, designation, department, sap, contact } = req.body;
  console.log('File requested:', req.file);
  const imgPath = req.file.path ? req.file.path : '';
  try {
    const filter = { email: email };
    const update = {
      name: name,
      designation: designation,
      department: department,
      sap: sap,
      contact: contact,
      image: imgPath,
    };
    let doc = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.json({ message: doc, flag: true });
  } catch (error) {
    res.json({ error: error, flag: false });
  }
};

// Get Profile
module.exports.get_profile = async (req, res) => {
  const { email } = req.body;
  User.findOne({ email }, (err, data) => {
    if (err) {
      res.json({ error: err, flag: false });
    }
    res.json({ data });
  });
};

// View Members
module.exports.view_members = async (req, res) => {
  let members = [];
  try {
    const filter = {};
    const all = await User.find(filter);
    all.forEach((ele) => {
      members.push(ele);
    });
    return res.json({ members });
  } catch (error) {
    return res.json({ error: error });
  }
};

// Change password
module.exports.change_password = async (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, (err, data) => {
    if (data === null) {
      res.json({
        message: 'User not found, Please check your credentials again',
      });
    } else {
      bcrypt.hash(password, 10, function (err, hashedPass) {
        if (err) {
          res.json({ message: err, flag: false });
        }
        // Update the document
        User.updateOne(
          { email: email },
          {
            $set: {
              password: hashedPass,
            },
          },
          (error, result) => {
            if (error) {
              res.json({
                message: 'Failed to update the password',
                flag: false,
              });
            }
            res.json({
              message: 'Updated the password Successfully',
              flag: true,
            });
          }
        );
      });
    }
  });
};

// Find User (_id) and ticket inside that user (_id) and delete that
module.exports.delete_ticket = async (req, res) => {
  const { email, ticketId } = req.body;

  try {
    User.findOne({ email: email }, (err, data) => {
      // res.json({ message: data.ticketsRaised });
      data.ticketsRaised.forEach((ticket) => {
        if (ticket._id == ticketId) {
          let idx = data.ticketsRaised.indexOf(ticket);
          console.log(idx);
          data.ticketsRaised.splice(idx, 1);
          data.save((err) => {
            if (err) {
              return res.json({ message: 'Error deleting the document' });
            }
            return res.json({ message: 'Deleted !!' });
          });
        }
      });
    });
  } catch (error) {
    res.json({ error: error });
  }
};
