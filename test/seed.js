const { Project } = require('../../models');
exports.module = aync models => {
    await Project.bulkCreate(            [
        {
            title: 'APEX Legends',
            details: 'game!',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'Jenkins',
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: 'Travis',
            details: 'Ugly cousin',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ])
}