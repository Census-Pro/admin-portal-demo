# Quick Test Data - Copy & Paste Ready

## 🎯 Navigation Items (Create these first)

### 1. About Us

- Label: `About Us`
- URL: `/about`
- Icon: `info`
- Order: `1`
- Status: `active`

### 2. Services

- Label: `Services`
- URL: `/services`
- Icon: `apps`
- Order: `2`
- Status: `active`

### 3. Help & Support

- Label: `Help & Support`
- URL: `/help`
- Icon: `help`
- Order: `3`
- Status: `active`

---

## 📄 Content Pages (Create these after navigation)

### Page 1: Privacy Policy (Standalone - No Nav Link)

```
Title: Privacy Policy - Census 2026
Slug: privacy-policy
Nav Link: None
Featured Image: None
Status: Published
Order: 1

Body:
<h1>Privacy Policy</h1>
<p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information during the Census 2026.</p>
<h2>Information We Collect</h2>
<ul>
<li>Name and contact details</li>
<li>Address information</li>
<li>Demographic data</li>
</ul>
```

### Page 2: About Census 2026 (Under "About Us")

```
Title: About Census 2026
Slug: about-census-2026
Nav Link: About Us
Featured Image: None
Status: Published
Order: 1

Body:
<h1>About Census 2026</h1>
<p>Welcome to the Census 2026 official portal. The census is a comprehensive count of Bhutan's population conducted every 10 years.</p>
<h2>Why is the Census Important?</h2>
<ul>
<li>Helps government plan for the future</li>
<li>Determines resource allocation</li>
<li>Shapes policy decisions</li>
</ul>
```

### Page 3: Our Team (Under "About Us")

```
Title: Our Team
Slug: our-team
Nav Link: About Us
Featured Image: None
Status: Published
Order: 2

Body:
<h1>Meet Our Team</h1>
<p>The Census 2026 is led by a dedicated team of professionals.</p>
<h2>Census Leadership</h2>
<ul>
<li>Director General - Tshering Dorji</li>
<li>Deputy Director - Karma Wangmo</li>
</ul>
```

### Page 4: Birth Registration (Under "Services")

```
Title: Birth Registration Service
Slug: birth-registration
Nav Link: Services
Featured Image: None
Status: Published
Order: 1

Body:
<h1>Birth Registration</h1>
<p>Register your newborn and obtain a birth certificate online.</p>
<h2>Required Documents</h2>
<ul>
<li>Hospital birth certificate</li>
<li>Parents' CID cards</li>
</ul>
```

### Page 5: FAQs (Under "Help & Support")

```
Title: Frequently Asked Questions
Slug: faqs
Nav Link: Help & Support
Featured Image: None
Status: Published
Order: 1

Body:
<h1>Frequently Asked Questions</h1>
<h2>General Questions</h2>
<p><strong>Q: Who needs to participate in the census?</strong><br>A: All residents of Bhutan, including citizens and legal residents.</p>
<p><strong>Q: Is census participation mandatory?</strong><br>A: Yes, it is required by law.</p>
```

---

## 🚀 Quick Testing Flow

1. **Start Services**

   ```bash
   # Terminal 1: Admin Portal
   cd admin-portal
   npm run dev

   # Terminal 2: Common Service
   cd common_service
   npm run start:dev

   # Terminal 3: Auth Service
   cd auth_service
   npm run start:dev
   ```

2. **Login to Admin Portal**

   - Go to: `http://localhost:3000`
   - Login with your admin credentials

3. **Create Navigation** (in order)

   - Go to: `/dashboard/content/navigation`
   - Click "Add Navigation Item"
   - Create "About Us", "Services", "Help & Support"

4. **Create Content Pages** (in order)

   - Go to: `/dashboard/content/pages`
   - Click "Add Page"
   - Create all 5 pages above
   - Use copy-paste from above!

5. **Verify**
   - Check `/dashboard/content/navigation` → View Sub-Links
   - Check `/dashboard/content/pages` → See all pages
   - Edit a page → Change status → Save
   - Delete a test page → Confirm deletion

---

## ✅ Expected Results

**Navigation Page Should Show:**

```
About Us          (2 sub-links)
Services          (1 sub-link)
Help & Support    (1 sub-link)
```

**Content Pages Should Show:**

```
5 total pages
- 2 pages under "About Us"
- 1 page under "Services"
- 1 page under "Help & Support"
- 1 standalone page (Privacy Policy)
```

---

## 🎯 Test Checklist

- [ ] Created 3 navigation items ✓
- [ ] Created 5 content pages ✓
- [ ] Pages with nav links show correctly ✓
- [ ] Standalone pages work ✓
- [ ] Can edit pages ✓
- [ ] Can change status ✓
- [ ] Can delete pages ✓
- [ ] No foreign key errors ✓

🎉 **All tests passing? You're good to go!**
