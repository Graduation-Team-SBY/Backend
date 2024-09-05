const { ObjectId } = require('mongodb');

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const users = [
  {
    _id: new ObjectId(),
    email: "user1@example.com",
    phoneNumber: "+1234567890",
    password: "password123",
    isWorker: false
  },
  {
    _id: new ObjectId(),
    email: "user2@example.com",
    phoneNumber: "+1987654321",
    password: "securepass",
    isWorker: true
  },
  {
    _id: new ObjectId(),
    email: "user3@example.com",
    phoneNumber: "+1122334455",
    password: "pass1234",
    isWorker: false
  }
];

// Profiles
const profiles = [
  {
    _id: new ObjectId(),
    name: "John Doe",
    dateOfBirth: randomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    profilePicture: "https://example.com/pic1.jpg",
    address: "123 Main St, Anytown, USA",
    userId: users[0]._id
  },
  {
    _id: new ObjectId(),
    name: "Jane Smith",
    dateOfBirth: randomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    profilePicture: "https://example.com/pic2.jpg",
    address: "456 Elm St, Othertown, USA",
    userId: users[1]._id
  },
  {
    _id: new ObjectId(),
    name: "Bob Johnson",
    dateOfBirth: randomDate(new Date(1980, 0, 1), new Date(2000, 0, 1)),
    profilePicture: "https://example.com/pic3.jpg",
    address: "789 Oak St, Somewhere, USA",
    userId: users[2]._id
  }
];

// Wallets
const wallets = [
  {
    _id: new ObjectId(),
    amount: 1000,
    userId: users[0]._id
  },
  {
    _id: new ObjectId(),
    amount: 1500,
    userId: users[1]._id
  },
  {
    _id: new ObjectId(),
    amount: 2000,
    userId: users[2]._id
  }
];

// Categories
const categories = [
  {
    _id: new ObjectId(),
    name: "Home Cleaning",
    description: "General house cleaning services"
  },
  {
    _id: new ObjectId(),
    name: "Gardening",
    description: "Lawn and garden maintenance"
  },
  {
    _id: new ObjectId(),
    name: "Plumbing",
    description: "Pipe fitting and repair services"
  }
];

// Jobs
const jobs = [
  {
    _id: new ObjectId(),
    description: "Clean 3-bedroom house",
    address: "123 Pine St, Cleanville, USA",
    fee: 100,
    images: ["https://example.com/job1-1.jpg", "https://example.com/job1-2.jpg"],
    chatId: new ObjectId(),
    clientId: users[0]._id,
    workerId: users[1]._id,
    categoryId: categories[0]._id
  },
  {
    _id: new ObjectId(),
    description: "Mow lawn and trim hedges",
    address: "456 Maple Ave, Greentown, USA",
    fee: 75,
    images: ["https://example.com/job2-1.jpg"],
    chatId: new ObjectId(),
    clientId: users[2]._id,
    workerId: users[1]._id,
    categoryId: categories[1]._id
  }
];

// JobStatus
const jobStatus = [
  {
    _id: new ObjectId(),
    workerConfirmed: true,
    clientConfirmed: false,
    isDone: false,
    jobId: jobs[0]._id
  },
  {
    _id: new ObjectId(),
    workerConfirmed: true,
    clientConfirmed: true,
    isDone: true,
    jobId: jobs[1]._id
  }
];

// JobRequests
const jobRequests = [
  {
    _id: new ObjectId(),
    jobId: jobs[0]._id,
    workerId: users[1]._id
  },
  {
    _id: new ObjectId(),
    jobId: jobs[1]._id,
    workerId: users[1]._id
  }
];

// Transactions
const transactions = [
  {
    _id: new ObjectId(),
    clientId: users[0]._id,
    workerId: users[1]._id,
    jobsId: jobs[0]._id
  },
  {
    _id: new ObjectId(),
    clientId: users[2]._id,
    workerId: users[1]._id,
    jobsId: jobs[1]._id
  }
];

// Worker Profiles
const workerProfiles = [
  {
    _id: new ObjectId(),
    userId: users[1]._id,
    bio: "Experienced cleaner and gardener",
    joinDate: randomDate(new Date(2020, 0, 1), new Date()),
    rating: 4
  }
];

// Reviews
const reviews = [
  {
    _id: new ObjectId(),
    transactionId: transactions[0]._id,
    description: "Great job on cleaning the house!",
    rating: 5,
    images: "https://example.com/review1.jpg"
  },
  {
    _id: new ObjectId(),
    transactionId: transactions[1]._id,
    description: "Good work on the garden, but could have been better",
    rating: 4,
    images: "https://example.com/review2.jpg"
  }
];

// Chats
const chats = [
  {
    _id: jobs[0].chatId,
    contents: [
      {
        sender: users[0]._id,
        message: "When can you start the cleaning?",
        createdAt: new Date()
      },
      {
        sender: users[1]._id,
        message: "I can start tomorrow at 9 AM. Is that okay?",
        createdAt: new Date(Date.now() + 3600000)
      }
    ]
  },
  {
    _id: jobs[1].chatId,
    contents: [
      {
        sender: users[2]._id,
        message: "Please confirm the time for lawn mowing",
        createdAt: new Date()
      },
      {
        sender: users[1]._id,
        message: "I'll be there at 2 PM as agreed. See you then!",
        createdAt: new Date(Date.now() + 7200000)
      }
    ]
  }
];

// Export all collections
module.exports = {
  users,
  profiles,
  wallets,
  categories,
  jobs,
  jobStatus,
  jobRequests,
  transactions,
  workerProfiles,
  reviews,
  chats
};