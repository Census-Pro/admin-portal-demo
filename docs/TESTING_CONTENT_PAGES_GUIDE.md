# Complete Testing Guide: Navigation & Content Pages

## 🚀 Quick Start

### Prerequisites

✅ Services running:

- Admin Portal: `http://localhost:3000`
- Common Service: `http://localhost:5003`
- Auth Service: `http://localhost:5001`

✅ Logged into admin portal

---

## 📋 Step-by-Step Testing Guide

### STEP 1: Create Navigation Items (Parent Menu Items)

Go to: `http://localhost:3000/dashboard/content/navigation`

#### Navigation Item #1: About Us

```json
{
  "label": "About Us",
  "url": "/about",
  "icon": "info",
  "message": "Learn more about Census 2026",
  "status": "active",
  "order": 1
}
```

**How to fill the form:**

- **Menu Label**: `About Us`
- **URL**: `/about`
- **Icon**: `info`
- **Message**: `Learn more about Census 2026`
- **Order**: `1`
- **Status**: `active`

---

#### Navigation Item #2: Services

```json
{
  "label": "Services",
  "url": "/services",
  "icon": "apps",
  "message": "Explore our services",
  "status": "active",
  "order": 2
}
```

**How to fill the form:**

- **Menu Label**: `Services`
- **URL**: `/services`
- **Icon**: `apps`
- **Message**: `Explore our services`
- **Order**: `2`
- **Status**: `active`

---

#### Navigation Item #3: Resources

```json
{
  "label": "Resources",
  "url": "/resources",
  "icon": "book",
  "message": "Download forms and documents",
  "status": "active",
  "order": 3
}
```

**How to fill the form:**

- **Menu Label**: `Resources`
- **URL**: `/resources`
- **Icon**: `book`
- **Message**: `Download forms and documents`
- **Order**: `3`
- **Status**: `active`

---

#### Navigation Item #4: Help & Support

```json
{
  "label": "Help & Support",
  "url": "/help",
  "icon": "help",
  "message": "Get assistance and support",
  "status": "active",
  "order": 4
}
```

**How to fill the form:**

- **Menu Label**: `Help & Support`
- **URL**: `/help`
- **Icon**: `help`
- **Message**: `Get assistance and support`
- **Order**: `4`
- **Status**: `active`

---

### STEP 2: Upload Featured Images (Optional)

Go to: `http://localhost:3000/dashboard/content/media`

Upload some sample images for featured images:

- `privacy-policy-banner.jpg`
- `terms-banner.jpg`
- `about-us-banner.jpg`
- `contact-us-banner.jpg`

**How to upload:**

1. Click "Upload Media"
2. Choose file
3. Select category: `media`
4. Click "Upload"

---

### STEP 3: Create Content Pages (Sub-Links)

There are **TWO WAYS** to create content pages:

#### **Option A: Via Navigation Page (Recommended)**

1. Go to: `http://localhost:3000/dashboard/content/navigation`
2. Find the "About Us" navigation item
3. Click **"View Sub-Links"** button
4. In the Sub-Links dialog, click **"Add Sub-Link"** button
5. This opens the **"Add Page"** modal ✅ (This is correct!)
6. Fill in the content page form (Nav Link will be pre-filled with "About Us")

#### **Option B: Via Content Pages Directly**

1. Go to: `http://localhost:3000/dashboard/content/pages`
2. Click **"Add Page"** button
3. Fill in the form and manually select "About Us" from the **Nav Link** dropdown

---

**For this guide, we'll use Option A (via Navigation Page)**

Go to: `http://localhost:3000/dashboard/content/navigation`

---

#### Content Page #1: Privacy Policy (Standalone - No Nav Link)

**⚠️ Note:** For standalone pages without a navigation link, use **Option B** (go to `/dashboard/content/pages` directly)

Go to: `http://localhost:3000/dashboard/content/pages`

```json
{
  "title": "Privacy Policy - Census 2026",
  "slug": "privacy-policy",
  "body": "<h1>Privacy Policy</h1><p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information during the Census 2026.</p><h2>Information We Collect</h2><ul><li>Name and contact details</li><li>Address information</li><li>Demographic data</li><li>Household information</li></ul><h2>How We Use Your Information</h2><p>We use your information solely for census purposes and statistical analysis. Your data is protected and will never be shared with unauthorized parties.</p><h2>Data Security</h2><p>We employ industry-standard security measures to protect your information.</p>",
  "featured_image_id": null,
  "cms_navigation_id": null,
  "status": "published",
  "order": 1
}
```

**How to fill the form:**

- **Title**: `Privacy Policy - Census 2026`
- **Slug**: `privacy-policy`
- **Body Content**: (Use the rich text editor to add the content above)
- **Featured Image**: `None`
- **Nav Link**: `None`
- **Order**: `1`
- **Status**: `Published`

