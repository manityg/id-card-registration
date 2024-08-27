const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'xxxxx',
    resave: false,
    saveUninitialized: true,
}));

const db = mysql.createConnection({
    host: 'xxxxx',
    user: 'xxxxx',
    password: 'xxxxx',
    database: 'xxxxx',
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login.html');
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.get('/login.html', (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.get('/register.html', (req, res) => {
    res.sendFile(__dirname + "/public/register.html");
});

app.get('/employeeDashboard.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/employeeDashboard.html");
});

app.get('/profile.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/profile.html");
});

app.get('/apply.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/apply.html");
});

app.get('/departmentDashboard.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/departmentDashboard.html");
});

app.get('/employeeDetails.html', isAuthenticated, (req,res) => {
    res.sendFile(__dirname + "/public/employeeDetails.html");
});

app.get('/details.html', isAuthenticated, (req,res) => {
    res.sendFile(__dirname + "/public/details.html");
});

app.get('/newApplications.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/newApplications.html");
});

app.get('/acceptedApplications.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/acceptedApplications.html");
});

app.get('/rejectedApplications.html', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/rejectedApplications.html");
});

app.get('/getUserName', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ success: true, name: req.session.user.username });
    } else {
        res.json({ success: false });
    }
});

app.get('/getName', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ success: true, name: req.session.user.name });
    } else {
        res.json({ success: false });
    }
});

app.post('/register', upload.single('file'), (req, res) => {
    const { name, dob, gender, designation, doj, department, mobile, email, address } = req.body;
    const username = generateUsername(name);
    const password = generatePassword();


    bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;


        const sql = `INSERT INTO employees (username, password, name, dob, gender, designation, doj, department, mobile, email, address, role, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'employee','new')`;
        db.query(sql, [username, hash, name, dob, gender, designation, doj, department, mobile, email, address], (err, result) => {
            if (err) {
                res.json({ success: false });
                throw err;
            }
            sendCredentials(email, username, password);
            res.json({ success: true });
        });
    });
});


