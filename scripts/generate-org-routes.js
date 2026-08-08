#!/usr/bin/env node
/**
 * generate-org-routes.js
 * Generates thin wrapper pages for the new [organizationSlug] route group.
 * Each page re-exports the existing component from the tenant/[subdomain] tree.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORG_DIR = path.join(ROOT, 'app', '[organizationSlug]');
const SOURCE_BASE = 'app/tenant/[subdomain]/(app)/owner/dashboard';

// All dashboard pages (relative to owner/dashboard)
const PAGES = [
  '/page.tsx',
  '/analytics/page.tsx',
  '/attendance/page.tsx',
  '/attendance/history/page.tsx',
  '/attendance/qr/page.tsx',
  '/attendance/scan/page.tsx',
  '/domain/page.tsx',
  '/expiry/page.tsx',
  '/leads/page.tsx',
  '/leads/new/page.tsx',
  '/leads/[id]/page.tsx',
  '/members/page.tsx',
  '/members/new/page.tsx',
  '/members/expiring/page.tsx',
  '/members/renewals/page.tsx',
  '/members/[id]/page.tsx',
  '/members/[id]/edit/page.tsx',
  '/payments/page.tsx',
  '/payments/new/page.tsx',
  '/payments/pending/page.tsx',
  '/payments/renewals/page.tsx',
  '/payments/revenue/page.tsx',
  '/plans/page.tsx',
  '/reports/page.tsx',
  '/reports/revenue/page.tsx',
  '/reports/attendance/page.tsx',
  '/reports/members/page.tsx',
  '/settings/page.tsx',
  '/settings/gym/page.tsx',
  '/settings/profile/page.tsx',
  '/settings/account/page.tsx',
  '/settings/billing/page.tsx',
  '/settings/security/page.tsx',
  '/settings/staff/page.tsx',
  '/settings/team/page.tsx',
  '/settings/integrations/page.tsx',
  '/staff/receptionists/page.tsx',
  '/team/page.tsx',
  '/team/trainers/page.tsx',
  '/team/receptionists/page.tsx',
  '/trainers/page.tsx',
  '/trainers/new/page.tsx',
  '/trainers/[id]/page.tsx',
  '/trainers/[id]/edit/page.tsx',
  '/upgrade/page.tsx',
  '/website/page.tsx',
  '/website/branding/page.tsx',
  '/website/content/page.tsx',
  '/website/domain/page.tsx',
  '/website/gallery/page.tsx',
  '/website/pages/page.tsx',
  '/website/publish/page.tsx',
  '/website/seo/page.tsx',
  '/website/setup/page.tsx',
  '/website/team/page.tsx',
  '/website/templates/page.tsx',
  '/website/theme/page.tsx',
  '/website/trainers/page.tsx',
  '/website/sections/page.tsx',
  '/website/sections/contact/page.tsx',
  '/website/sections/cta/page.tsx',
  '/website/sections/faq/page.tsx',
  '/website/sections/gallery/page.tsx',
  '/website/sections/hero/page.tsx',
  '/website/sections/pricing/page.tsx',
  '/website/sections/programs/page.tsx',
  '/website/sections/stats/page.tsx',
  '/website/sections/testimonials/page.tsx',
  '/website/sections/trainers/page.tsx',
];

// Special: the root page under [organizationSlug] is the "dashboard" page
// gmmx.app/nitish/dashboard → maps to the dashboard page
const DASHBOARD_OVERRIDE = '/dashboard/page.tsx';

function getImportDepth(relativePath) {
  // Count how many directories deep the file is from [organizationSlug]/
  const parts = relativePath.replace(/^\//, '').split('/');
  // parts includes the filename, so depth = parts.length - 1 dirs + 1 for [organizationSlug] itself
  return parts.length; // each segment = one level up
}

function buildImportPath(pageRelPath) {
  // e.g. /members/new/page.tsx → @/app/tenant/[subdomain]/(app)/owner/dashboard/members/new/page
  const withoutExt = pageRelPath.replace(/\.tsx$/, '');
  return `@/${SOURCE_BASE}${withoutExt}`;
}

function generateWrapper(destPath, sourcePath, extra = '') {
  return `// Auto-generated thin wrapper — do not edit manually.
// Route: ${destPath}
// Source: ${sourcePath}
export { default } from "${buildImportPath(extra || destPath.replace('/dashboard', ''))}";
export * from "${buildImportPath(extra || destPath.replace('/dashboard', ''))}";
`;
}

let created = 0;
let skipped = 0;

// 1. Root [organizationSlug]/page.tsx → redirect to /dashboard
const rootPage = path.join(ORG_DIR, 'page.tsx');
const rootContent = `import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ organizationSlug: string }>;
}

export default async function OrgRootPage({ params }: Props) {
  const { organizationSlug } = await params;
  redirect(\`/\${organizationSlug}/dashboard\`);
}
`;
fs.mkdirSync(path.dirname(rootPage), { recursive: true });
if (!fs.existsSync(rootPage)) {
  fs.writeFileSync(rootPage, rootContent);
  console.log(`✅ Created: app/[organizationSlug]/page.tsx`);
  created++;
}

// 2. dashboard/page.tsx → maps to the root owner/dashboard page
const dashboardPage = path.join(ORG_DIR, 'dashboard', 'page.tsx');
const dashboardContent = `// Auto-generated thin wrapper — do not edit manually.
// Route: /[organizationSlug]/dashboard
// Source: app/tenant/[subdomain]/(app)/owner/dashboard/page.tsx
export { default } from "@/${SOURCE_BASE}/page";
export * from "@/${SOURCE_BASE}/page";
`;
fs.mkdirSync(path.dirname(dashboardPage), { recursive: true });
if (!fs.existsSync(dashboardPage)) {
  fs.writeFileSync(dashboardPage, dashboardContent);
  console.log(`✅ Created: app/[organizationSlug]/dashboard/page.tsx`);
  created++;
}

// 3. All other pages
for (const pageRelPath of PAGES) {
  if (pageRelPath === '/page.tsx') continue; // handled as dashboard above

  // Destination: app/[organizationSlug]{pageRelPath}
  const destFile = path.join(ORG_DIR, pageRelPath.replace(/^\//, ''));
  const sourceImportPath = pageRelPath.replace(/\.tsx$/, '');

  const content = `// Auto-generated thin wrapper — do not edit manually.
// Route: /[organizationSlug]${pageRelPath}
// Source: ${SOURCE_BASE}${pageRelPath}
export { default } from "@/${SOURCE_BASE}${sourceImportPath}";
export * from "@/${SOURCE_BASE}${sourceImportPath}";
`;

  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  if (!fs.existsSync(destFile)) {
    fs.writeFileSync(destFile, content);
    console.log(`✅ Created: app/[organizationSlug]${pageRelPath}`);
    created++;
  } else {
    skipped++;
  }
}

console.log(`\nDone: ${created} created, ${skipped} skipped (already exist).`);
