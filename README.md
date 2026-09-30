# Polyglot Tech Demo Frontend

> A Next.js and React frontend serving as the presentation layer for the Polyglot Tech Demo, combining reusable UI components with interactive real-time visualizations backed by the Express gateway and FastAPI compute service.

---

## Architectural Role

The Next.js application is the **presentation and interaction layer** of the Polyglot Tech Demo.

It is responsible for:

- Rendering the application UI.
- Managing client-side React state.
- Providing reusable TypeScript components.
- Handling user interaction.
- Rendering simulation, telemetry, and spatial visualization data.
- Connecting frontend visualization modules to the backend gateway.

The frontend does **not** own the primary mathematical or scientific-computing logic. Those workloads remain in the FastAPI compute service, with Express providing the gateway and WebSocket proxy layer.

```text
┌─────────────────────────────────┐
│        Next.js Frontend         │
│                                 │
│ React / TypeScript / Tailwind   │
│ UI + State + Visualization      │
└────────────────┬────────────────┘
                 │
                 │ HTTP / WebSocket
                 ▼
┌─────────────────────────────────┐
│         Express Gateway         │
│                                 │
│ REST Routing + WS Proxying      │
└────────────────┬────────────────┘
                 │
                 │ HTTP / WebSocket
                 ▼
┌─────────────────────────────────┐
│     FastAPI Compute Service     │
│                                 │
│ Python / NumPy / SciPy /        │
│ Skyfield / Simulation Engines   │
└─────────────────────────────────┘
```

---

# Project Structure

```text
my-nextjs-app/
│
├── public/
│
├── src/
│   └── app/
│       │
│       ├── cart/
│       │   └── page.tsx
│       │
│       ├── components/
│       │   │
│       │   ├── cards/
│       │   │   ├── ArticleCard.tsx
│       │   │   ├── DashboardCard.tsx
│       │   │   ├── ProductCard.tsx
│       │   │   └── ProfileCard.tsx
│       │   │
│       │   ├── data/
│       │   │   ├── Badge.tsx
│       │   │   ├── DataTable.tsx
│       │   │   └── Tabs.tsx
│       │   │
│       │   ├── feedback/
│       │   │   ├── EmptyState.tsx
│       │   │   ├── Skeleton.tsx
│       │   │   └── Toast.tsx
│       │   │
│       │   ├── forms/
│       │   │   ├── ContactForm.tsx
│       │   │   └── ThemeToggle.tsx
│       │   │
│       │   ├── AttractorCanvas.tsx
│       │   ├── BoidsSimulation.tsx
│       │   ├── Dropdown.tsx
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   ├── MaritimeMesh.tsx
│       │   ├── Modal.tsx
│       │   └── SatelliteGlobe.tsx
│       │
│       ├── context/
│       │   └── CartContext.tsx
│       │
│       ├── details/
│       │   └── page.tsx
│       │
│       ├── engineering/
│       │   └── page.tsx
│       │
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
│
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── jsconfig.json
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
└── tsconfig.json
```

---

# Main Application

The primary homepage is:

```text
src/app/page.tsx
```

The homepage is a client component because it maintains local state for the visualization controls.

The main page composes:

```text
Header
  ↓
Welcome / Architecture Card
  ↓
Visualization Controls
  ↓
Enabled Visualizations
  ↓
Footer
```

The visualization components are:

```text
SatelliteGlobe
BoidsSimulation
MaritimeMesh
AttractorCanvas
```

---

# Visualization Lifecycle

The four real-time visualization modules are disabled by default.

The homepage maintains independent state for each feature:

```tsx
const [boidsEnabled, setBoidsEnabled] = useState(false);
const [satelliteEnabled, setSatelliteEnabled] = useState(false);
const [maritimeEnabled, setMaritimeEnabled] = useState(false);
const [attractorEnabled, setAttractorEnabled] = useState(false);
```

They are conditionally mounted:

