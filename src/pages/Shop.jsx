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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            Merchant's Shop
          </h1>
          <p className="mt-2 text-slate-400">Spend your hard-earned coins on epic loot!</p>
        </div>
        
        <div className="flex items-center gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4 shadow-sm">
          <span className="text-sm font-medium text-slate-300">Your Wallet:</span>
          <CoinBadge amount={user?.coins || 0} className="text-lg px-3 py-1" />
        </div>
      </div>

      {/* Backgrounds Section */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
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
        <h2 className="text-xl font-bold text-white mb-4 mt-12 flex items-center gap-2">
          <UserIcon className="h-5 w-5 text-accent" />
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
      "group overflow-hidden rounded-xl border flex flex-col bg-surface shadow-md transition-all",
      isEquipped ? "border-primary shadow-primary/20" : "border-slate-800 hover:border-slate-700"
    )}>
      {/* Item Image */}
      <div className={cn(
        "relative w-full overflow-hidden bg-slate-900 flex items-center justify-center p-4",
        isAvatar ? "aspect-square" : "aspect-video"
      )}>
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className={cn(
            "object-cover transition-transform group-hover:scale-105",
            isAvatar ? "h-full w-full rounded-full border-4 border-slate-700" : "absolute inset-0 h-full w-full"
          )} 
        />
        {/* Overlay for price/status */}
        <div className="absolute right-2 top-2">
          {isEquipped ? (
            <span className="rounded-full bg-primary px-2 py-1 text-xs font-bold text-white shadow-sm">
              Equipped
            </span>
          ) : isOwned ? (
            <span className="rounded-full bg-slate-700 px-2 py-1 text-xs font-bold text-white shadow-sm">
              Owned
            </span>
          ) : (
            <CoinBadge amount={item.price} />
          )}
        </div>
      </div>

      {/* Details & Actions */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-semibold text-white">{item.name}</h3>
          {item.description && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2">{item.description}</p>
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
