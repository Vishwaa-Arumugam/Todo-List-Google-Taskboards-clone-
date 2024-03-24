import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { collection } from './config.js';


const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));



app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'Anything',
        resave: false,
        saveUninitialized: false,
    })
);



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/home.html');
});



app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html')
});



app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/views/signup.html')
});


app.post('/signup', async (req, res) => {

    const data = {
        name: req.body.email,
        password: req.body.Password
    }

    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists')
    } else {
        const userdata = await collection.insertMany(data);
        req.session.user = { username: req.body.email };
        // console.log(userdata);
        res.redirect('/main');
    };


});


app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.email });
        const HTMLC = check.HTMLContent;
        if (!check) {
            res.send("Username not found please sign up");
        }

        const passwordCheck = await collection.findOne({ password: req.body.Password });
        if (!passwordCheck) {
            res.send('Wrong Password')
        } else {
            req.session.user = { username: req.body.email };

            if (!HTMLC) {
                res.redirect('/main');
            } else {
                res.redirect('/main1');
            }
        }
    } catch {
        res.redirect('Wrong Details');
    }
});

app.get('/main1', (req, res) => {
    res.sendFile(__dirname + '/views/main1.html')
});


app.get('/getHTMLC', async (req, res) => {
    const check = await collection.findOne({ name: req.session.user.username });
    var HTMLC = check.HTMLContent;
    HTMLC = JSON.parse(HTMLC);
    res.json({ HtmlContent: HTMLC });
});


app.get('/main', (req, res) => {
    res.sendFile(__dirname + '/views/main.html')
});


app.get('/todo', async (req, res) => {

    try {
        res.sendFile(__dirname + '/views/todo.html');

    } catch (error) {
        console.error('Error fetching user data: ', error);
        res.status(500).send('Internal server error');
    }
});



app.get('/sendUserName', async (req, res) => {
    const knownUsername = req.session.user;

    if (!knownUsername) {
        console.error('Error fetching username')
    } else {
        res.json({ knownUsername })
    }
});


app.post('/sendDictionary', async (req, res) => {
    const activeUser = req.session.user;
    // console.log('Active User: ', activeUser);
    const knownUsername = activeUser.username;
    const receivedDict = req.body;
    console.log('Received dictionary in index.js:', receivedDict);


    try {
        const user = await collection.findOne({ name: knownUsername });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        await collection.updateOne(
            { name: knownUsername },
            { $set: { taskDictioanry: [receivedDict] } }
        );

        console.log('Task Dictinary updated for user: ', knownUsername);
        res.json({ message: 'Dictioanry received and updated successfully in index.js' });
    } catch (error) {
        console.error('Error updating taskDictionary:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});


app.post('/sendTaskName', async (req, res) => {
    const activeUser = req.session.user;
    const knownUsername = activeUser.username;
    const receivedTaskname = req.body;

    try {
        const user = await collection.findOne({ name: knownUsername });

        if (!user) {
            return res.status(400).json({ message: ' User Not Found' });
        }
        await collection.updateOne(
            { name: knownUsername },
            { $set: { taskanmes: [receivedTaskname] } }
        );

        console.log('Tasknames updated for user: ', knownUsername);
        res.json({ message: 'Tasknames received and updated successfully' });
    } catch (error) {
        console.error('error updating tasknames: ', error)
    }
});

app.get('/sendTaskNamesList', async (req, res) => {
    const knownUsername = req.session.user.username;

    try {
        const user1 = await collection.findOne({ name: knownUsername });
        // console.log(user1);
        if (!user1) {
            return res.status(400).json({ message: 'User Not Found' });
        }

        const taskNames = user1.taskanmes || [];
        console.log(taskNames)
        res.json({ username: knownUsername, tasksNames: taskNames });
    } catch (error) {
        console.error('Error Fetching Data : ', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

app.get('/getTaskDictionary', async (req, res) => {
    const knownUsername = req.session.user.username;
    console.log('known', knownUsername)
    try {
        const user = await collection.findOne({ name: knownUsername });
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const taskDictionary = user.taskDictioanry || [];
        console.log(taskDictionary)
        res.json({ username: knownUsername, tasks: taskDictionary });

    } catch (error) {
        console.error('Error fetching taskDictionary: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/sendHtmlContent', async (req, res) => {

    const receivedData = req.body;
    const receivedHtmlContent = receivedData.htmlContent;
    const aa = JSON.stringify(receivedHtmlContent);

    const activeUser = req.session.user;
    console.log('Active User: ', activeUser);
    const knownUsername = activeUser.username;

    try {
        const user = await collection.findOne({ name: knownUsername });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        await collection.updateOne(
            { name: knownUsername },
            { $set: { HTMLContent: [aa] } }
        );

        console.log('HTML content updated for user: ', knownUsername);
        res.json({ message: 'HTML content updated successfully in index.js' });
    } catch (error) {
        console.error('Error updating HTML:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/views/notes.html')
});


app.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.error('Error while destrying session: ', err);
        } else {
            console.log('Session destroyed successfully')
            res.redirect('/');
        }
    })

});


app.listen(port, () => {
    console.log(`Port is listening at ${port}`);
});