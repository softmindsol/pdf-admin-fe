import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useGetFormByIdQuery } from '@/store/GlobalApi';
import { Loader2, Edit, ArrowLeft } from 'lucide-react';

const fieldTypeLabels = {
  text: 'Text Input',
  email: 'Email',
  number: 'Number',
  textarea: 'Textarea',
  select: 'Select',
  checkbox: 'Checkbox',
  radio: 'Radio',
  date: 'Date',
  file: 'File Upload',
};

export default function ViewFormBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: formData, isLoading } = useGetFormByIdQuery(id);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <Loader2 className='w-8 h-8 animate-spin' />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 mb-4'>Form not found</p>
        <Button onClick={() => navigate('/form-builder')}>Back to Forms</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-4xl'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button variant='outline' size='icon' onClick={() => navigate('/form-builder')}>
            <ArrowLeft className='w-4 h-4' />
          </Button>
          <div>
            <h1 className='text-3xl font-bold'>{formData.name}</h1>
            <p className='text-gray-500'>View form details and fields</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/form-builder/update/${id}`)}>
          <Edit className='w-4 h-4 mr-2' /> Edit Form
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form Information</CardTitle>
          <CardDescription>Basic details about this form</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <p className='text-sm font-semibold text-gray-600'>Form Name</p>
            <p className='text-lg'>{formData.name}</p>
          </div>

          {formData.description && (
            <div>
              <p className='text-sm font-semibold text-gray-600'>Description</p>
              <p className='text-lg'>{formData.description}</p>
            </div>
          )}

          <div>
            <p className='text-sm font-semibold text-gray-600'>Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                formData.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {formData.status}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
          <CardDescription>
            {formData.fields?.length || 0} fields in this form
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formData.fields && formData.fields.length > 0 ? (
            <div className='space-y-4'>
              {formData.fields.map((field, index) => (
                <Card key={field.id || index} className='bg-gray-50'>
                  <CardContent className='pt-4'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-xs font-semibold text-gray-600 uppercase'>
                          Label
                        </p>
                        <p className='text-lg font-medium'>{field.label}</p>
                      </div>

                      <div>
                        <p className='text-xs font-semibold text-gray-600 uppercase'>
                          Type
                        </p>
                        <p className='text-lg font-medium'>
                          {fieldTypeLabels[field.fieldType] || field.fieldType}
                        </p>
                      </div>

                      {field.placeholder && (
                        <div>
                          <p className='text-xs font-semibold text-gray-600 uppercase'>
                            Placeholder
                          </p>
                          <p className='text-sm text-gray-700'>{field.placeholder}</p>
                        </div>
                      )}

                      <div>
                        <p className='text-xs font-semibold text-gray-600 uppercase'>
                          Required
                        </p>
                        <p className='text-sm'>
                          {field.required ? (
                            <span className='text-red-600 font-semibold'>Yes</span>
                          ) : (
                            <span className='text-gray-600'>No</span>
                          )}
                        </p>
                      </div>

                      {field.options && (
                        <div className='md:col-span-2'>
                          <p className='text-xs font-semibold text-gray-600 uppercase mb-2'>
                            Options
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            {field.options.split(',').map((option, i) => (
                              <span
                                key={i}
                                className='px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm'
                              >
                                {option.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className='text-center text-gray-500 py-8'>No fields added to this form</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
