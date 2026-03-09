'use client';

import { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Link } from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Quote,
  Code,
  Code2,
  Undo2,
  Redo2,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  RemoveFormatting,
  ChevronDown,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ArrowDownToLine,
  Trash2,
  Columns2
} from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './tooltip';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  title,
  disabled,
  children
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              'h-8 w-8 rounded p-0',
              isActive && 'bg-primary/10 text-primary shadow-sm'
            )}
          >
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function Divider() {
  return <div className="bg-border mx-0.5 h-6 w-px self-center" />;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = '',
  minHeight = '400px'
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: false
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' }
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'rte-content max-w-none',
          'px-6 py-4 focus:outline-none',
          'overflow-y-auto'
        ),
        style: `min-height: ${minHeight}`
      }
    }
  });

  const setLink = useCallback(() => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url.startsWith('http') ? url : `https://${url}` })
        .run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  const wordCount = editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount = editor.getText().length;

  return (
    <div className="bg-background flex flex-col rounded-lg border shadow-sm">
      {/* ── Toolbar ── */}
      <div className="bg-muted/20 flex flex-wrap items-center gap-0.5 border-b px-2 py-1.5">
        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (⌘Z)"
        >
          <Undo2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (⌘⇧Z)"
        >
          <Redo2 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Headings dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 px-2 text-xs font-medium"
            >
              {editor.isActive('heading', { level: 1 })
                ? 'H1'
                : editor.isActive('heading', { level: 2 })
                  ? 'H2'
                  : editor.isActive('heading', { level: 3 })
                    ? 'H3'
                    : editor.isActive('heading', { level: 4 })
                      ? 'H4'
                      : 'Para'}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            <DropdownMenuItem
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={cn(!editor.isActive('heading') && 'bg-muted/50')}
            >
              Paragraph
            </DropdownMenuItem>
            {([1, 2, 3, 4] as const).map((level) => (
              <DropdownMenuItem
                key={level}
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
                className={cn(
                  editor.isActive('heading', { level }) && 'bg-muted/50'
                )}
              >
                <span
                  style={{ fontSize: `${1.5 - level * 0.1}em` }}
                  className="font-bold"
                >
                  Heading {level}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Divider />

        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold (⌘B)"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic (⌘I)"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline (⌘U)"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive('subscript')}
          title="Subscript"
        >
          <SubscriptIcon className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive('superscript')}
          title="Superscript"
        >
          <SuperscriptIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Color & Highlight */}
        <div className="relative flex items-center">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded"
                  title="Text Color"
                >
                  <Palette className="h-3.5 w-3.5" />
                  <input
                    type="color"
                    className="sr-only"
                    onChange={(e) =>
                      editor.chain().focus().setColor(e.target.value).run()
                    }
                  />
                </label>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Text Color
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="relative flex items-center">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <label
                  className="hover:bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded"
                  title="Highlight"
                >
                  <Highlighter className="h-3.5 w-3.5" />
                  <input
                    type="color"
                    defaultValue="#fef08a"
                    className="sr-only"
                    onChange={(e) =>
                      editor
                        .chain()
                        .focus()
                        .setHighlight({ color: e.target.value })
                        .run()
                    }
                  />
                </label>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Highlight
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          <RemoveFormatting className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          isActive={editor.isActive({ textAlign: 'justify' })}
          title="Justify"
        >
          <AlignJustify className="h-3.5 w-3.5" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
            } else {
              const { from, to } = editor.state.selection;
              const selectedText = editor.state.doc.textBetween(from, to);
              setLinkUrl(selectedText.startsWith('http') ? selectedText : '');
              setShowLinkInput((v) => !v);
              setShowImageInput(false);
            }
          }}
          isActive={editor.isActive('link')}
          title={editor.isActive('link') ? 'Remove Link' : 'Insert Link'}
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={() => {
            setShowImageInput((v) => !v);
            setShowLinkInput(false);
          }}
          title="Insert Image"
        >
          <ImageIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <TableIcon className="h-3.5 w-3.5" />
        </ToolbarButton>

        {/* Horizontal Rule */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* ── Link / Image input bars ── */}
      {showLinkInput && (
        <div className="flex items-center gap-2 border-b bg-blue-50/60 px-3 py-2 dark:bg-blue-950/20">
          <LinkIcon className="h-3.5 w-3.5 shrink-0 text-blue-500" />
          <input
            autoFocus
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setLink();
              if (e.key === 'Escape') setShowLinkInput(false);
            }}
            placeholder="https://example.com"
            className="h-7 flex-1 rounded border border-blue-200 bg-white px-2 text-xs focus:ring-1 focus:ring-blue-400 focus:outline-none dark:bg-gray-900"
          />
          <Button
            type="button"
            size="sm"
            className="h-7 text-xs"
            onClick={setLink}
          >
            Apply
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => setShowLinkInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {showImageInput && (
        <div className="flex items-center gap-2 border-b bg-green-50/60 px-3 py-2 dark:bg-green-950/20">
          <ImageIcon className="h-3.5 w-3.5 shrink-0 text-green-600" />
          <input
            autoFocus
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') insertImage();
              if (e.key === 'Escape') setShowImageInput(false);
            }}
            placeholder="https://example.com/image.png"
            className="h-7 flex-1 rounded border border-green-200 bg-white px-2 text-xs focus:ring-1 focus:ring-green-400 focus:outline-none dark:bg-gray-900"
          />
          <Button
            type="button"
            size="sm"
            className="h-7 text-xs"
            onClick={insertImage}
          >
            Insert
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => setShowImageInput(false)}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* ── Editor area ── */}
      {/* ── Table toolbar (visible when cursor is inside a table) ── */}
      {(editor.isActive('table') ||
        editor.isActive('tableCell') ||
        editor.isActive('tableHeader')) && (
        <div className="table-toolbar border-b px-2 py-1">
          <TooltipProvider delayDuration={200}>
            {/* Column actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                >
                  <ArrowLeftToLine className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                Add column before
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                >
                  <ArrowRightToLine className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                Add column after
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  <Columns2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Delete column</TooltipContent>
            </Tooltip>

            <div className="bg-border mx-0.5 h-5 w-px self-center" />

            {/* Row actions */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                >
                  <ArrowUpToLine className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Add row above</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                >
                  <ArrowDownToLine className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Add row below</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Delete row</TooltipContent>
            </Tooltip>

            <div className="bg-border mx-0.5 h-5 w-px self-center" />

            {/* Toggle header row */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs font-semibold"
                  onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                >
                  H±
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                Toggle header row
              </TooltipContent>
            </Tooltip>

            <div className="bg-border mx-0.5 h-5 w-px self-center" />

            {/* Delete table */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Delete table</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      <EditorContent editor={editor} className="flex-1" />

      {/* ── Status bar ── */}
      <div className="bg-muted/10 text-muted-foreground flex items-center justify-between border-t px-4 py-1.5 text-xs">
        <span>
          {wordCount} word{wordCount !== 1 ? 's' : ''} · {charCount} character
          {charCount !== 1 ? 's' : ''}
        </span>
        <span className="opacity-60">
          {editor.isActive('heading', { level: 1 })
            ? 'Heading 1'
            : editor.isActive('heading', { level: 2 })
              ? 'Heading 2'
              : editor.isActive('heading', { level: 3 })
                ? 'Heading 3'
                : editor.isActive('heading', { level: 4 })
                  ? 'Heading 4'
                  : editor.isActive('codeBlock')
                    ? 'Code Block'
                    : editor.isActive('blockquote')
                      ? 'Blockquote'
                      : 'Paragraph'}
        </span>
      </div>
    </div>
  );
}