```tsx
{satelliteEnabled && <SatelliteGlobe />}
{boidsEnabled && <BoidsSimulation />}
{maritimeEnabled && <MaritimeMesh />}
{attractorEnabled && <AttractorCanvas />}
```

This means the corresponding React component does not mount until its feature is enabled.

The current homepage controls are:

```text
☐ Satellite Globe
☐ Boids Simulation
☐ Maritime Mesh
☐ Chaotic Attractor
```

The lifecycle approach is intended to prevent every live visualization from starting simultaneously and allows individual modules to be turned off by unmounting their components.

---

# Real-Time Visualization Components

## Satellite Globe

```text
src/app/components/SatelliteGlobe.tsx
```

Provides the frontend 3D satellite telemetry visualization.

The frontend component is responsible for visualization and user interaction. Satellite orbital propagation remains in the Python compute service.

---

## Boids Simulation

```text
src/app/components/BoidsSimulation.tsx
```

Provides the frontend visualization for the Boids flocking simulation.

The component presents particle state and exposes simulation controls.

The underlying flocking calculations are performed by the Python `BoidsEngine`.

---

## Maritime Mesh

```text
src/app/components/MaritimeMesh.tsx
```

Provides the frontend spatial visualization for the maritime simulation.

It presents vessel and mesh data generated by the Python maritime engine, including live or fallback vessel positions and the resulting spatial structure.

The actual AIS processing and Voronoi tessellation remain in the FastAPI service.

---

## Chaotic Attractor

```text
src/app/components/AttractorCanvas.tsx
```

Provides an interactive canvas for chaotic attractor visualization.

The backend currently supports:

```text
Clifford
De Jong
Aizawa
Lorenz
```

The frontend provides the controls and rendering surface while the Python `AttractorEngine` generates the underlying trajectories.

---

# Reusable Component Architecture

Reusable UI components are organized by function under:

```text
src/app/components/
```

This separates general interface elements from the domain-specific visualization components.

---

## Cards

```text
src/app/components/cards/
```

### ArticleCard

```text
ArticleCard.tsx
```

A reusable article/content card.

Props:

```text
category
readTime
title
description
author
date
imageUrl
href?
```

The optional `href` property allows the card to be wrapped in a Next.js `Link`.

---

### DashboardCard

```text
DashboardCard.tsx
```

A reusable dashboard container accepting:

```text
title
children
className?
```

The `children` prop allows arbitrary React content to be rendered inside the card.

---

### ProductCard

```text
ProductCard.tsx
```

A client-side product card integrated with the application's cart context.

It supports:

- Product information.
- Optional sale pricing.
- Quantity increase/decrease controls.
- Add-to-cart interaction.
- Cart state updates.
- Parent-level feedback callbacks.

The product price is converted from its displayed string representation into a numeric value before being added to the cart.

The component consumes the shared cart through:

```tsx
const { addToCart } = useCart();
```

---

### ProfileCard

```text
ProfileCard.tsx
```

A client-side profile card supporting:

- Avatar and profile information.
- Message interaction.
- Connect interaction.
- Email copying.
- LinkedIn link.
- GitHub link.

The component manages modal state internally and reuses:

```text
Modal.tsx
ContactForm.tsx
```

for its interactions.

---

# Data Components

```text
src/app/components/data/
```

## Badge

```text
Badge.tsx
```

Reusable status badge supporting the variants:

```text
active
pending
archived
success
error
default
```

A custom `className` can also be supplied.

---

## DataTable

```text
DataTable.tsx
```

A generic TypeScript data-table component.

Columns can access data through either:

```text
key-based property access
```

or:

```text
custom accessor functions
```

The component supports:

- Generic row types.
- Empty-state handling.
- Sticky headers.
- Horizontal scrolling.
- Zebra striping.
- Optional row-click handlers.
- Per-column styling.

The main data-table abstraction is generic:

```tsx
DataTable<T>
```

