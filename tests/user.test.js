const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const { user1, token1, setupDatabase } = require('./fixtures/db');
