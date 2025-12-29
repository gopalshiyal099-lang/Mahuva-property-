
import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { View, Property, Lead, PropertyType, PropertyStatus, LeadStatus, Message } from './types';
import { MOCK_PROPERTIES, MOCK_LEADS } from './constants';
import { Search, Plus, DollarSign, Key, Users, TrendingUp, Filter, MoreVertical, Phone, MessageCircle, Send, MessageSquare, Home } from 'lucide-react';
import { generatePropertyDescription, generateCommunicationDraft } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [commType, setCommType] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [aiDraft, setAiDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const stats = useMemo(() => {
    return {
      totalValue: properties.filter(p => p.type === PropertyType.SALE).reduce((acc, curr) => acc + curr.price, 0),
      activeRentals: properties.filter(p => p.type === PropertyType.RENTAL && p.status === PropertyStatus.AVAILABLE).length,
      totalLeads: leads.length,
      conversionRate: 12.5, // Mocked
    };
  }, [properties, leads]);

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendComm = () => {
    if (!selectedLead || !aiDraft) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      leadId: selectedLead.id,
      type: commType,
      content: aiDraft,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages([newMessage, ...messages]);
    setIsCommModalOpen(false);
    setAiDraft('');
    alert(`Success: ${commType.toUpperCase()} sent to ${selectedLead.name}`);
  };

  const handleGenerateDraft = async () => {
    if (!selectedLead) return;
    setIsGenerating(true);
    const property = properties.find(p => p.id === selectedLead.interestedIn);
    const draft = await generateCommunicationDraft(
      commType,
      selectedLead.name,
      property?.title || "our listings"
    );
    setAiDraft(draft);
    setIsGenerating(false);
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50 flex items-center gap-2">
            <Filter size={18} /> Filters
          </button>
          <button onClick={() => setIsPropertyModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2">
            <Plus size={18} /> New Listing
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Inventory Value" value={`$${(stats.totalValue / 1000000).toFixed(1)}M`} icon={<DollarSign size={24} />} trend="+12%" trendUp={true} />
        <StatCard label="Active Rentals" value={stats.activeRentals} icon={<Key size={24} />} trend="+4" trendUp={true} />
        <StatCard label="Total Leads" value={stats.totalLeads} icon={<Users size={24} />} trend="+8" trendUp={true} />
        <StatCard label="Conversion Rate" value={`${stats.conversionRate}%`} icon={<TrendingUp size={24} />} trend="-1.2%" trendUp={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Leads</h3>
            <button onClick={() => setActiveView('leads')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Interest</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.slice(0, 5).map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {properties.find(p => p.id === lead.interestedIn)?.title || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                        lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                        lead.status === LeadStatus.CONTACTED ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {messages.length > 0 ? messages.slice(0, 5).map(msg => (
              <div key={msg.id} className="flex gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${msg.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                  {msg.type === 'whatsapp' ? <MessageCircle size={18} /> : <Send size={18} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {msg.type.toUpperCase()} sent to {leads.find(l => l.id === msg.leadId)?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{msg.content}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 text-sm text-center py-10">No recent communications.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Property Inventory</h2>
          <p className="text-slate-500">Manage your sales and rental listings.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search properties..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setIsPropertyModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 whitespace-nowrap">
            <Plus size={18} /> Add Property
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-48 overflow-hidden">
              <img src={property.imageUrl} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/90 shadow-sm ${property.type === PropertyType.SALE ? 'text-indigo-600' : 'text-emerald-600'}`}>
                  {property.type}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-white/90 shadow-sm ${
                  property.status === PropertyStatus.AVAILABLE ? 'text-emerald-600' : 
                  property.status === PropertyStatus.PENDING ? 'text-orange-600' : 'text-slate-600'
                }`}>
                  {property.status}
                </span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{property.title}</h3>
                <p className="font-bold text-indigo-600 text-lg">
                  {property.type === PropertyType.SALE ? `$${(property.price / 1000).toFixed(0)}k` : `$${property.price}/mo`}
                </p>
              </div>
              <p className="text-slate-500 text-sm mb-4 flex items-center gap-1">
                <Filter size={14} /> {property.address}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-slate-600 text-sm">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1 font-medium"><strong>{property.beds}</strong> Beds</span>
                  <span className="flex items-center gap-1 font-medium"><strong>{property.baths}</strong> Baths</span>
                  <span className="flex items-center gap-1 font-medium"><strong>{property.sqft}</strong> sqft</span>
                </div>
                <button className="text-slate-400 hover:text-indigo-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lead Management</h2>
          <p className="text-slate-500">Engage and nurture your potential clients.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search leads..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
          </div>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700">Add Lead</button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Interest</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-50 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{lead.name}</p>
                      <p className="text-sm text-slate-500">{lead.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase border ${
                    lead.status === LeadStatus.NEW ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    lead.status === LeadStatus.CONTACTED ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {lead.source}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-900 font-medium">{properties.find(p => p.id === lead.interestedIn)?.title}</p>
                  <p className="text-xs text-slate-500">Property #{lead.interestedIn}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { setSelectedLead(lead); setCommType('whatsapp'); setIsCommModalOpen(true); }}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Send WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </button>
                    <button 
                      onClick={() => { setSelectedLead(lead); setCommType('sms'); setIsCommModalOpen(true); }}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Send SMS"
                    >
                      <Send size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                      <Phone size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pl-64 pb-20">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="max-w-7xl mx-auto p-8">
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'inventory' && renderInventory()}
        {activeView === 'leads' && renderLeads()}
        {activeView === 'messages' && (
          <div className="flex flex-col items-center justify-center h-[70vh] text-slate-500">
             <MessageSquare size={64} className="mb-4 text-slate-300" />
             <h2 className="text-xl font-bold text-slate-900">Communication Hub</h2>
             <p className="text-sm">Consolidated messaging history coming soon.</p>
          </div>
        )}
      </main>

      {/* Communication Modal with AI Draft */}
      {isCommModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${commType === 'whatsapp' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                  {commType === 'whatsapp' ? <MessageCircle size={24} /> : <Send size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Send {commType === 'whatsapp' ? 'WhatsApp' : 'SMS'}</h3>
                  <p className="text-xs text-slate-500">To: {selectedLead.name} ({selectedLead.phone})</p>
                </div>
              </div>
              <button onClick={() => setIsCommModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message Content</label>
                <textarea 
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  placeholder="Type your message or use AI to generate a professional draft..."
                  value={aiDraft}
                  onChange={(e) => setAiDraft(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button 
                  onClick={handleGenerateDraft}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  <TrendingUp size={16} /> {isGenerating ? 'Generating...' : 'AI Generate Draft'}
                </button>
                <p className="text-[10px] text-slate-400 italic">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsCommModalOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendComm}
                disabled={!aiDraft}
                className="flex-2 px-8 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-300"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Property Modal Shell */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold">Add New Property Listing</h3>
                <button onClick={() => setIsPropertyModalOpen(false)} className="text-slate-400">×</button>
             </div>
             <div className="p-8 text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home size={40} />
                </div>
                <p className="text-slate-600">Inventory addition interface. In a production app, you would have a comprehensive form here with file uploads and AI auto-description generation.</p>
                <button onClick={() => setIsPropertyModalOpen(false)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg">Dismiss</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
