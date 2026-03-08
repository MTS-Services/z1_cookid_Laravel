/**
 * TipTap Rich Text Editor - Full Implementation
 * Laravel + Inertia React
 *
 * Install dependencies:
 * npm install @tiptap/react @tiptap/pm @tiptap/starter-kit
 * npm install @tiptap/extension-underline @tiptap/extension-text-align
 * npm install @tiptap/extension-color @tiptap/extension-text-style
 * npm install @tiptap/extension-image @tiptap/extension-link
 * npm install @tiptap/extension-placeholder @tiptap/extension-character-count
 * npm install @tiptap/extension-highlight @tiptap/extension-table
 * npm install @tiptap/extension-table-row @tiptap/extension-table-header
 * npm install @tiptap/extension-table-cell @tiptap/extension-youtube
 */

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Youtube from '@tiptap/extension-youtube';
import React, { useState, useCallback, useRef } from 'react';

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = '' }: { d: string; size?: number; className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d={d} />
    </svg>
);

const ICONS = {
    bold: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
    italic: "M19 4h-9M14 20H5M15 4 9 20",
    underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16",
    strikethrough: "M16 4H9a3 3 0 0 0-2.83 4M4 20h4M14 20h6M11 4 8 20M4 12h16",
    code: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    codeBlock: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
    quote: "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
    h1: "M4 12h8M4 18V6M12 18V6M17 12l5-6v12",
    h2: "M4 12h8M4 18V6M12 18V6M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",
    h3: "M4 12h8M4 18V6M12 18V6M16 7h4l-4 5h4M16 17c.5 2 4 2 4 0s-2-2.5-4-2",
    ul: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    ol: "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",
    link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    image: "M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32",
    table: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
    youtube: "M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z",
    highlight: "M9 7l-6 6 6 6 6-6-6-6zM9 7V5m0 16v-2M20 11l-6 6",
    alignLeft: "M21 10H7M21 6H3M21 14H3M21 18H7",
    alignCenter: "M21 10H3M21 6H3M21 14H3M21 18H3",
    alignRight: "M21 6H3M21 10H9M21 14H3M21 18H9",
    undo: "M3 7v6h6M3 13C5.6 7.6 12 5 17 8a9 9 0 0 1 4 7.7",
    redo: "M21 7v6h-6M21 13c-2.6-5.4-9-8-14-5a9 9 0 0 0-4 7.7",
    hr: "M5 12h14",
    clear: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
    color: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14H9l3-9 3 9h-2l-.5-1.5h-2L11 16z",
};

// ─── Toolbar Button ────────────────────────────────────────────────────────────
const ToolbarBtn = ({
    onClick,
    active = false,
    disabled = false,
    title = '',
    children,
    className = '',
    dark = false,
}: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title?: string;
    children: React.ReactNode;
    className?: string;
    dark?: boolean;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`
            relative flex items-center justify-center w-8 h-8 rounded-md text-sm
            transition-all duration-150 select-none
            ${dark
                ? active
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                : active
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
            ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
            ${className}
        `}
    >
        {children}
    </button>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
const Divider = ({ dark = false }) => (
    <div className={`w-px h-6 mx-1 ${dark ? 'bg-white/20' : 'bg-slate-200'}`} />
);

