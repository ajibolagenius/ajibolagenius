import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './admin-quill.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'blockquote', 'link',
];

/**
 * WYSIWYG editor for blog body. Outputs HTML.
 * Styled for admin dark theme.
 */
export default function RichTextEditor({ value, onChange, id, placeholder, className = '' }) {
  const quillClassName = useMemo(() => `admin-quill ${className}`.trim(), [className]);

  return (
    <div className={quillClassName} data-quill-dark>
      <ReactQuill
        id={id}
        theme="snow"
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        className="bg-[var(--elevated)] border border-[var(--border-md)] rounded-none"
        style={{ minHeight: 220 }}
      />
    </div>
  );
}
