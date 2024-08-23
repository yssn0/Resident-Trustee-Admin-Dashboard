//import UsersDashboardHeader from '../../components/dashboard/UserHeader';

import SponsorshipList from './SponsorshipList';
export default function SponsorshipsPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="bg-white shadow-md rounded-lg p-6 layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <main className="container mx-auto px-4 py-8">
            <SponsorshipList />
          </main>
        </div>
      </div>
    </div>
  );
}