const nodemailer = require("nodemailer");
const { google } = require("googleapis");
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const SEND_TO = process.env.SEND_TO;
const SEND_FROM = process.env.SEND_FROM;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (body) => {
	// console.log(body);
	const { name, email, subject, message } = body;
	if (name && email && subject && message) {
		try {
			name = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			email = email.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			message = message.replace(/</g, "&lt;").replace(/>/g, "&gt;");
			const contentHtml = `
			<h1>Mensaje recibido del Portfolio</h1>
			<ul>
				<li>Nombre: ${name}</li>
				<li>Email: ${email}</li>
			</ul>
			<p style="white-space: pre-wrap">${message}</p>`

			const accessToken = await oAuth2Client.getAccessToken();

			const transport = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: SEND_FROM,
					clientId: CLIENT_ID,
					clientSecret: CLIENT_SECRET,
					refreshToken: REFRESH_TOKEN,
					accessToken: accessToken
				}
			});
			const mailOptions = {
				from: `Pagina del Portfolio <${SEND_FROM}>`,
				to: SEND_TO,
				subject: subject,
				html: contentHtml
			};
			const result = await transport.sendMail(mailOptions);

			return 'OK';
		} catch(error) {
			console.log(error);
			return `Lo sentimos su mensaje no pudo ser enviado. Si lo desea puede contactarme al correo ${CONTACT_EMAIL}`;
		}
	} else {
		return `Lo sentimos su mensaje no pudo ser enviado. Si lo desea puede contactarme al correo ${CONTACT_EMAIL}`;
	}
};

exports.sendEmail = sendEmail;