const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');
const moment = require('moment');

const date = moment().format('dddd MMM Mo YYYY');
console.log(date);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please enter your Name'],
    lowercase: true,
    default: '',
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter an password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  designation: {
    type: String,
    default: '',
    // required: [true, 'Please enter your designation'],
  },
  department: {
    type: String,
    default: '',
    // required: [true, 'Please enter your department'],
    lowercase: true,
  },
  sap: {
    type: Number,
    default: '',
    // required: [true, 'Please enter your SAP ID'],
    minlength: [8, 'Minimum password length is 8 characters'],
  },
  contact: {
    type: Number,
    default: '',
    // required: [true, 'Please enter your contact Number'],
  },
  organization: {
    type: String,
    default: '',
    // required: [true, 'Please enter your Organization'],
  },
  image: {
    type: String,
    default: '',
  },
  ticketsRaised: [
    {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      description: { type: String, default: '' },
      status: { type: String, default: '' },
      due: { type: Number, default: '' },
      priority: { type: String, default: '' },
      date: { type: String, default: date },
      image: { type: String, default: '' },
    },
  ],
  ticketsCompleted: [],
  ticketsPending: [],
});

// Fire a function before doc saved to the db
// userSchema.pre('save', async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

const User = mongoose.model('user', userSchema);

module.exports = User;

/*
name: *
email: * 
password: * 
designation: *
department: *
sap: * 
contact: *
Organization:  *
ticketsRaised: []
ticketsCompleted: []
ticketsPending: []
*/
