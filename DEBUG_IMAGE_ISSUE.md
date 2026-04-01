# Profile Image Debug Kaise Karein

## Step 1: Browser Console Check Karo
1. F12 press karo
2. Console tab kholo
3. Team page pe jao
4. Console mein ye dikhega:
   - "Image loaded: Name, filename" (agar load ho gayi)
   - "Image failed to load: Name, filename" (agar fail hui)

## Step 2: Network Tab Check Karo
1. F12 press karo
2. Network tab kholo
3. Team page refresh karo (F5)
4. Image requests dhundo (filter by "Img")
5. Koi red (failed) request hai?
6. Us request pe click karo aur dekho:
   - URL kya hai?
   - Status code kya hai? (404 = file not found, 403 = forbidden)

## Step 3: localStorage Check Karo
Console mein ye command run karo:
```javascript
const members = JSON.parse(localStorage.getItem('teamMembers') || '[]');
members.forEach(m => {
  console.log(m.name, ':', m.profileImage);
});
```

Ye dikhayega ki har member ke liye kaunsa filename stored hai.

## Step 4: Backend Files Check Karo
Ye command run karo (PowerShell mein):
```powershell
Get-ChildItem "Dashboard backend/uploads/profileImage" | Select-Object Name
```

Ye dikhayega ki server pe kaun si files hain.

## Step 5: Direct URL Test Karo
Browser mein ye URL kholo:
```
http://localhost:5000/uploads/profileImage/[FILENAME]
```

[FILENAME] ko actual filename se replace karo jo localStorage mein hai.

Agar ye URL image dikha raha hai, to code mein problem hai.
Agar ye URL 404 de raha hai, to file upload nahi hui properly.

## Quick Fix:
1. localStorage clear karo:
```javascript
localStorage.clear()
location.reload()
```

2. Ek NAYA team member add karo with profile image
3. Check karo - naya member ka image dikhai dena chahiye

## Mujhe Batao:
- Console mein kya error aa raha hai?
- Network tab mein image URL kya hai?
- localStorage mein filename kya stored hai?
- Backend folder mein file exist karti hai?
