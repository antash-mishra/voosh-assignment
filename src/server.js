const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            console.error('Server error:', error);
        });
    })
    .catch(error => {
        console.error('Error syncing database:', error);
        process.exit(1);
    });