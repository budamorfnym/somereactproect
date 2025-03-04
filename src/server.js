// server.js - Main server file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Database connection
const connectDB = async () => {
  try {
    // For CodeSandbox, we'll use MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://username:password@cluster.mongodb.net/a1detailing', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'a1detailing-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define MongoDB Models
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff', 'client'], default: 'client' },
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyStatus: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'], default: 'bronze' },
  cars: [{
    model: String,
    year: Number,
    plateNumber: String
  }],
  createdAt: { type: Date, default: Date.now }
});

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  category: { type: String, required: true },
  active: { type: Boolean, default: true }
});

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String }
});

const ServiceOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  serviceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service',
    required: true 
  }
});

const BookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service',
    required: true 
  },
  options: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ServiceOption' 
  }],
  date: { type: Date, required: true },
  time: { type: String, required: true },
  carModel: { type: String, required: true },
  carNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  progress: { type: Number, default: 0 }, // 0-100%
  comment: { type: String },
  totalPrice: { type: Number, required: true },
  estimatedDuration: { type: Number, required: true }, // in minutes
  startTime: Date,
  endTime: Date,
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  booking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking' 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Initialize models
const User = mongoose.model('User', UserSchema);
const Service = mongoose.model('Service', ServiceSchema);
const Category = mongoose.model('Category', CategorySchema);
const ServiceOption = mongoose.model('ServiceOption', ServiceOptionSchema);
const Booking = mongoose.model('Booking', BookingSchema);
const Review = mongoose.model('Review', ReviewSchema);

// JWT Authentication
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'a1detailing-jwt-secret',
    { expiresIn: '7d' }
  );
};

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'a1detailing-jwt-secret', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

