const mongoose = require('mongoose');

const monthlyItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  months: {
    january: {
      type: Boolean,
      default: false
    },
    february: {
      type: Boolean,
      default: false
    },
    march: {
      type: Boolean,
      default: false
    },
    april: {
      type: Boolean,
      default: false
    },
    may: {
      type: Boolean,
      default: false
    },
    june: {
      type: Boolean,
      default: false
    },
    july: {
      type: Boolean,
      default: false
    },
    august: {
      type: Boolean,
      default: false
    },
    september: {
      type: Boolean,
      default: false
    },
    october: {
      type: Boolean,
      default: false
    },
    november: {
      type: Boolean,
      default: false
    },
    december: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MonthlyItem', monthlyItemSchema);
