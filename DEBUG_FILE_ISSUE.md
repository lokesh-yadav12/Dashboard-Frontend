# Debug File Upload Issue

## Problem
Profile images and qualification documents showing "File not found" error.

## Steps to Debug:

### 1. Check Browser Console
Open browser console (F12) and check for:
- What filename is being stored
- What URL is being requested
- Any error messages

### 2. Check localStorage Data
In browser console, run:
```javascript
// Check team members data
const members = JSON.parse(localStorage.getItem('teamMembers') || '[]');
console.log('Team Members:', members);

// Check specific member's files
members.forEach(m => {
  console.log(`${m.name}:`, {
    profileImage: m.profileImage,
    qualificationDocument: m.qualificationDocument
  });
});
```

### 3. Clear Old Data and Re-upload
Old data might have wrong filenames. Clear and start fresh:
```javascript
localStorage.clear();
location.reload();
```

Then add a new team member with files.

### 4. Check File Upload Response
When uploading, check browser Network tab:
- Look for POST to `/api/upload`
- Check the response - it should have `fileName` field
- That fileName should be stored in localStorage

### 5. Verify Backend Files
Check if files exist in:
- `Dashboard backend/uploads/profileImage/`
- `Dashboard backend/uploads/qualificationDocument/`

The filename in localStorage should match a file in these folders.

## Common Issues:

### Issue 1: Old Data with Wrong Filenames
**Solution**: Clear localStorage and re-add team members

### Issue 2: Files Not Uploaded
**Solution**: Check backend is running on port 5000

### Issue 3: CORS Error
**Solution**: Backend should allow requests from localhost:5173

### Issue 4: Wrong File Path
**Solution**: Filename should be like `1774942925796-image.jpg` (timestamp-originalname)

## Quick Fix:
```javascript
// Clear all data
localStorage.clear();

// Reload page
location.reload();

// Add new team member with files - they should work now
```