// ─── Heading Dropdown ─────────────────────────────────────────────────────────
const HeadingDropdown = ({ editor, dark = false }: { editor: NonNullable<ReturnType<typeof useEditor>>; dark?: boolean }) => {
    const [open, setOpen] = useState(false);
    const current = [1, 2, 3, 4, 5, 6].find((l) => editor.isActive('heading', { level: l }));
    const label = current ? `H${current}` : 'Text';

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center gap-1 px-2 h-8 rounded-md text-xs font-semibold transition-all
                    ${dark ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
                <span>{label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {open && (
                <div
                    className={`absolute top-10 left-0 z-50 border rounded-lg shadow-xl overflow-hidden min-w-[120px]
                        ${dark ? 'bg-slate-800 border-white/10' : 'bg-white border-slate-200'}`}
                    onMouseLeave={() => setOpen(false)}
                >
                    {[
                        {
                            label: 'Paragraph',
                            action: () => editor.chain().focus().setParagraph().run(),
                            active: editor.isActive('paragraph'),
                        },
                        {
                            label: 'Heading 1',
                            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                            active: editor.isActive('heading', { level: 1 }),
                        },
                        {
                            label: 'Heading 2',
                            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                            active: editor.isActive('heading', { level: 2 }),
                        },
                        {
                            label: 'Heading 3',
                            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                            active: editor.isActive('heading', { level: 3 }),
                        },
                        {
                            label: 'Heading 4',
                            action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
                            active: editor.isActive('heading', { level: 4 }),
                        },
                    ].map((item) => (
                        <button
                            key={item.label}
                            type="button"
                            onClick={() => {
                                item.action();
                                setOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors
                                ${dark
                                    ? item.active
                                        ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                                        : 'text-slate-200 hover:bg-white/10'
                                    : item.active
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                        : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Link Modal ───────────────────────────────────────────────────────────────
const LinkModal = ({ onSubmit, onClose, initialUrl = '' }: { onSubmit: (url: string) => void; onClose: () => void; initialUrl?: string }) => {
    const [url, setUrl] = useState(initialUrl);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Insert Link</h3>
                <input
                    type="url"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    autoFocus
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                    onKeyDown={e => e.key === 'Enter' && onSubmit(url)}
                />
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={() => onSubmit(url)}
                        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Image Modal ──────────────────────────────────────────────────────────────
const ImageModal = ({ onSubmit, onClose }: { onSubmit: (src: string, alt?: string) => void; onClose: () => void }) => {
    const [url, setUrl] = useState('');
    const [alt, setAlt] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev: ProgressEvent<FileReader>) => {
            const result = ev.target?.result;
            if (typeof result === 'string') onSubmit(result, alt);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Insert Image</h3>
                <div className="space-y-3">
                    <input type="text" value={url} onChange={e => setUrl(e.target.value)}
                        placeholder="Image URL (optional)"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" value={alt} onChange={e => setAlt(e.target.value)}
                        placeholder="Alt text"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="flex-1 border-t border-slate-200" />
                        <span>OR</span>
                        <div className="flex-1 border-t border-slate-200" />
                    </div>
                    <button type="button" onClick={() => fileRef.current?.click()}
                        className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
                        Upload from device
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button type="button" onClick={() => url && onSubmit(url, alt)}
                        disabled={!url}
                        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40">
                        Insert
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Main TipTap Editor Component ─────────────────────────────────────────────
export interface TipTapEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    maxLength?: number;
    minHeight?: number;
    className?: string;
    /** 'dark' for dark backgrounds (e.g. vendor listing pages) */
    variant?: 'light' | 'dark';
    /** Shorter toolbar: headings, lists, link; no table/youtube/image/code */
    compact?: boolean;
}

const TipTapEditor = ({
    value = '',
    onChange,
    placeholder = 'Start writing something amazing...',
    label = '',
    error = '',
    maxLength = 10000,
    minHeight = 300,
    className = '',
    variant = 'light',
    compact = false,
}: TipTapEditorProps) => {
    const [linkModal, setLinkModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [youtubeModal, setYoutubeModal] = useState(false);
    const [ytUrl, setYtUrl] = useState('');
    const [color, setColor] = useState('#6366f1');
    const colorRef = useRef<HTMLInputElement>(null);
    const dark = variant === 'dark';

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
            }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Color,
            TextStyle,
            Image.configure({ inline: false, allowBase64: true }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: dark
                        ? 'text-indigo-400 underline cursor-pointer'
                        : 'text-indigo-600 underline cursor-pointer',
                },
            }),
            Placeholder.configure({ placeholder }),
            CharacterCount.configure({ limit: maxLength }),
            Highlight.configure({ multicolor: true }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Youtube.configure({ controls: true, nocookie: true }),
        ],
        content: value,
        onUpdate: ({ editor: ed }) => {
            onChange?.(ed.getHTML());
        },
    });


    const handleLink = useCallback((url: string) => {
        if (!url) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
        setLinkModal(false);
    }, [editor]);

    const handleImage = useCallback((src: string, alt?: string) => {
        editor.chain().focus().setImage({ src, alt }).run();
        setImageModal(false);
    }, [editor]);

    const handleYoutube = useCallback(() => {
        if (ytUrl) { editor.commands.setYoutubeVideo({ src: ytUrl, width: 640, height: 360 }); }
        setYoutubeModal(false);
        setYtUrl('');
    }, [editor, ytUrl]);

    if (!editor) return null;

    const charCount = editor.storage.characterCount.characters();
    const charPercent = Math.min((charCount / maxLength) * 100, 100);

    return (
        <div className={`tiptap-wrapper ${className}`} data-variant={variant}>
            {label && (
                <label
                    className={`block text-sm font-medium mb-2 ${dark ? 'text-slate-200' : 'text-slate-700'}`}
                >
                    {label}
                </label>
            )}

            <div
                className={`rounded-xl overflow-hidden transition-all duration-200 border
                ${error ? 'border-red-400 ring-2 ring-red-100' : ''}
                ${!error && dark ? 'border-white/10 focus-within:border-white/20 focus-within:ring-2 focus-within:ring-white/10 bg-black/20' : ''}
                ${!error && !dark ? 'border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 bg-white shadow-sm' : ''}`}
            >
                <div
                    className={`flex flex-wrap items-center gap-0.5 p-2 border-b
                    ${dark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/80'}`}
                >
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()} title="Undo">
                        <Icon d={ICONS.undo} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()} title="Redo">
                        <Icon d={ICONS.redo} />
                    </ToolbarBtn>
                    <Divider dark={dark} />

                    {!compact && (
                        <>
                            <HeadingDropdown editor={editor} dark={dark} />
                            <Divider dark={dark} />
                        </>
                    )}

                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleBold().run()}
                        active={editor.isActive('bold')} title="Bold">
                        <Icon d={ICONS.bold} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleItalic().run()}
                        active={editor.isActive('italic')} title="Italic">
                        <Icon d={ICONS.italic} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleUnderline().run()}
                        active={editor.isActive('underline')} title="Underline">
                        <Icon d={ICONS.underline} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleStrike().run()}
                        active={editor.isActive('strike')} title="Strikethrough">
                        <Icon d={ICONS.strikethrough} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark}
                        onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()}
                        active={editor.isActive('highlight')} title="Highlight">
                        <Icon d={ICONS.highlight} />
                    </ToolbarBtn>
                    <Divider dark={dark} />

                    {!compact && (
                        <>
                            <div className="relative" title="Text Color">
                                <ToolbarBtn dark={dark} onClick={() => colorRef.current?.click()}>
                                    <span className="text-xs font-bold" style={{ color }}>A</span>
                                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ backgroundColor: color }} />
                                </ToolbarBtn>
                                <input ref={colorRef} type="color" value={color}
                                    onChange={(e) => { setColor(e.target.value); editor.chain().focus().setColor(e.target.value).run(); }}
                                    className="absolute opacity-0 w-0 h-0 pointer-events-none" />
                            </div>
                            <Divider dark={dark} />

                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().setTextAlign('left').run()}
                                active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                                <Icon d={ICONS.alignLeft} />
                            </ToolbarBtn>
                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().setTextAlign('center').run()}
                                active={editor.isActive({ textAlign: 'center' })} title="Align Center">
                                <Icon d={ICONS.alignCenter} />
                            </ToolbarBtn>
                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().setTextAlign('right').run()}
                                active={editor.isActive({ textAlign: 'right' })} title="Align Right">
                                <Icon d={ICONS.alignRight} />
                            </ToolbarBtn>
                            <Divider dark={dark} />
                        </>
                    )}

                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleBulletList().run()}
                        active={editor.isActive('bulletList')} title="Bullet List">
                        <Icon d={ICONS.ul} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        active={editor.isActive('orderedList')} title="Ordered List">
                        <Icon d={ICONS.ol} />
                    </ToolbarBtn>
                    <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        active={editor.isActive('blockquote')} title="Blockquote">
                        <Icon d={ICONS.quote} />
                    </ToolbarBtn>
                    <Divider dark={dark} />

                    {!compact && (
                        <>
                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleCode().run()}
                                active={editor.isActive('code')} title="Inline Code">
                                <Icon d={ICONS.code} />
                            </ToolbarBtn>
                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                                active={editor.isActive('codeBlock')} title="Code Block">
                                <Icon d={ICONS.codeBlock} />
                            </ToolbarBtn>
                            <Divider dark={dark} />
                        </>
                    )}

                    <ToolbarBtn dark={dark} onClick={() => setLinkModal(true)} active={editor.isActive('link')} title="Insert Link">
                        <Icon d={ICONS.link} />
                    </ToolbarBtn>
                    {!compact && (
                        <>
                            <ToolbarBtn dark={dark} onClick={() => setImageModal(true)} title="Insert Image">
                                <Icon d={ICONS.image} />
                            </ToolbarBtn>
                            <ToolbarBtn dark={dark} onClick={() => setYoutubeModal(true)} title="Insert YouTube">
                                <Icon d={ICONS.youtube} />
                            </ToolbarBtn>
                            <Divider dark={dark} />

                            <ToolbarBtn dark={dark} title="Insert Table"
                                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
                                <Icon d={ICONS.table} />
                            </ToolbarBtn>
                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                                <Icon d={ICONS.hr} />
                            </ToolbarBtn>
                            <ToolbarBtn dark={dark} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
                                <Icon d={ICONS.clear} />
                            </ToolbarBtn>
                        </>
                    )}
                </div>

                <BubbleMenu editor={editor}
                    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 shadow-xl ${dark ? 'bg-slate-800 border border-white/10' : 'bg-slate-900'}`}
                >
                    {[
                        { icon: ICONS.bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), title: 'Bold' },
                        { icon: ICONS.italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), title: 'Italic' },
                        { icon: ICONS.underline, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline'), title: 'Underline' },
                        { icon: ICONS.link, action: () => setLinkModal(true), active: editor.isActive('link'), title: 'Link' },
                        { icon: ICONS.highlight, action: () => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run(), active: editor.isActive('highlight'), title: 'Highlight' },
                    ].map((btn, i) => (
                        <button key={i} type="button" onClick={btn.action} title={btn.title}
                            className={`w-7 h-7 flex items-center justify-center rounded transition-colors
                                ${btn.active ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'}`}>
                            <Icon d={btn.icon} size={14} />
                        </button>
                    ))}
                </BubbleMenu>

                {/* ── Editor Content ── */}
                <EditorContent
                    editor={editor}
                    className="tiptap-content"
                    style={{ minHeight }}
                />

                <div
                    className={`flex items-center justify-between px-4 py-2 border-t
                    ${dark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50/50'}`}
                >
                    <span className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-400'}`}>
                        {editor.storage.characterCount.words()} words
                    </span>
                    <div className="flex items-center gap-2">
                        <div className={`w-20 h-1 rounded-full overflow-hidden ${dark ? 'bg-white/20' : 'bg-slate-200'}`}>
                            <div className="h-full transition-all duration-300 rounded-full"
                                style={{ width: `${charPercent}%`, backgroundColor: charPercent > 90 ? '#ef4444' : '#6366f1' }} />
                        </div>
                        <span className={`text-xs ${charPercent > 90 ? 'text-red-400' : dark ? 'text-slate-400' : 'text-slate-400'}`}>
                            {charCount} / {maxLength}
                        </span>
                    </div>
                </div>
            </div>

            {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}

            {/* ── Modals ── */}
            {linkModal && (
                <LinkModal
                    initialUrl={editor.getAttributes('link').href || ''}
                    onSubmit={handleLink}
                    onClose={() => setLinkModal(false)}
                />
            )}
            {imageModal && (
                <ImageModal
                    onSubmit={handleImage}
                    onClose={() => setImageModal(false)}
                />
            )}
            {youtubeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
                        <h3 className="text-base font-semibold text-slate-800 mb-4">Insert YouTube Video</h3>
                        <input type="url" value={ytUrl} onChange={e => setYtUrl(e.target.value)}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
                            onKeyDown={e => e.key === 'Enter' && handleYoutube()} autoFocus />
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => { setYoutubeModal(false); setYtUrl(''); }}
                                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="button" onClick={handleYoutube} disabled={!ytUrl}
                                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40">Insert</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .tiptap-wrapper .tiptap-content .ProseMirror {
                    padding: 1rem 1.25rem;
                    outline: none;
                    min-height: ${minHeight}px;
                    font-family: 'Georgia', serif;
                    font-size: 15px;
                    line-height: 1.8;
                    color: #1e293b;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror {
                    color: #e2e8f0;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
                    color: #94a3b8;
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
                    color: #64748b;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror h1 { font-size: 2em; font-weight: 700; line-height: 1.2; margin: 0.75em 0 0.4em; }
                .tiptap-wrapper .tiptap-content .ProseMirror h2 { font-size: 1.5em; font-weight: 700; line-height: 1.3; margin: 0.75em 0 0.4em; }
                .tiptap-wrapper .tiptap-content .ProseMirror h3 { font-size: 1.25em; font-weight: 600; line-height: 1.4; margin: 0.75em 0 0.4em; }
                .tiptap-wrapper .tiptap-content .ProseMirror h4 { font-size: 1.1em; font-weight: 600; margin: 0.75em 0 0.4em; }
                .tiptap-wrapper .tiptap-content .ProseMirror p { margin: 0.6em 0; }
                .tiptap-wrapper .tiptap-content .ProseMirror ul, .tiptap-wrapper .tiptap-content .ProseMirror ol { padding-left: 1.5em; margin: 0.5em 0; }
                .tiptap-wrapper .tiptap-content .ProseMirror li { margin: 0.25em 0; }
                .tiptap-wrapper .tiptap-content .ProseMirror blockquote {
                    border-left: 3px solid #6366f1;
                    padding: 0.5em 1em;
                    margin: 1em 0;
                    color: #475569;
                    background: #f8faff;
                    border-radius: 0 0.5em 0.5em 0;
                    font-style: italic;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror blockquote {
                    color: #94a3b8;
                    background: rgba(99, 102, 241, 0.1);
                }
                .tiptap-wrapper .tiptap-content .ProseMirror code {
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    padding: 0.1em 0.4em;
                    font-size: 0.85em;
                    font-family: 'Fira Code', monospace;
                    color: #6366f1;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror code {
                    background: rgba(99, 102, 241, 0.2);
                    border-color: rgba(99, 102, 241, 0.3);
                    color: #a5b4fc;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror pre {
                    background: #0f172a;
                    color: #e2e8f0;
                    border-radius: 8px;
                    padding: 1em 1.25em;
                    margin: 1em 0;
                    overflow-x: auto;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror pre code {
                    background: none;
                    border: none;
                    color: inherit;
                    padding: 0;
                    font-size: 0.875em;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror hr {
                    border: none;
                    border-top: 2px solid #e2e8f0;
                    margin: 1.5em 0;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror hr {
                    border-top-color: rgba(255,255,255,0.15);
                }
                .tiptap-wrapper .tiptap-content .ProseMirror img {
                    max-width: 100%;
                    border-radius: 8px;
                    margin: 0.75em 0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .tiptap-wrapper .tiptap-content .ProseMirror table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror th, .tiptap-wrapper .tiptap-content .ProseMirror td {
                    border: 1px solid #e2e8f0;
                    padding: 0.5em 0.75em;
                    text-align: left;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror th,
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror td {
                    border-color: rgba(255,255,255,0.1);
                }
                .tiptap-wrapper .tiptap-content .ProseMirror th {
                    background: #f8faff;
                    font-weight: 600;
                    color: #475569;
                }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror th {
                    background: rgba(255,255,255,0.08);
                    color: #cbd5e1;
                }
                .tiptap-wrapper .tiptap-content .ProseMirror tr:nth-child(even) td { background: #f8faff; }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror tr:nth-child(even) td { background: rgba(255,255,255,0.04); }
                .tiptap-wrapper .tiptap-content .ProseMirror mark { border-radius: 2px; padding: 0.1em 0.2em; }
                .tiptap-wrapper .tiptap-content .ProseMirror a { color: #6366f1; text-decoration: underline; cursor: pointer; }
                .tiptap-wrapper[data-variant="dark"] .tiptap-content .ProseMirror a { color: #818cf8; }
                .tiptap-wrapper .tiptap-content .ProseMirror iframe { border-radius: 8px; margin: 0.75em 0; }
            `}</style>
        </div>
    );
};

export default TipTapEditor;


// ─────────────────────────────────────────────────────────────────────────────
// USAGE EXAMPLE (Laravel Inertia React Page)
// ─────────────────────────────────────────────────────────────────────────────
//
// import TipTapEditor from '@/Components/TipTapEditor';
// import { useForm } from '@inertiajs/react';
//
// export default function CreatePost() {
//     const { data, setData, post, errors, processing } = useForm({
//         title: '',
//         content: '',
//     });
//
//     const submit = (e) => {
//         e.preventDefault();
//         post(route('posts.store'));
//     };
//
//     return (
//         <form onSubmit={submit} className="max-w-3xl mx-auto p-6 space-y-4">
//             <input
//                 type="text"
//                 value={data.title}
//                 onChange={e => setData('title', e.target.value)}
//                 placeholder="Post title"
//                 className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             />
//             <TipTapEditor
//                 label="Content"
//                 value={data.content}
//                 onChange={val => setData('content', val)}
//                 error={errors.content}
//                 placeholder="Write your post..."
//                 maxLength={5000}
//             />
//             <button type="submit" disabled={processing}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50">
//                 {processing ? 'Publishing...' : 'Publish Post'}
//             </button>
//         </form>
//     );
// }
//
// ─────────────────────────────────────────────────────────────────────────────
// LARAVEL CONTROLLER (store method)
// ─────────────────────────────────────────────────────────────────────────────
//
// public function store(Request $request)
// {
//     $validated = $request->validate([
//         'title'   => 'required|string|max:255',
//         'content' => 'required|string',
//     ]);
//
//     // Sanitize HTML (install: composer require ezyang/htmlpurifier)
//     $config = HTMLPurifier_Config::createDefault();
//     $purifier = new HTMLPurifier($config);
//     $validated['content'] = $purifier->purify($validated['content']);
//
//     Post::create($validated);
//     return redirect()->route('posts.index');
// }
//
// ─────────────────────────────────────────────────────────────────────────────
// DISPLAY HTML in Blade/React
// ─────────────────────────────────────────────────────────────────────────────
//
// Blade:   {!! $post->content !!}
// React:   <div dangerouslySetInnerHTML={{ __html: post.content }} />