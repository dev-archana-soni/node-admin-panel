const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Media = require('../models/Media');
const EmailLog = require('../models/EmailLog');

const getMediaType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
};

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const createEmailTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true';

  if (!host) {
    throw new Error('SMTP_HOST is not configured');
  }

  const auth = user && pass ? { user, pass } : undefined;

  return nodemailer.createTransport({ host, port, secure, auth });
};

async function getAllMedia(req, res) {
  try {
    const media = await Media.find().sort({ uploadedAt: -1 }).lean();
    return res.json({
      media: media.map(item => ({
        id: item._id.toString(),
        name: item.name,
        type: item.type,
        format: item.format,
        size: item.size,
        sizeBytes: item.sizeBytes,
        url: item.url,
        thumbnail: item.thumbnail || '',
        mimeType: item.mimeType,
        uploadedAt: item.uploadedAt,
        dimensions: item.dimensions || ''
      }))
    });
  } catch (error) {
    console.error('Get media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function uploadMedia(req, res) {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const created = [];

    for (const file of files) {
      const type = getMediaType(file.mimetype);
      const ext = path.extname(file.originalname).replace('.', '') || 'file';
      const url = `${req.protocol}://${req.get('host')}/uploads/media/${file.filename}`;

      const mediaDoc = await Media.create({
        name: file.originalname,
        type,
        format: ext,
        size: formatFileSize(file.size),
        sizeBytes: file.size,
        url,
        thumbnail: type === 'image' ? url : '',
        mimeType: file.mimetype,
        uploadedAt: new Date(),
        filename: file.filename,
        filePath: file.path
      });

      created.push({
        id: mediaDoc._id.toString(),
        name: mediaDoc.name,
        type: mediaDoc.type,
        format: mediaDoc.format,
        size: mediaDoc.size,
        sizeBytes: mediaDoc.sizeBytes,
        url: mediaDoc.url,
        thumbnail: mediaDoc.thumbnail || '',
        mimeType: mediaDoc.mimeType,
        uploadedAt: mediaDoc.uploadedAt
      });
    }

    return res.status(201).json({
      message: 'Media uploaded successfully',
      media: created
    });
  } catch (error) {
    console.error('Upload media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteMedia(req, res) {
  const { id } = req.params;

  try {
    const media = await Media.findById(id);
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    if (media.filePath && fs.existsSync(media.filePath)) {
      fs.unlinkSync(media.filePath);
    }

    await Media.findByIdAndDelete(id);

    return res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete media error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function getEmailHistory(req, res) {
  try {
    const history = await EmailLog.find().sort({ sentAt: -1 }).lean();
    return res.json({
      history: history.map(item => ({
        id: item._id.toString(),
        from: item.from,
        to: item.to,
        subject: item.subject,
        body: item.body,
        status: item.status,
        error: item.error || '',
        sentAt: item.sentAt
      }))
    });
  } catch (error) {
    console.error('Get email history error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function sendEmail(req, res) {
  const { from, to, subject, body } = req.body || {};

  if (!from || !to || !subject || !body) {
    return res.status(400).json({ message: 'From, to, subject, and body are required' });
  }

  try {
    const transport = createEmailTransport();
    await transport.sendMail({ from, to, subject, text: body });

    const log = await EmailLog.create({
      from,
      to,
      subject,
      body,
      status: 'sent',
      sentAt: new Date()
    });

    return res.status(201).json({
      message: 'Email sent successfully',
      log: {
        id: log._id.toString(),
        from: log.from,
        to: log.to,
        subject: log.subject,
        body: log.body,
        status: log.status,
        sentAt: log.sentAt
      }
    });
  } catch (error) {
    console.error('Send email error:', error);
    await EmailLog.create({
      from,
      to,
      subject,
      body,
      status: 'failed',
      error: error.message || 'Failed to send email',
      sentAt: new Date()
    });

    return res.status(500).json({ message: 'Failed to send email' });
  }
}

module.exports = {
  getAllMedia,
  uploadMedia,
  deleteMedia,
  getEmailHistory,
  sendEmail
};
