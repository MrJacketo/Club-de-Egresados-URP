import React, { useEffect } from "react";
import { useController } from "react-hook-form";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

const MenuBar = ({ editor }) => {
  if (!editor) return null

  const buttons = [
    { action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), label: 'H1', isActive: () => editor.isActive('heading', { level: 1 }) },
    { action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), label: 'H2', isActive: () => editor.isActive('heading', { level: 2 }) },
    { action: () => editor.chain().focus().toggleBold().run(), label: 'Bold', isActive: () => editor.isActive('bold') },
    { action: () => editor.chain().focus().toggleItalic().run(), label: 'Italic', isActive: () => editor.isActive('italic') },
    { action: () => editor.chain().focus().toggleHighlight().run(), label: 'Highlight', isActive: () => editor.isActive('highlight') },
    { action: () => editor.chain().focus().setTextAlign('left').run(), label: 'Left', isActive: () => editor.isActive({ textAlign: 'left' }) },
    { action: () => editor.chain().focus().setTextAlign('center').run(), label: 'Center', isActive: () => editor.isActive({ textAlign: 'center' }) },
    { action: () => editor.chain().focus().setTextAlign('right').run(), label: 'Right', isActive: () => editor.isActive({ textAlign: 'right' }) },
    { action: () => editor.chain().focus().setTextAlign('justify').run(), label: 'Justify', isActive: () => editor.isActive({ textAlign: 'justify' }) },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {buttons.map((btn, i) => (
        <button
          key={i}
          onClick={btn.action}
          type="button"
          className={`px-3 py-1 rounded text-sm font-medium border transition-all duration-150
            ${btn.isActive() ? '!bg-[#11B981] text-white' : '!bg-[#222] text-white border-gray-300 hover:bg-gray-100'}
          `}
        >
          {btn.label}
        </button>
      ))}
    </div>
  )
}


const Editor = ({ name, control }) => {
  const {
    field: { onChange, value },
  } = useController({
    name,
    control,
    defaultValue: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="block text-start text-[17px] font-semibold text-black">
        Descripcion del empleo
      </label>
      <MenuBar editor={editor} />
      <div className="border rounded-md p-3 bg-white">
        <EditorContent
          editor={editor}
          className="rounded-lg border transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default Editor;
