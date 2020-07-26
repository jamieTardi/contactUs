const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer')
const path = require('path')

const app = express();

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'C:/Users/jamie/OneDrive/Desktop/ContactUs/views/contact'}))
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
res.render('contact', {layout: false});
})

app.post('/send',(req, res) => {
const output = `
<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>
<li>Name: ${req.body.name}</li>
<li>Company: ${req.body.company}</li>
<li>Email: ${req.body.email}</li>
<li>Phone Number: ${req.body.phone}</li>
</ul>
<p>${req.body.message}</p>
`;
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.livemail.co.uk',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'info@jamietardi.co.uk', // generated ethereal user
        pass: 'Cheesedog69'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Jamie Tardi" <info@jamietardi.co.uk>', // sender address
      to: 'jamie.tardi@gmail.com', // list of receivers
      subject: 'Booking query', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });

app.listen(3000, () => console.log('Server started...'));