
// src/app/users/page.tsx
import UserListWrapper from './userListWrapper';

export default function UsersPage() {
  return (
    <div className="relative flex size-full min-h-screen flex-col overflow-x-hidden">
      <div className="bg-white shadow-md rounded-lg p-6 layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <UserListWrapper />
        </div>
      </div>
    </div>
  );
}