---

#### Content Page #2: About Census 2026 (Under "About Us" Navigation)

**📍 Location:** Go to `/dashboard/content/navigation`

- Find "About Us" → Click **"View Sub-Links"** → Click **"Add Sub-Link"**
- This opens the **Add Page modal** ✅

In the modal that opens, fill:

```json
{
  "title": "About Census 2026",
  "slug": "about-census-2026",
  "body": "<h1>About Census 2026</h1><p>Welcome to the Census 2026 official portal. The census is a comprehensive count of Bhutan's population conducted every 10 years.</p><h2>Why is the Census Important?</h2><ul><li>Helps government plan for the future</li><li>Determines resource allocation</li><li>Shapes policy decisions</li><li>Provides crucial demographic data</li></ul><h2>Our Mission</h2><p>To collect accurate, comprehensive, and timely population data that will guide Bhutan's development for the next decade.</p><h2>Key Dates</h2><ul><li>Registration Opens: April 1, 2026</li><li>Census Day: May 15, 2026</li><li>Registration Closes: June 30, 2026</li></ul>",
  "featured_image_id": "SELECT_FROM_DROPDOWN",
  "cms_navigation_id": "SELECT_ABOUT_US_FROM_DROPDOWN",
  "status": "published",
  "order": 1
}
```

**How to fill the form:**

- **Title**: `About Census 2026`
- **Slug**: `about-census-2026`
- **Body Content**: (Copy the HTML above into the editor)
- **Featured Image**: Select an uploaded image (or None)
- **Nav Link**: Select `About Us`
- **Order**: `1`
- **Status**: `Published`

---

#### Content Page #3: Our Team (Under "About Us" Navigation)

**📍 Location:** Still in `/dashboard/content/navigation`

- Find "About Us" → Click **"View Sub-Links"** → Click **"Add Sub-Link"** again
- Fill the modal:

```json
{
  "title": "Our Team",
  "slug": "our-team",
  "body": "<h1>Meet Our Team</h1><p>The Census 2026 is led by a dedicated team of professionals committed to ensuring accurate data collection.</p><h2>Census Leadership</h2><ul><li><strong>Director General</strong> - Tshering Dorji</li><li><strong>Deputy Director</strong> - Karma Wangmo</li><li><strong>IT Head</strong> - Sonam Choden</li></ul><h2>Field Operations</h2><p>Our team includes over 500 trained enumerators across all 20 dzongkhags.</p><h2>Contact Us</h2><p>For inquiries, email: info@census2026.gov.bt</p>",
  "featured_image_id": null,
  "cms_navigation_id": "SELECT_ABOUT_US_FROM_DROPDOWN",
  "status": "published",
  "order": 2
}
```

**How to fill the form:**

- **Title**: `Our Team`
- **Slug**: `our-team`
- **Body Content**: (Use the rich text editor)
- **Featured Image**: `None`
- **Nav Link**: Select `About Us`
- **Order**: `2`
- **Status**: `Published`

---

#### Content Page #4: Birth Registration (Under "Services" Navigation)

```json
{
  "title": "Birth Registration Service",
  "slug": "birth-registration",
  "body": "<h1>Birth Registration</h1><p>Register your newborn and obtain a birth certificate online.</p><h2>Required Documents</h2><ul><li>Hospital birth certificate</li><li>Parents' CID cards</li><li>Marriage certificate (if applicable)</li></ul><h2>How to Apply</h2><ol><li>Log in to the portal</li><li>Navigate to Birth Registration</li><li>Fill in the required details</li><li>Upload supporting documents</li><li>Submit application</li></ol><h2>Processing Time</h2><p>Birth certificates are typically issued within 7 working days.</p><h2>Fees</h2><p>Registration: Free<br>Certificate issuance: Nu. 50</p>",
  "featured_image_id": null,
  "cms_navigation_id": "SELECT_SERVICES_FROM_DROPDOWN",
  "status": "published",
  "order": 1
}
```

**How to fill the form:**

- **Title**: `Birth Registration Service`
- **Slug**: `birth-registration`
- **Body Content**: (HTML above)
- **Featured Image**: `None`
- **Nav Link**: Select `Services`
- **Order**: `1`
- **Status**: `Published`

---

#### Content Page #5: Death Registration (Under "Services" Navigation)

