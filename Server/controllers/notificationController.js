const Notification = require('../models/notification');

async function getlocal(req, res) {
    try {
        const userId = req.params.id;

        const localNotifications = await Notification.find({ 
            userId, 
            scope: "LOCAL" 
        }).sort({ createdAt: -1 });

        res.status(200).json(localNotifications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch local notifications" });
    }
}

async function getnational(req, res) {
    try {
        const userId = req.params.id;

        const nationalNotifications = await Notification.find({ 
            userId, 
            scope: "NATIONAL" 
        }).sort({ createdAt: -1 });

        res.status(200).json(nationalNotifications);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch national notifications" });
    }
}

async function getreportupdates(req, res) {
    try {
        const userId = req.params.id;

        const reportUpdates = await Notification.find({ 
            userId, 
            scope: "REPORTUPDATE" 
        }).sort({ createdAt: -1 });

        res.status(200).json(reportUpdates);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch report update notifications" });
    }
}

module.exports = {
    getlocal,
    getnational,
    getreportupdates,
};
