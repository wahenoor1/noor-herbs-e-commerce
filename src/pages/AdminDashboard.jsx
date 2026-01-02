import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, FileText, Users, LogOut, BarChart } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem('noorherbs_admin_auth') === 'true';
    if (!isAdmin) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('noorherbs_admin_auth');
    toast.success('Logged out successfully');
    navigate(createPageUrl('AdminLogin'));
  };

  const adminCards = [
    {
      title: 'Manage Products',
      description: 'Add, edit, and manage product listings',
      icon: Package,
      link: 'AdminProducts',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Manage Blogs',
      description: 'Create and edit blog posts',
      icon: FileText,
      link: 'AdminBlogs',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Manage Affiliates',
      description: 'View and manage affiliate accounts',
      icon: Users,
      link: 'AdminAffiliates',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Noor Herbs Management Panel</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')}>
                <Button variant="outline">View Site</Button>
              </Link>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.link} to={createPageUrl(card.link)}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-orange-600 transition-colors">
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}