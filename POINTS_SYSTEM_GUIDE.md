# Zencoder Discord Points System Guide

## Overview

A comprehensive gamified point system for the Zencoder Discord server. Members earn points through community engagement, social account linking, and external mentions. Points accumulate on a leaderboard and unlock tier ranks.

## Database Schema

### Member
Stores user profile and point aggregation data.
- `id` - Discord user ID
- `username` - Discord username
- `totalPoints` - Lifetime accumulated points
- `weeklyPoints` - Points earned in current week
- `streakDays` - Consecutive active days
- `streakActive` - Active 5+ days this week
- `tier` - Current tier (LURKER, MEMBER, BUILDER, CONTRIBUTOR, CHAMPION)
- `redditHandle` - Linked Reddit account
- `xHandle` - Linked X/Twitter account

### PointEvent
Individual point transactions with audit trail.
- `id` - UUID
- `memberId` - Link to Member
- `actionType` - Type of action that earned points
- `pointsAwarded` - Final points after multipliers
- `multipliers` - Applied multipliers (JSON array)
- `metadata` - Contextual data (message_id, post_url, etc.)
- `weekKey` - ISO week for aggregation (e.g., "2024-W03")

### SocialLink
Verified social media accounts.
- `id` - UUID
- `memberId` - Link to Member
- `platform` - REDDIT or X
- `handle` - Username on that platform
- `verifiedAt` - Verification timestamp
- `bonusAwarded` - One-time bonus paid

### MentionSubmission
External mentions pending verification.
- `id` - UUID
- `memberId` - Link to Member
- `platform` - REDDIT or X
- `postUrl` - URL to the post
- `status` - PENDING, APPROVED, REJECTED
- `verifiedBy` - Moderator or "bot"
- `pointsAwarded` - Points given on approval

## Point Actions & Values

### One-Time Actions
| Action | Points | Notes |
|--------|--------|-------|
| ONBOARDING_INTRO | 50 | First message in #introductions |
| SOCIAL_LINK_REDDIT | 75 | Reddit account linked |
| SOCIAL_LINK_X | 75 | X/Twitter account linked |

### Recurring Discord Actions
| Action | Points | Daily Cap | Notes |
|--------|--------|-----------|-------|
| MESSAGE_SENT | 2 | 5 | Any message in qualifying channels |
| THREAD_STARTED | 5 | 3 | New thread or question |
| HELPFUL_ANSWER | 15 | None | Thread author marks with ✅ |
| REACTION_RECEIVED | 1 | 10 | Any reaction on member's message |
| SHOWCASE_POST | 20 | 1 | Post in #showcase channel |
| TIP_SHARED | 8 | 2 | Post in #resources channel |

### External Mention Actions
| Action | Points | Daily Cap | Verification |
|--------|--------|-----------|--------------|
| ZENCODER_MENTION_X | 30 | 1 | Mod/bot verified |
| ZENCODER_MENTION_REDDIT | 30 | 1 | Mod verified |

## Multipliers

### Weekly Streak Multiplier
- **Trigger**: Member earns points on 5+ distinct days in current week (Mon-Sun UTC)
- **Multiplier**: ×1.2 applied to all points once threshold is crossed
- **Retroactive**: Yes — already-logged points for that week are adjusted
- **Reset**: Every Sunday at 23:59 UTC

## Tier System

| Tier | Points | Discord Role |
|------|--------|--------------|
| LURKER | 0-99 | Lurker |
| MEMBER | 100-499 | Member |
| BUILDER | 500-1,499 | Builder |
| CONTRIBUTOR | 1,500-3,999 | Contributor |
| CHAMPION | 4,000+ | Champion |

Tiers are based on `totalPoints` (lifetime) and update automatically when points are awarded.

## API Endpoints

### Award Points
**POST** `/api/points/add`

Award points to a member for a specific action.

```json
{
  "memberId": "discord_user_id",
  "actionType": "MESSAGE_SENT",
  "metadata": {
    "messageId": "123456",
    "channelId": "general"
  }
}
```

**Response:**
```json
{
  "success": true,
  "points": 2,
  "message": "Awarded 2 points for MESSAGE_SENT"
}
```

**Error cases:**
- Daily cap exceeded
- One-time action already completed
- Member not found
- Invalid action type

---

### Get Leaderboard
**GET** `/api/points/leaderboard?period=all-time&limit=100`

Fetch top members with their points and tier information.

**Query Parameters:**
- `period` - "all-time" or "weekly" (default: "all-time")
- `limit` - Max results, 1-500 (default: 100)

**Response:**
```json
[
  {
    "rank": 1,
    "id": "user_id",
    "username": "john_doe",
    "totalPoints": 4500,
    "weeklyPoints": 340,
    "tier": "CHAMPION",
    "streakDays": 5,
    "streakActive": true
  },
  ...
]
```

---

### Initialize Members
**POST** `/api/points/init`

Initialize all Discord members with 0 points (run once at setup).

```json
{
  "members": [
    {
      "user": {
        "id": "user_id",
        "username": "username"
      }
    }
  ]
}
```

**Response:**
```json
{
  "message": "Initialized 150 members"
}
```

---

### Link Social Account
**POST** `/api/social/link`

Link and verify a social media account (Reddit or X).

