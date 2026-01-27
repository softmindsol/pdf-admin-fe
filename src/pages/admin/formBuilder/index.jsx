import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useGetAllFormsQuery, useDeleteFormMutation } from '@/store/GlobalApi';
import { useBounce } from '@/hooks/useBounce';
import { DataTablePagination } from '@/components/pagination';
import { Loader2, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FormBuilderManagement() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const searchValue = useBounce(search, 500);
  const [deleteId, setDeleteId] = useState(null);

  const { data: formsData, isLoading } = useGetAllFormsQuery({
    page,
    limit: 10,
    search: searchValue,
  });

  const [deleteForm] = useDeleteFormMutation();

  const handleDelete = async () => {
    try {
      await deleteForm(deleteId).unwrap();
      setDeleteId(null);
      toast.success('Form deleted successfully');
    } catch (error) {
      toast.error('Failed to delete form', error);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Form Builder</h1>
          <p className='text-gray-500'>Manage and create custom forms</p>
        </div>
        <Button onClick={() => navigate('/form-builder/new')}>
          <Plus className='w-4 h-4 mr-2' /> New Form
        </Button>
      </div>

      <div className='flex gap-4'>
        <Input
          placeholder='Search forms...'
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className='max-w-md'
        />
      </div>

      <div className='border rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formsData?.data?.length > 0 ? (
              formsData.data.map(form => (
                <TableRow key={form.id}>
                  <TableCell className='font-medium'>{form.name}</TableCell>
                  <TableCell>{form.description || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        form.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {form.status}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => navigate(`/form-builder/${form.id}`)}
                      >
                        <Eye className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => navigate(`/form-builder/update/${form.id}`)}
                      >
                        <Edit className='w-4 h-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-red-600 hover:text-red-700 hover:bg-red-50'
                        onClick={() => setDeleteId(form.id)}
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan='4' className='text-center py-8 text-gray-500'>
                  No forms found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {formsData?.pagination && (
        <DataTablePagination
          page={page}
          setPage={setPage}
          pageCount={formsData.pagination.totalPages}
          isLoading={isLoading}
          currentPage={page}
          totalItems={formsData.pagination.totalCount}
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Form</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this form? This action cannot be undone.
          </AlertDialogDescription>
          <div className='flex gap-3 justify-end'>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className='bg-red-600'>
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