app.post('/login', upload.single('file'), (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM employees WHERE username = ?`;
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (isMatch) {
                    req.session.user = results[0];
                    res.json({ success: true, role: results[0].role });
                } else {
                    res.json({ success: false });
                }
            });
        } else {
            res.json({ success: false });
        }
    });
});


app.post('/upload', upload.fields([{ name: 'photo' }, { name: 'signature' }]), (req, res) => {
    if (req.session.user) {
      const username = req.session.user.username;
      const sql = `SELECT photo, signature FROM employees WHERE username = ?`;
      db.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
          const employee = result[0];
          if (employee.photo && employee.signature) {
            res.json({ success: false, message: 'You have already uploaded your photo and signature' });
          } else {
            const photoBuffer = fs.readFileSync(req.files.photo[0].path);
            const signatureBuffer = fs.readFileSync(req.files.signature[0].path);
            const sql = `UPDATE employees SET photo = ?, signature = ? WHERE username = ?`;
            db.query(sql, [photoBuffer, signatureBuffer, username], (err, result) => {
              if (err) throw err;
              res.json({ success: true });
            });
          }
        } else {
          res.status(404).json({ message: 'Employee not found' });
        }
      });
    } else {
      res.json({ success: false, message: 'You are not logged in' });
    }
});


app.post('/logout', (req, res) => {
    const startTime = Date.now();
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        const endTime = Date.now();
        console.log(`Session destroyed in ${endTime - startTime}ms`);
        res.json({ success: true });
      }
    });
});


app.get('/status', isAuthenticated, (req, res) => {
    const username = req.session.user.username;
    const sql = `SELECT status FROM employees WHERE username = ?`;
    db.query(sql, [username], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        const status = result[0].status.toUpperCase();
        res.json({ status: status });
      } else {
        res.status(404).json({ message: 'Application not found' });
      }
    });
});


app.get('/applications/:status', isAuthenticated, (req, res) => {
    const status = req.params.status;
    const department = req.session.user.department;
    let sql;
    if (req.session.user.username === 'admin') {
      sql = `SELECT * FROM employees WHERE status = ?`;
    } else {
      sql = `SELECT * FROM employees WHERE department = ? AND status = ?`;
    }
    const params = req.session.user.username === 'admin' ? [status] : [department, status];
    db.query(sql, params, (err, results) => {
        if (err) throw err;
        res.json({ applications: results });
    });
});


app.get('/applicationCounts', isAuthenticated, (req, res) => {
    let sqlNew, sqlAccepted, sqlRejected;
    const department = req.session.user.department;
    if (req.session.user.username === 'admin') {
        sqlNew = `SELECT COUNT(*) AS count FROM employees WHERE status = 'new'`;
        sqlAccepted = `SELECT COUNT(*) AS count FROM employees WHERE status = 'accepted'`;
        sqlRejected = `SELECT COUNT(*) AS count FROM employees WHERE status = 'rejected'`;
    } else {
        const department = req.session.user.department;
        sqlNew = `SELECT COUNT(*) AS count FROM employees WHERE department = ? AND status = 'new'`;
        sqlAccepted = `SELECT COUNT(*) AS count FROM employees WHERE department = ? AND status = 'accepted'`;
        sqlRejected = `SELECT COUNT(*) AS count FROM employees WHERE department = ? AND status = 'rejected'`;
    }


    db.query(sqlNew, req.session.user.username === 'admin' ? [] : [department], (err, result) => {
        if (err) throw err;
        const counts = { new: result[0].count };


        db.query(sqlAccepted, req.session.user.username === 'admin' ? [] : [department], (err, result) => {
            if (err) throw err;
            counts.accepted = result[0].count;


            db.query(sqlRejected, req.session.user.username === 'admin' ? [] : [department], (err, result) => {
                if (err) throw err;
                counts.rejected = result[0].count;


                res.json(counts);
            });
        });
    });
});


app.get('/application/:username', isAuthenticated, (req, res) => {
    const username = req.params.username;
    const sql = `SELECT * FROM employees WHERE username = ?`;
    db.query(sql, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const employee = result[0];
            let photoBase64, signatureBase64;
            if (employee.photo) {
                photoBase64 = employee.photo.toString('base64');
            } else {
                photoBase64 = null;
            }
            if (employee.signature) {
                signatureBase64 = employee.signature.toString('base64');
            } else {
                signatureBase64 = null;
            }


            const data = {
                name: employee.name,
                username: employee.username,
                mobile: employee.mobile,
                email: employee.email,
                department: employee.department,
                designation: employee.designation,
                dob: employee.dob,
                doj: employee.doj,
                address: employee.address,
                    photo: photoBase64 ? `data:image/jpeg;base64,${photoBase64}` : null,
                    signature: signatureBase64 ? `data:image/jpeg;base64,${signatureBase64}` : null
            };
            res.json(data);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    });
});


app.get('/application/:username/status', isAuthenticated, (req, res) => {
    const username = req.params.username;
    const sql = `SELECT status, remark FROM employees WHERE username = ?`;
    db.query(sql, username, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            const employee = result[0];
            const data = {
                status: employee.status,
                remark: employee.remark
            };
            res.json(data);
        } else {
            res.status(500).json({ error: 'Failed to fetch status and remark' });
        }
    });
});


app.put('/application/:username', isAuthenticated, (req, res) => {
    const username = req.params.username;
    const { status, remark } = req.body;
    const sql = `UPDATE employees SET status = ?, remark = ? WHERE username = ?`;
    db.query(sql, [status, remark, username], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
        const sql = `SELECT email FROM employees WHERE username = ?`;
        db.query(sql, [username], (err, result) => {
            if (err) throw err;
            const email = result[0].email;
            sendStatus(email, status, remark);
        });
    });
});


function generateUsername(name) {
    return name.toLowerCase().replace(/\s+/g, '') + Math.floor(1000 + Math.random() * 9000);
}


function generatePassword() {
    return Math.random().toString(36).slice(-8);
}


function sendCredentials(to, username, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'xxxxx',
            pass: 'xxxxx'
        }
    });


    const mailOptions = {
        from: 'xxxxx',
        to: to,
        subject: 'Registration Details',
        text: `Your login credentials for ID Card Registration Portal are:\nUsername: ${username}\nPassword: ${password}`
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


function sendStatus(to, status, remark) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'xxxxx',
            pass: 'xxxxx'
        }
    });


    let mailText = `Your ID Card application has been ${status}.`;


    if (remark !== '') {
        mailText += `\nRemark: ${remark}`;
    }


    const mailOptions = {
        from: 'xxxxx',
        to: to,
        subject: 'ID Card Application Status',
        text: mailText
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

