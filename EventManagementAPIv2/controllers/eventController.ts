import { Request, Response, NextFunction, RequestHandler } from 'express';
import { dbOperation } from '../utils/helpers';

export const getAllEvents: RequestHandler = async (req, res) => {
    try {
        const events = await dbOperation('getMany', { collection: 'events' });
        
        if (!events) {
            res.status(404).json({ message: "No events found" });
            return;
        }

        if (!Array.isArray(events)) {
            res.status(500).json({ message: "Unexpected data format" });
            return;
        }
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
};

export const addEvent: RequestHandler = async (req, res) => {
    try {
        const { company, date, imageUrl, location, price, title } = req.body;
        const events = await dbOperation('getMany', { collection: 'events' });
        if (!events) {
            res.status(404).json({ message: "No events found" });
            return;
        }
        const maxEventId = Array.isArray(events) ? events.reduce((max, event) => Math.max(max, event.eventId ?? 0), 0) : 0;
        const eventId = maxEventId + 1;
        const newEvent = await dbOperation('create', {
            collection: 'events',
            updateData: { company, date, eventId, imageUrl, location, price, title }
        });
        res.status(201).json(newEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const getEventById: RequestHandler<{ eventId: string }> = async (req, res) => {
    try {
        const { eventId } = req.params;
        const events = await dbOperation('filter', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });
        if (!events || (Array.isArray(events) && events.length === 0)) {
            res.status(404).send('Event not found');
            return;
        }
        const event = (events as any[])[0];
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

export const updateEventById: RequestHandler = async (req, res, next) => {
    const { eventId } = req.params;
    const { company, date, imageUrl, location, price, title } = req.body;
    try {
        const events = await dbOperation('filter', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });

        if (!events || (Array.isArray(events) && events.length === 0)) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        const event = (events as any[])[0];
        await dbOperation('update', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) },
            updateData: { company, date, imageUrl, location, price, title }
        });
        const updatedEvents = await dbOperation('filter', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });
        if (!updatedEvents || !Array.isArray(updatedEvents) || updatedEvents.length === 0) {
            res.status(500).json({ message: "Failed to update event" });
            return;
        }
        if (!updatedEvents || !Array.isArray(updatedEvents) || updatedEvents.length === 0) {
            res.status(500).json({ message: "Failed to update event" });
            return;
        }
        if (!updatedEvents || !Array.isArray(updatedEvents) || updatedEvents.length === 0) {
            res.status(500).json({ message: "Failed to update event" });
            return;
        }
        if (!updatedEvents || !Array.isArray(updatedEvents) || updatedEvents.length === 0) {
            res.status(500).json({ message: "Failed to update event" });
            return;
        }
        const updatedEvent = (updatedEvents as any[])[0];
        res.status(200).json({ message: "Event updated successfully", data: updatedEvent });
    } catch (error) {
        next(error);
    }
};

export const patchEventById: RequestHandler = async (req, res, next) => {
    const { eventId } = req.params;
    const { company, date, imageUrl, location, price, title } = req.body;
    try {
        const events = await dbOperation('filter', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }
        const event = events[0];
        await dbOperation('update', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) },
            updateData: { company, date, imageUrl, location, price, title }
        });
        const updatedEvents = await dbOperation('filter', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });
        if (!updatedEvents || !Array.isArray(updatedEvents) || updatedEvents.length === 0) {
            res.status(500).json({ message: "Failed to update event" });
            return;
        }
        const updatedEvent = updatedEvents[0];
        res.status(200).json({ message: "Event patched successfully", data: updatedEvent });
    } catch (error) {
        next(error);
    }
};

export const deleteEventById: RequestHandler = async (req, res, next) => {
    const { eventId } = req.params;
    try {
        const events = await dbOperation('filter', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });

        if (!events || !Array.isArray(events) || events.length === 0) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        const event = events[0];
        await dbOperation('delete', {
            collection: 'events',
            filter: { eventId: parseInt(eventId, 10) }
        });
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        next(error);
    }
};