// API Routes
// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, carModel, carNumber, carYear } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      cars: carModel && carNumber ? [{ model: carModel, plateNumber: carNumber, year: carYear || null }] : []
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser);

    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        loyaltyPoints: newUser.loyaltyPoints,
        loyaltyStatus: newUser.loyaltyStatus,
        cars: newUser.cars
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({ 
      $or: [{ email }, { phone: email }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
        loyaltyStatus: user.loyaltyStatus,
        cars: user.cars
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Services routes
app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.json(services);
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/services/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Service fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    // Add 'all' category if not exists
    const allCategoryExists = categories.some(cat => cat.id === 'all');
    if (!allCategoryExists) {
      categories.unshift({ id: 'all', name: 'Все услуги' });
    }
    res.json(categories);
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Service options routes
app.get('/api/service-options', async (req, res) => {
  try {
    const options = await ServiceOption.find();
    res.json(options);
  } catch (error) {
    console.error('Service options fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/service-options/:serviceId', async (req, res) => {
  try {
    const options = await ServiceOption.find({ serviceId: req.params.serviceId });
    res.json(options);
  } catch (error) {
    console.error('Service options fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bookings routes
app.post('/api/bookings', authenticateJWT, async (req, res) => {
  try {
    const { serviceId, options, date, time, carModel, carNumber, comment } = req.body;

    // Get service details
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Calculate total price and duration
    let totalPrice = service.price;
    let totalDuration = service.duration;

    if (options && options.length > 0) {
      const serviceOptions = await ServiceOption.find({ _id: { $in: options } });
      serviceOptions.forEach(option => {
        totalPrice += option.price;
        totalDuration += option.duration;
      });
    }

    // Create date object from date and time
    const [hour, minute] = time.split(':').map(Number);
    const bookingDate = new Date(date);
    bookingDate.setHours(hour, minute, 0, 0);

    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      service: serviceId,
      options: options || [],
      date: bookingDate,
      time,
      carModel,
      carNumber,
      comment,
      totalPrice,
      estimatedDuration: totalDuration,
      status: 'pending'
    });

    await newBooking.save();

    // Add car to user's profile if not exists
    const user = await User.findById(req.user.id);
    const carExists = user.cars.some(car => car.plateNumber === carNumber);
    
    if (!carExists) {
      user.cars.push({ model: carModel, plateNumber: carNumber });
      await user.save();
    }

    // Emit socket event to notify admin panel
    io.emit('new-booking', { 
      booking: {
        ...newBooking.toObject(),
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone
        }
      }
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/bookings', authenticateJWT, async (req, res) => {
  try {
    let bookings;
    
    // Admin/staff can see all bookings
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      bookings = await Booking.find()
        .populate('user', 'name phone')
        .populate('service', 'name price duration')
        .populate('options')
        .sort({ date: -1 });
    } else {
      // Clients can only see their own bookings
      bookings = await Booking.find({ user: req.user.id })
        .populate('service', 'name price duration')
        .populate('options')
        .sort({ date: -1 });
    }
    
    res.json(bookings);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Queue routes
app.get('/api/queue', async (req, res) => {
  try {
    // Get bookings currently in progress
    const inProgressBookings = await Booking.find({ status: 'in-progress' })
      .populate('user', 'name')
      .populate('service', 'name duration')
      .sort({ startTime: 1 });
      
    // Get confirmed bookings waiting to start
    const waitingBookings = await Booking.find({ status: 'confirmed' })
      .populate('user', 'name')
      .populate('service', 'name duration')
      .sort({ date: 1 });
    
    // Transform data into format expected by frontend
    const currentWashing = inProgressBookings.map((booking, index) => ({
      position: index + 1,
      car: booking.carModel,
      plateNumber: booking.carNumber,
      progress: booking.progress,
      estimatedEndTime: booking.startTime ? 
        new Date(booking.startTime.getTime() + booking.estimatedDuration * 60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) :
        "Скоро",
      userId: booking.user._id,
      bookingId: booking._id
    }));
    
    const waiting = waitingBookings.map((booking, index) => ({
      position: index + currentWashing.length + 1,
      car: booking.carModel,
      plateNumber: booking.carNumber,
      estimatedStartTime: new Date(booking.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      userId: booking.user._id,
      bookingId: booking._id
    }));
    
    res.json({ currentWashing, waiting });
  } catch (error) {
    console.error('Queue fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
// Update booking status
app.put('/api/admin/bookings/:id/status', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { status, progress } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    booking.status = status;
    
    if (progress !== undefined) {
      booking.progress = progress;
    }
    
    if (status === 'in-progress' && !booking.startTime) {
      booking.startTime = new Date();
    }
    
    if (status === 'completed' && !booking.endTime) {
      booking.endTime = new Date();
      
      // Award loyalty points
      const user = await User.findById(booking.user);
      if (user) {
        // Award 10% of the booking price as points
        const pointsToAdd = Math.floor(booking.totalPrice * 0.1);
        user.loyaltyPoints += pointsToAdd;
        
        // Update loyalty status based on points
        if (user.loyaltyPoints >= 2000) {
          user.loyaltyStatus = 'platinum';
        } else if (user.loyaltyPoints >= 1000) {
          user.loyaltyStatus = 'gold';
        } else if (user.loyaltyPoints >= 500) {
          user.loyaltyStatus = 'silver';
        }
        
        await user.save();
      }
    }
    
    await booking.save();
    
    // Emit socket event to update clients
    io.emit('booking-updated', { booking });
    
    res.json(booking);
  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD for services
app.post('/api/admin/services', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    
    const newService = new Service({
      name,
      description,
      price,
      duration,
      category
    });
    
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    console.error('Service creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/admin/services/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { name, description, price, duration, category, active } = req.body;
    
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    service.name = name || service.name;
    service.description = description || service.description;
    service.price = price !== undefined ? price : service.price;
    service.duration = duration !== undefined ? duration : service.duration;
    service.category = category || service.category;
    service.active = active !== undefined ? active : service.active;
    
    await service.save();
    res.json(service);
  } catch (error) {
    console.error('Service update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/services/:id', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Soft delete - just mark as inactive
    service.active = false;
    await service.save();
    
    res.json({ message: 'Service deactivated successfully' });
  } catch (error) {
    console.error('Service deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD for categories
app.post('/api/admin/categories', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { id, name, icon } = req.body;
    
    const existingCategory = await Category.findOne({ id });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category ID already exists' });
    }
    
    const newCategory = new Category({
      id,
      name,
      icon
    });
    
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Category creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD for service options
app.post('/api/admin/service-options', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { name, price, duration, serviceId } = req.body;
    
    const newOption = new ServiceOption({
      name,
      price,
      duration,
      serviceId
    });
    
    await newOption.save();
    res.status(201).json(newOption);
  } catch (error) {
    console.error('Service option creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin dashboard stats
app.get('/api/admin/stats', authenticateJWT, isAdmin, async (req, res) => {
  try {
    // Get counts
    const userCount = await User.countDocuments({ role: 'client' });
    const bookingsCount = await Booking.countDocuments();
    const completedBookingsCount = await Booking.countDocuments({ status: 'completed' });
    const pendingBookingsCount = await Booking.countDocuments({ status: 'pending' });
    
    // Get revenue
    const completedBookings = await Booking.find({ status: 'completed' });
    const totalRevenue = completedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayBookings = await Booking.find({
      date: { $gte: today, $lt: tomorrow }
    });
    
    // Get most popular services
    const services = await Booking.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'serviceDetails' } },
      { $unwind: '$serviceDetails' }
    ]);
    
    res.json({
      userCount,
      bookingsCount,
      completedBookingsCount,
      pendingBookingsCount,
      totalRevenue,
      todayBookingsCount: todayBookings.length,
      popularServices: services.map(item => ({
        id: item._id,
        name: item.serviceDetails.name,
        count: item.count
      }))
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Initialize test data if needed
const seedInitialData = async () => {
  try {
    // Check if data already exists
    const categoryCount = await Category.countDocuments();
    const serviceCount = await Service.countDocuments();
    const userCount = await User.countDocuments();
    
    if (categoryCount === 0) {
      // Create default categories
      const categories = [
        { id: 'all', name: 'Все услуги' },
        { id: 'wash', name: 'Мойка', icon: '🚿' },
        { id: 'cleaning', name: 'Химчистка', icon: '🧪' },
        { id: 'polish', name: 'Полировка', icon: '✨' },
        { id: 'pdr', name: 'ПДР', icon: '🔨' },
        { id: 'wrap', name: 'Оклейка', icon: '📜' },
        { id: 'coating', name: 'Обработка кузова', icon: '🛡️' }
      ];
      
      await Category.insertMany(categories);
      console.log('Categories seeded');
    }
    
    if (serviceCount === 0) {
      // Create default services
      const services = [
        {
          name: "Экспресс мойка",
          price: 700,
          duration: 20,
          category: "wash",
          description: "Быстрая мойка кузова автомобиля без детальной очистки салона"
        },
        {
          name: "Комплексная мойка",
          price: 1500,
          duration: 60,
          category: "wash",
          description: "Полная мойка кузова и салона автомобиля, чистка ковриков"
        },
        {
          name: "Химчистка салона",
          price: 3500,
          duration: 180,
          category: "cleaning",
          description: "Глубокая химчистка всего салона, включая потолок, сиденья и ковры"
        },
        {
          name: "Полировка кузова",
          price: 8000,
          duration: 240,
          category: "polish",
          description: "Профессиональная полировка кузова с удалением мелких царапин"
        },
        {
          name: "ПДР (1 зона)",
          price: 2500,
          duration: 90,
          category: "pdr",
          description: "Ремонт вмятин без покраски на ограниченной зоне кузова"
        },
        {
          name: "Защитная пленка",
          price: 35000,
          duration: 480,
          category: "wrap",
          description: "Оклейка кузова защитной пленкой премиум-класса"
        }
      ];
      
      const savedServices = await Service.insertMany(services);
      console.log('Services seeded');
      
      // Create service options
      const serviceOptions = [
        { name: "Чернение резины", price: 200, duration: 10, serviceId: savedServices[0]._id },
        { name: "Полировка фар", price: 400, duration: 15, serviceId: savedServices[0]._id },
        { name: "Обработка кожи", price: 500, duration: 15, serviceId: savedServices[1]._id },
        { name: "Мойка двигателя", price: 700, duration: 20, serviceId: savedServices[1]._id },
        { name: "Нанесение защитного воска", price: 1000, duration: 30, serviceId: savedServices[3]._id },
        { name: "Полировка фар", price: 500, duration: 20, serviceId: savedServices[3]._id }
      ];
      
      await ServiceOption.insertMany(serviceOptions);
      console.log('Service options seeded');
    }
    
    if (userCount === 0) {
      // Create admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = new User({
        name: 'Admin',
        email: 'admin@a1detailing.kg',
        phone: '+996700000000',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Admin user created');
      
      // Create test user
      const testUser = new User({
        name: 'Тестовый Пользователь',
        email: 'test@a1detailing.kg',
        phone: '+996700123456',
        password: await bcrypt.hash('test123', salt),
        loyaltyPoints: 750,
        loyaltyStatus: 'silver',
        cars: [
          { model: "Toyota Camry", year: 2020, plateNumber: "B0123AB" },
          { model: "Lexus RX", year: 2019, plateNumber: "B4567CD" }
        ]
      });
      
      await testUser.save();
      console.log('Test user created');
    }
  } catch (error) {
    console.error('Seeding error:', error);
  }
};

// Seed data when starting the server
seedInitialData();

// Socket.io implementation for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Join admin room if admin user
  socket.on('join-admin', (data) => {
    if (data.token) {
      try {
        const decoded = jwt.verify(data.token, process.env.JWT_SECRET || 'a1detailing-jwt-secret');
        if (decoded.role === 'admin' || decoded.role === 'staff') {
          socket.join('admin-room');
          console.log('Admin joined admin room:', socket.id);
        }
      } catch (error) {
        console.error('JWT verification error:', error);
      }
    }
  });
  
  // Handle booking status updates from admin panel
  socket.on('update-booking-status', async (data) => {
    try {
      const { bookingId, status, progress } = data;
      
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return;
      }
      
      booking.status = status;
      if (progress !== undefined) {
        booking.progress = progress;
      }
      
      if (status === 'in-progress' && !booking.startTime) {
        booking.startTime = new Date();
      }
      
      if (status === 'completed' && !booking.endTime) {
        booking.endTime = new Date();
      }
      
      await booking.save();
      
      // Broadcast updated queue to all clients
      const updatedQueue = await getQueueData();
      io.emit('queue-updated', updatedQueue);
      
    } catch (error) {
      console.error('Update booking status error:', error);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Helper function to get queue data
async function getQueueData() {
  try {
    const inProgressBookings = await Booking.find({ status: 'in-progress' })
      .populate('user', 'name')
      .populate('service', 'name duration')
      .sort({ startTime: 1 });
      
    const waitingBookings = await Booking.find({ status: 'confirmed' })
      .populate('user', 'name')
      .populate('service', 'name duration')
      .sort({ date: 1 });
    
    const currentWashing = inProgressBookings.map((booking, index) => ({
      position: index + 1,
      car: booking.carModel,
      plateNumber: booking.carNumber,
      progress: booking.progress,
      estimatedEndTime: booking.startTime ? 
        new Date(booking.startTime.getTime() + booking.estimatedDuration * 60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) :
        "Скоро",
      userId: booking.user._id,
      bookingId: booking._id
    }));
    
    const waiting = waitingBookings.map((booking, index) => ({
      position: index + currentWashing.length + 1,
      car: booking.carModel,
      plateNumber: booking.carNumber,
      estimatedStartTime: new Date(booking.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      userId: booking.user._id,
      bookingId: booking._id
    }));
    
    return { currentWashing, waiting };
  } catch (error) {
    console.error('Get queue data error:', error);
    return { currentWashing: [], waiting: [] };
  }
}

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});