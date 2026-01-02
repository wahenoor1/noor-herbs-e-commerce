import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const categories = ["History & Culture", "Health & Wellness", "Product Knowledge", "Nutrition", "Research"];

export default function AdminBlogs() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    const isAdmin = localStorage.getItem('noorherbs_admin_auth') === 'true';
    if (!isAdmin) {
      navigate(createPageUrl('AdminLogin'));
    }
  }, [navigate]);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Health & Wellness',
    author: 'Noor Herbs Team',
    read_time: '5 min read',
    published: false,
    featured: false
  });

  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: () => base44.entities.BlogPost.list('-created_date')
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.BlogPost.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success("Blog post created successfully!");
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to create blog post")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.BlogPost.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success("Blog post updated successfully!");
      setOpen(false);
      resetForm();
    },
    onError: () => toast.error("Failed to update blog post")
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BlogPost.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast.success("Blog post deleted successfully!");
    },
    onError: () => toast.error("Failed to delete blog post")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };

    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData(post);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '', slug: '', excerpt: '', content: '', image_url: '',
      category: 'Health & Wellness', author: 'Noor Herbs Team',
      read_time: '5 min read', published: false, featured: false
    });
    setEditingPost(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, image_url: file_url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    }
    setUploading(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Blog Posts</h1>
            <p className="text-gray-600">Create, edit, or remove blog articles</p>
          </div>
          <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus className="w-5 h-5 mr-2" />
                Add Blog Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label>Slug (URL-friendly)</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated-from-title"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Read Time</Label>
                    <Input
                      value={formData.read_time}
                      onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                      placeholder="5 min read"
                    />
                  </div>
                </div>

                <div>
                  <Label>Excerpt / Short Description *</Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>Featured Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                    <Button type="button" variant="outline" disabled={uploading} onClick={() => document.getElementById('blog-image-upload').click()}>
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </Button>
                    <input
                      id="blog-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {formData.image_url && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 h-32 w-full object-cover rounded" />
                  )}
                </div>

                <div>
                  <Label>Content (HTML) *</Label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                    modules={modules}
                    className="bg-white rounded"
                  />
                </div>

                <div>
                  <Label>Author</Label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Published</Label>
                    <Switch
                      checked={formData.published}
                      onCheckedChange={(val) => setFormData({ ...formData, published: val })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Featured Post</Label>
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(val) => setFormData({ ...formData, featured: val })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={createMutation.isPending || updateMutation.isPending}>
                  {createMutation.isPending || updateMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    editingPost ? 'Update Post' : 'Create Post'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      {post.image_url && (
                        <img src={post.image_url} alt={post.title} className="w-16 h-12 object-cover rounded" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.author}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {post.published ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Published</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">Draft</span>
                        )}
                        {post.featured && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">Featured</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
}