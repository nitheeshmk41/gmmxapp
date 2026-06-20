const fs = require('fs');
const path = require('path');

const routes = [
  'members/expiring',
  'attendance/history',
  'payments/pending',
  'payments/revenue',
  'staff/receptionists',
  'website/branding',
  'website/pages',
  'website/gallery',
  'website/trainers',
  'website/publish',
  'reports/revenue',
  'reports/attendance',
  'reports/members',
  'settings/billing',
  'settings/team'
];

const basePath = path.join(process.cwd(), 'app', 'tenant', '[subdomain]', '(app)', 'owner', 'dashboard');

routes.forEach(route => {
  const dirPath = path.join(basePath, route);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const content = `export default function PlaceholderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-slate-500 animate-in fade-in">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h2>
      <p>The ${route.split('/').pop().toUpperCase()} page is under development.</p>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Created placeholder pages.');
