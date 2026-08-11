const express = require('express');
const router = express.Router();
const Simulation = require('../models/Simulation');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const simulations = await Simulation.find({ isActive: true });
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const sim = await Simulation.findById(req.params.id);
    if (!sim) return res.status(404).json({ message: 'Simulation not found' });
    res.json(sim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