```json
{
  "title": "Death Registration Service",
  "slug": "death-registration",
  "body": "<h1>Death Registration</h1><p>Report a death and obtain a death certificate.</p><h2>Required Documents</h2><ul><li>Medical certificate of death</li><li>Deceased's CID card</li><li>Reporter's CID card</li><li>Relationship proof</li></ul><h2>Who Can Apply</h2><ul><li>Immediate family members</li><li>Legal representatives</li><li>Hospital authorities</li></ul><h2>Procedure</h2><ol><li>Report death within 24 hours</li><li>Submit online application</li><li>Upload required documents</li><li>Await verification</li><li>Collect certificate</li></ol><h2>Important Note</h2><p>Death must be registered within 7 days as per the law.</p>",
  "featured_image_id": null,
  "cms_navigation_id": "SELECT_SERVICES_FROM_DROPDOWN",
  "status": "published",
  "order": 2
}
```

**How to fill the form:**

- **Title**: `Death Registration Service`
- **Slug**: `death-registration`
- **Body Content**: (HTML above)
- **Featured Image**: `None`
- **Nav Link**: Select `Services`
- **Order**: `2`
- **Status**: `Published`

---

#### Content Page #6: Terms and Conditions

```json
{
  "title": "Terms and Conditions",
  "slug": "terms-and-conditions",
  "body": "<h1>Terms and Conditions</h1><p>Please read these terms carefully before using the Census 2026 portal.</p><h2>Acceptance of Terms</h2><p>By accessing this portal, you agree to be bound by these terms and conditions.</p><h2>User Responsibilities</h2><ul><li>Provide accurate information</li><li>Maintain confidentiality of login credentials</li><li>Use the portal for lawful purposes only</li><li>Respect intellectual property rights</li></ul><h2>Data Accuracy</h2><p>Users are responsible for ensuring all submitted data is accurate and truthful. False information may result in legal consequences.</p><h2>Privacy</h2><p>Please refer to our Privacy Policy for details on how we handle your data.</p><h2>Modifications</h2><p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of updated terms.</p>",
  "featured_image_id": null,
  "cms_navigation_id": null,
  "status": "published",
  "order": 2
}
```

**How to fill the form:**

- **Title**: `Terms and Conditions`
- **Slug**: `terms-and-conditions`
- **Body Content**: (HTML above)
- **Featured Image**: `None`
- **Nav Link**: `None` (standalone page)
- **Order**: `2`
- **Status**: `Published`

---

#### Content Page #7: FAQs (Under "Help & Support" Navigation)

```json
{
  "title": "Frequently Asked Questions",
  "slug": "faqs",
  "body": "<h1>Frequently Asked Questions</h1><h2>General Questions</h2><p><strong>Q: Who needs to participate in the census?</strong><br>A: All residents of Bhutan, including citizens and legal residents.</p><p><strong>Q: Is census participation mandatory?</strong><br>A: Yes, it is required by law.</p><p><strong>Q: How long does it take to complete?</strong><br>A: Approximately 15-20 minutes per household.</p><h2>Registration Questions</h2><p><strong>Q: Can I register online?</strong><br>A: Yes, online registration is available through this portal.</p><p><strong>Q: What if I don't have internet access?</strong><br>A: Visit your nearest census office for assistance.</p><h2>Privacy & Security</h2><p><strong>Q: Is my data safe?</strong><br>A: Yes, we use industry-standard encryption and security measures.</p><p><strong>Q: Who can access my information?</strong><br>A: Only authorized census officials have access to individual data.</p>",
  "featured_image_id": null,
  "cms_navigation_id": "SELECT_HELP_SUPPORT_FROM_DROPDOWN",
  "status": "published",
  "order": 1
}
```

**How to fill the form:**

- **Title**: `Frequently Asked Questions`
- **Slug**: `faqs`
- **Body Content**: (HTML above)
- **Featured Image**: `None`
- **Nav Link**: Select `Help & Support`
- **Order**: `1`
- **Status**: `Published`

---

#### Content Page #8: Contact Us (Under "Help & Support" Navigation)

```json
{
  "title": "Contact Us",
  "slug": "contact-us",
  "body": "<h1>Contact Us</h1><p>Need help? We're here to assist you.</p><h2>Office Address</h2><p>Census Office<br>Department of Civil Registration & Census<br>Ministry of Home Affairs<br>Thimphu, Bhutan</p><h2>Contact Information</h2><ul><li><strong>Phone:</strong> +975 2 123456</li><li><strong>Toll-Free:</strong> 1800-CENSUS (236787)</li><li><strong>Email:</strong> info@census2026.gov.bt</li><li><strong>Support Email:</strong> support@census2026.gov.bt</li></ul><h2>Office Hours</h2><p>Monday - Friday: 9:00 AM - 5:00 PM<br>Saturday: 9:00 AM - 1:00 PM<br>Sunday & Public Holidays: Closed</p><h2>Regional Offices</h2><p>For dzongkhag-specific inquiries, contact your local census office.</p>",
  "featured_image_id": null,
  "cms_navigation_id": "SELECT_HELP_SUPPORT_FROM_DROPDOWN",
  "status": "published",
  "order": 2
}
```

