# Sweet Box Website

עיצוב חדש של אתר sweetbox.co.il — American Bakeshop בתל אביב.

🌐 **Live preview:** https://guysho1.github.io/sweetbox-website/

## הדפים בפרויקט

| קובץ | מטרה |
|---|---|
| `index.html` | דף הבית — Hero typewriter, גריד מארזים (כקרוסלה), סניפים, ביקורות, זכיינות, פוטר |
| `product-bestseller.html` | תבנית דף מוצר — Gallery, כפתורי קנייה, סטורי, related products |
| `franchise.html` | דף נחיתה לזכיינות — Hero, Stats, Features, Process, Contact form |

## טכנולוגיה

- **HTML/CSS/JS טהור** — אין framework, אין build step
- **Hebrew RTL** מלא
- **רספונסיבי** — מובייל (≤700px) ודסקטופ
- **Google Fonts:** Playfair Display (display), Cormorant Garamond (italic), Frank Ruhl Libre (Hebrew body)

## פלטת צבעים

| שם | HEX | שימוש |
|---|---|---|
| Powder Blue | `#A1D9FA` | צבע מותג ראשי (הקופסא) |
| Deep Blue | `#7BBCD6` | אקסנטים, hovers |
| Soft Blue | `#EBF6FE` | רקעי סקציות |
| Cream | `#F4EFE6` | רקעים חמים |
| Warm Brown | `#554B41` | טקסט גוף, אקסנטים |
| Ink | `#0F0F0F` | טקסט כותרות |
| Paper | `#FAFAFA` | רקע כללי |

## מבנה הקבצים

הקבצים כיום במבנה שטוח (כל הקבצים בתיקייה הראשית):

```
sweetbox-website/
├── index.html
├── product-bestseller.html
├── franchise.html
├── logo-sweetbox.png
├── box-bestseller.jpg, box-cheesy.jpg, ... (כל תמונות הקופסאות)
├── item-1-brownie-bites.jpg, ... (פריטי מארז Best Seller)
├── seal-est-2019.png, seal-made-with-care.png, ...
├── icon-bow.png, icon-oven.png, ... (איקונים)
├── pattern-boxes.png, divider-ribbon.png, ... (דקורציה)
└── branch-glilot.jpg, branch-levinsky.jpg
```

המפתח יכול לארגן מחדש לתיקיית `/assets/` אם רוצה — צריך לעדכן גם את כל ה-`src` ב-HTML בהתאם.

## אינטראקטיביות

### דף הבית (`index.html`)
- **טייפרייטר** מסקריפט בתחתית — מסובב 8 תיאורי מוצרים
- **קרוסלת מארזים** — `carouselScroll(direction)` עם כפתורי חצים
- **חץ scroll-down** — אנימציה bounce

### דף מוצר (`product-bestseller.html`)
- **גלריה** — 7 thumbnails (כל תמונה לחיצה מחליפה את הראשית עם fade)
- **מונה כמות** — `changeQty(delta)` כפתורי +/-
- **כרטיס ברכה** — checkbox שמראה/מסתיר שדות
- **קרוסלת "You Might Also Like"** — `relatedScroll(direction)`

### דף זכיינות (`franchise.html`)
- **טופס Contact** — שולח ל-`shop@sweetbox.co.il` (mailto)

## הערות למפתח

### לחיבור WooCommerce/WordPress
- כל ה-CSS inline ב-`<style>` — אפשר להוציא ל-`style.css` חיצוני
- ה-JS inline — אפשר להוציא ל-`script.js`
- תמונות מוצר — להחליף בשדות תמונה דינמיים של WooCommerce
- מחיר ו-Add to Cart — לחבר ל-WooCommerce variables (`get_price()`, `single_add_to_cart_button()`)
- טופס יצירת קשר — לחבר ל-Contact Form 7 או WPForms

### תוויות שמורות לדפים עתידיים
- `bulk-orders.html` — דף "הזמנות מרוכזות" (טרם נבנה, מקושר בנב העליון)
- דפי מוצר נוספים — להעתיק את `product-bestseller.html` ולעדכן תמונות+תיאור

### תאימות וגישה
- מובייל ראשון — `@media (max-width: 700px)` ו-600px
- אין שימוש ב-localStorage או cookies
- RTL מלא — `dir="rtl"` ב-`<html>`

## פרטי קשר B2B
- **שי יוכלמן** — 054-343-4344
- **mail:** shop@sweetbox.co.il
- **סניפים:** לוינסקי 46 ת"א · ביג פאשן גלילות (פתוח בשבת)
- **מפעל:** החלוצים 6 ת"א — כשר חלבי, הרבנות הראשית ת"א-יפו

---

נוצר: מאי 2026 · עיצוב + פיתוח: גיא + Cowork
