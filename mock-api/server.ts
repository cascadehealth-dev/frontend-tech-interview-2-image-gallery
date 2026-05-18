import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

type TImage = {
  id: string;
  title: string;
  tags: string[];
  filename: string;
  size: number;
  url: string;
  createdAt: string;
};

const images: TImage[] = [
  {
    id: '1',
    title: 'Mountain Sunrise',
    tags: ['nature', 'landscape'],
    filename: 'mountain-sunrise.svg',
    size: 245000,
    url: '/sample-images/mountain-sunrise.svg',
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: '2',
    title: 'City Skyline',
    tags: ['urban', 'architecture'],
    filename: 'city-skyline.svg',
    size: 312000,
    url: '/sample-images/city-skyline.svg',
    createdAt: '2026-02-20T14:15:00Z',
  },
  {
    id: '3',
    title: 'Ocean Waves',
    tags: ['nature', 'water'],
    filename: 'ocean-waves.svg',
    size: 198000,
    url: '/sample-images/ocean-waves.svg',
    createdAt: '2026-03-05T11:00:00Z',
  },
  {
    id: '4',
    title: 'Office Team Meeting',
    tags: ['people', 'work'],
    filename: 'team-meeting.svg',
    size: 275000,
    url: '/sample-images/team-meeting.svg',
    createdAt: '2026-03-18T16:45:00Z',
  },
  {
    id: '5',
    title: 'Abstract Pattern',
    tags: ['art', 'abstract'],
    filename: 'abstract-pattern.svg',
    size: 156000,
    url: '/sample-images/abstract-pattern.svg',
    createdAt: '2026-04-02T08:20:00Z',
  },
];

// GET /api/images — list with optional filters
app.get('/api/images', (req, res) => {
  let result = [...images];

  const q = req.query.q as string | undefined;
  if (q) {
    const term = q.toLowerCase();
    result = result.filter((img) => img.title.toLowerCase().includes(term));
  }

  const tag = req.query.tag as string | undefined;
  if (tag) {
    result = result.filter((img) =>
      img.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  }

  res.json(result);
});

// GET /api/images/:id
app.get('/api/images/:id', (req, res) => {
  const image = images.find((img) => img.id === req.params.id);
  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }
  res.json(image);
});

// POST /api/images — upload with simulated progress
// The upload is accepted via multipart form data.
// Progress is simulated server-side with chunked transfer encoding.
app.post('/api/images', upload.single('file'), (req, res) => {
  const file = req.file;
  const title = req.body.title as string;
  const tags = req.body.tags
    ? (req.body.tags as string).split(',').map((t: string) => t.trim())
    : [];

  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  // Simulate upload processing delay (1-3 seconds)
  const delay = 1000 + Math.random() * 2000;

  setTimeout(() => {
    const newImage: TImage = {
      id: randomUUID(),
      title,
      tags,
      filename: file.originalname,
      size: file.size,
      url: `/sample-images/${file.originalname}`,
      createdAt: new Date().toISOString(),
    };

    images.push(newImage);
    res.status(201).json(newImage);
  }, delay);
});

// DELETE /api/images/:id
// ~20% chance of failure to test optimistic rollback
app.delete('/api/images/:id', (req, res) => {
  const index = images.findIndex((img) => img.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  // Simulate occasional failure
  if (Math.random() < 0.2) {
    res.status(500).json({ error: 'Server error: could not delete image. Please try again.' });
    return;
  }

  // Simulate network delay
  setTimeout(() => {
    images.splice(index, 1);
    res.status(204).send();
  }, 500 + Math.random() * 1000);
});

// GET /api/tags — list unique tags
app.get('/api/tags', (_req, res) => {
  const allTags = [...new Set(images.flatMap((img) => img.tags))].sort();
  res.json(allTags);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log(`\nEndpoints:`);
  console.log(`  GET    /api/images          — list images (query: ?q=search&tag=nature)`);
  console.log(`  GET    /api/images/:id       — get single image`);
  console.log(`  POST   /api/images           — upload (multipart: file, title, tags)`);
  console.log(`  DELETE /api/images/:id        — delete (~20% simulated failure rate)`);
  console.log(`  GET    /api/tags             — list unique tags`);
});
