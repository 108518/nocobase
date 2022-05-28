import { ISchema } from '@formily/react';
import { uid } from '@formily/shared';
import { cloneDeep } from 'lodash';
import React from 'react';
import { ForeignKey1, ForeignKey2, SourceKey, TargetKey, ThroughCollection } from './components';
import { defaultProps, recordPickerSelector, recordPickerViewer } from './properties';
import { IField } from './types';

export const m2m: IField = {
  name: 'm2m',
  type: 'object',
  group: 'relation',
  order: 6,
  title: '{{t("Many to many")}}',
  isAssociation: true,
  default: {
    type: 'belongsToMany',
    // name,
    uiSchema: {
      // title,
      'x-component': 'RecordPicker',
      'x-component-props': {
        // mode: 'tags',
        multiple: true,
        fieldNames: {
          label: 'id',
          value: 'id',
        },
      },
    },
    reverseField: {
      interface: 'm2m',
      type: 'belongsToMany',
      // name,
      uiSchema: {
        // title,
        'x-component': 'RecordPicker',
        'x-component-props': {
          // mode: 'tags',
          multiple: true,
          fieldNames: {
            label: 'id',
            value: 'id',
          },
        },
      },
    },
  },
  schemaInitialize(schema: ISchema, { readPretty }) {
    if (readPretty) {
      schema['properties'] = {
        viewer: cloneDeep(recordPickerViewer),
      };
    } else {
      schema['properties'] = {
        selector: cloneDeep(recordPickerSelector),
      };
    }
  },
  initialize: (values: any) => {
    if (values.type === 'belongsToMany') {
      if (!values.through) {
        values.through = `t_${uid()}`;
      }
      if (!values.foreignKey) {
        values.foreignKey = `f_${uid()}`;
      }
      if (!values.otherKey) {
        values.otherKey = `f_${uid()}`;
      }
      if (!values.sourceKey) {
        values.sourceKey = 'id';
      }
      if (!values.targetKey) {
        values.targetKey = 'id';
      }
    }
  },
  properties: {
    ...defaultProps,
    type: {
      type: 'string',
      title: '{{t("Relationship type")}}',
      required: true,
      'x-disabled': true,
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      enum: [
        { label: 'One to one', value: 'hasOne' },
        { label: 'One to many', value: 'hasMany' },
        { label: 'Many to one', value: 'belongsTo' },
        { label: 'Many to many', value: 'belongsToMany' },
      ],
    },
    grid: {
      type: 'void',
      'x-component': 'Grid',
      properties: {
        row1: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col11: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                source: {
                  type: 'string',
                  title: '{{t("Source collection")}}',
                  'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': true,
                },
              },
            },
            col12: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                through: {
                  type: 'string',
                  title: <ThroughCollection/>,
                  'x-disabled': '{{ !createOnly }}',
                  'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {},
                },
              },
            },
            col13: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                target: {
                  type: 'string',
                  title: '{{t("Target collection")}}',
                  required: true,
                  'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
          },
        },
        row2: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col21: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                sourceKey: {
                  type: 'string',
                  title: <SourceKey />,
                  default: 'id',
                  enum: [{ label: 'ID', value: 'id' }],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
            col22: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                foreignKey: {
                  type: 'string',
                  title: <ForeignKey1/>,
                  'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
            col23: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
              },
            },
          },
        },
        row3: {
          type: 'void',
          'x-component': 'Grid.Row',
          properties: {
            col21: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
              },
            },
            col22: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                otherKey: {
                  type: 'string',
                  title: <ForeignKey2 />,
                  'x-reactions': ['{{useAsyncDataSource(loadCollections)}}'],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
            col23: {
              type: 'void',
              'x-component': 'Grid.Col',
              properties: {
                targetKey: {
                  type: 'string',
                  title: <TargetKey/>,
                  default: 'id',
                  enum: [{ label: 'ID', value: 'id' }],
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-disabled': '{{ !createOnly }}',
                },
              },
            },
          },
        },
      },
    },
  },
  filterable: {
    nested: true,
    children: [
      // {
      //   name: 'id',
      //   title: '{{t("Exists")}}',
      //   operators: [
      //     { label: '{{t("exists")}}', value: '$exists', noValue: true },
      //     { label: '{{t("not exists")}}', value: '$notExists', noValue: true },
      //   ],
      //   schema: {
      //     title: '{{t("Exists")}}',
      //     type: 'string',
      //     'x-component': 'Input',
      //   },
      // },
    ],
  },
};
