 // src/app/notifications/page.tsx
 import NotificationListWrapper from './NotificationListWrapper';
 import SendNotificationForm from './SendNotificationForm';
 
 export default function NotificationsPage() {
   return (
      <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
       <div className="bg-white shadow-md rounded-lg p-6 layout-container flex h-full grow flex-col">
           <div>
             <h2 className="text-2xl font-semibold mb-4">Liste des Notifications</h2>
             <NotificationListWrapper />
           </div>
        </div>
      </div>
   );
 }
 