```json
{
  "memberId": "discord_user_id",
  "platform": "REDDIT",
  "handle": "reddit_username"
}
```

**Response:**
```json
{
  "success": true,
  "socialLink": {
    "id": "link_id",
    "platform": "REDDIT",
    "handle": "reddit_username",
    "verifiedAt": "2024-06-08T12:00:00Z"
  },
  "pointsAwarded": 75,
  "message": "REDDIT account linked and 75 points awarded"
}
```

**Valid platforms:** REDDIT, X

---

### Submit Mention
**POST** `/api/mentions/submit`

Submit an external mention (Reddit post or Tweet) for verification.

```json
{
  "memberId": "discord_user_id",
  "platform": "X",
  "postUrl": "https://twitter.com/user/status/1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "submission": {
    "id": "submission_id",
    "status": "PENDING",
    "postUrl": "https://twitter.com/user/status/1234567890",
    "submittedAt": "2024-06-08T12:00:00Z"
  },
  "message": "Mention submission created and pending verification"
}
```

---

### Verify Mention
**POST** `/api/mentions/verify`

Approve or reject a pending mention (moderator action).

```json
{
  "submissionId": "submission_id",
  "status": "APPROVED",
  "verifiedBy": "moderator_id"
}
```

**Response (Approved):**
```json
{
  "success": true,
  "submission": {
    "id": "submission_id",
    "status": "APPROVED",
    "pointsAwarded": 30,
    "verifiedAt": "2024-06-08T12:05:00Z"
  },
  "pointsAwarded": 30,
  "message": "Mention approved and points awarded"
}
```

**Valid statuses:** APPROVED, REJECTED

---

## Usage Examples

### Example 1: Awarding Points for a Message
```javascript
// Award points when a user sends a message
const response = await fetch('/api/points/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberId: '123456789',
    actionType: 'MESSAGE_SENT',
    metadata: {
      messageId: 'msg_123',
      channelId: 'general',
      content: 'Great question!'
    }
  })
});

const result = await response.json();
console.log(`${result.points} points awarded`);
```

### Example 2: Linking Social Accounts
```javascript
// User links their Reddit account
const response = await fetch('/api/social/link', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberId: '123456789',
    platform: 'REDDIT',
    handle: 'my_reddit_username'
  })
});

const result = await response.json();
console.log(`${result.pointsAwarded} bonus points for linking account`);
```

### Example 3: Fetching Leaderboard
```javascript
// Get top 50 all-time members
const response = await fetch('/api/points/leaderboard?period=all-time&limit=50');
const leaderboard = await response.json();

leaderboard.forEach(member => {
  console.log(`${member.rank}. ${member.username} - ${member.totalPoints} pts (${member.tier})`);
});
```

### Example 4: Submitting and Verifying Mentions
```javascript
// User submits a Zencoder mention
const submitResponse = await fetch('/api/mentions/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    memberId: '123456789',
    platform: 'X',
    postUrl: 'https://twitter.com/user/status/1234567890'
  })
});

const submission = await submitResponse.json();
console.log(`Submission ${submission.submission.id} pending review`);

// Later, moderator approves it
const verifyResponse = await fetch('/api/mentions/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    submissionId: submission.submission.id,
    status: 'APPROVED',
    verifiedBy: 'mod_id_123'
  })
});

const verified = await verifyResponse.json();
console.log(`Member earned ${verified.pointsAwarded} points!`);
```

## Edge Cases & Rules

- **Self-reactions do not count** - Only reactions from different members award points
- **Bot messages excluded** - Points not awarded for bot account messages
- **Deleted messages** - Already awarded points are NOT revoked if message is deleted
- **Duplicate URLs** - Same URL can only be approved once per member
- **Tier upgrade only** - Tiers move upward based on total_points, never downward
- **Weekly reset** - Weekly points reset to 0 every Monday at 00:00 UTC
- **Idempotency** - All point operations keyed on event_id to prevent double-awarding

## Weekly Reset Schedule

Every Monday at 00:00 UTC:
1. Top 10 members are archived
2. `weeklyPoints` reset to 0 for all members
3. Streak calculations update for new week

## Integration Checklist

- [ ] Create/migrate database with Member, PointEvent, SocialLink, MentionSubmission tables
- [ ] Set up Discord bot to listen for messages, reactions, threads
- [ ] Call `/api/points/add` for each qualifying action
- [ ] Set up social link verification flow in bot commands
- [ ] Create mention submission channels (#x-mentions, #reddit-mentions)
- [ ] Add moderation commands for `/mention approve` and `/mention reject`
- [ ] Set up scheduled task for weekly reset at Monday 00:00 UTC
- [ ] Display leaderboard on dashboard using `/api/points/leaderboard`
- [ ] Monitor point event logs for abuse/exploitation

## Monitoring & Debugging

View points awarded to a member:
```javascript
const events = await prisma.pointEvent.findMany({
  where: { memberId: 'user_id' },
  orderBy: { createdAt: 'desc' },
  take: 20
});
```

Check member tier and points:
```javascript
const member = await prisma.member.findUnique({
  where: { id: 'user_id' },
  include: { pointEvents: true }
});
```

Reset points (admin only):
```javascript
await prisma.member.update({
  where: { id: 'user_id' },
  data: { totalPoints: 0, weeklyPoints: 0 }
});
```
