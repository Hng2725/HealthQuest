import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { CoinBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import { ShoppingBag, Sparkles, User as UserIcon } from 'lucide-react';
import { cn } from '../utils/cn';

const Shop = () => {
  const { user, fetchProfile } = useAuthStore();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchShopItems();
  }, []);

  const fetchShopItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shop');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch shop items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (itemId) => {
    setActionLoading(itemId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/shop/purchase/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Purchase successful!');
      
      // Refresh user profile to get new coin balance and unlocked items
      await fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to purchase item');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEquip = async (itemId) => {
    setActionLoading(itemId);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/shop/equip/${itemId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh user profile to update current background
      await fetchProfile();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to equip item');
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-primary"></span>
      </div>
    );
  }

  const backgrounds = items.filter(item => item.type === 'background');
  const avatars = items.filter(item => item.type === 'avatar');

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <ShoppingBag className="h-10 w-10 text-primary" />
            Merchant's Shop
          </h1>
          <p className="mt-2 text-slate-500 font-medium">Spend your hard-earned coins on epic loot!</p>
        </div>
        
        <div className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-primary/10 p-4 shadow-sm">
          <span className="text-sm font-bold text-slate-700">Your Wallet:</span>
          <CoinBadge amount={user?.coins || 0} className="text-lg px-3 py-1 shadow-sm bg-white" />
        </div>
      </div>

      {/* Backgrounds Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          Backgrounds
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {backgrounds.map((item) => {
            const isOwned = user?.unlockedBackgrounds?.includes(item._id);
            const isEquipped = user?.currentBackground === item.imageUrl;
            
            return (
              <ShopItemCard 
                key={item._id}
                item={item}
                userCoins={user?.coins || 0}
                isOwned={isOwned}
                isEquipped={isEquipped}
                onPurchase={() => handlePurchase(item._id)}
                onEquip={() => handleEquip(item._id)}
                isLoading={actionLoading === item._id}
              />
            );
          })}
        </div>
      </section>

      {/* Avatars Section */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 mt-12 flex items-center gap-2">
          <UserIcon className="h-6 w-6 text-accent" />
          Avatars
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {avatars.map((item) => {
            const isEquipped = user?.avatar === item.imageUrl;
            
            return (
              <ShopItemCard 
                key={item._id}
                item={item}
                userCoins={user?.coins || 0}
                isOwned={false} // Assuming avatars are single-purchase overrides for simplicity here
                isEquipped={isEquipped}
                onPurchase={() => handlePurchase(item._id)}
                isLoading={actionLoading === item._id}
                isAvatar
              />
            );
          })}
        </div>
      </section>
    </div>
  );
};

// Subcomponent for individual shop items
const ShopItemCard = ({ 
  item, 
  userCoins, 
  isOwned, 
  isEquipped, 
  onPurchase, 
  onEquip, 
  isLoading,
  isAvatar
}) => {
  const canAfford = userCoins >= item.price;

  return (
    <div className={cn(
      "group overflow-hidden rounded-3xl border-2 flex flex-col bg-white shadow-md transition-all duration-300",
      isEquipped ? "border-primary shadow-[0_8px_30px_rgba(251,191,36,0.3)] scale-[1.02]" : "border-amber-100 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
    )}>
      {/* Item Image */}
      <div className={cn(
        "relative w-full overflow-hidden bg-amber-50 flex items-center justify-center p-4",
        isAvatar ? "aspect-square" : "aspect-video"
      )}>
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-110",
            isAvatar ? "h-full w-full rounded-full border-4 border-white shadow-md" : "absolute inset-0 h-full w-full opacity-90 group-hover:opacity-100"
          )} 
        />
        <div className="absolute right-3 top-3">
          {isEquipped ? (
            <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-slate-800 shadow-md">
              Equipped
            </span>
          ) : isOwned ? (
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-600 shadow-sm border border-emerald-200">
              Owned
            </span>
          ) : (
            <CoinBadge amount={item.price} />
          )}
        </div>
      </div>

      {/* Details & Actions */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-sm font-medium text-slate-500 line-clamp-2">{item.description}</p>
          )}
        </div>

        <div className="mt-4">
          {isEquipped ? (
            <Button variant="outline" className="w-full" disabled>
              In Use
            </Button>
          ) : isOwned && !isAvatar ? (
            <Button variant="primary" className="w-full" onClick={onEquip} isLoading={isLoading}>
              Equip
            </Button>
          ) : (
            <Button 
              variant={canAfford ? "accent" : "outline"} 
              className="w-full" 
              onClick={onPurchase} 
              disabled={!canAfford || isLoading}
              isLoading={isLoading}
            >
              {canAfford ? 'Purchase' : 'Not enough coins'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
