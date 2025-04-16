import { Outlet, Link, useLocation } from 'react-router-dom';
import { ChatBubbleLeftRightIcon, Cog6ToothIcon, ClockIcon, PuzzlePieceIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  const location = useLocation();
  
  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-claude-purple text-white' : 'text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 flex items-center justify-center md:justify-start">
          <div className="bg-claude-purple rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
            C
          </div>
          <h1 className="hidden md:block ml-2 text-xl font-bold text-claude-purple">Claude Desktop</h1>
        </div>
        
        {/* Version */}
        <div className="px-4 py-2 text-center md:text-left">
          <span className="text-xs text-gray-500">v0.1.0</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center p-2 rounded-md ${isActive('/')}`}
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6" />
                <span className="hidden md:inline ml-3">聊天</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/history" 
                className={`flex items-center p-2 rounded-md ${isActive('/history')}`}
              >
                <ClockIcon className="w-6 h-6" />
                <span className="hidden md:inline ml-3">歷史記錄</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/mcp-features" 
                className={`flex items-center p-2 rounded-md ${isActive('/mcp-features')}`}
              >
                <PuzzlePieceIcon className="w-6 h-6" />
                <span className="hidden md:inline ml-3">MCP 功能</span>
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center p-2 rounded-md ${isActive('/settings')}`}
              >
                <Cog6ToothIcon className="w-6 h-6" />
                <span className="hidden md:inline ml-3">設定</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Footer */}
        <div className="p-4 text-center md:text-left">
          <div className="text-xs text-gray-500">
            <p>連接狀態:</p>
            <p className="text-green-500">已連接到 MCP</p>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;