'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import DashboardCard from '../components/cards/DashboardCard';
import ProductCard from '../components/cards/ProductCard';
import ArticleCard from '../components/cards/ArticleCard';
import ProfileCard from '../components/cards/ProfileCard';
import Toast, { ToastType } from '../components/feedback/Toast';
import { ProductCardSkeleton } from '../components/feedback/Skeleton';
import EmptyState from '../components/feedback/EmptyState';
import Tabs from '../components/data/Tabs';
import Badge from '../components/data/Badge';
import DataTable, { Column } from '../components/data/DataTable';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'archived' | 'error';
  joined: string;
}

const MOCK_USERS: UserRow[] = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'Designer', status: 'active', joined: 'Oct 12, 2025' },
  { id: '2', name: 'Alex Turner', email: 'alex.t@example.com', role: 'Engineer', status: 'active', joined: 'Nov 03, 2025' },
  { id: '3', name: 'Elena Rostova', email: 'elena.r@example.com', role: 'Product Manager', status: 'pending', joined: 'Jan 15, 2026' },
  { id: '4', name: 'Marcus Vance', email: 'marcus.v@example.com', role: 'DevOps', status: 'archived', joined: 'Aug 22, 2024' },
];

export default function Details() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [activeTab, setActiveTab] = useState('cards');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddToCart = (productName: string, quantity: number) => {
    addToast(
      'success',
      'Added to Cart!',
      `Successfully added ${quantity}x ${productName} to your cart.`
    );
  };

  const handleSimulateLoading = () => {
    setIsLoading(true);
    setIsEmpty(false);
    setTimeout(() => {
      setIsLoading(false);
      addToast('info', 'Data Loaded', 'Products have finished loading.');
    }, 2000);
  };

  // Define columns for the Data Table
  const userColumns: Column<UserRow>[] = [
    { header: 'Name', accessor: 'name', className: 'font-medium text-foreground' },
    { header: 'Email', accessor: 'email', className: 'text-muted' },
    { header: 'Role', accessor: 'role' },
    { 
      header: 'Status', 
      accessor: (row) => (
        <Badge variant={row.status}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ) 
    },
    { header: 'Joined', accessor: 'joined', className: 'text-muted' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="grow max-w-6xl w-full mx-auto px-6 py-10 space-y-8">

        {/* Title & Trigger Buttons */}
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground text-center">UI Component Showcase</h1>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Open Modal Preview
            </button>
            <button 
              onClick={handleSimulateLoading}
              className="px-4 py-2 bg-border text-foreground font-medium text-sm rounded-lg hover:bg-border/80 transition-colors"
            >
              {isLoading ? 'Loading Skeletons...' : 'Simulate Loading'}
            </button>
            <button 
              onClick={() => { setIsEmpty(!isEmpty); setIsLoading(false); }}
              className="px-4 py-2 bg-border text-foreground font-medium text-sm rounded-lg hover:bg-border/80 transition-colors"
            >
              {isEmpty ? 'Show Normal Grid' : 'Toggle Empty State'}
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DashboardCard title="Total Revenue">
            <p className="text-2xl font-bold text-foreground">$24,500</p>
          </DashboardCard>
          <DashboardCard title="Active Users">
            <p className="text-2xl font-bold text-foreground">1,420</p>
          </DashboardCard>
          <DashboardCard title="Conversion Rate">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">3.4%</p>
          </DashboardCard>
        </div>

        {/* Section Tabs */}
        <div className="pt-4">
          <Tabs 
            tabs={[
              { id: 'cards', label: 'Cards & Feedback', count: 3 },
              { id: 'table', label: 'Data Table & Badges', count: MOCK_USERS.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'cards' ? (
          /* Showcase Grid / States */
          isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </div>
          ) : isEmpty ? (
            <EmptyState 
              icon="📦"
              title="No items to display"
              description="Your inventory or product list is currently empty. Try toggling back or resetting your view filters."
              actionLabel="Reset View"
              onAction={() => setIsEmpty(false)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProductCard 
                id="watch-1"
                name="Minimalist Watch" 
                category="Accessories" 
                price="$129.00" 
                originalPrice="$159.00"
                imageUrl="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
                isSale={true}
                onAddToCart={handleAddToCart}
              />
              <ArticleCard 
                category="Engineering" 
                readTime="4 min read"
                title="Building Scalable UI Components" 
                description="Explore how modern styling frameworks streamline development."
                author="Alex Turner"
                date="Oct 24"
                imageUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"
                href="/engineering"
              />
              <ProfileCard 
                name="Sarah Jenkins" 
                role="Lead Product Designer" 
                bio="Passionate about crafting intuitive user experiences."
                avatarUrl="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              />
            </div>
          )
        ) : (
          /* Data Table Tab Content */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Team Directory</h3>
                <p className="text-sm text-muted">A responsive table featuring sticky headers, zebra striping, and semantic status badges.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="active">Active</Badge>
                <Badge variant="pending">Pending</Badge>
                <Badge variant="archived">Archived</Badge>
              </div>
            </div>

            <DataTable 
              columns={userColumns}
              data={MOCK_USERS}
              keyExtractor={(user) => user.id}
              onRowClick={(user) => addToast('info', 'Row Clicked', `Selected user: ${user.name}`)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer/>
      
      {/* Modal Dialog Component */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Interactive Dialog Preview"
      >
        <p className="text-muted mb-6 text-sm">
          This modal is managed by client state. It features a backdrop blur, smooth entry transitions, and listens for the `Escape` key to close automatically.
        </p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm text-muted hover:bg-border rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Floating Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast 
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              onClose={removeToast}
            />
          </div>
        ))}
      </div>
    </div>
  );
}