---

## Tabs

```text
Tabs.tsx
```

A controlled tab navigation component.

Each tab contains:

```text
id
label
count?
```

The active tab is supplied by the parent component through:

```text
activeTab
onChange
```

---

# Feedback Components

```text
src/app/components/feedback/
```

## EmptyState

```text
EmptyState.tsx
```

Provides a reusable empty-state presentation.

It supports:

- Optional icon.
- Title.
- Description.
- Optional link-based action.
- Optional callback-based action.

The component can therefore support both navigation actions and in-place actions.

---

## Skeleton

```text
Skeleton.tsx
```

Provides a reusable loading placeholder using an animated pulse effect.

The module also includes:

```text
ProductCardSkeleton
```

which mirrors the general structure of `ProductCard` during loading.

---

## Toast

```text
Toast.tsx
```

Provides temporary notification presentation.

Supported toast types are:

```text
success
error
warning
info
```

Each type has its own background, border, icon, and text treatment.

The component receives:

```text
id
type
title
message
onClose
```

and delegates dismissal to the parent through `onClose`.

---

# Form Components

```text
src/app/components/forms/
```

## ContactForm

```text
ContactForm.tsx
```

A client-side contact/message form used by interactive profile components.

It collects:

```text
Email
Message
```

The current implementation simulates a backend request rather than transmitting to a real API.

During submission it presents a success state, then invokes the supplied `onSuccess` callback.

---

## ThemeToggle

```text
ThemeToggle.tsx
```

Provides a reusable theme toggle item.

Props:

```text
isDarkMode
onToggle
```

The component displays the current theme and a toggle switch while delegating state changes to its parent.

---

# General UI Components

The top-level components directory also contains shared application UI:

```text
Dropdown.tsx
Footer.tsx
Header.tsx
Modal.tsx
```

### Header

Provides the application header/navigation surface.

### Footer

Provides the application footer.

### Dropdown

Provides a reusable dropdown interface.

### Modal

Provides a reusable modal container used by interactive components such as `ProfileCard`.

---

# Cart Context

```text
src/app/context/CartContext.tsx
```

The cart uses React context to provide shared cart state across components.

`ProductCard` consumes the context to add products and quantities without maintaining the global cart itself.

The cart page is:

```text
src/app/cart/page.tsx
```

This keeps cart state management separate from the individual product presentation component.

---

# Application Routes

The application uses the Next.js App Router.

Current route structure:

```text
src/app/
├── page.tsx
├── cart/
│   └── page.tsx
├── details/
│   └── page.tsx
└── engineering/
    └── page.tsx
```

These provide separate application surfaces for:

- Main demonstration page.
- Cart/UI demonstration.
- Details content.
- Engineering content.

---

# Styling

Global styles are defined in:

```text
src/app/globals.css
```

The frontend uses Tailwind CSS utility classes for:

- Layout.
- Spacing.
- Typography.
- Borders.
- Colors.
- Responsive behavior.
- Interactive states.
- Loading states.

The component design uses shared semantic classes such as:

```text
bg-card
bg-border
text-foreground
text-muted
border-border
```

alongside standard Tailwind utilities.

---

# TypeScript and React

The project uses TypeScript for component contracts and type safety.

Examples include explicit prop interfaces:

```tsx
interface ArticleCardProps { ... }
interface ProductCardProps { ... }
interface DashboardCardProps { ... }
```

Generic components are also supported, such as:

```tsx
DataTable<T>
```

React hooks are used where components require client-side interaction or state.

Examples include:

```text
useState
```

Client components are explicitly marked with:

```tsx
"use client";
```

where browser APIs, React state, or interactive event handlers require them.

---

# Backend Communication

The frontend participates in a three-layer architecture:

