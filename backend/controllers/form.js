const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.contactForm = (req, res) => {
	const { name, email, message } = req.body;

	const msg = {
		to: process.env.EMAIL_TO, //admin email
		from: email,
		subject: "Sending email test",
		text: `Email received from contact \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
		html: `
      <h4>Email received from contact form:</h4>
      <p>Sender name: ${name}</p>
      <p>Sender email: ${email}</p>
      <p>Sender message: ${message}</p>
    `,
	};

  (async () => {
    try {
      await sgMail.send(msg).then(sent => {
        res.json({
          message: "success"
        })
      });
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    }
  })();
};

exports.contactFormBlogAuthor = (req, res) => {
	const { authorEmail, name, email, message } = req.body;

  const mailList = [process.env.EMAIL_TO, authorEmail]

	const msg = {
		to: mailList,
		from: email,
		subject: "Sending email test",
		text: `Email received from contact \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
		html: `
      <h4>Email received from contact form to author:</h4>
      <p>Sender name: ${name}</p>
      <p>Sender email: ${email}</p>
      <p>Sender message: ${message}</p>
    `,
	};

  (async () => {
    try {
      await sgMail.send(msg).then(sent => {
        res.json({
          message: "success"
        })
      });
    } catch (error) {
      console.error(error);
  
      if (error.response) {
        console.error(error.response.body)
      }
    }
  })();
};
