const mongoose = require('mongoose');
const User = require('../models/user.model');
const Task = require('../models/task.model');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    });

    console.log('Created demo user:', demoUser.email);

    const tasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish the Q4 project proposal for client presentation',
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: demoUser._id
      },
      {
        title: 'Team meeting preparation',
        description: 'Prepare slides and agenda for weekly team sync',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        userId: demoUser._id
      },
      {
        title: 'Code review',
        description: 'Review pull requests from team members',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        userId: demoUser._id
      },
      {
        title: 'Update documentation',
        description: 'Update API documentation with new endpoints',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        userId: demoUser._id
      },
      {
        title: 'Bug fix - login issue',
        description: 'Fix critical login bug reported by users',
        priority: 'urgent',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        userId: demoUser._id
      }
    ];

    await Task.insertMany(tasks);
    console.log(`Created ${tasks.length} sample tasks`);

    console.log('\n✅ Seed data inserted successfully!');
    console.log('\nDemo Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();