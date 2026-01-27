import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  Accordion as AccordionComponent,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button as DeleteButton } from '@/components/ui/button';
import {
  useCreateFormMutation,
  useUpdateFormMutation,
  useGetFormByIdQuery,
} from '@/store/GlobalApi';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2 } from 'lucide-react';

const fieldTypeOptions = [
  { label: 'Text Input', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Select', value: 'select' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Radio', value: 'radio' },
  { label: 'Date', value: 'date' },
  { label: 'File Upload', value: 'file' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Form name is required'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  fields: z.array(
    z.object({
      label: z.string().min(1, 'Field label is required'),
      fieldType: z.string().min(1, 'Field type is required'),
      placeholder: z.string().optional(),
      required: z.boolean().default(false),
      options: z.string().optional(),
      order: z.number().default(0),
    }),
  ),
});

export default function FormBuilderForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { data: formData, isLoading: isFormLoading } = useGetFormByIdQuery(id, {
    skip: !id,
  });
  const [createForm] = useCreateFormMutation();
  const [updateForm] = useUpdateFormMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      fields: [
        {
          label: '',
          fieldType: '',
          placeholder: '',
          required: false,
          options: '',
          order: 0,
        },
      ],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'fields',
  });

  useEffect(() => {
    if (formData && isEditMode) {
      form.reset({
        name: formData.name,
        description: formData.description,
        status: formData.status,
        fields: formData.fields || [],
      });
    }
  }, [formData, isEditMode, form]);

  const onSubmit = async data => {
    try {
      if (isEditMode) {
        await updateForm({ id, ...data }).unwrap();
        toast.success('Form updated successfully');
      } else {
        await createForm(data).unwrap();
        toast.success('Form created successfully');
      }
      navigate('/form-builder');
    } catch (error) {
      toast.error(error.data?.message || 'Failed to save form');
    }
  };

  if (isFormLoading && isEditMode) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl'>
      <div>
        <h1 className='text-3xl font-bold'>
          {isEditMode ? 'Edit Form' : 'Create New Form'}
        </h1>
        <p className='text-gray-500 mt-2'>
          {isEditMode
            ? 'Update form details and fields'
            : 'Build a custom form with multiple field types'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
              <CardDescription>Basic information about your form</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form Name</FormLabel>
                    <FormControl>
                      <Input placeholder='e.g., Customer Feedback Form' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe what this form is for...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <div>
                <CardTitle>Form Fields</CardTitle>
                <CardDescription>Add and configure form fields</CardDescription>
              </div>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() =>
                  append({
                    label: '',
                    fieldType: '',
                    placeholder: '',
                    required: false,
                    options: '',
                    order: fields.length,
                  })
                }
              >
                <Plus className='w-4 h-4 mr-2' /> Add Field
              </Button>
            </CardHeader>
            <CardContent>
              {fields.length === 0 ? (
                <p className='text-center text-gray-500 py-8'>
                  No fields added yet. Click "Add Field" to start building your form.
                </p>
              ) : (
                <div className='space-y-4'>
                  {fields.map((field, index) => (
                    <Card key={field.id} className='bg-gray-50'>
                      <CardContent className='pt-4 space-y-4'>
                        <div className='flex justify-between items-center mb-4'>
                          <h4 className='font-semibold'>Field {index + 1}</h4>
                          <div className='flex gap-2'>
                            {index > 0 && (
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => move(index, index - 1)}
                              >
                                ↑
                              </Button>
                            )}
                            {index < fields.length - 1 && (
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => move(index, index + 1)}
                              >
                                ↓
                              </Button>
                            )}
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              className='text-red-600 hover:text-red-700 hover:bg-red-50'
                              onClick={() => remove(index)}
                            >
                              <Trash2 className='w-4 h-4' />
                            </Button>
                          </div>
                        </div>

                        <div className='grid md:grid-cols-2 gap-4'>
                          <FormField
                            control={form.control}
                            name={`fields.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                  <Input placeholder='Field label' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`fields.${index}.fieldType`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Type</FormLabel>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {fieldTypeOptions.map(option => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`fields.${index}.placeholder`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Placeholder (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder='Placeholder text' {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {form.watch(`fields.${index}.fieldType`) &&
                          ['select', 'radio', 'checkbox'].includes(
                            form.watch(`fields.${index}.fieldType`),
                          ) && (
                            <FormField
                              control={form.control}
                              name={`fields.${index}.options`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Options (comma-separated)</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder='Option 1, Option 2, Option 3'
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                        <FormField
                          control={form.control}
                          name={`fields.${index}.required`}
                          render={({ field }) => (
                            <FormItem className='flex items-center gap-2'>
                              <FormControl>
                                <input
                                  type='checkbox'
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className='w-4 h-4'
                                />
                              </FormControl>
                              <FormLabel className='mt-0'>Required Field</FormLabel>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className='flex gap-4 justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => navigate('/form-builder')}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              )}
              {isEditMode ? 'Update Form' : 'Create Form'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
