const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// // Use the upload router
// app.use(uploadRouter);

const secretKey = '75bc14c8a3c37e88838ee2724e40e6216f1dce0e5bb327831408d6ac2772cc24'; // Replace with your actual secret key
const JWT_SECRET = process.env.JWT_SECRET || secretKey;

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
 try {
   const { username, password, service } = req.body;

   // Check if user exists
   const existingUser = await prisma.user.findUnique({
     where: { username: username  }
   });

   if (existingUser) {
     return res.status(400).json({ error: 'Username already exists' });
   }

   // Hash password
   const hashedPassword = await bcrypt.hash(password, 10);

   // Create user
   const user = await prisma.user.create({
     data: {
       username,
       password: hashedPassword,
       service,
      //  role: 'ADMIN'
       role: 'USER'
     }
   });

   // Generate token
   const token = jwt.sign(
     { userId: user.id, username: user.username },
     JWT_SECRET,
     { expiresIn: '24h' }
   );

   res.status(201).json({
     token,
     user: {
       username: user.username,
       service: user.service,
       role: user.role
     }
   });

 } catch (error) {
   console.error('Registration error:', error);
   res.status(500).json({ error: 'Registration failed' });
 }
});

// Login endpoint 
app.post('/api/auth/login', async (req, res) => {
 try {
   const { username, password } = req.body;

   // Find user
   const user = await prisma.user.findUnique({
     where: { username }
   });

   if (!user) {
     return res.status(401).json({ error: 'Invalid credentials' });
   }

   // Check password
   const validPassword = await bcrypt.compare(password, user.password);
   if (!validPassword) {
     return res.status(401).json({ error: 'Invalid credentials' });
   }

   // Generate token
   const token = jwt.sign(
     { userId: user.id, username: user.username },
     JWT_SECRET,
     { expiresIn: '24h' }
   );
   console.log('Generated token:', token);
   res.json({
     token,
     user: {
       username: user.username,
       service: user.service,
       role: user.role
     }
   });

 } catch (error) {
   console.error('Login error:', error);
   res.status(500).json({ error: 'Login failed' });
 }
}); 

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Create employee
app.post('/api/employees', async (req, res) => {
  try {
    const employee = await prisma.employee.create({
      data: req.body
    });
    res.status(201).json(employee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// Update employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    await prisma.employee.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.status(200).send();
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    await prisma.employee.delete({
      where: { id: req.params.id }
    });
    res.status(200).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

// Get all equipment
app.get('/', async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany();
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create new equipment
app.post('/api/equipment', async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Add logging

    const equipment = await prisma.equipment.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        type: req.body.type,
        service: req.body.service,
        status: req.body.status,
        employeeId: req.body.assignedTo || null,
        nombre: req.body.nombre,
        dateInstall: req.body.dateInstall,
        etatBien: req.body.etatBien
      },
    });
    res.json(equipment);
  } catch (error) {
    console.error('Error creating equipment:', error); // Add error logging
    res.status(500).json({ 
      error: 'Failed to create equipment',
      details: error.message // Send error details to client
    });
  }
});

// Update equipment
app.put('/api/equipment/:id', async (req, res) => {
  try {
    const equipment = await prisma.equipment.update({
      where: { id: req.params.id },
      data: {
        code: req.body.code,
        name: req.body.name,
        type: req.body.type,
        service: req.body.service,
        status: req.body.status,
        employeeId: req.body.assignedTo || null,
        nombre: req.body.nombre,
        dateInstall: req.body.dateInstall,
        etatBien: req.body.etatBien
      },
    });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// Delete equipment
app.delete('/api/equipment/:id', async (req, res) => {
  try {
    await prisma.equipment.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

// Public form submission endpoint
// app.post('/api/public/submit', async (req, res) => {
//   try {
//     const { documents, ...formData } = req.body;

//     // Validate required fields
//     const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'region', 'adminDepartment', 'arrondissement', 'village'];
//     const missingFields = requiredFields.filter(field => !formData[field]);
    
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         error: 'Missing required fields',
//         fields: missingFields
//       });
//     }

//     // Validate documents if present
//     if (documents) {
//       const invalidDocs = documents.filter(doc => !doc.type || !doc.fileUrl || !doc.fileName || !doc.fileType);
//       if (invalidDocs.length > 0) {
//         return res.status(400).json({
//           error: 'Invalid document data',
//           details: 'Each document must have type, fileUrl, fileName, and fileType'
//         });
//       }
//     }

//     const submission = await prisma.publicFormSubmission.create({
//       data: {
//         ...formData,
//         requestType: formData.requestType || '',
//         description: formData.description || '',
//         documents: {
//           create: documents?.map(doc => ({
//             type: doc.type,
//             fileUrl: doc.fileUrl,
//             fileName: doc.fileName,
//             fileType: doc.fileType
//           })) || []
//         }
//       },
//       include: {
//         documents: true
//       }
//     });

//     res.status(201).json(submission);
//   } catch (error) {
//     console.error('Error submitting public form:', error);
    
//     // Handle specific Prisma errors
//     if (error.code === 'P2002') {
//       return res.status(409).json({
//         error: 'A submission with this information already exists'
//       });
//     }
    
//     if (error.code === 'P2003') {
//       return res.status(400).json({
//         error: 'Invalid reference in submission data'
//       });
//     }

//     res.status(500).json({
//       error: 'Failed to submit form',
//       details: 'An unexpected error occurred while processing your submission'
//     });
//   }
// });



// Public form submission endpoint
app.post('/api/public/submit', async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      region,
      adminDepartment,
      arrondissement,
      village,
      requestType,
      description,
      documents
    } = req.body;

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'region', 'adminDepartment', 'arrondissement', 'village'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      console.log('Missing Fields:', missingFields); // Log missing fields
      return res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid Email:', email); // Log invalid email
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate phone number format (basic validation)
    // Phone Validation (More flexible)
    // const phoneRegex = /^\+?\d{1,4}?\d{9,15}$/; // Allows international numbers
    // if (phone && !phoneRegex.test(phone)) {  // Make phone optional if your DB allows
    //   return res.status(400).json({ error: 'Invalid phone format' });
    // }

    // Create submission with validated data
    const submission = await prisma.publicFormSubmission.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        region,
        adminDepartment,
        arrondissement,
        village,
        requestType: requestType || '',
        description: description || null,
        status: 'pending',
        documents: {
          create: documents?.map(doc => ({
            type: doc.type,
            fileUrl: doc.fileUrl,
            fileName: doc.fileName,
            fileType: doc.fileType
          })) || []
        }
      },
      include: {
        documents: true
      }
    });

    // Response filtering (don't return full documents array)
    const response = {
      message: 'Submission successful',
      submissionId: submission.id,
      status: submission.status,
      documentCount: submission.documents.length
    };
    res.status(201).json(response);

  } catch (error) {
    console.error('Error submitting form:', error);
    
    // Handle specific Prisma errors
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'A submission with this information already exists'
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid reference in submission data'
      });
    }

    // Security: Don't expose internal errors in production
    const errorMessage = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

    // Handle other unexpected errors
    res.status(500).json({
      error: 'Failed to submit form',
      details: error.message || 'An unexpected error occurred while processing your submission'
    });
  }
});

// Get all public form submissions
app.get('/api/public/submissions', async (req, res) => {
  try {
    const submissions = await prisma.publicFormSubmission.findMany({
      include: {
        documents: true
      }
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching public form submissions:', error);
    res.status(500).json({ error: 'Failed to fetch public form submissions' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});