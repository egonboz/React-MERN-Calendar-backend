const {response} = require('express');
const Event = require('../models/Event');

const obtainEvents = async(req, res = response) => {

        try {
            const events = await Event.find()
                .populate('user', 'name');
            res.json({
                ok: true,
                events
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: "Please contact the administrator"
            });
        }
}

const createEvent = async(req, res = response) => {

            const event = new Event(req.body);
            
            try {
                event.user = req.uid;
                const eventSaved = await event.save();
                res.json({
                    ok: true,
                    event: eventSaved
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: "Please contact the administrator"
                });
            }
    }

const updateEvent = async(req, res = response) => {

    const eventId = req.params.id;

    try {
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: "Event not found"
            });
        } else {
            if (event.user.toString() !== req.uid) {
                return res.status(401).json({
                    ok: false,
                    msg: "You don't have the privilege to edit this event"
                });
            }
        }

        const newEvent = {
            ...req.body,
            user: req.uid
        }

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});
        res.json({
            ok: true,
            event: eventUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Please contact the administrator"
        });
    }
}

const deleteEvent = async(req, res = response) => {

        const eventId = req.params.id;

        try {
            const event = await Event.findById(eventId);
            if (!event) {
                return res.status(404).json({
                    ok: false,
                    msg: "Event not found"
                });
            } else {
                if (event.user.toString() !== req.uid) {
                    return res.status(401).json({
                        ok: false,
                        msg: "You don't have the privilege to delete this event"
                    });
                }
            }

            await Event.findByIdAndDelete(eventId);
            res.json({
                ok: true,
                message: "Delete event",
            });
        } catch (error) {    
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: "Please contact the administrator"
            });
        }
}

module.exports = {
    obtainEvents,
    createEvent,
    updateEvent,
    deleteEvent
}