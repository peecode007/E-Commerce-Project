import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });  
})
.catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
