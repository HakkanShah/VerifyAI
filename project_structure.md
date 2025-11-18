# 📁 VerifyAi-v2.0 - Project Structure

*Generated on: 11/18/2025, 11:24:38 PM*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 87 |
| 📁 Total Folders | 17 |
| 🌳 Max Depth | 3 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🟡 ▲ **next.config.ts** - Next.js config
- 🟡 🔒 **package-lock.json** - Dependency lock
- 🔴 📦 **package.json** - Package configuration
- 🔴 📖 **README.md** - Project documentation
- 🟡 🔷 **tsconfig.json** - TypeScript config

## 📊 File Statistics

### By File Type

- ⚛️ **.tsx** (React TypeScript files): 60 files (69.0%)
- 🔷 **.ts** (TypeScript files): 16 files (18.4%)
- ⚙️ **.json** (JSON files): 4 files (4.6%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.1%)
- ⚙️ **.yaml** (YAML files): 1 files (1.1%)
- 📄 **.rules** (Other files): 1 files (1.1%)
- 📄 **.mjs** (Other files): 1 files (1.1%)
- 📖 **.md** (Markdown files): 1 files (1.1%)
- 🖼️ **.ico** (Icon files): 1 files (1.1%)
- 🎨 **.css** (Stylesheets): 1 files (1.1%)

### By Category

- **React**: 60 files (69.0%)
- **TypeScript**: 16 files (18.4%)
- **Config**: 5 files (5.7%)
- **Other**: 2 files (2.3%)
- **DevOps**: 1 files (1.1%)
- **Docs**: 1 files (1.1%)
- **Assets**: 1 files (1.1%)
- **Styles**: 1 files (1.1%)

### 📁 Largest Directories

- **root**: 87 files
- **src**: 75 files
- **src\components**: 45 files
- **src\components\ui**: 35 files
- **src\app**: 11 files

## 🌳 Directory Structure

```
VerifyAi-v2.0/
├── 🟡 🚫 **.gitignore**
├── ⚙️ apphosting.yaml
├── ⚙️ components.json
├── 📄 firestore.rules
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🟡 🔒 **package-lock.json**
├── 🔴 📦 **package.json**
├── 📄 postcss.config.mjs
├── 🔴 📖 **README.md**
├── 📁 src/
│   ├── 📂 ai/
│   │   ├── 🔷 dev.ts
│   │   ├── 📂 flows/
│   │   │   ├── 🔷 image-deepfake-analyzer.ts
│   │   │   ├── 🔷 text-credibility-analyzer.ts
│   │   │   └── 🔷 tts.ts
│   │   └── 🔷 genkit.ts
│   ├── 🚀 app/
│   │   ├── 📂 about/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 🔷 actions.ts
│   │   ├── 📂 blogs/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 contact/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── ⚛️ layout.tsx
│   │   ├── 📂 login/
│   │   │   └── ⚛️ page.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 profile/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 signup/
│   │   │   └── ⚛️ page.tsx
│   ├── 🧩 components/
│   │   ├── ⚛️ dynamic-headline.tsx
│   │   ├── ⚛️ FirebaseErrorListener.tsx
│   │   ├── 📂 layout/
│   │   │   ├── ⚛️ footer.tsx
│   │   │   ├── ⚛️ header.tsx
│   │   │   └── ⚛️ mobile-nav.tsx
│   │   ├── ⚛️ light-grid.tsx
│   │   ├── ⚛️ matrix-background.tsx
│   │   ├── ⚛️ theme-provider.tsx
│   │   ├── ⚛️ theme-toggle.tsx
│   │   ├── 🎨 ui/
│   │   │   ├── ⚛️ accordion.tsx
│   │   │   ├── ⚛️ alert-dialog.tsx
│   │   │   ├── ⚛️ alert.tsx
│   │   │   ├── ⚛️ avatar.tsx
│   │   │   ├── ⚛️ badge.tsx
│   │   │   ├── ⚛️ button.tsx
│   │   │   ├── ⚛️ calendar.tsx
│   │   │   ├── ⚛️ card.tsx
│   │   │   ├── ⚛️ carousel.tsx
│   │   │   ├── ⚛️ chart.tsx
│   │   │   ├── ⚛️ checkbox.tsx
│   │   │   ├── ⚛️ collapsible.tsx
│   │   │   ├── ⚛️ dialog.tsx
│   │   │   ├── ⚛️ dropdown-menu.tsx
│   │   │   ├── ⚛️ form.tsx
│   │   │   ├── ⚛️ input.tsx
│   │   │   ├── ⚛️ label.tsx
│   │   │   ├── ⚛️ menubar.tsx
│   │   │   ├── ⚛️ popover.tsx
│   │   │   ├── ⚛️ progress.tsx
│   │   │   ├── ⚛️ radio-group.tsx
│   │   │   ├── ⚛️ scroll-area.tsx
│   │   │   ├── ⚛️ select.tsx
│   │   │   ├── ⚛️ separator.tsx
│   │   │   ├── ⚛️ sheet.tsx
│   │   │   ├── ⚛️ sidebar.tsx
│   │   │   ├── ⚛️ skeleton.tsx
│   │   │   ├── ⚛️ slider.tsx
│   │   │   ├── ⚛️ switch.tsx
│   │   │   ├── ⚛️ table.tsx
│   │   │   ├── ⚛️ tabs.tsx
│   │   │   ├── ⚛️ textarea.tsx
│   │   │   ├── ⚛️ toast.tsx
│   │   │   ├── ⚛️ toaster.tsx
│   │   │   └── ⚛️ tooltip.tsx
│   │   └── ⚛️ verifier.tsx
│   ├── 📂 firebase/
│   │   ├── ⚛️ client-provider.tsx
│   │   ├── 🔷 config.ts
│   │   ├── 🔷 error-emitter.ts
│   │   ├── 🔷 errors.ts
│   │   ├── 📂 firestore/
│   │   │   ├── ⚛️ use-collection.tsx
│   │   │   └── ⚛️ use-doc.tsx
│   │   ├── 🔷 index.ts
│   │   ├── ⚛️ non-blocking-login.tsx
│   │   ├── ⚛️ non-blocking-updates.tsx
│   │   └── ⚛️ provider.tsx
│   ├── 🎣 hooks/
│   │   ├── ⚛️ use-mobile.tsx
│   │   └── 🔷 use-toast.ts
│   └── 📚 lib/
│   │   ├── 🔷 types.ts
│   │   └── 🔷 utils.ts
├── 🔷 tailwind.config.ts
└── 🟡 🔷 **tsconfig.json**
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- ⚙️ Config: YAML files
- ⚙️ Config: JSON files
- 📄 Other: Other files
- 🔷 TypeScript: TypeScript files
- 📖 Docs: Markdown files
- ⚛️ React: React TypeScript files
- 🖼️ Assets: Icon files
- 🎨 Styles: Stylesheets

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
