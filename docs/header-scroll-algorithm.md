# 📚 Document: Auto-Hide Header Scroll Algorithm

## 📋 Mục lục

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc tổng thể](#kiến-trúc-tổng-thể)
3. [Chi tiết từng thành phần](#chi-tiết-từng-thành-phần)
4. [Flow Chart & Timeline](#flow-chart--timeline)
5. [Performance Optimization](#performance-optimization)
6. [Ví dụ minh họa](#ví-dụ-minh-họa)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

### Mục đích

Tạo header thông minh tự động ẩn/hiện dựa trên hành vi scroll của user:

- ✅ **Luôn hiển thị** khi ở đầu trang (transparent)
- ✅ **Tự động ẩn** khi scroll xuống để tối đa hóa không gian đọc
- ✅ **Tự động hiện** khi scroll lên để dễ dàng truy cập navigation
- ✅ **Mượt mà, không lag** nhờ tối ưu performance

### Công nghệ sử dụng

- **Vue 3 Composition API** - Reactive state management
- **requestAnimationFrame** - Throttling & performance optimization
- **CSS Transform** - Smooth animations
- **Window Scroll Event** - Tracking scroll behavior

---

## 🏗️ Kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                      User scrolls page                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   window.scroll event       │
        │   (fires 100+ times/sec)    │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │      onScroll()             │
        │   - Check ticking flag      │
        │   - Request animation frame │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  requestAnimationFrame      │
        │   (max 60 calls/sec)        │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │    handleScroll()           │
        │   - Calculate position      │
        │   - Determine direction     │
        │   - Update visibility state │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   Vue Reactive Update       │
        │   - isHeaderVisible changes │
        │   - Trigger re-render       │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   CSS Class Binding         │
        │   :class="{ 'header-hidden' │
        │      : !isHeaderVisible }"  │
        └─────────────┬───────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   CSS Transition            │
        │   transform: translateY()   │
        │   (0.3s smooth animation)   │
        └─────────────────────────────┘
```

---

## 🔍 Chi tiết từng thành phần

### 1. **State Variables (Biến trạng thái)**

#### 📌 `isHeaderVisible` - Ref<boolean>

```typescript
const isHeaderVisible = ref(true);
```

**Công dụng:**

- Điều khiển việc ẩn/hiện header
- Binding vào CSS class `header-hidden`
- Default `true` vì header luôn hiện khi load trang

**Tại sao dùng `ref`?**

- Cần **reactive** để Vue tự động re-render khi giá trị thay đổi
- Giá trị primitive (boolean) → phải dùng `ref` thay vì `reactive`

**Life cycle:**

```
Page Load → true (hiện)
   ↓
Scroll down 100px → false (ẩn)
   ↓
Scroll up → true (hiện)
   ↓
Back to top → true (hiện + transparent)
```

---

#### 📌 `isScrolled` - Ref<boolean>

```typescript
const isScrolled = ref(false);
```

**Công dụng:**

- Phân biệt 2 trạng thái design của header:
    - `false` → Header **transparent** với blur nhẹ (ở đầu trang)
    - `true` → Header **solid background** với shadow (đã scroll)
- Binding vào CSS class `is-scrolled`

**Tại sao cần biến riêng?**

- `isHeaderVisible` chỉ xử lý ẩn/hiện (transform)
- `isScrolled` xử lý visual style (background, shadow)
- 2 concerns khác nhau → tách biệt để dễ maintain

**Ví dụ:**

```typescript
// Đầu trang (0-10px)
isScrolled = false; // → transparent background
isHeaderVisible = true; // → header hiện

// Scroll xuống (> 100px)
isScrolled = true; // → solid background
isHeaderVisible = false; // → header ẩn

// Scroll lên (80px)
isScrolled = true; // → vẫn solid (chưa về đầu)
isHeaderVisible = true; // → header hiện lại
```

---

#### 📌 `lastScrollY` - let number

```typescript
let lastScrollY = 0;
```

**Công dụng:**

- Lưu vị trí scroll **trước đó** để so sánh với vị trí hiện tại
- Xác định **hướng scroll** (lên/xuống)

**Tại sao không dùng `ref`?**

- Không cần reactive vì không bind vào template
- Chỉ dùng nội bộ trong logic tính toán
- Tránh overhead của Vue reactivity system

**Cách hoạt động:**

```typescript
// Frame 1
lastScrollY = 0
currentScrollY = 50
→ 50 > 0 → Scroll DOWN

// Frame 2
lastScrollY = 50  // ← Cập nhật từ frame trước
currentScrollY = 80
→ 80 > 50 → Vẫn scroll DOWN

// Frame 3
lastScrollY = 80
currentScrollY = 60
→ 60 < 80 → Scroll UP!
```

---

#### 📌 `ticking` - let boolean

```typescript
let ticking = false;
```

**Công dụng:**

- **Cờ bảo vệ** (guard flag) ngăn chặn đăng ký nhiều animation frame cùng lúc
- Implement throttling pattern cho performance

**Tại sao cần?**

```typescript
// ❌ KHÔNG có ticking - Vấn đề
window.addEventListener('scroll', () => {
    requestAnimationFrame(handleScroll);
});
// Scroll event fire 200 lần trong 1 giây
// → 200 animation frames được đăng ký!
// → Tốn CPU, chạy duplicate logic

// ✅ CÓ ticking - Giải pháp
window.addEventListener('scroll', () => {
    if (!ticking) {
        // ← Kiểm tra trước
        requestAnimationFrame(handleScroll);
        ticking = true; // ← Khóa lại
    }
    // Scroll tiếp tục fire nhưng bị ignore
});
```

**Life cycle của `ticking`:**

```
Scroll event 1 → ticking = false
                → Request frame
                → ticking = true  ← LOCK

Scroll event 2 → ticking = true → SKIP
Scroll event 3 → ticking = true → SKIP
Scroll event 4 → ticking = true → SKIP
...

Frame execute → handleScroll()
              → ticking = false  ← UNLOCK

Scroll event 5 → ticking = false → Request frame lại
```

**Tại sao không dùng `ref`?**

- Không cần reactive (không hiển thị trên UI)
- Chỉ dùng cho internal logic control
- Primitive boolean đơn giản, không cần Vue tracking

---

### 2. **Event Listener - `onScroll()`**

```typescript
const onScroll = () => {
    if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
    }
};
```

#### **Vai trò:** Gatekeeper

- Nhận **tất cả** scroll events (100+ lần/giây)
- Lọc và chỉ cho phép **1 frame** được xử lý tại một thời điểm
- Chuyển tiếp công việc cho `requestAnimationFrame`

#### **Tại sao không gọi `handleScroll()` trực tiếp?**

```typescript
// ❌ BAD - Main thread bị block
window.addEventListener('scroll', handleScroll);
// Mỗi scroll event → chạy ngay
// → UI lag vì main thread busy

// ✅ GOOD - Sync với browser paint cycle
window.addEventListener('scroll', onScroll);
const onScroll = () => {
    requestAnimationFrame(handleScroll);
};
// Scroll event → Schedule for next frame
// → Browser tự động optimize timing
// → Smooth 60fps
```

#### **Giải thích `requestAnimationFrame`:**

**Browser Paint Cycle:**

```
Frame 1 (16.67ms)
├─ JavaScript execution
├─ Style calculation
├─ Layout
├─ Paint
└─ Composite

Frame 2 (16.67ms)
├─ JavaScript execution  ← requestAnimationFrame runs here
├─ ...
```

**Ưu điểm:**

- ✅ Sync với monitor refresh rate (60Hz/120Hz)
- ✅ Auto pause khi tab inactive (tiết kiệm battery)
- ✅ Batch multiple changes → 1 repaint
- ✅ Prevents layout thrashing

---

### 3. **Main Logic - `handleScroll()`**

```typescript
const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // CASE 1: Top of page
    if (currentScrollY < 10) {
        isHeaderVisible.value = true;
        isScrolled.value = false;
    }
    // CASE 2: Scrolled away from top
    else {
        isScrolled.value = true;

        // CASE 2A: Scrolling DOWN past threshold
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            isHeaderVisible.value = false;
        }
        // CASE 2B: Scrolling UP
        else if (currentScrollY < lastScrollY) {
            isHeaderVisible.value = true;
        }
    }

    lastScrollY = currentScrollY;
    ticking = false;
};
```

#### **Step-by-Step Breakdown:**

---

#### **STEP 1: Lấy vị trí scroll hiện tại**

```typescript
const currentScrollY = window.scrollY;
```

**`window.scrollY` là gì?**

- Khoảng cách (px) từ top của document đến viewport hiện tại
- Read-only property
- Type: `number`

**Ví dụ:**

```
┌─────────────────┐  ← scrollY = 0 (top)
│   Viewport      │
│   (visible)     │
└─────────────────┘
│   Content       │
│   (hidden       │  ← scrollY = 200
│    below)       │
│                 │
└─────────────────┘  ← scrollY = 500 (bottom)
```

---

#### **STEP 2: CASE 1 - Ở đầu trang (< 10px)**

```typescript
if (currentScrollY < 10) {
    isHeaderVisible.value = true;
    isScrolled.value = false;
}
```

**Tại sao threshold là 10px?**

- Cho phép **một chút tolerance** (không quá strict)
- User có thể scroll nhẹ (1-9px) mà không trigger state change
- Tránh **flickering** khi scroll rất nhỏ

**Tại sao set cả 2 state?**

```typescript
isHeaderVisible = true; // Header phải hiện
isScrolled = false; // Reset về transparent style
```

**Visual result:**

```css
/* isScrolled = false */
.app-header {
    background: transparent;
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

#### **STEP 3: CASE 2 - Đã scroll khỏi đầu trang (>= 10px)**

```typescript
else {
    isScrolled.value = true;
    // ... more logic
}
```

**Tại sao set `isScrolled = true` ngay?**

- Không quan tâm scroll lên hay xuống
- Chỉ cần **không ở top** → apply solid background style

**Visual result:**

```css
/* isScrolled = true */
.app-header.is-scrolled {
    background: rgba(10, 14, 20, 0.92); /* Solid */
    box-shadow: 0 6px 24px -8px rgba(0, 0, 0, 0.55);
    border-color: rgba(255, 255, 255, 0.08);
}
```

---

#### **STEP 4: CASE 2A - Scroll xuống (past 100px)**

```typescript
if (currentScrollY > lastScrollY && currentScrollY > 100) {
    isHeaderVisible.value = false;
}
```

**Phân tích điều kiện:**

**Điều kiện 1: `currentScrollY > lastScrollY`**

```
lastScrollY = 150
currentScrollY = 180
→ 180 > 150 ✅ → Scroll DOWN
```

**Điều kiện 2: `currentScrollY > 100`**

- Threshold để **tránh ẩn header quá sớm**
- User cần scroll đủ xa (> 100px) trước khi header ẩn

**Tại sao cần 2 điều kiện?**

```typescript
// Scenario 1: Scroll từ 50 → 80px
currentScrollY (80) > lastScrollY (50) ✅  // Scroll down
currentScrollY (80) > 100 ❌                // Chưa đủ xa
→ Header VẪN HIỆN (không ẩn quá sớm)

// Scenario 2: Scroll từ 120 → 180px
currentScrollY (180) > lastScrollY (120) ✅  // Scroll down
currentScrollY (180) > 100 ✅                // Đủ xa rồi
→ Header ẨN
```

**UX Reasoning:**

- 0-100px: Zone đọc title/hero section → Cần header hiện
- > 100px: Đọc content chính → Ẩn header để tối đa không gian

---

#### **STEP 5: CASE 2B - Scroll lên**

```typescript
else if (currentScrollY < lastScrollY) {
    isHeaderVisible.value = true;
}
```

**Điều kiện:**

```typescript
currentScrollY < lastScrollY; // Vị trí mới < vị trí cũ
```

**Ví dụ:**

```
lastScrollY = 200
currentScrollY = 180
→ 180 < 200 ✅ → Scroll UP
→ User muốn quay lại → Hiện header
```

**Tại sao không có threshold?**

- Scroll lên → User đang tìm navigation
- Cần **phản hồi ngay lập tức**
- Không delay → Better UX

**So sánh:**

```typescript
// Scroll DOWN → Cần threshold
if (currentScrollY > lastScrollY && currentScrollY > 100)

// Scroll UP → Không cần threshold
if (currentScrollY < lastScrollY)
```

---

#### **STEP 6: Cập nhật state**

```typescript
lastScrollY = currentScrollY;
ticking = false;
```

**`lastScrollY = currentScrollY`:**

- Lưu vị trí hiện tại làm "điểm tham chiếu" cho frame tiếp theo
- **Critical** - Nếu quên dòng này → Logic sẽ sai hoàn toàn

**Ví dụ nếu KHÔNG cập nhật:**

```typescript
// Frame 1
lastScrollY = 0
currentScrollY = 50
→ 50 > 0 ✅ Scroll DOWN

// lastScrollY KHÔNG được update → vẫn = 0

// Frame 2
lastScrollY = 0  ❌ // Sai! Phải là 50
currentScrollY = 80
→ 80 > 0 ✅ // Luôn luôn là scroll down!
→ LOGIC BỊ BROKEN
```

**`ticking = false`:**

- **Mở khóa** để frame tiếp theo có thể được schedule
- Quan trọng để throttling pattern hoạt động

```typescript
// Unlock ngay sau khi xử lý xong
ticking = false;

// Scroll event tiếp theo có thể request frame mới
if (!ticking) {
    // ← Bây giờ = false → OK
    requestAnimationFrame(handleScroll);
}
```

---

### 4. **Lifecycle Integration**

```typescript
onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true });

    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll);
    });
});
```

#### **`onMounted()` - Setup phase**

**Tại sao trong `onMounted`?**

- Đảm bảo `window` object tồn tại (SSR-safe)
- Component đã được mount → refs đã có giá trị
- DOM ready → có thể attach event listeners

#### **`{ passive: true }` Option**

**Không có `passive`:**

```typescript
// ❌ Browser phải chờ JS xử lý xong
window.addEventListener('scroll', onScroll);
// Browser: "Hmm, JS có gọi preventDefault() không?"
// → Wait for JS → Delay scroll → Janky
```

**Với `passive: true`:**

```typescript
// ✅ Báo browser: "Tôi sẽ KHÔNG preventDefault()"
window.addEventListener('scroll', onScroll, { passive: true });
// Browser: "OK, tôi scroll luôn, không đợi!"
// → Smooth scroll → Better performance
```

**Performance impact:**

- Scroll events có thể **block scrolling** nếu không passive
- `passive: true` → Đảm bảo 60fps smooth scroll
- Chrome DevTools warning nếu thiếu flag này

#### **`onUnmounted()` - Cleanup phase**

**Tại sao cần cleanup?**

```typescript
onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);
});
```

**Nếu KHÔNG cleanup:**

- ❌ Memory leak
- ❌ Event listener vẫn chạy sau khi component destroy
- ❌ Multiple listeners nếu component mount/unmount nhiều lần
- ❌ Console errors khi callback reference không tồn tại

**Ví dụ memory leak:**

```typescript
// Component A mount → add listener
// User navigate → Component A unmount
// ❌ Listener vẫn còn!
// Component A mount lại → add listener thứ 2
// → 2 listeners cùng chạy → Bug + memory leak
```

---

### 5. **CSS Integration**

```vue
<header
    :class="{
        'is-scrolled': isScrolled,
        'header-hidden': !isHeaderVisible
    }"
></header>
```

#### **Dynamic Class Binding**

**Cách hoạt động:**

```typescript
// When isScrolled = true
<header class="app-header is-scrolled">

// When isHeaderVisible = false
<header class="app-header header-hidden">

// Both true
<header class="app-header is-scrolled header-hidden">
```

#### **CSS Styles**

```css
.app-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    transition: transform 0.3s ease-in-out;
}

.app-header.header-hidden {
    transform: translateY(-100%);
}

.app-header.is-scrolled {
    background: rgba(10, 14, 20, 0.92);
    box-shadow: 0 6px 24px -8px rgba(0, 0, 0, 0.55);
}
```

**Tại sao dùng `transform` thay vì `top`?**

```css
/* ❌ BAD - Triggers layout reflow */
.header-hidden {
    top: -100px;
}

/* ✅ GOOD - GPU accelerated */
.header-hidden {
    transform: translateY(-100%);
}
```

**Performance comparison:**

- `top/left/right` → Layout reflow → Expensive
- `transform` → Composite layer → Cheap → 60fps
- GPU acceleration → Smooth animation

---

## 📊 Flow Chart & Timeline

### Timeline của 1 scroll action:

```
Time: 0ms
├─ User scroll down
│
Time: 0.1ms
├─ Scroll event fired (#1)
├─ onScroll() called
├─ ticking = false → Request frame
├─ ticking = true
│
Time: 0.5ms
├─ Scroll event fired (#2)
├─ onScroll() called
├─ ticking = true → SKIP
│
Time: 1ms
├─ Scroll event fired (#3)
├─ ticking = true → SKIP
│
Time: 16.67ms (Next frame)
├─ requestAnimationFrame callback
├─ handleScroll() execute
│  ├─ currentScrollY = 150
│  ├─ lastScrollY = 50
│  ├─ 150 > 50 && 150 > 100 ✅
│  ├─ isHeaderVisible = false
│  ├─ lastScrollY = 150
│  └─ ticking = false
│
Time: 17ms
├─ Vue reactivity triggered
├─ Component re-render
├─ class="header-hidden" added
│
Time: 17.1ms
├─ CSS transition starts
├─ transform: translateY(0) → translateY(-100%)
│
Time: 317.1ms (0.3s later)
└─ Animation complete
   └─ Header fully hidden
```

---

## ⚡ Performance Optimization

### 1. **requestAnimationFrame vs setInterval**

```typescript
// ❌ BAD - Fixed interval, không sync với browser
setInterval(handleScroll, 16); // ~60fps
// Vấn đề:
// - Có thể chạy giữa frames → wasted work
// - Không pause khi tab inactive
// - Fixed 16ms không match với variable refresh rate

// ✅ GOOD - Sync với browser paint cycle
requestAnimationFrame(handleScroll);
// Ưu điểm:
// - Chỉ chạy khi browser ready to paint
// - Auto pause khi tab hidden
// - Support 120Hz/144Hz monitors
```

### 2. **Throttling Pattern**

**Without throttling:**

```typescript
// Scroll event: 200 times/second
// handleScroll: 200 times/second  ❌ Overkill!
window.addEventListener('scroll', handleScroll);
```

**With throttling:**

```typescript
// Scroll event: 200 times/second
// handleScroll: 60 times/second  ✅ Optimal!
window.addEventListener('scroll', onScroll);
const onScroll = () => {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
    }
};
```

**CPU usage comparison:**

```
Without throttling: 15-20% CPU
With throttling: 2-5% CPU
Savings: ~75% reduction
```

### 3. **CSS Transform vs Position**

```css
/* ❌ SLOW - Triggers layout */
.header-hidden {
    top: -100px; /* Reflow → Repaint → Composite */
}

/* ✅ FAST - Composite only */
.header-hidden {
    transform: translateY(-100%); /* Composite only */
}
```

**Rendering pipeline:**

```
Layout → Paint → Composite
  ↑        ↑        ↑
 Slow    Medium   Fast

top/left     background    transform
width/height   color        opacity
```

### 4. **Passive Event Listeners**

```typescript
// ❌ Browser must wait for JS
window.addEventListener('scroll', onScroll);
// Scroll is blocked until JS confirms no preventDefault()

// ✅ Browser can scroll immediately
window.addEventListener('scroll', onScroll, { passive: true });
// Scroll is never blocked
```

---

## 🎓 Ví dụ minh họa

### **Scenario 1: Load trang mới**

```
Initial state:
├─ scrollY = 0
├─ lastScrollY = 0
├─ isHeaderVisible = true
├─ isScrolled = false
└─ Header: Visible, transparent

User scrolls to 150px:
├─ currentScrollY = 150
├─ lastScrollY = 0
├─ 150 >= 10 → isScrolled = true
├─ 150 > 0 && 150 > 100 → isHeaderVisible = false
├─ lastScrollY = 150
└─ Header: Hidden, solid background
```

### **Scenario 2: Scroll xuống rồi scroll lên**

```
Current state:
├─ scrollY = 300
├─ lastScrollY = 300
├─ isHeaderVisible = false (hidden)
└─ isScrolled = true

User scrolls up to 280px:
├─ currentScrollY = 280
├─ lastScrollY = 300
├─ 280 < 300 ✅ → Scroll UP!
├─ isHeaderVisible = true
├─ lastScrollY = 280
└─ Header: Shows immediately

Continue scroll up to 5px:
├─ currentScrollY = 5
├─ 5 < 10 ✅ → Top zone
├─ isScrolled = false
├─ isHeaderVisible = true
└─ Header: Visible, transparent again
```

### **Scenario 3: Slow scroll (không đến 100px)**

```
Current state:
├─ scrollY = 30
├─ lastScrollY = 20
├─ isHeaderVisible = true
└─ isScrolled = true

User scrolls to 50px:
├─ currentScrollY = 50
├─ 50 >= 10 → isScrolled = true
├─ 50 > 20 ✅ (scroll down)
├─ 50 > 100 ❌ (chưa đủ xa!)
├─ isHeaderVisible = true (NO CHANGE)
└─ Header: Still visible
```

---

## 🐛 Troubleshooting

### **Issue 1: Header flickering**

**Nguyên nhân:**

- Threshold quá nhỏ
- Scroll detection quá nhạy

**Giải pháp:**

```typescript
// Tăng threshold
if (currentScrollY < 10) {  // Thay vì < 5
if (currentScrollY > 100) {  // Thay vì > 50
```

### **Issue 2: Header không ẩn**

**Check list:**

```typescript
// 1. Kiểm tra class binding
:class="{ 'header-hidden': !isHeaderVisible }"  // ← Dấu ! có đúng?

// 2. Kiểm tra CSS
.header-hidden {
    transform: translateY(-100%);  // ← Có CSS này không?
}

// 3. Kiểm tra threshold
if (currentScrollY > 100) {  // ← Bạn có scroll quá 100px chưa?
```

### **Issue 3: Performance lag**

**Kiểm tra:**

```typescript
// 1. Có dùng throttling?
if (!ticking) {  // ← Cờ này có không?

// 2. Có dùng passive?
{ passive: true }  // ← Option này có không?

// 3. Có cleanup?
onUnmounted(() => {
    window.removeEventListener('scroll', onScroll);  // ← Có remove không?
});
```

---

## 📈 Performance Metrics

### **Target metrics:**

- ✅ Scroll FPS: 60fps constant
- ✅ CPU usage: < 5% during scroll
- ✅ Animation smoothness: No jank
- ✅ First Input Delay: < 100ms

### **Measuring tools:**

```javascript
// Chrome DevTools Performance tab
// 1. Start recording
// 2. Scroll page
// 3. Stop recording
// 4. Check:
//    - FPS graph (should be steady 60)
//    - CPU usage (should be low)
//    - No long tasks (> 50ms)
```

---

## 🎯 Best Practices

### ✅ DO

- Use `requestAnimationFrame` for scroll handlers
- Implement throttling with flag
- Use CSS `transform` for animations
- Add `passive: true` to scroll listeners
- Clean up listeners in `onUnmounted`
- Set reasonable thresholds (10px, 100px)

### ❌ DON'T

- Don't use `setInterval` or `setTimeout`
- Don't manipulate `top/left` properties
- Don't skip the throttling pattern
- Don't forget to update `lastScrollY`
- Don't use heavy computations in scroll handler
- Don't forget SSR safety checks

---

## 📚 References

- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [MDN: Passive Event Listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#passive)
- [Google: Rendering Performance](https://web.dev/rendering-performance/)
- [Vue 3: Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

---

## 🔖 Summary

**Key takeaways:**

1. **requestAnimationFrame** syncs với browser paint cycle → smooth 60fps
2. **Throttling với flag** giảm CPU usage xuống ~75%
3. **CSS transform** là GPU-accelerated → performance tốt nhất
4. **Passive listeners** không block scroll → better UX
5. **Threshold logic** tránh flickering và premature hiding

**Formula for success:**

```
Throttling + requestAnimationFrame + CSS transform + Passive listeners
= Smooth, performant, professional header animation
```
