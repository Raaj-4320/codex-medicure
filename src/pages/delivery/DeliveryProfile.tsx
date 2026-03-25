import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Star, 
  TrendingUp, 
  ChevronRight, 
  Camera, 
  LogOut, 
  Settings, 
  Bell, 
  Lock,
  Building,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { MOCK_DELIVERY_PERFORMANCE } from '../../staticData';
import { motion } from 'motion/react';

const DeliveryProfile: React.FC = () => {
  const { profile, logout } = useAuth();
  const performance = MOCK_DELIVERY_PERFORMANCE;

  return (
    <div className="space-y-6 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col items-center py-8 bg-white rounded-[40px] shadow-sm border border-black/5 relative overflow-hidden">
        <div className="relative mb-4">
          <div className="w-28 h-28 rounded-[40px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={profile?.photoURL || 'https://picsum.photos/seed/delivery/200/200'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
            <Camera size={18} />
          </button>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900">{profile?.displayName || 'John Delivery'}</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">
            <ShieldCheck size={12} />
            Verified Partner
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
            <Star size={12} />
            {performance.averageRating} Rating
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <TrendingUp size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Deliveries</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{performance.totalDeliveries}</div>
          <p className="text-[10px] text-emerald-500 font-bold mt-1">+12 this week</p>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-black/5">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <MapPin size={16} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Distance</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{performance.distanceTraveled} <span className="text-sm font-normal text-slate-400">km</span></div>
          <p className="text-[10px] text-blue-500 font-bold mt-1">Fuel efficient</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Personal Information</h3>
        </div>
        <div className="divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Phone</p>
                <p className="text-sm font-bold text-slate-900">+91 98765 43210</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600">Edit</button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Mail size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email</p>
                <p className="text-sm font-bold text-slate-900">{profile?.email}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600">Edit</button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                <Building size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vehicle</p>
                <p className="text-sm font-bold text-slate-900">Honda Activa (GJ01-AB-1234)</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600">Edit</button>
          </div>
        </div>
      </div>

      {/* Documents & Compliance */}
      <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Documents & KYC</h3>
        </div>
        <div className="divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Driving License</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Verified</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Aadhar Card</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Verified</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </div>
      </div>

      {/* Settings & Logout */}
      <div className="space-y-3">
        <button className="w-full bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center">
              <Settings size={20} />
            </div>
            <span className="text-sm font-bold text-slate-900">App Settings</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
        <button 
          onClick={logout}
          className="w-full bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between group active:bg-red-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center group-active:bg-red-200">
              <LogOut size={20} />
            </div>
            <span className="text-sm font-bold text-red-600">Logout</span>
          </div>
          <ChevronRight size={18} className="text-red-300" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryProfile;
