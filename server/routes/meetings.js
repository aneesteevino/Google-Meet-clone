const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

router.post('/create', (req, res) => {
  try {
    const meetingId = uuidv4();
    res.json({ 
      meetingId,
      message: 'Meeting created successfully' 
    });
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ message: 'Failed to create meeting' });
  }
});

module.exports = router;