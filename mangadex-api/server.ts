import express from 'express';
import cors from 'cors';
import path from 'path';
import { 
    Manga, 
    Chapter, 
    Author, 
    Cover, 
    Tag, 
    List, 
    User, 
    Group,
    loginPersonal, 
    setGlobalLocale
} from './src/index';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.set('json spaces', 2);
app.use(cors());
app.use(express.json());

// Serve documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Set default locale to English
setGlobalLocale('en');

// Authentication helper - uses the single project account
const authenticate = async () => {
    try {
        await loginPersonal({
            clientId: process.env.MFA_TEST_CLIENT_ID || '',
            clientSecret: process.env.MFA_TEST_CLIENT_SECRET || '',
            username: process.env.MFA_TEST_USERNAME || '',
            password: process.env.MFA_TEST_PASSWORD || ''
        });
        console.log('Authenticated with MangaDex');
    } catch (error) {
        console.error('Authentication failed:', error);
    }
};

// --- Manga & Chapters ---

// Search & list manga
app.get('/manga', async (req, res) => {
    try {
        const results = await Manga.search(req.query as any);
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Manga details
app.get('/manga/:id', async (req, res) => {
    try {
        const manga = await Manga.get(req.params.id);
        res.json(manga);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Chapters feed
app.get('/manga/:id/feed', async (req, res) => {
    try {
        const feed = await Manga.getFeed(req.params.id, req.query as any);
        res.json(feed);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Single chapter info
app.get('/chapter/:id', async (req, res) => {
    try {
        const chapter = await Chapter.get(req.params.id);
        res.json(chapter);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Chapter pages (images)
app.get('/at-home/server/:chapterId', async (req, res) => {
    try {
        const chapter = await Chapter.get(req.params.chapterId);
        const pages = await chapter.getReadablePages();
        res.json({ pages });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Authors, Artists, and Groups ---

// Author info
app.get('/author/:id', async (req, res) => {
    try {
        const author = await Author.get(req.params.id);
        res.json(author);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Artist info
app.get('/artist/:id', async (req, res) => {
    try {
        const artist = await Author.get(req.params.id);
        res.json(artist);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Scanlation group info
app.get('/group/:id', async (req, res) => {
    try {
        const group = await Group.get(req.params.id);
        res.json(group);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Covers & Artwork ---

// Search/filter covers
app.get('/cover', async (req, res) => {
    try {
        const results = await Cover.search(req.query as any);
        res.json(results);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Cover info
app.get('/cover/:id', async (req, res) => {
    try {
        const cover = await Cover.get(req.params.id);
        res.json(cover);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Tags, Lists, and Custom Metadata ---

// List all tags
app.get('/tag', async (req, res) => {
    try {
        const tags = await Tag.getAllTags();
        res.json(tags);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Community or user-created manga lists
app.get('/list/:id', async (req, res) => {
    try {
        const list = await List.get(req.params.id);
        res.json(list);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// --- Misc / Admin / Utility ---

// Rate limits info
app.get('/rate-limits', (req, res) => {
    res.json({ message: 'Check X-RateLimit headers on any API response' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, '0.0.0.0', async () => {
    console.log(`MangaDex API Server running at http://0.0.0.0:${port}`);
    await authenticate();
});
