---
name: frontend-design
description: Enforces high-craft, human-grade UI/UX design and eliminates generic AI-generated aesthetics. Triggers whenever designing or building web pages, landing pages, components, or frontends.
---

# Anti-AI Slop Frontend Design System

When building UI, reject default AI generation cliches and apply intentional editorial and structural choices.

## 1. Negative Constraints (Banned Patterns)
- NO purple/blue glowing gradients (`bg-gradient-to-r from-indigo-500 to-purple-600`).
- NO background glowing radial blobs (`blur-3xl` colored circles).
- NO default 3-column card layouts where each card has a Lucide icon inside a rounded box.
- NO glassmorphism clichés (`backdrop-blur-md bg-white/5 border-white/10`) unless specifically requested.
- NO generic marketing headers like "Supercharge your workflow with AI" or "Transform the way you work."
- NO numbered decorative markers (`01`, `02`, `03`) unless displaying an actual ordered sequence.

## 2. Typography First
- Never default to Inter, Roboto, or standard system fonts.
- Pair a distinctive display font with a clean body face:
  - Editorial / Modern: Instrument Serif + Plus Jakarta Sans
  - Technical / Clean: Space Grotesk + Geist or JetBrains Mono
  - Warm / Human: Outfit + Newsreader
- Establish a dramatic type scale: huge display headlines (4rem–6rem), compact tracking, intentional line-heights.

## 3. Layout & Structure
- Build asymmetric layouts. Vary row structures (e.g., full-width visual hero, split 60/40 section, dense horizontal list).
- Use tight, intentional whitespace and solid high-contrast borders (`border-neutral-200 dark:border-neutral-800`) over blurry drop shadows.
- Include data-dense micro-components: tags, timestamps, breadcrumbs, status indicators, or subtle badges.

## 4. Color Palettes
- Restrict palettes to 2–3 deliberate colors:
  - Editorial: Paper warm white (`#fcfbf9`), deep charcoal (`#121212`), single muted accent (e.g., olive, burnt amber, or cobalt).
  - High-Contrast Monochrome: Pure black, crisp white, with neutral grays for borders.