```text
┌──────────────────────────────┐
│        Next.js Frontend      │
│                              │
│ UI / State / Visualization   │
└──────────────┬───────────────┘
               │
               │ HTTP / WebSocket
               ▼
┌──────────────────────────────┐
│       Express Gateway        │
│                              │
│ Routing / Proxying           │
└──────────────┬───────────────┘
               │
               │ HTTP / WebSocket
               ▼
┌──────────────────────────────┐
│    FastAPI Compute Service   │
│                              │
│ Computation / Data Processing│
└──────────────────────────────┘
```

The responsibilities are intentionally separated:

| Layer | Responsibility |
|---|---|
| Next.js | UI, interaction, state, visualization |
| Express | Gateway routing and WebSocket proxying |
| FastAPI | API endpoints and compute orchestration |
| Python Services | Mathematical and scientific computation |

Example attractor flow:

```text
User changes parameter
        ↓
AttractorCanvas
        ↓
Express WebSocket Gateway
        ↓
FastAPI /ws/attractor
        ↓
AttractorEngine
        ↓
Generated point data
        ↓
AttractorCanvas
```

---

# Frontend Design Principle

The frontend follows the principle:

> **The frontend presents and controls computation rather than implementing the core computation itself.**

For the real-time visualization features, the primary flow is:

```text
User interaction
       ↓
React state / controls
       ↓
Backend communication
       ↓
Visualization rendering
```

while the expensive computation remains in the Python service.

This keeps presentation, transport, and computation as separate architectural responsibilities.

---

# Current Feature Areas

| Area | Implementation |
|---|---|
| Main application | `src/app/page.tsx` |
| Satellite visualization | `SatelliteGlobe.tsx` |
| Boids visualization | `BoidsSimulation.tsx` |
| Maritime visualization | `MaritimeMesh.tsx` |
| Chaotic attractors | `AttractorCanvas.tsx` |
| Shared cart state | `CartContext.tsx` |
| Article UI | `ArticleCard.tsx` |
| Dashboard UI | `DashboardCard.tsx` |
| Product UI | `ProductCard.tsx` |
| Profile UI | `ProfileCard.tsx` |
| Status badges | `Badge.tsx` |
| Data tables | `DataTable.tsx` |
| Tabs | `Tabs.tsx` |
| Empty states | `EmptyState.tsx` |
| Loading states | `Skeleton.tsx`, `ProductCardSkeleton` |
| Notifications | `Toast.tsx` |
| Contact interaction | `ContactForm.tsx` |
| Theme control | `ThemeToggle.tsx` |
| Navigation/UI | `Header.tsx`, `Footer.tsx`, `Dropdown.tsx`, `Modal.tsx` |

---

# Running the Frontend

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The frontend can be used independently for UI pages, while the live computational visualizations require the Express gateway and FastAPI compute service to be running.

---

# Running the Full Polyglot Stack

The complete demonstration consists of three application layers.

## 1. Next.js Frontend

```text
Presentation
```

Responsible for:

- UI
- React state
- User interaction
- Visualization
- Client-side controls

## 2. Express Gateway

```text
Transport
```

Responsible for:

- HTTP routing
- API proxying
- WebSocket proxying
- Connection routing

## 3. FastAPI Compute Service

```text
Computation
```

Responsible for:

- Boids computation
- Chaotic attractor generation
- Satellite orbital propagation
- Maritime AIS processing
- Voronoi tessellation
- Scientific and numerical computation

---

# Service Boundary

```text
┌───────────────────────────────┐
│          PRESENTATION         │
│                               │
│        Next.js / React        │
│                               │
│ UI → State → Visualization    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│           TRANSPORT           │
│                               │
│       Express Gateway         │
│                               │
│ HTTP Routing / WS Proxying    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│         COMPUTE / DATA        │
│                               │
│      FastAPI / Python         │
│                               │
│ NumPy / SciPy / Skyfield      │
└───────────────────────────────┘
```

The resulting separation is:

> **Next.js presents the application. Express transports requests and streams. FastAPI and its service layer perform the computation.**
