import express, { Express, Request, Response } from 'express';
import { getXataClient } from './xata';
import dotenv from 'dotenv';
import { RequestHandler } from 'express';

dotenv.config();

const xata = getXataClient();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

// Get all events
app.get('/events', async (req: Request, res: Response) => {
    try {
        const events = await xata.db.events.getMany();

        // Map over the events to include only the desired fields
        const filteredEvents = events.map(event => ({
            company: event.company,
            date: event.date,
            eventId: event.eventId,
            imageUrl: event.imageUrl,
            location: event.location,
            price: event.price,
            title: event.title
        }));

        res.status(200).json(filteredEvents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a new event
app.post('/events', async (req: Request, res: Response) => {
    try {
        const { company, date, imageUrl, location, price, title } = req.body;

        // Fetch the current number of events
        const events = await xata.db.events.getMany();

        // Find the maximum eventId value
        const maxEventId = events.reduce((max, event) => Math.max(max, event.eventId ?? 0), 0);

        // Increment the maximum eventId value by 1
        const eventId = maxEventId + 1;

        const newEvent = await xata.db.events.create({
            company,
            date,
            eventId,
            imageUrl,
            location,
            price,
            title
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET - Get an event by eventId
const getEventById: RequestHandler<{ eventId: string }> = async (req, res) => {
    try {
        const { eventId } = req.params;

        const events = await xata.db.events.filter({ eventId: parseInt(eventId, 10) }).getMany();

        if (events.length === 0) {
            res.status(404).send('Event not found');
        }

        const event = events[0];

        // Filter the response data
        const filteredEvent = {
            company: event.company,
            date: event.date,
            eventId: event.eventId,
            imageUrl: event.imageUrl,
            location: event.location,
            price: event.price,
            title: event.title
        };

        res.status(200).json(filteredEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

app.get('/events/:eventId', getEventById);

// PUT - Update an event by eventId
const updateEventById: RequestHandler = async (req, res, next) => {
    const { eventId } = req.params;
    const { company, date, imageUrl, location, price, title } = req.body;

    try {
        // Retrieve the event by eventId
        const events = await xata.db.events.filter({ eventId: parseInt(eventId, 10) }).getMany();
        const event = events[0];
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // Update the event using the same eventId
        await xata.db.events.update(event.id, {
            company: company ?? event.company,
            date: date ?? event.date,
            imageUrl: imageUrl ?? event.imageUrl,
            location: location ?? event.location,
            price: price ?? event.price,
            title: title ?? event.title
        });

        // Retrieve the updated event data
        const updatedEvents = await xata.db.events.filter({ eventId: parseInt(eventId, 10) }).getMany();
        const updatedEvent = updatedEvents[0];

        res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
        next(error);
    }
};

app.put('/events/:eventId', updateEventById);


// PATCH - Update partial fields of an event by eventId
const patchEventById: RequestHandler = async (req, res, next) => {
    const { eventId } = req.params;
    const { company, date, imageUrl, location, price, title } = req.body;

    try {
        // Retrieve the event by eventId
        const events = await xata.db.events.filter({ eventId: parseInt(eventId, 10) }).getMany();
        const event = events[0];
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // Update only the fields provided in the request body
        await xata.db.events.update(event.id, {
            company: company ?? event.company,
            date: date ?? event.date,
            imageUrl: imageUrl ?? event.imageUrl,
            location: location ?? event.location,
            price: price ?? event.price,
            title: title ?? event.title
        });

        // Retrieve the updated event
        const updatedEvents = await xata.db.events.filter({ eventId: parseInt(eventId, 10) }).getMany();
        const updatedEvent = updatedEvents[0];

        res.status(200).json({ message: "Event patched successfully", data: updatedEvent });
    } catch (error) {
        next(error);
    }
};

app.patch('/events/:eventId', patchEventById);


// DELETE - Remove an event by eventId
const deleteEventById: RequestHandler = async (req, res, next) => {
    const { eventId } = req.params;

    try {
        // Retrieve the event by eventId
        const events = await xata.db.events.filter({ eventId: parseInt(eventId, 10) }).getMany();
        const event = events[0];
        if (!event) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        // Delete the event using xata_id
        await xata.db.events.delete(event.id);

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        next(error);
    }
};

app.delete('/events/:eventId', deleteEventById);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
