// src\app\notifications\create\page.tsx
import SendNotificationForm from '.././SendNotificationForm';
 
export default function SendNotificationFormPage() {
     return (
      <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
       <div className="bg-white shadow-md rounded-lg p-6 layout-container flex h-full grow flex-col">
           <div>
             <SendNotificationForm />
             </div>
        </div>
      </div>
  );
}
 