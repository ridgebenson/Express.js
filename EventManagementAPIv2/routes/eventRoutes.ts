import express from 'express';
import { validateEvent } from '../middleware/eventValidators';
import { validateEventId } from '../middleware/eventIDValidator';
import {
    getAllEvents,
    addEvent,
    getEventById,
    updateEventById,
    patchEventById,
    deleteEventById
} from '../controllers/eventController';

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', validateEvent, addEvent);
router.get('/:eventId', validateEventId, getEventById);
router.put('/:eventId', validateEventId, validateEvent, updateEventById);
router.patch('/:eventId', validateEventId, validateEvent, patchEventById);
router.delete('/:eventId', validateEventId, deleteEventById);

export default router;