import test from 'node:test';
import assert from 'node:assert/strict';
import { chunkDocument, retrieveRelevantChunks } from './rag';

test('chunkDocument parses blocks and assigns categories', () => {
  const resumeSample = `
    Skills & Technologies: React, TypeScript, Node.js, PostgreSQL, Distributed Systems, Docker, AWS.

    Senior Software Engineer at Stripe (2021-Present)
    Led the core payment migration project handling over 10M transactions per day. Decreased latency by 45% using Redis caching and event-driven architecture.

    Education: B.S. in Computer Science from Stanford University (2017-2021).
  `;

  const chunks = chunkDocument(resumeSample, 'resume');
  assert.ok(chunks.length >= 3, `Expected at least 3 chunks, got ${chunks.length}`);
  assert.equal(chunks[0].category, 'skills');
  assert.equal(chunks[1].category, 'experience');
  assert.equal(chunks[2].category, 'education');
  assert.ok(chunks[1].content.includes('Stripe'));
});

test('retrieveRelevantChunks returns top matching chunks for behavioral interview query', () => {
  const sampleChunks = [
    {
      id: 'resume-1',
      source: 'resume' as const,
      category: 'skills' as const,
      content: 'Languages: Python, Go, TypeScript, C++, GraphQL.',
      keywords: ['languages', 'python', 'typescript', 'graphql'],
    },
    {
      id: 'resume-2',
      source: 'resume' as const,
      category: 'experience' as const,
      content: 'Led payment pipeline migration under tight 3-week deadline. Reduced transaction latency by 45%.',
      keywords: ['led', 'payment', 'pipeline', 'migration', 'tight', 'deadline', 'latency'],
    },
    {
      id: 'resume-3',
      source: 'resume' as const,
      category: 'experience' as const,
      content: 'Designed real-time WebSocket cluster supporting 5M concurrent connections with zero downtime.',
      keywords: ['designed', 'real-time', 'websocket', 'cluster', 'connections'],
    },
  ];

  const results = retrieveRelevantChunks('Tell me about a time you worked on a high stakes project under a tight deadline', sampleChunks, 2);

  assert.ok(results.length > 0, 'Expected at least 1 match');
  assert.equal(results[0].chunk.id, 'resume-2', 'Expected payment deadline experience to rank #1');
  assert.ok(results[0].score > 0);
});

test('retrieveRelevantChunks handles empty queries gracefully', () => {
  const results = retrieveRelevantChunks('', []);
  assert.deepEqual(results, []);
});
