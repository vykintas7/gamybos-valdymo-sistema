import React from 'react';
import { useMaterials } from '../hooks/useMaterials';
import { useFormulas } from '../hooks/useFormulas';
import { useClients } from '../hooks/useClients';
import { useComments } from '../hooks/useComments';
import { 
  Package, 
  Beaker, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  MessageCircle,
  Calendar,
  DollarSign,
  Activity,
  FileText,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { materials } = useMaterials();
  const { formulas } = useFormulas();
  const { clients } = useClients();
  const { allComments } = useComments();

  // Materials statistics
  const lowStockMaterials = materials.filter(m => m.currentStock <= m.minStock);
  const expiringMaterials = materials.filter(m => {
    if (!m.expiryDate) return false;
    const expiryDate = new Date(m.expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  });
  const totalInventoryValue = materials.reduce((sum, m) => sum + (m.currentStock * m.unitPrice), 0);

  // Formula statistics
  const pendingFormulas = formulas.filter(f => f.status === 'testing');
  const approvedFormulas = formulas.filter(f => f.status === 'approved');
  const draftFormulas = formulas.filter(f => f.status === 'draft');
  
  // Recent formulas (last 7 days)
  const recentFormulas = formulas.filter(f => {
    const formulaDate = new Date(f.lastModified);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return formulaDate >= weekAgo;
  });

  // Comments statistics
  const unresolvedComments = allComments.filter(c => !c.isResolved);
  const safetyComments = allComments.filter(c => c.type === 'safety' && !c.isResolved);
  const salesFeedback = allComments.filter(c => c.type === 'sales_feedback' && !c.isResolved);

  // Active clients
  const activeClients = clients.filter(c => c.status === 'active');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('lt-LT', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Skydelis</h1>
        <p className="text-gray-600 text-lg">Sistemos apžvalga ir pagrindinė statistika</p>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Iš viso žaliavų</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{materials.length}</p>
              <p className="text-xs text-gray-500 mt-1">Aktyvių sandėlyje</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Formulės</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{formulas.length}</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                {recentFormulas.length} šią savaitę
              </p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm">
              <Beaker className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Aktyvūs klientai</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{activeClients.length}</p>
              <p className="text-xs text-gray-500 mt-1">Iš {clients.length} iš viso</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Atsargų vertė</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{formatCurrency(totalInventoryValue)}</p>
              <p className="text-xs text-gray-500 mt-1">Bendras turtas</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-sm">
              <span className="w-6 h-6 text-yellow-600 font-bold text-lg flex items-center justify-center">€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Įspėjimai</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
              <div>
                <p className="text-sm font-medium text-red-900">Mažos atsargos</p>
                <p className="text-xs text-red-600">{lowStockMaterials.length} žaliavos</p>
              </div>
              <span className="bg-red-200 text-red-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {lowStockMaterials.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
              <div>
                <p className="text-sm font-medium text-orange-900">Baigiasi galiojimas</p>
                <p className="text-xs text-orange-600">Per 30 dienų</p>
              </div>
              <span className="bg-orange-200 text-orange-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {expiringMaterials.length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
              <div>
                <p className="text-sm font-medium text-yellow-900">Neišspręsti komentarai</p>
                <p className="text-xs text-yellow-600">Reikia dėmesio</p>
              </div>
              <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {unresolvedComments.length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Formulių būsenos</h3>
            <Activity className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Patvirtintos</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{approvedFormulas.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Testuojamos</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{pendingFormulas.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Juodraščiai</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{draftFormulas.length}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Patvirtinimo laukia</span>
              <span className="font-semibold text-yellow-600">{pendingFormulas.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Komentarų aktyvumas</h3>
            <MessageCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Iš viso komentarų</span>
              <span className="text-sm font-semibold text-gray-900">{allComments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Neišspręsti</span>
              <span className="text-sm font-semibold text-orange-600">{unresolvedComments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Saugos pastabos</span>
              <span className="text-sm font-semibold text-red-600">{safetyComments.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Pardavimų atsiliepimas</span>
              <span className="text-sm font-semibold text-green-600">{salesFeedback.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Pending Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patvirtinimo laukiančios formulės</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {pendingFormulas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">Visos formulės patvirtintos!</p>
              </div>
            ) : (
              pendingFormulas.slice(0, 5).map((formula) => (
                <div key={formula.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{formula.name}</p>
                    <p className="text-xs text-gray-500">v{formula.version} • {formula.developedBy}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Paskutinį kartą keista: {formatDate(formula.lastModified)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      Testuojama
                    </span>
                  </div>
                </div>
              ))
            )}
            {pendingFormulas.length > 5 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                ... ir dar {pendingFormulas.length - 5} formulės
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kritinės žaliavos</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="space-y-3">
            {lowStockMaterials.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">Visos atsargos pakankamos!</p>
              </div>
            ) : (
              lowStockMaterials.slice(0, 5).map((material) => (
                <div key={`low-stock-${material.id}`} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{material.name}</p>
                    <p className="text-xs text-gray-500">{material.sku} • {material.supplier}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Atsargos: {material.currentStock} {material.unit} (min: {material.minStock})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                      Mažos atsargos
                    </span>
                  </div>
                </div>
              ))
            )}
            {lowStockMaterials.length > 5 && (
              <p className="text-xs text-gray-500 text-center pt-2">
                ... ir dar {lowStockMaterials.length - 5} žaliavos
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;