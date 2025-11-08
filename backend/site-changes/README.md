# Site Configuration Backup System

## Overview
This directory contains the site configuration backup system. The system automatically creates backups whenever changes are saved and maintains only the 5 most recent backups.

## File Structure
```
site-changes/
├── default.json           # Current active site configuration
├── skyber-2025-01-08.json # Today's backup with change log
├── skyber-2025-01-07.json # Yesterday's backup
├── skyber-2025-01-06.json # 2 days ago
├── skyber-2025-01-05.json # 3 days ago
└── skyber-2025-01-04.json # 4 days ago (5 days total)
```

## How It Works

### 1. Current Configuration (`default.json`)
- Stores the currently active site configuration
- Automatically updated when changes are saved via the Edit Site page
- Includes header settings: logo, site name, navigation links, colors, etc.

### 2. Backup Files (`skyber-YYYY-MM-DD.json`)
- One backup file per day (date-based)
- Filename format: `skyber-YYYY-MM-DD.json`
- Example: `skyber-2025-01-08.json`
- Multiple saves on the same day are logged in the same file with timestamps
- Only the 5 most recent days are kept (older days are automatically deleted)

### 3. Change Log Structure
Each daily backup file contains:
```json
{
  "date": "2025-01-08",
  "createdAt": "2025-01-08T10:00:00.000Z",
  "lastModified": "2025-01-08T15:30:00.000Z",
  "latestConfig": { /* Latest configuration */ },
  "changeLog": [
    {
      "timestamp": "2025-01-08T10:00:00.000Z",
      "previousConfig": { /* Previous state */ },
      "note": "Initial backup for this day"
    },
    {
      "timestamp": "2025-01-08T15:30:00.000Z",
      "previousConfig": { /* Previous state */ },
      "note": "Configuration updated"
    }
  ]
}
```

### 4. Restore Process
- User selects a backup day from dropdown (shows date, change count, and last modified time)
- Example: "Jan 8, 2025 - 3 changes (Last: 3:30 PM)"
- Restores the latest configuration from that day
- Current configuration is saved as a new backup before restoring
- All changes are reversible and tracked

## API Endpoints

### Get Current Configuration
```
GET /api/site-config/current
```
Returns the current active site configuration.

### Save Configuration
```
POST /api/site-config/save
Body: { header: { ... } }
```
Saves new configuration and creates a backup of the previous configuration.

### List Backups
```
GET /api/site-config/backups
```
Returns list of available backups (up to 5 most recent).

### Restore from Backup
```
POST /api/site-config/restore/:filename
```
Restores configuration from specified backup file.

## Usage in Frontend

### Edit Site Page
1. **Save Changes**: Click "Save Header Settings" button
   - Creates backup automatically
   - Updates active configuration
   - Shows success notification

2. **Restore from Backup**:
   - Open "Backup & Restore" section
   - Select backup from dropdown (shows timestamp)
   - Click "Restore" button
   - Confirmation notification appears

## Security
- All API endpoints are protected with authentication middleware
- Only authenticated super-admin users can access these endpoints
- Backups are stored server-side only

## Maintenance
- Old backup days (beyond 5 most recent) are automatically deleted
- No manual cleanup required
- All changes within a day are preserved in the change log
- Backups are created in JSON format for easy reading and debugging

## Benefits of Day-Based Backups
- **Reduced file clutter**: One file per day instead of multiple files
- **Change history**: See all changes made within a day
- **Easy tracking**: Know how many times configuration was changed each day
- **Efficient storage**: Better organization and less redundant data

## Configuration Structure
```json
{
  "header": {
    "logoUrl": "/favicon.svg",
    "siteName": "SKYBER",
    "navigationLinks": [...],
    "headerBgColor": "#ffffff",
    "headerTextColor": "#000000",
    "stickyHeader": true
  },
  "lastModified": "2025-01-08T05:35:00.000Z",
  "version": "1.0.0"
}
```
