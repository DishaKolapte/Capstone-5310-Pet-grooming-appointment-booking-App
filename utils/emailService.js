const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email templates
const emailTemplates = {
  newAppointment: (data) => ({
    to: data.groomerEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Pet Grooming Service'
    },
    subject: 'New Appointment Request',
    text: `New appointment request for ${data.date} at ${data.time}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #ff6b6b;">New Appointment Request</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Pet Name:</strong> ${data.petName}</p>
          <p><strong>Services:</strong> ${data.services.join(', ')}</p>
          <p><strong>Notes:</strong> ${data.notes || 'No special notes'}</p>
        </div>
      </div>
    `
  }),

  appointmentConfirmed: (data) => ({
    to: data.userEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Pet Grooming Service'
    },
    subject: 'Appointment Confirmed',
    text: `Your appointment has been confirmed for ${data.date} at ${data.time}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #52c41a;">Your appointment has been confirmed!</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Time:</strong> ${data.time}</p>
          <p><strong>Groomer:</strong> ${data.groomerName}</p>
          <p><strong>Location:</strong> ${data.groomerCity}</p>
        </div>
      </div>
    `
  }),

  appointmentCancelled: (data) => ({
    to: data.recipientEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Pet Grooming Service'
    },
    subject: 'Appointment Cancelled',
    text: `The appointment scheduled for ${data.date} at ${data.time} has been cancelled.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #ff4d4f;">Appointment Cancelled</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p>The appointment scheduled for <strong>${data.date}</strong> at <strong>${data.time}</strong> has been cancelled.</p>
        </div>
      </div>
    `
  }),

  appointmentRescheduled: (data) => ({
    to: data.recipientEmail,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'Pet Grooming Service'
    },
    subject: 'Appointment Rescheduling Request',
    text: `Appointment rescheduling request from ${data.oldDate} ${data.oldTime} to ${data.newDate} ${data.newTime}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #1890ff;">Appointment Rescheduling Request</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p><strong>Original Date:</strong> ${data.oldDate} at ${data.oldTime}</p>
          <p><strong>Requested New Date:</strong> ${data.newDate} at ${data.newTime}</p>
        </div>
      </div>
    `
  }),

  statusUpdate: (data) => ({
    to: data.recipientEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `Your Groomer Account Status: ${data.status.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #ff6b6b;">Account Status Update</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
          <p>Dear ${data.name},</p>
          <p>Your groomer account status has been updated to: <strong>${data.status.toUpperCase()}</strong></p>
          ${data.status === 'approved' ? 
            '<p>You can now log in and start managing your appointments.</p>' : 
            '<p>Please contact support if you have any questions.</p>'
          }
        </div>
      </div>
    `
  })
};

// Send email function with better error handling
const sendEmail = async (template, data) => {
  try {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      throw new Error('SendGrid configuration missing');
    }

    const emailContent = emailTemplates[template](data);
    
    await sgMail.send(emailContent)
      .then(() => {
        console.log('Email sent successfully');
        return true;
      })
      .catch((error) => {
        console.error('SendGrid Error:', error);
        if (error.response) {
          console.error('Error Details:', error.response.body);
        }
        return false;
      });
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return false;
  }
};

module.exports = { sendEmail }; 