**How to fill the form:**

- **Title**: `Contact Us`
- **Slug**: `contact-us`
- **Body Content**: (HTML above)
- **Featured Image**: `None`
- **Nav Link**: Select `Help & Support`
- **Order**: `2`
- **Status**: `Published`

---

## 🧪 Test Scenarios

### Test 1: Create Page Without Navigation Link ✅

- **Page**: Privacy Policy
- **Expected**: Should save successfully with `cms_navigation_id: null`

### Test 2: Create Page With Navigation Link ✅

- **Page**: About Census 2026 (under "About Us")
- **Expected**: Should save successfully and appear as sub-link

### Test 3: Create Multiple Pages Under Same Navigation ✅

- **Pages**: Our Team, About Census 2026 (both under "About Us")
- **Expected**: Both should appear as sub-links in correct order

### Test 4: Toggle Page Status ✅

- **Action**: Change page from Published to Draft
- **Expected**: Status should update successfully

### Test 5: Edit Page and Remove Navigation Link ✅

- **Action**: Edit "About Census 2026", set Nav Link to "None"
- **Expected**: Should save successfully, page becomes standalone

### Test 6: Delete Page ✅

- **Action**: Delete a test page
- **Expected**: Page should be removed from list

---

## 📊 Expected Result Structure

After creating all pages, you should see:

```
Navigation Structure:
├── About Us
│   ├── About Census 2026
│   └── Our Team
├── Services
│   ├── Birth Registration Service
│   └── Death Registration Service
├── Resources
│   (no sub-pages yet)
└── Help & Support
    ├── Frequently Asked Questions
    └── Contact Us

Standalone Pages:
├── Privacy Policy
└── Terms and Conditions
```

---

## 🔍 Verification Steps

### 1. Check Navigation Page

Go to: `/dashboard/content/navigation`

- Should see 4 navigation items
- Click "View Sub-Links" on any to see associated content pages

### 2. Check Content Pages List

Go to: `/dashboard/content/pages`

- Should see all 8 content pages
- Verify titles, slugs, and statuses
- Check which pages have navigation links

### 3. Check Browser Console

Open DevTools → Console
Look for logs:

```
[createCmsPage] Payload: { ... }
[createCmsPage] Success
```

### 4. Check Database (Optional)

```sql
-- View all navigation items
SELECT id, label, "order", status FROM cm_navigation ORDER BY "order";

-- View all content pages
SELECT id, title, slug, status, cms_navigation_id FROM cm_content ORDER BY "order";

-- View pages with their navigation links
SELECT
  cp.title as page_title,
  cn.label as nav_label
FROM cm_content cp
LEFT JOIN cm_navigation cn ON cp.cms_navigation_id = cn.id;
```

---

## 🎨 Rich Text Editor Tips

When filling the "Body Content":

### Add Headings

Use the toolbar → Select text → Choose H1, H2, H3

### Add Lists

- Click the bullet list icon for unordered lists
- Click the numbered list icon for ordered lists

### Format Text

- **Bold**: Select text → Click B
- _Italic_: Select text → Click I
- Underline: Select text → Click U

### Add Links

1. Select text
2. Click link icon
3. Enter URL
4. Click Apply

---

## 🐛 Troubleshooting

### Error: "Navigation item does not exist"

**Solution**:

1. Go to `/dashboard/content/navigation`
2. Create navigation items first
3. Refresh the content pages form
4. Try again

### Error: "Featured image does not exist"

**Solution**:

1. Go to `/dashboard/content/media`
2. Upload images first
3. Refresh the content pages form
4. Try again

### Page not saving

**Check**:

- Title is not empty
- Slug is not empty
- Slug doesn't contain spaces (use hyphens)
- Status is selected
- Order is a positive number

---

## 📝 Quick Copy-Paste Data

### Simple Test Page

```
Title: Test Page
Slug: test-page
Body: <h1>Test Page</h1><p>This is a test page.</p>
Status: Published
Order: 1
Nav Link: None
Featured Image: None
```

---

## ✅ Success Checklist

- [ ] Created 4 navigation items
- [ ] Uploaded at least 1 media file (optional)
- [ ] Created 8 content pages
- [ ] At least 2 pages under "About Us"
- [ ] At least 2 pages under "Services"
- [ ] At least 2 pages under "Help & Support"
- [ ] At least 1 standalone page (no nav link)
- [ ] Verified all pages appear correctly
- [ ] Tested editing a page
- [ ] Tested toggling page status
- [ ] Tested deleting a page

🎉 **If all checked, your CMS integration is working perfectly!**
