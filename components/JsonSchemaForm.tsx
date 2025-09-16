
import React from 'react';
import type { JSONSchema, AgentConfig } from '../types';

interface JsonSchemaFormProps {
  schema: JSONSchema;
  formData: AgentConfig;
  onChange: (newFormData: AgentConfig) => void;
}

const FormField: React.FC<{
  fieldKey: string;
  properties: JSONSchema['properties'][string];
  value: any;
  onChange: (fieldKey: string, value: any) => void;
}> = ({ fieldKey, properties, value, onChange }) => {
  const { title, type, description, enum: enumOptions, 'ui:widget': widget, minimum, maximum } = properties;
  const id = `form-field-${fieldKey}`;

  const renderInput = () => {
    if (enumOptions) {
      return (
        <select
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {enumOptions.map((option) => (
            <option key={option} value={option}>
              {String(option)}
            </option>
          ))}
        </select>
      );
    }
    
    if (widget === 'textarea') {
      return (
        <textarea
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          rows={5}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      );
    }

    if (type === 'boolean') {
      return (
        <div className="flex items-center h-10">
          <input
            id={id}
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(fieldKey, e.target.checked)}
            className="h-4 w-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
          />
        </div>
      );
    }

    if (type === 'number' || type === 'integer') {
       const isRange = typeof minimum === 'number' && typeof maximum === 'number';
      return (
        <div className="flex items-center space-x-2">
            <input
                id={id}
                type={isRange ? "range" : "number"}
                value={value ?? ''}
                min={minimum}
                max={maximum}
                step={isRange ? 0.01 : undefined}
                onChange={(e) => onChange(fieldKey, parseFloat(e.target.value))}
                className={`w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isRange ? 'h-2 appearance-none cursor-pointer' : ''}`}
            />
            {isRange && <span className="text-sm text-gray-400 w-12 text-center">{Number(value).toFixed(2)}</span>}
        </div>
      );
    }

    return (
      <input
        id={id}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm p-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    );
  };
  
  const label = title || fieldKey;

  return (
    <div className="mb-4">
      <label htmlFor={id} className={`block text-sm font-medium text-gray-300 ${type === 'boolean' ? 'inline-block mr-3' : 'mb-2'}`}>
        {label}
      </label>
      <div className={`${type === 'boolean' ? 'inline-flex' : ''}`}>
        {renderInput()}
      </div>
      {description && type !== 'boolean' && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};


export const JsonSchemaForm: React.FC<JsonSchemaFormProps> = ({ schema, formData, onChange }) => {
  const handleFieldChange = (key: string, value: any) => {
    onChange({
      ...formData,
      [key]: value,
    });
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {Object.entries(schema.properties).map(([key, properties]) => (
        <FormField
          key={key}
          fieldKey={key}
          properties={properties}
          value={formData[key]}
          onChange={handleFieldChange}
        />
      ))}
    </form>
  );
};
