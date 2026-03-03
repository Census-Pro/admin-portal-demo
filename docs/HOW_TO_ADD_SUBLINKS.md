# Quick Answer: How to Add Sub-Links

## Yes, That's Correct! ✅

When you click **"Add Sub-Link"**, it opens the **"Add Page"** modal. This is the **intended behavior**.

## Why?

Because **sub-links ARE content pages**. You're creating a page that will appear under a navigation item.

---

## Quick Steps to Add a Sub-Link

### 1. Go to Navigation Page

```
http://localhost:3000/dashboard/content/navigation
```

### 2. Find Your Navigation Item

Look for "About Us" in the table

### 3. Click "View Sub-Links"

Button on the right side of the row

### 4. Click "Add Sub-Link"

In the dialog that opens

### 5. Fill the "Add Page" Form

```
✓ Title: About Census 2026
✓ Slug: about-census-2026
✓ Body: <h1>About Census 2026</h1><p>Welcome...</p>
✓ Nav Link: About Us (already selected! ✓)
✓ Status: Published
✓ Order: 1
```

### 6. Click Save

Done! Your sub-link is created.

---

## The Key Thing to Understand

```
Navigation Item (Parent)     Content Page (Sub-Link)
        ↓                            ↓
    "About Us"              "About Census 2026"
    (just a label)          (full page content)
                                     ↑
                            This is what you're creating
                            when you click "Add Sub-Link"
```

---

## Two Methods Summary

**Method 1: Via Navigation Page (Easier)**

- Nav Link is **pre-filled** for you
- Navigation → View Sub-Links → Add Sub-Link → Fill form

**Method 2: Via Content Pages (Manual)**

- You **manually select** the Nav Link
- Content Pages → Add Page → Select Nav Link → Fill form

---

## 🎯 Bottom Line

**The modal you're seeing is 100% correct!**

Just fill it out like a normal content page. The "Nav Link" field will be pre-selected with the parent navigation item you clicked from.

---

For detailed visual guide, see: `NAVIGATION_SUBLINKS_VISUAL_GUIDE.md`
