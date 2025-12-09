import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface VehicleCategory {
  id: string;
  name: string;
}

interface VehicleSubcategory {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  organization_id: string;
  vehicle_categories?: VehicleCategory;
}

export default function VehicleSubcategoriesManagement() {
  const [subcategories, setSubcategories] = useState<VehicleSubcategory[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<VehicleSubcategory | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadCategories();
    loadSubcategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_categories')
        .select('id, name')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      toast.error('Erro ao carregar categorias');
    }
  };

  const loadSubcategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vehicle_subcategories')
        .select(`
          *,
          vehicle_categories (
            id,
            name
          )
        `)
        .order('category_id', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSubcategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar subcategorias:', error);
      toast.error('Erro ao carregar subcategorias');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (subcategory?: VehicleSubcategory) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setFormData({
        category_id: subcategory.category_id,
        name: subcategory.name,
        description: subcategory.description || '',
        display_order: subcategory.display_order,
        is_active: subcategory.is_active,
      });
    } else {
      setEditingSubcategory(null);
      setFormData({
        category_id: categories[0]?.id || '',
        name: '',
        description: '',
        display_order: 0,
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingSubcategory(null);
    setFormData({
      category_id: '',
      name: '',
      description: '',
      display_order: 0,
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: systemUser } = await supabase
        .from('system_users')
        .select('organization_id')
        .eq('id', user.id)
        .single();

      if (!systemUser) throw new Error('Usuário não encontrado');

      if (editingSubcategory) {
        const { error } = await supabase
          .from('vehicle_subcategories')
          .update({
            category_id: formData.category_id,
            name: formData.name,
            description: formData.description || null,
            display_order: formData.display_order,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingSubcategory.id);

        if (error) throw error;
        toast.success('Subcategoria atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('vehicle_subcategories')
          .insert({
            organization_id: systemUser.organization_id,
            category_id: formData.category_id,
            name: formData.name,
            description: formData.description || null,
            display_order: formData.display_order,
            is_active: formData.is_active,
            created_by: user.id,
          });

        if (error) throw error;
        toast.success('Subcategoria criada com sucesso');
      }

      handleCloseDialog();
      loadSubcategories();
    } catch (error) {
      console.error('Erro ao salvar subcategoria:', error);
      toast.error('Erro ao salvar subcategoria');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta subcategoria?')) return;

    try {
      const { error } = await supabase
        .from('vehicle_subcategories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Subcategoria excluída com sucesso');
      loadSubcategories();
    } catch (error) {
      console.error('Erro ao excluir subcategoria:', error);
      toast.error('Erro ao excluir subcategoria');
    }
  };

  const filteredSubcategories = filterCategory === 'all'
    ? subcategories
    : subcategories.filter(s => s.category_id === filterCategory);

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Subcategorias de Veículos</CardTitle>
              <CardDescription>
                Gerencie as subcategorias de veículos (Básico, Padron, Executivo, etc.)
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()} disabled={categories.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Subcategoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Filtrar por Categoria</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcategories.map((subcategory) => (
                <TableRow key={subcategory.id}>
                  <TableCell>
                    <Badge variant="outline">
                      {subcategory.vehicle_categories?.name || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{subcategory.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {subcategory.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={subcategory.is_active ? 'default' : 'secondary'}>
                      {subcategory.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(subcategory)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(subcategory.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingSubcategory ? 'Editar Subcategoria' : 'Nova Subcategoria'}
              </DialogTitle>
              <DialogDescription>
                {editingSubcategory
                  ? 'Atualize as informações da subcategoria'
                  : 'Preencha os dados para criar uma nova subcategoria'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category_id">Categoria *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Básico, Padron, Executivo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição da subcategoria"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de Exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  min={0}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Subcategoria ativa</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingSubcategory ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
