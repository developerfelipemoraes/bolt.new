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
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Globe } from 'lucide-react';

interface ChassisManufacturer {
  id: string;
  name: string;
  country: string | null;
  website: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  organization_id: string;
}

export default function ChassisManufacturersManagement() {
  const [manufacturers, setManufacturers] = useState<ChassisManufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<ChassisManufacturer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: 'Brasil',
    website: '',
    notes: '',
    is_active: true,
  });

  useEffect(() => {
    loadManufacturers();
  }, []);

  const loadManufacturers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('chassis_manufacturers')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setManufacturers(data || []);
    } catch (error) {
      console.error('Erro ao carregar fabricantes:', error);
      toast.error('Erro ao carregar fabricantes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (manufacturer?: ChassisManufacturer) => {
    if (manufacturer) {
      setEditingManufacturer(manufacturer);
      setFormData({
        name: manufacturer.name,
        country: manufacturer.country || 'Brasil',
        website: manufacturer.website || '',
        notes: manufacturer.notes || '',
        is_active: manufacturer.is_active,
      });
    } else {
      setEditingManufacturer(null);
      setFormData({
        name: '',
        country: 'Brasil',
        website: '',
        notes: '',
        is_active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingManufacturer(null);
    setFormData({
      name: '',
      country: 'Brasil',
      website: '',
      notes: '',
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

      if (editingManufacturer) {
        const { error } = await supabase
          .from('chassis_manufacturers')
          .update({
            name: formData.name,
            country: formData.country || null,
            website: formData.website || null,
            notes: formData.notes || null,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingManufacturer.id);

        if (error) throw error;
        toast.success('Fabricante atualizado com sucesso');
      } else {
        const { error } = await supabase
          .from('chassis_manufacturers')
          .insert({
            organization_id: systemUser.organization_id,
            name: formData.name,
            country: formData.country || null,
            website: formData.website || null,
            notes: formData.notes || null,
            is_active: formData.is_active,
            created_by: user.id,
          });

        if (error) throw error;
        toast.success('Fabricante criado com sucesso');
      }

      handleCloseDialog();
      loadManufacturers();
    } catch (error) {
      console.error('Erro ao salvar fabricante:', error);
      toast.error('Erro ao salvar fabricante');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este fabricante?')) return;

    try {
      const { error } = await supabase
        .from('chassis_manufacturers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Fabricante excluído com sucesso');
      loadManufacturers();
    } catch (error) {
      console.error('Erro ao excluir fabricante:', error);
      toast.error('Erro ao excluir fabricante. Verifique se não há modelos associados.');
    }
  };

  if (loading) {
    return <div className="p-8">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Fabricantes de Chassi</CardTitle>
              <CardDescription>
                Gerencie os fabricantes de chassi (Agrale, Mercedes-Benz, Volvo, etc.)
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fabricante
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Website</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {manufacturers.map((manufacturer) => (
                <TableRow key={manufacturer.id}>
                  <TableCell className="font-medium">{manufacturer.name}</TableCell>
                  <TableCell>{manufacturer.country || '-'}</TableCell>
                  <TableCell>
                    {manufacturer.website ? (
                      <a
                        href={manufacturer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        Site
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={manufacturer.is_active ? 'default' : 'secondary'}>
                      {manufacturer.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(manufacturer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(manufacturer.id)}
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
                {editingManufacturer ? 'Editar Fabricante' : 'Novo Fabricante'}
              </DialogTitle>
              <DialogDescription>
                {editingManufacturer
                  ? 'Atualize as informações do fabricante'
                  : 'Preencha os dados para criar um novo fabricante'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Agrale, Mercedes-Benz, Volvo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Ex: Brasil, Alemanha, Suécia"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.exemplo.com.br"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações adicionais sobre o fabricante"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Fabricante ativo</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {editingManufacturer ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
